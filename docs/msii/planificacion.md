# Planificación y dimensionamiento

> Backlog **general** (no atado a un Sprint puntual) del Backoffice (Tema 12). Se estructura en **2 temas estratégicos → 5 épicas → 14 historias de usuario**. Estimación: **SP (Fibonacci)** por historia y **horas** por tarea. La capacidad real la define el Excel del equipo. Ver [Sprint 0](/msii/sprint0).

## 2 temas estratégicos (supra-épicas)

- **T-A · Gobernanza y Configuración Institucional** — *quién puede actuar y bajo qué reglas* (ADMIN + modelos de IA). Épicas EP-01..03.
- **T-B · Observabilidad y Soporte Académico** — *muestra en vez de gobernar* (PROFESOR consulta; ADMIN ve consolidado). Épicas EP-04..05.

## Épicas e Historias (14)

| Tema | Épica | Historias | SP | Prioridad |
|---|---|---|---|---|
| T-A | EP-01 · Parámetros Globales | US-01, US-02 | 5+5 | Must |
| T-A | EP-02 · Administración de la Plataforma | US-03 | 5 | Must |
| T-A | EP-03 · Modelos LLM y Golden Set | US-04, US-05, US-06, US-07 | 5+5+5+5 | Must |
| T-B | EP-04 · Contratos de Lectura e Ingesta | US-08, US-10 | 5+3 | Must |
| T-B | EP-05 · Observabilidad, Reportes y Panel | US-09, US-11, US-12, US-13, US-14 | 5+5+5+5+3 | Could / Should ×4 |

> **Prioridades:** **Must** = US-01..08 y US-10 (**43 SP**) · **Should** = US-11..14 · **Could** = US-09. Detalle por historia (template + tareas con horas) en el repo: `plan/sprint0/uh/` y `plan/sprint0/tareas.md`.

## Tareas de dominio (detalle técnico)

| Tarea de dominio | RF | Página |
|---|---|---|
| Administración de plataforma | RF-CFG-01/05 · RF-ROL | [detalle](/msii/tareas/administracion-plataforma) |
| Registro de parámetros PAR-01..23 | RF-CFG-04/06 | [detalle](/msii/tareas/registro-parametros) |
| Gestión del proveedor LLM (exclusiva ADMIN) | RF-IA-ADM-01..07 | [detalle](/msii/tareas/proveedor-llm) |
| Contratos de lectura con los 6 temas | RF-RPT-10 | [detalle](/msii/tareas/contratos-lectura) |
| Reportes docentes | RF-RPT-01/02/03/04/05 | [detalle](/msii/tareas/reportes-docentes) |

## Criterios de prioridad (del documento del profe)

- **Pedido para empezar (Must)** = núcleo del dominio + lo que otros equipos necesitan (los **contratos de lectura** son la dependencia crítica).
- **Para más adelante (Should)** = se diseña ahora y se implementa después.
- **Podría ser (Could)** = un extra a medias vale menos que un núcleo terminado.

> **Transversal:** la **multitenancy (tenant = curso-cohorte + RLS)** se incorpora desde el diseño en Reporting (caso ADMIN `ALL` incluido); ver [Multitenancy y RLS](/backend/arquitectura/multitenancy).