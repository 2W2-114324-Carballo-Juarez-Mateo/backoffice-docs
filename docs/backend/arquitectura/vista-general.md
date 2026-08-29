# Arquitectura — Vista general

> Estilo: **microservicios orientados a dominios**. No un microservicio por entidad; sí uno por bounded context. Frontend por definir. El BackOffice cubre **4 servicios**; los dominios de cursos/desafíos/usuarios son de otros equipos y se consumen vía eventos.

## Diagrama

```mermaid
flowchart TB
    subgraph CLIENTE[Consumidores]
        FE["Frontend (por definir)"]
    end

    FE --> GW[API Gateway · Spring Cloud Gateway]

    GW --> ID[Identity & Access · lado ADMIN]
    GW --> AD[Administration & Configuration]
    GW --> RP[Reporting & Analytics]
    GW --> AU[Audit Service]

    ID --> DB1[(identity_db)]
    AD --> DB2[(administration_db)]
    RP --> DB3[(reporting_db)]
    AU --> DB4[(audit_db)]

    subgraph INFRA[Infraestructura]
        EU[Eureka · Discovery]
        CFG[Config Server]
        RQ[Kafka · Event Broker]
    end

    AD --> RQ
    ID --> RQ
    RP -. consume eventos cross-team .-> RQ
    EU <-->|consulta ubicación de instancias| GW
    EU <-. registra .- ID
    EU <-. registra .- AD
    EU <-. registra .- RP
    EU <-. registra .- AU
```

## Componentes

| Componente | Rol |
|---|---|
| **API Gateway** | Punto de entrada único: routing, JWT, **rate limiting (429 con `Retry-After`)**, correlation ID, CORS, errores uniformes. Sin lógica de negocio. |
| **Eureka** | Service Discovery: los servicios se registran al iniciar y el **Gateway consulta** la ubicación de la instancia activa antes de enrutar. Health checks. |
| **Config Server** | Configuración centralizada no sensible; perfiles por ambiente. |
| **Kafka** | Eventos de dominio, desacople, read models. Replay para auditoría y Reporting. |
| **4 microservicios** | Ver página [Microservicios](/backend/arquitectura/microservicios). |

## Principios clave

- **Autorización distribuida:** el Gateway valida el JWT, pero cada microservicio revalida identidad, rol, permisos y **alcance del recurso**.
- **Database per Service:** sin FKs entre bases; las relaciones se modelan con IDs.
- **Consumo de dominios ajenos:** cursos/desafíos/usuarios/gamificación/ranking/encuestas son de otros equipos; el BackOffice los **consume** vía eventos (reportes/métricas).
- **Outbox + idempotencia** para eventos.
- **Correlation ID** en todo el recorrido.

## Alcance por dato (reportes/métricas)

El alcance del PROFESOR sobre un curso se valida contra la **membresía real** provista por el dominio de cursos (cross-team); el `course_id` del request nunca se acepta ciegamente.