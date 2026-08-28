# Arquitectura — Vista general

> Estilo: **microservicios orientados a dominios**. No un microservicio por entidad; sí uno por bounded context. Frontend por definir.

## Diagrama

```mermaid
flowchart TB
    subgraph CLIENTE[Consumidores]
        FE["Frontend (por definir)"]
    end

    FE --> GW[API Gateway · Spring Cloud Gateway]

    GW --> ID[Identity & User Service]
    GW --> CS[Course & Content Service]
    GW --> CF[Configuration Service]
    GW --> AU[Audit Service]
    GW --> RP[Reporting Service]

    ID --> DB1[(identity_db)]
    CS --> DB2[(course_db)]
    CF --> DB3[(configuration_db)]
    AU --> DB4[(audit_db)]
    RP --> DB5[(reporting_db)]

    subgraph INFRA[Infraestructura]
        EU[Eureka · Discovery]
        CFG[Config Server]
        RQ[Kafka · Event Broker]
    end

    ID --> RQ
    CS --> RQ
    CF --> RQ
    RP --> RQ
    EU <-->|consulta ubicación de instancias| GW
    EU <-. registra .- ID
    EU <-. registra .- CS
    EU <-. registra .- CF
    EU <-. registra .- AU
    EU <-. registra .- RP
```

## Componentes

| Componente | Rol |
|---|---|
| **API Gateway** | Punto de entrada único: routing, JWT, rate limiting, correlation ID, CORS, errores uniformes. Sin lógica de negocio. |
| **Eureka** | Service Discovery: los servicios se registran al iniciar y el **Gateway consulta** la ubicación de la instancia activa antes de enrutar. Health checks. |
| **Config Server** | Configuración centralizada no sensible; perfiles por ambiente. |
| **Kafka** | Eventos de dominio, desacople, read models. Replay para auditoría y Reporting. |
| **5 microservicios** | Ver página [Microservicios](/arquitectura/microservicios). |

## Principios clave

- **Autorización distribuida:** el Gateway valida el JWT, pero cada microservicio revalida identidad, rol, permisos y **alcance del recurso** (pertenencia al curso).
- **Database per Service:** sin FKs entre bases; las relaciones se modelan con IDs.
- **Multitenancy lógico:** `tenant_id = course_id` en entidades de curso. El `tenant_id` **no** va fijo en el JWT (un alumno pertenece a varios cursos): se resuelve por operación y se valida contra la membresía real.
- **Outbox + idempotencia** para eventos.
- **Correlation ID** en todo el recorrido.

## Multitenancy: regla de aislamiento

```sql
-- Incorrecto: ignora el tenant
SELECT * FROM RankingEntry WHERE StudentId = @studentId;

-- Correcto: siempre limitado por tenant
SELECT * FROM RankingEntry
WHERE StudentId = @studentId AND TenantId = @tenantId;
```

El `tenant_id` enviado por el cliente nunca se acepta ciegamente: se valida contra `CourseMembership`.