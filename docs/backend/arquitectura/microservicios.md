# Microservicios

> El Backoffice es **"consumidor puro"** (Tema 12 según `TUP_PIV_BE_PROPUESTA_ARQ.pdf`): tiene **2 servicios propietarios** y consume identidad/autorización/auditoría (Tema 01) y cohorte (Tema 02). Cada servicio con su base (Database per Service) y capas Clean Architecture: `api → application → domain ← infrastructure`.

## Administration & Configuration Service

**Responsabilidad:** administración de la plataforma: configuración global + **gestión del proveedor de modelo** (exclusiva de ADMIN).

- Registro de parámetros **PAR-01..PAR-24** (base PRD PAR-01..18; registro genérico/extensible).
- **Gestión de proveedores de LLM** (RF-IA-35): alta, sustitución, baja, auditada.
- **Asignación modelo ↔ función** (RF-IA-23/24) y configuración del evaluador (RF-IA-25/28).
- **Golden set base y calibración** a nivel plataforma (RF-IA-30/31) y **detección de deriva** (RF-IA-32).
- Versionado y cambios hacia adelante (RF-CFG-06).
- Autoriza sus endpoints consumiendo roles del **Tema 01**.
- **Base:** `administration_db`
- **No debe:** llamar a los LLM (Tema 07 los usa), ni implementar identidad/auth/auditoría (Tema 01) ni cohorte (Tema 02).

## Reporting & Analytics Service

**Responsabilidad:** **reportes docentes**, **panel del profesor**, **métricas de curso**, **exportación de datos** y **alertas**. Consumidor de lecturas: no es dueño de la información operacional.

- Reportes docentes por cohorte (PROFESOR) y consolidado de plataforma (ADMIN).
- Panel del profesor con **indicador de alumno en riesgo**.
- Métricas de cohorte: satisfacción (**KPIs CSAT 5★**, encuestas agregadas/anónimas), engagement, aprobación/abandono.
- Exportación de datos (CSV/PDF) y **alertas configurables**.
- **Frescura ≤ 15 minutos** en read models; **sin comparación entre docentes**.
- Consume **contratos de lectura** de los temas 02/04/05/07/08/10 (eventos/APIs por el gateway).
- **Base:** `reporting_db` (read models reconstruibles por contratos de lectura (REST)).

## Consumidos (no implementados)

| Dominio | Tema | Uso del Backoffice |
|---|---|---|
| Identidad, auth, 2FA, roles, sesión, **auditoría**, retención | **T01** | Consume para autenticar/autorizar/auditar; **API Gateway de plataforma** |
| Curso-cohorte, matrícula, padrón | **T02** | Consume la cohorte (`course_id`) y la pertenencia docente |
| Desafíos, teóricos, encuestas, prácticas, sandbox, evaluación LLM, banco, mercado, roadmap, social | Temas 03-11 | Solo **lectura** (02/04/05/07/08/10) para reportes/métricas |

## Tabla de bases

| Servicio | Base |
|---|---|
| Administration & Configuration | administration_db |
| Reporting & Analytics | reporting_db |

> No existen Foreign Keys entre bases de microservicios; las relaciones entre dominios se representan con IDs.