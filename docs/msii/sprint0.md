# Sprint 0 — Propuesta inicial de trabajo

> **Entregable:** un único PDF por grupo (Propuesta de Sprint 0 + DoD + capacidad + épicas + historias). Fuente: `plan/sprint0/sprint0.md` en el repo del equipo.

## 1. Propuesta de Sprint 0

**Objetivo:** preparar las **bases de trabajo** del equipo (repos, entorno, estándares, contratos, backlog). No se implementan funcionalidades; se deja listo el **backend funcional** para el Sprint 1.

**Bases de trabajo:** Java 21 + Spring Boot 3 + Maven · PostgreSQL · **Kafka** (Outbox + idempotencia + caché TTL) · Eureka + Config Server · Gateway (T01) · GitHub Actions · Testcontainers · OpenAPI. Git con ramas `feature/*` + **PR revisada por ≥1 compañero** · `main` protegido · **Clean Architecture** · sin secretos en el repo · `sdd/` + sitio sincronizados · contratos de eventos acordados · seguimiento en **Taiga**.

**Tareas iniciales:** repos+CI · bootstrap de `administration-service` y `reporting-service` · `docker-compose` (Kafka, PostgreSQL, Eureka, Config Server, Gateway simulado) · contrato de eventos · DoD en Taiga · backlog en Taiga · planificación del Sprint 1 según capacidad.

## 2. Definition of Done (DoD)

> Adaptada (no genérica): se ancla a la tecnología, controles y entregas del equipo. Estructura profesional en **niveles**.

**Nivel 0 · Tarea** — cumple sus criterios de aceptación · build verde · se cierra cuando su historia alcanza el Nivel 1.

**Nivel 1 · Historia de Usuario** — cumple el `RF` citado y sus criterios · build verde · Clean Architecture · tests unitarios + Testcontainers (PostgreSQL + Kafka) · **Outbox + idempotencia** verificados · **autorización por rol** (200/403) · **multitenancy + RLS** verificado (`ALL` solo ADMIN y auditado) · contrato OpenAPI/eventos coordinado · PR revisada por ≥1 compañero · sin secretos · `sdd/` + sitio sincronizados.

**Nivel 2 · Sprint** — todas sus historias cumplen el Nivel 1 · sin regresiones · Taiga actualizado · revisión/demo lista · retrospectiva realizada.

**Nivel 3 · Release** — `main` con CI verde y tag · desplegable (Docker Compose/`envsubst`) · contratos estables coordinados · documentación alineada.

## 3. Épicas

| ID | Épica | RF | Prioridad |
|---|---|---|---|
| EP-1 | Administración de plataforma | RF-CFG-01/05 · RF-ROL | Must |
| EP-2 | Configuración global (PAR-01..24) | RF-CFG-04/06 | Must |
| EP-3 | Gestión del proveedor LLM | RF-IA-ADM-01..07 | Must |
| EP-4 | Contratos de lectura (6 temas) | RF-RPT-10 | Must |
| EP-5 | Reportes docentes y panel | RF-RPT-01/02/04/05 | Must/Should/Could |
| EP-6 | Frontend BackOffice (Angular + BFF) | a definir | Futura |

## 4. Historias de Usuario (primera versión)

- **US-01** ADMIN → alta/baja de administradores (no auto-eliminarse · último admin protegido · auditada).
- **US-02** ADMIN → crear/editar PAR-01..24 (versionado · hacia adelante · evento).
- **US-03** Consumidor (T03/05/08/10) → recibe el cambio de parámetro (Outbox · idempotencia · caché TTL 10 min).
- **US-04** ADMIN → alta/sustitución/baja de proveedor o modelo IA (exclusivo · auditado · evento).
- **US-05** ADMIN → habilitar evaluador solo si pasa el golden set (tolerancia PAR-14 · deriva → alerta).
- **US-06** Reporting → consume eventos/lecturas de los 6 temas para read models.
- **US-07** PROFESOR → reportes de su curso-cohorte (solo su curso · alumno en riesgo).
- **US-08** ADMIN → consolidado global de métricas (y por curso) (`ALL` solo ADMIN y auditado).
- **US-09** ADMIN/PROFESOR → exportar reportes (CSV/PDF).

## 5. Capacidad del equipo

Pendiente de completar (Excel 2 hojas: `CAPACIDAD_SPRINT` + `RESUMEN`). Fórmula: `Capacidad efectiva = ((Días del Sprint − Ausencias) × Horas por día − Otras actividades) × % de dedicación`.

> Ver también: [Planificación](/msii/planificacion) · [Casos de uso (TPI)](/msii/casos-de-uso) · [Rol del equipo](/msii/rol-equipo).