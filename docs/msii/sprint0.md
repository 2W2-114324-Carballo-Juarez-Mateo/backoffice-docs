# Sprint 0 — Propuesta inicial de trabajo

> **Entregable:** un único PDF por grupo (Propuesta de Sprint 0 + DoD + capacidad + épicas + historias). Fuente: `plan/sprint0/Sprint0-Propuesta.md` en el repo del equipo. Las **épicas** están en `plan/sprint0/epicas/` y las **historias** en `plan/sprint0/uh/` (formato template del equipo).

## 1. Propuesta de Sprint 0

**Objetivo:** preparar las **bases de trabajo** del equipo (repos, entorno, estándares, contratos, backlog). No se implementan funcionalidades; se deja listo el **backend funcional** para el Sprint 1.

**Bases de trabajo:** Java 21 + Spring Boot 3 + Maven · PostgreSQL · **Kafka** (Outbox + idempotencia + caché TTL) · Eureka + Config Server · Gateway (T01) · GitHub Actions · Testcontainers · OpenAPI. Git con ramas `feature/*` + **PR revisada por ≥1 compañero** · `main` protegido · **Clean Architecture** · sin secretos en el repo · `sdd/` + sitio sincronizados · contratos de eventos acordados · seguimiento en **Taiga**.

**Tareas iniciales:** repos+CI · bootstrap de `administration-service` y `reporting-service` · `docker-compose` (Kafka, PostgreSQL, Eureka, Config Server, Gateway simulado) · contrato de eventos · DoD en Taiga · backlog en Taiga · planificación del Sprint 1 según capacidad.

## 2. Definition of Done (DoD)

> Adaptada (no genérica): se ancla a la tecnología, controles y entregas del equipo. Estructura profesional en **niveles**.

**Nivel 0 · Tarea** — cumple sus criterios de aceptación · build verde · **cobertura de tests ≥ 90%** (objetivo) · se cierra cuando su historia alcanza el Nivel 1.

**Nivel 1 · Historia de Usuario** — cumple el `RF` citado y sus criterios · build verde · Clean Architecture · tests unitarios + Testcontainers (PostgreSQL + Kafka) · **cobertura de tests ≥ 90%** (objetivo) · **Outbox + idempotencia** verificados · **autorización por rol** (200/403) · **multitenancy + RLS** verificado (`ALL` solo ADMIN y auditado) · contrato OpenAPI/eventos coordinado · PR revisada por ≥1 compañero · sin secretos · `sdd/` + sitio sincronizados.

**Nivel 2 · Sprint** — todas sus historias cumplen el Nivel 1 · sin regresiones · Taiga actualizado · revisión/demo lista · retrospectiva realizada.

**Nivel 3 · Release** — `main` con CI verde y tag · desplegable (Docker Compose/`envsubst`) · contratos estables coordinados · documentación alineada.

## 3. Épicas (clasificadas por tema)

### T-A · Gobernanza y Configuración Institucional
> **Quién tiene poder de actuar y bajo qué reglas:** humanos con rol **ADMIN** (Épicas 1 y 2) y **modelos de IA habilitados** (Épica 3). Todas **escriben/deciden**, no solo muestran.

| Épica | Alcance | RF | Prioridad |
|---|---|---|---|
| **Épica 1 — Parámetros Globales** | Reglas de economía y operativas (PAR-01..23) que define el ADMIN y aplican los Temas 03/05/08/10 | RF-CFG-04/06 | Must |
| **Épica 2 — Administración de la Plataforma** | Gestión de administradores y roles: quién puede operar | RF-CFG-01/05 · RF-ROL | Must |
| **Épica 3 — Modelos LLM y Golden Set** | Proveedores/modelos de IA, evaluador, calibración y deriva (exclusivo ADMIN) | RF-IA-ADM-01..07 | Must |

### T-B · Observabilidad y Soporte Académico
> **Muestra información en vez de gobernarla:** el **PROFESOR** solo consulta (no configura nada); el **ADMIN** ve el consolidado. Incluye el habilitador transversal de los contratos de lectura.

| Épica | Alcance | RF | Prioridad |
|---|---|---|---|
| **Épica 4 — Contratos de Lectura** | Consumo de eventos/lecturas de los Temas 02/04/05/07/08/10 para los read models (habilitador del tema) | RF-RPT-10 | Must |
| **Épica 5 — Observabilidad, Reportes y Panel de Riesgo** | Reportes docentes, panel de métricas, alumno en riesgo, export y alertas | RF-RPT-01/02/03/04/05 | Must / Should / Could |

**Futura:** Frontend BackOffice (app Angular + BFF) — a definir.

## 4. Historias de Usuario (primera versión)

> **Especificación completa** de cada historia (con **reglas de negocio, criterios de aceptación, escenarios BDD/Gherkin, endpoints, estimación y tareas asociadas**) en el repo del equipo: `plan/sprint0/uh/US-01.md` … `US-14.md`, siguiendo el template del equipo.

### T-A · Gobernanza y Configuración Institucional

**Épica 1 · Parámetros Globales** — el ADMIN configura, los Temas 03/05/08/10 aplican (sin hardcodear).
- **US-01** ADMIN → crear/editar PAR-01..23 (versionado · hacia adelante · evento).
- **US-02** Consumidor (T03/05/08/10) → recibe el cambio de parámetro (Outbox · idempotencia · caché TTL 10 min).

**Épica 2 · Administración de la Plataforma** — control de quién opera.
- **US-03** ADMIN → alta/baja de administradores (no auto-eliminarse · último admin protegido · auditada).

**Épica 3 · Modelos LLM y Golden Set** — gobernanza de los modelos de IA (exclusivo ADMIN).
- **US-04** ADMIN → registrar proveedores y modelos de IA.
- **US-05** ADMIN → activar y conmutar el modelo en uso (aviso a los servicios).
- **US-06** Sistema → revisar un modelo contra el golden set y guardar el resultado.
- **US-07** Sistema → habilitar solo si pasa la tolerancia (PAR-14) y fallback por deriva.

### T-B · Observabilidad y Soporte Académico

**Épica 4 · Contratos de Lectura** — habilitador transversal: el Reporting consume los datos de los demás equipos.
- **US-08** Reporting → recibe los datos de los 6 temas con deduplicación.
- **US-10** Sistema → controla que los datos estén al día (15 min) y avisa.

**Épica 5 · Observabilidad, Reportes y Panel de Riesgo** — muestra información; PROFESOR consulta solo su curso.
- **US-09** ADMIN/PROFESOR → exportar reportes (CSV/PDF).
- **US-11** Sistema → arma el resumen por comisión y calcula el riesgo.
- **US-12** PROFESOR → panel de sus comisiones (solo su curso · alumno en riesgo).
- **US-13** ADMIN → tablero de indicadores (anonimato).
- **US-14** ADMIN → umbrales de aviso y acceso al tablero.

## 5. Capacidad del equipo

Pendiente de completar (Excel 2 hojas: `CAPACIDAD_SPRINT` + `RESUMEN`). Fórmula: `Capacidad efectiva = ((Días del Sprint − Ausencias) × Horas por día − Otras actividades) × % de dedicación`.

> Ver también: [Planificación](/msii/planificacion) · [Casos de uso (TPI)](/msii/casos-de-uso) · [Rol del equipo](/msii/rol-equipo).