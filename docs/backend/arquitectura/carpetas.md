# Estructura de carpetas

> Monorepo **Maven multi-módulo** para facilitar el trabajo académico y la ejecución local con Docker Compose.

```text
backoffice-backend/
│
├── pom.xml                     ← POM padre (gestión de dependencias y módulos)
├── mvnw / mvnw.cmd             ← Maven Wrapper
├── .env.example
├── README.md
│
├── gateway/
│   └── src/main/java/com/backoffice/gateway/
│
├── services/
│   ├── administration-service/   ──→ com/backoffice/administration/...
│   └── reporting-service/        ──→ com/backoffice/reporting/...
│
├── building-blocks/
│   ├── contracts/              ← DTOs y contratos de eventos compartidos
│   ├── shared-kernel/          ← utilidades comunes de dominio
│   ├── observability/          ← logging, tracing, métricas
│   └── security/               ← filtros JWT, utilidades de autorización
│
├── config-server/
├── discovery-server/           ← Eureka Server
│
├── tests/                      ← unit + integration (Testcontainers) por servicio
├── deploy/docker/
└── docker-compose.yml
```

## Estructura interna de un microservicio (Clean Architecture)

```text
administration-service/
│
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/backoffice/administration/
    │   │   ├── AdministrationApplication.java  ← @SpringBootApplication
    │   │   ├── api/
    │   │   │   ├── controllers/                ← ParameterController, ModelProviderController, ModelFunctionController
    │   │   │   ├── dto/
    │   │   │   ├── exception/                  ← @RestControllerAdvice
    │   │   │   └── config/                     ← seguridad, validación
    │   │   ├── application/
    │   │   │   ├── commands/                   ← UpdateParameter, RegisterModelProvider, AssignModelToFunction
    │   │   │   ├── queries/                    ← GetParameter, GetModelProviders
    │   │   │   ├── dto/
    │   │   │   ├── validators/
    │   │   │   └── ports/                      ← interfaces hacia dominio/infra
    │   │   ├── domain/
    │   │   │   ├── model/                      ← entidades + value objects
    │   │   │   ├── events/                     ← domain events
    │   │   │   ├── exceptions/
    │   │   │   └── services/
    │   │   └── infrastructure/
    │   │       ├── persistence/                ← JPA repositories, entities
    │   │       ├── messaging/
    │   │       │   ├── outbox/                 ← Transactional Outbox
    │   │       │   └── kafka/                  ← producers, consumers, topics
    │   │       └── external/                   ← clientes REST a otros servicios
    │   └── resources/
    │       ├── application.yml
    │       ├── application-development.yml
    │       └── db/migration/                   ← Flyway
    └── test/java/.../                          ← unit + integration
```

## Responsabilidad por capa

| Capa | Responsabilidad | Prohibido |
|---|---|---|
| **api** | HTTP, binding, autorización, status codes, DTOs | Reglas complejas de negocio |
| **application** | Casos de uso, orquestación, validaciones, ports | Lógica de persistencia |
| **domain** | Reglas de negocio, entidades, value objects, eventos, invariantes | Dependencias externas |
| **infrastructure** | PostgreSQL/JPA, Flyway, Kafka, Outbox, clientes externos | Reglas de negocio |

## Docker Compose (local)

```text
discovery-server (Eureka) · config-server · gateway
administration-service · reporting-service
PostgreSQL (una base por servicio) · Kafka
```