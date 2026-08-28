# Backend

> Materia **Back** · Estado: **documentado** (arquitectura + diseño detallado)

Backend del módulo **BackOffice** de la Plataforma Gamificada. Stack: **Java 21 · Spring Boot 3 · Maven** · Microservicios · Apache Kafka · PostgreSQL.

## Contenido de esta sección

| Página | Qué contiene |
|---|---|
| [Resumen visual](/backend/resumen) | Qué hace el BackOffice, los 5 microservicios, stack y reglas críticas |
| [Vista general](/backend/arquitectura/vista-general) | Diagrama de la arquitectura, componentes y principios |
| [Microservicios](/backend/arquitectura/microservicios) | Detalle de los 5 servicios y sus bases |
| [Comunicación](/backend/arquitectura/comunicacion) | Service Discovery (Eureka), REST + Kafka, Outbox, idempotencia |
| [Patrones de diseño](/backend/arquitectura/patrones) | Patrones Java aplicados por lugar concreto |
| [Estructura de carpetas](/backend/arquitectura/carpetas) | Monorepo Maven + Clean Architecture |
| [Modelo de datos](/backend/datos/modelo) | Entidades JPA por servicio |
| [Endpoints](/backend/api/endpoints) | Contratos de API + matriz endpoint → rol → alcance |
| [ADRs](/backend/decisiones/adr) | Decisiones arquitectónicas |
| [Riesgos](/backend/riesgos) | Riesgos técnicos y qué NO hacer |
| [Ownership entre equipos](/backend/equipos/ownership) | Matriz de ownership + contratos cross-team |

## Requerimientos

Los requerimientos funcionales y no funcionales están en la sección **[MSII](/msii/)**, junto con la trazabilidad RF → componente.

## Frontend

El frontend está en la sección **[Frontend](/frontend/)**, todavía sin plan definido.