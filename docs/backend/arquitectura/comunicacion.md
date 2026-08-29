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
    participant GW as API Gateway
    participant AD as Administration Service
    participant ID as Identity & Access

    B->>GW: GET /api/administration/parameters/PAR-01
    GW->>AD: reenvía con JWT
    AD->>ID: ¿el usuario tiene rol y permisos?
    ID-->>AD: sí / no
    AD-->>GW: datos o 403
    GW-->>B: respuesta
```

## Asíncrona — Eventos Apache Kafka

Para procesos desacoplados: auditoría, read models, propagación de cambios. **Kafka** es el broker elegido (ADR-003); RabbitMQ queda como alternativa.

**Publicación (BackOffice):**

```mermaid
sequenceDiagram
    participant AD as Administration Service
    participant K as Kafka (topic: administration.events)
    participant AU as Audit Service (consumer group: audit)
    participant GS as Gamification (cross-team)

    AD->>AD: persistir + escribir Outbox (misma transacción)
    AD->>K: GlobalConfigurationChanged (partición por key)
    K->>AU: registrar auditoría
    K->>GS: Gamification aplica hacia adelante (RF-CFG-06)
```

**Consumo (reportes/métricas):**

```mermaid
sequenceDiagram
    participant CS as Cursos Service (equipo Cursos)
    participant K as Kafka (topic: course.events)
    participant RP as Reporting & Analytics (consumer group: reporting)

    CS->>K: CourseArchived / RosterUpdated (por courseId)
    K->>RP: actualizar read models (métricas, reportes)
```

### Topics y particionado

| Topic | Eventos | Rol BackOffice | Particionado |
|---|---|---|---|
| `identity.events` | AdminCreated, AdminDeleted, AdminRecoveryExecuted, RoleChanged | Publica | por `actorId` |
| `administration.events` | GlobalConfigurationChanged, ModelProviderChanged, ModelFunctionChanged | Publica | por `key` |
| `audit.events` | eventos de auditoría | Publica | por `actorId` |
| `retention.events` | RetentionDecisionCreated, DataAnonymized | Publica | por `resourceId` |
| `course.events` | CourseCreated/Activated/Archived, RosterUpdated | **Consume** | por `courseId` |
| `gamification.events` / `ranking.events` / `survey.events` | eventos de otros equipos | **Consume** | por `courseId` |

Cada **consumer group** (un servicio) lee con su offset propio. Kafka permite **replay**: reconstruir read models de Reporting o la auditoría desde cero (clave para RF-AUD-04).

## Patrón Outbox

Evita perder un evento tras confirmar una transacción:

```text
BEGIN TRANSACTION
  UPDATE GlobalParameter SET value = ... (nueva versión)
  INSERT OutboxEvent(type = 'GlobalConfigurationChanged', payload = ...)
COMMIT
        │
        ▼
   Publisher → Kafka (topic administration.events)
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
    participant GW as Gateway
    participant AD as Administration Service
    participant K as Kafka
    participant AU as Audit
    participant AI as AI Service (cross-team)

    A->>GW: POST /api/administration/model-providers
    GW->>AD: valida JWT y rol ADMIN
    AD->>AD: valida datos + registra proveedor + Outbox
    AD->>K: ModelProviderChanged
    K->>AU: auditoría
    K->>AI: consume la configuración
    AD-->>A: 201 Created
```

## Flujo crítico: baja de ADMIN

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
    G --> H[Kafka → Audit Service]
```

> La protección del último ADMIN debe manejarse con **transacción y revalidación** (concurrencia), no solo con validación previa.