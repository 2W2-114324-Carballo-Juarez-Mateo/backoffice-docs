# Requerimientos Funcionales (RF)

> **Alcance oficial del BackOffice** (puntos de los docentes): administración de plataforma · gestión del proveedor de modelo (exclusiva de ADMIN) · reportes docentes · panel de métricas de curso · exportación de datos.
> Los IDs preservan los del PRD para trazabilidad (`RF-ÁREA-NN`); los propios del BackOffice se numeran `RF-IA-ADM-*` y `RF-RPT-*`. Detalle completo en `backoffice_backend_requerimientos_arquitectura.md` §4.

## Roles y administración de ADMIN

| ID | Requisito |
|---|---|
| RF-ROL-01 | Todos los ADMIN tienen los mismos permisos (sin sub-niveles). |
| RF-ROL-02 | Un ADMIN no puede auto-eliminarse. |
| RF-ROL-03 | ADMIN solo se crea/elimina por otro ADMIN; sin alta self-service. |
| RF-ROL-04 | Recuperación de ADMIN solo a nivel servidor (CLI, secreto de instalación, cambio de contraseña forzado, auditoría, alerta). |
| RF-ROL-05 | El sistema nunca puede quedar con cero ADMIN activos (incondicional). |
| RF-ROL-06 | Baja de ADMIN: contraseña + 2FA + confirmación explícita escrita, y validación de último ADMIN. |

## Configuración global

| ID | Requisito |
|---|---|
| RF-CFG-01 | ADMIN administra configuraciones globales. |
| RF-CFG-02 | Configuración a nivel curso: dominio del equipo Cursos. |
| RF-CFG-03 | Configuración a nivel usuario: dominio del equipo Usuarios. |
| RF-CFG-04 | Parámetros de economía (PAR-01..18) globales, solo ADMIN. |
| RF-CFG-05 | Separación de ámbitos: ADMIN = valores globales; PROFESOR no puede pisar parámetros globales. |
| RF-CFG-06 | Cambios de parámetros aplican solo hacia adelante (sin recalcular histórico). |

### Catálogo de parámetros (resumen)

| Parámetro | Default |
|---|---:|
| XP base por dificultad | 100 / 250 / 500 |
| XP desafíos personalizados | 10 / 20 / 30 |
| Monedas (obligatorio / opcional) | 100 / 50 |
| Variación XP calidad/tiempo | ±15% |
| Bonus/penalidad uso IA | ±20% |
| Precio vida / equipamiento | 300 / 500 |
| Umbral desbloqueo sección | 500 |
| Vidas iniciales / máximo | 3 / 3 |
| Máximo reintentos | 3 |
| Tolerancia calibración IA | ±5 prom / ±10 por dim |
| Retención académica / preaviso | 5 años / 90 días |
| Umbral encuestas | 5 respuestas |

## Gestión de usuarios (solo lado ADMIN)

| ID | Requisito |
|---|---|
| RF-USR-01 | ADMIN consulta usuarios (ámbito global). |
| RF-USR-02 | Consulta de identidad básica, rol, estado, fecha de alta. |
| RF-USR-03 | Operaciones administrativas de usuario según PRD (incluida gestión de ADMIN). |
| RF-USR-04 | Bajas siempre lógicas. |
| RF-USR-05 | El padrón de curso es del equipo Cursos; el BackOffice solo consume `RosterUpdated`. |
| RF-USR-06 | Backend valida ámbito: ADMIN global; PROFESOR solo sus cursos (en reportes). |

> **Fuera de alcance:** onboarding/alta de alumno/profesor, validación de legajo, avatar/imagen de usuario, perfil, vinculación GitHub, Guided Tour → equipo Usuarios.

## Gestión de proveedores de modelo (exclusiva de ADMIN)

| ID | Requisito |
|---|---|
| RF-IA-ADM-01 | Alta/sustitución/baja de proveedores y modelos de LLM, potestad exclusiva de ADMIN, auditada (RF-IA-35). |
| RF-IA-ADM-02 | Asignación modelo ↔ función (tutor/evaluador/moderador/generador/RAG), configuración global (RF-IA-23/24). |
| RF-IA-ADM-03 | Evaluador de uso de IA: un único modelo activo; se registra `model_id` + `model_version` + `rubric_version` (RF-IA-25). |
| RF-IA-ADM-04 | Cambio de modelo evaluador en cualquier momento, sujeto a calibración (RF-IA-28). |
| RF-IA-ADM-05 | Golden set base a nivel plataforma + calibración dentro de tolerancia (PAR-14) para habilitar el evaluador (RF-IA-30/31). |
| RF-IA-ADM-06 | Detección de deriva: re-calibración periódica y ante cambio de versión; alerta si cae fuera de tolerancia (RF-IA-32). |
| RF-IA-ADM-07 | Trazabilidad de cohortes evaluadas con más de un modelo (RF-IA-33). |

> El AI Service (otro equipo) **consume** esta configuración; el BackOffice solo la administra.

## Reportes docentes, métricas de curso y exportación

| ID | Requisito |
|---|---|
| RF-RPT-01 | Reportes docentes: PROFESOR consulta sus cursos; ADMIN el consolidado de plataforma. |
| RF-RPT-02 | Panel de métricas de curso: satisfacción (KPIs de encuesta agregados/anónimos), engagement, aprobación/abandono. |
| RF-RPT-03 | Exportación de datos: resúmenes administrativos y reportes descargables (CSV/PDF). |
| RF-RPT-04 | No exposición de datos fuera de ámbito (mismas reglas de autorización). |
| RF-RPT-05 | Encuestas: solo agregados anónimos (RF-ENC-04/12); sin reconstruir autor ↔ respuesta. |

## Auditoría

| ID | Requisito |
|---|---|
| RF-AUD-01 | Registro de operaciones administrativas sensibles. |
| RF-AUD-02 | Datos mínimos: evento, usuario, rol, fecha, operación, recurso, resultado, motivo, correlation ID. |
| RF-AUD-03 | Obligatorias: alta/baja ADMIN, recuperación, cambios de config global, cambios de proveedores de modelo, retención/anonimización, overrides. |
| RF-AUD-04 | Inmutabilidad lógica desde las APIs comunes. |

## Retención y datos

| ID | Requisito |
|---|---|
| RF-RET-01 | Conservación por el plazo del PRD (5 años). |
| RF-RET-02 | Vencimiento sin purga automática → estado pendiente de decisión. |
| RF-RET-03 | ADMIN decide: extender o anonimizar. |
| RF-RET-04 | Toda decisión auditada (responsable, fecha, alcance, motivo). |

## Fuera del alcance del BackOffice (otros equipos)

Cursos/Roadmap, Desafíos, Usuarios (onboarding), Gamificación, Ranking, Chat, Notificaciones, Encuestas de alumno, IA como producto (tutor/evaluador). El BackOffice **consume** sus eventos para reportes y métricas.