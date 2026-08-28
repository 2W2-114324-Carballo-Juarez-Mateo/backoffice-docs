# Comunicación entre microservicios

Tres piezas complementarias: **Service Discovery**, comunicación síncrona y asíncrona.

## Service Discovery — Eureka

Cada microservicio se **registra en Eureka al iniciar** (nombre, IP, puerto, health). El **API Gateway no conoce direcciones fijas**: consulta a Eureka la ubicación de la instancia activa antes de enrutar. Así, una instancia nueva se suma sola y una caída se descarta automáticamente.

```mermaid
sequenceDiagram
    participant FE as Frontend / BFF
    participant GW as API Gateway
    participant EU as Eureka (Discovery)
    participant CS as Course Service

    CS->>EU: registra instancia (health OK)
    FE->>GW: GET /api/courses
    GW->>EU: ¿dónde está course-service?
    EU-->>GW: instancia activa (curso-1:8082)
    GW->>CS: enruta la petición
    CS-->>GW: 200 datos
    GW-->>FE: respuesta
```

> El **Config Server** complementa: los servicios toman su configuración no sensible (URLs internas, feature flags, perfiles) desde el Config Server al arrancar, y los secretos desde variables de entorno.

## Síncrona — HTTP/REST

Cuando se necesita respuesta inmediata (consultas, validaciones para completar una operación).

```mermaid
sequenceDiagram
    participant B as BackOffice
    participant GW as API Gateway
    participant CS as Course Service
    participant ID as Identity Service

    B->>GW: GET /api/courses/10/students
    GW->>CS: reenvía con JWT
    CS->>ID: ¿el usuario tiene alcance sobre el curso 10?
    ID-->>CS: sí / no
    CS-->>GW: datos o 403
    GW-->>B: respuesta
```

## Asíncrona — Eventos RabbitMQ

Para procesos desacoplados: auditoría, read models, notificaciones, propagación de cambios.

```mermaid
sequenceDiagram
    participant CS as Course Service
    participant RQ as RabbitMQ
    participant AU as Audit Service
    participant RP as Reporting Service

    CS->>CS: persistir + escribir Outbox (misma transacción)
    CS->>RQ: CourseArchived
    RQ->>AU: registrar auditoría
    RQ->>RP: actualizar read model
```

## Patrón Outbox

Evita perder un evento tras confirmar una transacción:

```text
BEGIN TRANSACTION
  UPDATE course SET status = 'ARCHIVED' ...
  INSERT OutboxEvent(type = 'CourseArchived', payload = ...)
COMMIT
        │
        ▼
   Publisher → RabbitMQ
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
UserCreated · AdminDeleted · AdminRecoveryExecuted
GlobalConfigurationChanged
CourseCreated · CourseUpdated · CourseActivated · CourseArchived
RosterUpdated
ChallengeCreated · ChallengeUpdated
RetentionDecisionCreated · DataAnonymized
```

**Formato común de evento:**

```json
{
  "eventId": "uuid",
  "eventType": "CourseArchived",
  "occurredAt": "2026-08-28T12:00:00Z",
  "correlationId": "uuid",
  "actorId": "uuid",
  "source": "course-service",
  "payload": {}
}
```

## Flujo crítico: creación de curso

```mermaid
sequenceDiagram
    participant P as Profesor
    participant GW as Gateway
    participant CS as Course Service
    participant RQ as RabbitMQ
    participant AU as Audit
    participant RP as Reporting

    P->>GW: POST /api/courses
    GW->>CS: valida JWT y rol
    CS->>CS: valida datos + crea Course + Outbox
    CS->>RQ: CourseCreated
    RQ->>AU: auditoría
    RQ->>RP: read model
    CS-->>P: 201 Created
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
    G --> H[RabbitMQ → Audit Service]
```

> La protección del último ADMIN debe manejarse con **transacción y revalidación** (concurrencia), no solo con validación previa.