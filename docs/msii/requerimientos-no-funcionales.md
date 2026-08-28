# Requerimientos No Funcionales (RNF)

> Detalle completo en `backoffice_backend_requerimientos_arquitectura.md` §5. Los que el PRD deja a Low Level Design se marcan como decisión técnica del equipo.

## Seguridad y autenticación

| ID | Requisito |
|---|---|
| RNF-01 | Toda operación administrativa requiere autenticación + autorización por rol y recurso. |
| RNF-02 | Autenticación: usuario + contraseña + **2FA obligatorio**. GitHub NO es login. |
| RNF-03 | Autorización en **dos niveles**: Gateway y microservicio propietario. El Gateway no es frontera suficiente. |
| RNF-17 | Secretos fuera del repositorio (variables de entorno / secret manager). |

## Aislamiento y datos

| ID | Requisito |
|---|---|
| RNF-04 | **Database per Service**: cada microservicio es dueño de su base; comunicación solo por API/eventos. |
| RNF-10 | Borrado lógico en entidades de producción académica. |
| RNF-11 | Retención: 5 años, preaviso 90 días, sin purga automática, decisión auditada de ADMIN. |
| RNF-12 | Privacidad: encuestas anónimas por diseño; sin vínculo autor ↔ respuesta. |

## Resiliencia y escalabilidad

| ID | Requisito |
|---|---|
| RNF-05 | Soportar **120 sesiones concurrentes** (objetivo PRD), sin cuello de botella en operaciones administrativas. |
| RNF-06 | Resiliencia: timeouts, retry controlado, circuit breaker; operaciones asíncronas reintentables sin duplicar efectos. |
| RNF-07 | Idempotencia: operaciones críticas idempotentes; consumidores toleran duplicados (event_id). |

## Trazabilidad y observabilidad

| ID | Requisito |
|---|---|
| RNF-08 | Correlation ID propagado: `Gateway → Servicio → Evento → Consumidor`. |
| RNF-09 | Auditoría y logs técnicos separados conceptualmente. |
| RNF-16 | Logs estructurados, métricas, health checks, correlation ID por servicio. |

## Operación y plataforma

| ID | Requisito |
|---|---|
| RNF-13 | MVP en español; reglas de negocio desacopladas del idioma. |
| RNF-14 | Web responsive; APIs HTTP/REST documentadas. |
| RNF-15 | Código por capas: API / Aplicación / Dominio / Infraestructura (sin reglas de negocio en controllers). |
| RNF-18 | APIs documentadas con OpenAPI/Swagger (método, ruta, params, body, respuestas, errores, autorización). |

## Stack (decisión técnica)

| Capa | Tecnología |
|---|---|
| Lenguaje / Framework | Java 21 · Spring Boot 3 |
| Build | Maven multi-módulo |
| Gateway | Spring Cloud Gateway |
| Discovery | Eureka |
| Config | Spring Cloud Config Server |
| Mensajería | Apache Kafka + Outbox (RabbitMQ = alternativa) |
| Persistencia | JPA/Hibernate · PostgreSQL (recomendada) |
| API docs | springdoc / OpenAPI 3 |
| Seguridad | Spring Security + JWT (jjwt) + 2FA (TOTP) |
| Pruebas | JUnit 5 · Mockito · Testcontainers · Spring Cloud Contract |