# Ownership entre equipos

> La clase se dividió por módulos (microservicios). Cada módulo tiene un **dueño**. El BackOffice cubre **4 servicios**; el resto de los dominios son de otros equipos y el BackOffice solo los **consume** (eventos/APIs) para reportes y métricas.

## Matriz de ownership

| Servicio / Dominio | Dueño | Rol del BackOffice |
|---|---|---|
| Auth, roles, permisos, gestión de ADMIN | **BackOffice** (Identity & Access) | Propietario |
| Configuración global (PAR-01..18) | **BackOffice** (Administration) | Propietario |
| Proveedores/modelos de IA (RF-IA-23/24/25/35) | **BackOffice** (Administration) | Propietario (configuración; el AI Service la consume) |
| Reportes docentes, métricas de curso, exportación | **BackOffice** (Reporting & Analytics) | Propietario |
| Auditoría | **BackOffice** (Audit) | Propietario |
| User (datos, legajo, **avatar**, perfil, onboarding) | equipo Usuarios | **No** — solo consumo/consulta administrativa |
| Course (cursos, roadmap, padrón, estados) | equipo Cursos | **No** — consume eventos (CourseArchived, RosterUpdated) para reportes/métricas |
| Challenge (desafíos) | equipo Desafíos | **No** |
| Gamification (XP, monedas, vidas) | equipo Gamificación | **No** — solo configura PAR que ellos consumen |
| Ranking / Cierre académico | equipo Ranking | **No** — consume datos para métricas |
| AI Service (tutor/evaluador como producto) | equipo IA | **No** — consume la config de proveedores que administramos |
| Communication (chat) | equipo Comunicación | **No** |
| Encuestas de alumno | equipo Encuestas | **No** — consume agregados anónimos |

> Matriz a acordar con los demás equipos antes de la defensa.

## Contratos cross-team (dependencias críticas)

### 1. Configuración de proveedores de modelo → AI Service
- **Dependencia:** Administration (BackOffice) → AI Service (equipo IA).
- **Mecanismo:** evento `ModelProviderChanged` / `GlobalConfigurationChanged` en el topic `administration.events`.
- **Regla:** solo ADMIN puede cambiarla (RF-IA-35).

### 2. Parámetros de economía → Gamification (RF-CFG-04)
- **Mecanismo:** evento `GlobalConfigurationChanged` (`{key, value, version}`).
- **Regla:** cambios hacia adelante (RF-CFG-06).

### 3. Reportes/métricas consumen eventos de otros dominios
- **Mecanismo:** Reporting & Analytics (BackOffice) consume `course.events`, `gamification.events`, `ranking.events`, `survey.events` para read models, sin acceder a sus bases.
- **Encuestas:** solo agregados anónimos (RF-ENC-04/12).

### 4. Intervención excepcional de ADMIN sobre cursos
- **Mecanismo:** si el PRD otorga a ADMIN intervención excepcional sobre cursos (RF-CUR-08), se hace por la **API del equipo Cursos** (cross-team), no con servicio propio.

> **Convención de eventos:** todos siguen `{eventId, eventType, occurredAt, correlationId, actorId, source, payload}`, con contrato versionado.