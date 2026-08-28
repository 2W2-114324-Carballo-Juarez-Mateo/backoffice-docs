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
│   ├── identity-service/       ──→ com/backoffice/identity/{api,application,domain,infrastructure}
│   ├── course-service/         ──→ com/backoffice/course/...
│   ├── configuration-service/  ──→ com/backoffice/configuration/...
│   ├── audit-service/          ──→ com/backoffice/audit/...
│   └── reporting-service/      ──→ com/backoffice/reporting/...
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
course-service/
│
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/backoffice/course/
    │   │   ├── CourseApplication.java          ← @SpringBootApplication
    │   │   ├── api/
    │   │   │   ├── controllers/                ← CourseController, RosterController, ChallengeController
    │   │   │   ├── dto/
    │   │   │   ├── exception/                  ← @RestControllerAdvice
    │   │   │   └── config/                     ← seguridad, validación
    │   │   ├── application/
    │   │   │   ├── commands/                   ← CreateCourse, UpdateCourse, ActivateCourse, ArchiveCourse
    │   │   │   ├── queries/                    ← GetCourse, GetCourses
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
    │   │       │   └── rabbitmq/
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
| **infrastructure** | PostgreSQL/JPA, Flyway, RabbitMQ, Outbox, clientes externos | Reglas de negocio |

## Docker Compose (local)

```text
discovery-server (Eureka) · config-server · gateway
identity-service · course-service · configuration-service · audit-service · reporting-service
PostgreSQL (una base por servicio) · RabbitMQ
```