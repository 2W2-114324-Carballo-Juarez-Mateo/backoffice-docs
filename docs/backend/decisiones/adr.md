# Decisiones arquitectónicas (ADRs)

## ADR-001 — Microservicios

**Decisión:** utilizar microservicios.
**Motivos:** requisito explícito de los docentes · separación de dominios · independencia de despliegue · aprendizaje de comunicación distribuida.
**Consecuencia:** mayor complejidad operacional.

## ADR-002 — Database per Service

**Decisión:** cada microservicio posee su propia base.
**Motivo:** evitar acoplamiento mediante base compartida.
**Consecuencia:** no hay transacciones distribuidas simples; se usa API/eventos.

## ADR-003 — RabbitMQ (broker de eventos)

**Decisión:** **RabbitMQ** como broker de eventos, con patrón **híbrido** (REST por el gateway + eventos por RabbitMQ) y **caché local con TTL 10 min** en consumidores de configuración. Apache **Kafka** documentado como alternativa.

**Motivo:** comunicación asíncrona, desacoplamiento, liviano y simple de operar para la escala, soporte maduro con Spring AMQP, y adecuado al broadcast de configuración (exchange + cola por consumidor). Kafka (replay, orden por partición) no es necesario porque los read models de Reporting se reconstruyen vía contratos de lectura REST. Patrones de confiabilidad: Outbox + at-least-once + idempotencia por `event_id` y `version`.

## ADR-004 — Outbox

**Decisión:** Transactional Outbox.
**Motivo:** evitar pérdida de eventos después de confirmar una transacción.

## ADR-005 — API Gateway

**Decisión:** Gateway como entrada única.
**Motivo:** routing, seguridad inicial, rate limiting, correlation ID, punto de entrada uniforme.

## ADR-006 — Autorización distribuida

**Decisión:** validar autorización en Gateway **y** en microservicio.
**Motivo:** el Gateway no debe ser la única frontera de seguridad.

## ADR-007 — Stack Java + Spring

**Decisión:** Java 21 + Spring Boot 3 + Maven.
**Motivo:** experiencia previa del equipo con Java/Spring; ecosistema Spring Cloud completo.
**Consecuencia:** se reemplaza cualquier propuesta previa basada en .NET (YARP, EF Core) por Spring Cloud Gateway, JPA/Hibernate y PostgreSQL.

## ADR-008 — Service Discovery con Eureka

**Decisión:** Spring Cloud Netflix Eureka.
**Motivo:** estándar del ecosistema Spring Cloud.
**Alternativa documentada:** Consul (agrega KV store), si se prefiere consolidar discovery + config.

## ADR-009 — PostgreSQL (recomendada)

**Decisión:** PostgreSQL como motor (una base por servicio).
**Motivo:** open source, mejor par con Hibernate, JSONB para auditoría/eventos, Docker liviano, transacciones sólidas.
**Estado:** recomendada, **pendiente de confirmación final** (SQL Server también es viable con Spring).

## Opcionales según tiempo (no bloquean el MVP)

- **Spring Cloud Contract / Pact** (contract testing de eventos): cubierto por OpenAPI + esquemas de eventos versionados + tests de integración en el MVP; se incorpora si sobra tiempo.
- **Dashboards Prometheus/Grafana + OpenTelemetry**: el MVP exige solo health checks + logs estructurados; la instrumentación queda preparada (`/actuator/metrics`).