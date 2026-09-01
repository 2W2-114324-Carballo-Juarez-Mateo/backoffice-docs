# Comunicación entre microservicios

Tres piezas complementarias: **Service Discovery**, comunicación síncrona y asíncrona.

## Service Discovery — Eureka

Cada microservicio se **registra en Eureka al iniciar** (nombre, IP, puerto, health). El **API Gateway no conoce direcciones fijas**: consulta a Eureka la ubicación de la instancia activa antes de enrutar. Así, una instancia nueva se suma sola y una caída se descarta automáticamente.

```mermaid
sequenceDiagram
    participant FE as Frontend / BFF
    participant GW as API Gateway
    participant EU as Eureka (Discovery)
    participant AD as Administration Service

    AD->>EU: registra instancia (health OK)
    FE->>GW: GET /api/administration/parameters
    GW->>EU: ¿dónde está administration-service?
    EU-->>GW: instancia activa (admin-1:8082)
    GW->>AD: enruta la petición
    AD-->>GW: 200 datos
    GW-->>FE: respuesta
```

> El **Config Server** complementa: los servicios toman su configuración no sensible (URLs internas, feature flags, perfiles) desde el Config Server al arrancar, y los secretos desde variables de entorno.

## Síncrona — HTTP/REST

Cuando se necesita respuesta inmediata (consultas, validaciones para completar una operación).

```mermaid
sequenceDiagram
    participant B as BackOffice
    participant GW as API Gateway de PLATAFORMA (T01)
    participant AD as Administration Service
    participant T01 as Tema 01 (Identidad)

    B->>GW: GET /api/administration/parameters/PAR-01
    GW->>AD: reenvía con JWT
    AD->>GW: consulta rol/permisos (sync por el gateway)
    GW->>T01: autorización
    T01-->>GW: sí / no
    GW-->>AD: resultado
    AD-->>GW: datos o 403
    GW-->>B: respuesta
```

## Asíncrona — Eventos RabbitMQ

Para procesos desacoplados: auditoría, read models, propagación de cambios. **RabbitMQ** es el broker elegido (ADR-003); Apache **Kafka** queda como alternativa. Patrón **híbrido**: REST por el gateway para lo síncrono + eventos por RabbitMQ para avisar, con **caché local con TTL** en los consumidores.

**Publicación (BackOffice):**

```mermaid
sequenceDiagram
    participant AD as Administration Service
    participant K as RabbitMQ (exchange: administration.events)
    participant T01 as Tema 01 (auditoría)
    participant GS as Gamification (cola: gamification)

    AD->>AD: persistir + escribir Outbox (misma transacción)
    AD->>K: GlobalConfigurationChanged (routing key por parámetro)
    K->>T01: persiste auditoría
    K->>GS: Gamification aplica hacia adelante (RF-CFG-06)
```

**Consumo (reportes/métricas):**

```mermaid
sequenceDiagram
    participant CS as Cursos Service (equipo Cursos)
    participant K as RabbitMQ (exchange: course.events)
    participant RP as Reporting & Analytics (cola: reporting)

    CS->>K: CourseArchived / RosterUpdated
    K->>RP: actualizar read models (métricas, reportes)
```

### Exchanges y colas

| Exchange | Eventos | Rol BackOffice | Cola por consumidor |
|---|---|---|---|
| `identity.events` | AdminCreated, AdminDeleted, AdminRecoveryExecuted, RoleChanged | Publica | `audit`, `reporting`… |
| `administration.events` | GlobalConfigurationChanged, ModelProviderChanged, ModelFunctionChanged | Publica | `gamification`, `challenges`, `bank`, `roadmap`… |
| `audit.events` | eventos de auditoría | Publica | `audit` |
| `retention.events` | RetentionDecisionCreated, DataAnonymized | Publica | `audit`, `reporting`… |
| `course.events` | CourseCreated/Activated/Archived, RosterUpdated | **Consume** | `reporting` |
| `gamification.events` / `ranking.events` / `survey.events` | eventos de otros equipos | **Consume** | `reporting` |

Cada **cola** pertenece a un consumidor. **Idempotencia por `event_id` y por `version`** (descarta `v ≤ local`). Los **read models de Reporting se reconstruyen vía contratos de lectura REST** (no dependen del historial del broker). Los consumidores de parámetros usan **caché local con TTL 10 min** que el evento invalida antes (respaldo ante caída del Backoffice).

## Patrón Outbox

Evita perder un evento tras confirmar una transacción:

```text
BEGIN TRANSACTION
  UPDATE GlobalParameter SET value = ... (nueva versión)
  INSERT OutboxEvent(type = 'GlobalConfigurationChanged', payload = ...)
COMMIT
        │
        ▼
   Publisher → RabbitMQ (exchange administration.events)
```

## Idempotencia en consumidores

Cada evento lleva `event_id`. El consumidor registra qué eventos ya procesó:

```text
¿event_id ya procesado?
    ├── sí → ignorar
    └── no → procesar + registrar en ProcessedEvent
```

## Eventos de dominio (ejemplos)

```text
AdminDeleted · AdminRecoveryExecuted · RoleChanged
GlobalConfigurationChanged · ModelProviderChanged · ModelFunctionChanged
RetentionDecisionCreated · DataAnonymized
```
> El BackOffice también **consume**: CourseArchived/RosterUpdated (Cursos), eventos de Gamificación/Ranking/Encuestas.

**Formato común de evento:**

```json
{
  "eventId": "uuid",
  "eventType": "ModelProviderChanged",
  "occurredAt": "2026-08-28T12:00:00Z",
  "correlationId": "uuid",
  "actorId": "uuid",
  "source": "administration-service",
  "payload": {}
}
```

## Flujo crítico: gestión de proveedor de modelo (ADMIN)

```mermaid
sequenceDiagram
    participant A as ADMIN
    participant GW as Gateway de plataforma (T01)
    participant AD as Administration Service
    participant K as RabbitMQ
    participant T01 as Tema 01 (auditoría)
    participant T07 as Tema 07 (Evaluación LLM)

    A->>GW: POST /api/administration/model-providers
    GW->>AD: valida JWT y rol ADMIN
    AD->>AD: valida datos + registra proveedor + Outbox
    AD->>K: ModelProviderChanged
    K->>T01: persiste auditoría
    K->>T07: consume la configuración
    AD-->>A: 201 Created
```

## Flujo crítico: baja de ADMIN — **del Tema 01 (consumido)**

```mermaid
flowchart TD
    A[ADMIN A solicita baja de ADMIN B] --> B{¿A != B?}
    B -- No --> X[Rechazar]
    B -- Sí --> C{¿contraseña confirmada?}
    C -- No --> X
    C -- Sí --> D{¿2FA válido?}
    D -- No --> X
    D -- Sí --> E{¿ADMIN B activo?}
    E -- No --> X
    E -- Sí --> F{¿quedará al menos un ADMIN?}
    F -- No --> X
    F -- Sí --> G[Baja lógica + Outbox]
    G --> H[RabbitMQ → Tema 01 persiste auditoría]
```

> La protección del último ADMIN debe manejarse con **transacción y revalidación** (concurrencia), no solo con validación previa.