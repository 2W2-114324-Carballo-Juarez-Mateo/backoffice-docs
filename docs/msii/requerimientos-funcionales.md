# Requerimientos Funcionales (RF)

> **Alcance: Tema 12 — Backoffice** (consumidor puro) según `TUP_PIV_BE_PROPUESTA_ARQ.pdf`. Los IDs preservan los del PRD; los propios del Backoffice se numeran `RF-IA-ADM-*` y `RF-RPT-*`. Detalle completo en `backoffice_backend_requerimientos_arquitectura.md` §4.

## Configuración global (Administration & Configuration)

| ID | Requisito |
|---|---|
| RF-CFG-01 | ADMIN administra configuraciones globales. |
| RF-CFG-04 | Parámetros de economía (PAR) globales, solo ADMIN. |
| RF-CFG-05 | Separación de ámbitos: PROFESOR no puede pisar parámetros globales. |
| RF-CFG-06 | Cambios de parámetros aplican solo hacia adelante (sin recalcular histórico). |

> **PAR-01..PAR-24** según el doc del profe (base PRD PAR-01..18; registro genérico/extensible — no depende del número).

### Catálogo de parámetros (resumen, base PRD)

| Parámetro | Default |
|---|---:|
| XP base por dificultad | 100 / 250 / 500 |
| Monedas (obligatorio / opcional) | 100 / 50 |
| Bonus/penalidad uso IA | ±20% |
| Precio vida / equipamiento | 300 / 500 |
| Vidas iniciales / máximo | 3 / 3 |
| Tolerancia calibración IA | ±5 prom / ±10 por dim |
| Retención académica / preaviso | 5 años / 90 días |
| Umbral encuestas | 5 respuestas |

## Gestión de proveedores de modelo (exclusiva de ADMIN)

| ID | Requisito |
|---|---|
| RF-IA-ADM-01 | Alta/sustitución/baja de proveedores y modelos de LLM, exclusiva de ADMIN, auditada (RF-IA-35). |
| RF-IA-ADM-02 | Asignación modelo ↔ función (RF-IA-23/24). |
| RF-IA-ADM-03 | Evaluador de uso de IA: un único modelo activo (RF-IA-25). |
| RF-IA-ADM-04 | Cambio de modelo evaluador sujeto a calibración (RF-IA-28). |
| RF-IA-ADM-05 | Golden set base + calibración dentro de tolerancia (RF-IA-30/31). |
| RF-IA-ADM-06 | Detección de deriva (RF-IA-32). |
| RF-IA-ADM-07 | Trazabilidad de cohortes evaluadas con más de un modelo (RF-IA-33). |

## Reportes docentes, métricas, exportación y alertas (Reporting & Analytics)

| ID | Requisito |
|---|---|
| RF-RPT-01 | Reportes docentes: PROFESOR consulta sus cohortes; ADMIN el consolidado de plataforma. |
| RF-RPT-02 | Panel de métricas de curso: satisfacción (KPIs CSAT 5★, agregados/anónimos), engagement, aprobación/abandono. |
| RF-RPT-03 | Panel del profesor con **indicador de alumno en riesgo** (para más adelante). |
| RF-RPT-04 | Exportación de datos (resúmenes, reportes CSV/PDF). |
| RF-RPT-05 | **Alertas configurables** (para más adelante). |
| RF-RPT-06 | **Frescura ≤ 15 minutos** en los datos de lectura. |
| RF-RPT-07 | **Sin comparación entre docentes**. |
| RF-RPT-08 | No exposición de datos fuera de ámbito. |
| RF-RPT-09 | Encuestas: solo agregados anónimos (RF-ENC-04/12). |
| RF-RPT-10 | **Contratos de lectura** con los seis temas (02/04/05/07/08/10) — dependencia crítica del sprint 1. |

## Consumido del Tema 01 (no se implementa)

Identidad, auth, 2FA, roles/permisos, sesión, **auditoría**, retención y **API Gateway** son del **Tema 01**. El Backoffice los consume para operar y autorizar sus endpoints (validar ≠ autorizar).

## Fuera del alcance del Backoffice (otros temas)

Cursos/Mátricula (T02), Motor de Desafíos (T03), Teóricos y Encuestas (T04), Desafíos Prácticos (T05), Sandbox (T06), Evaluación LLM (T07), Banco (T08), Mercado (T09), Roadmap y Progreso (T10), Social y Notificaciones (T11). El Backoffice los **lee** (02/04/05/07/08/10) para reportes y métricas.