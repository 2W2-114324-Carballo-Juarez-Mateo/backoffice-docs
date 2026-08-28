# Requerimientos Funcionales (RF)

> Los IDs preservan los del PRD para trazabilidad (`RF-ÁREA-NN`). Detalle completo en `backoffice_backend_requerimientos_arquitectura.md` §4.

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
| RF-CFG-02 | Configuración por curso administrada por el PROFESOR creador. |
| RF-CFG-03 | Configuración a nivel usuario. |
| RF-CFG-04 | Parámetros de economía (PAR-01..18) globales, solo ADMIN. |
| RF-CFG-05 | Separación de ámbitos: ADMIN = valores globales; PROFESOR = decisiones pedagógicas. No puede pisar parámetros globales. |
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

## Gestión de usuarios

| ID | Requisito |
|---|---|
| RF-USR-01 | ADMIN consulta usuarios (ámbito global). |
| RF-USR-02 | Consulta de identidad, rol, estado, validación, fecha de alta. |
| RF-USR-03 | Operaciones administrativas de usuario según PRD. |
| RF-USR-04 | Bajas siempre lógicas. |
| RF-USR-05 | PROFESOR administra padrón de su curso: alta, carga masiva (acumula y reporta errores), modificación, baja lógica. |
| RF-USR-06 | Backend valida ámbito: el PROFESOR solo accede a alumnos de sus cursos. |

## Gestión de cursos

| ID | Requisito |
|---|---|
| RF-CUR-01 | Alta de curso por PROFESOR autorizado. |
| RF-CUR-02 | ADMIN consulta todos; PROFESOR solo los suyos. |
| RF-CUR-03 | Edición según reglas de negocio. |
| RF-CUR-04 | Estados: `draft`, `activo`, `archivado`. |
| RF-CUR-05 | No hay borrado físico: se archiva. |
| RF-CUR-06 | draft → activo valida padrón cargado + calibración IA aprobada. Sin override. |
| RF-CUR-07 | activo → archivado valida estado académico confirmado + cero scores IA pendientes. |
| RF-CUR-08 | Archivado queda en modo lectura. |
| RF-CUR-09 | Administra la info del curso sin asumir dominios de otros equipos. |

## Desafíos (administración)

| ID | Requisito |
|---|---|
| RF-DES-01 | ADMIN/PROFESOR crean desafíos. |
| RF-DES-02 | Consulta de desafíos para el usuario autenticado. |
| RF-DES-03 | Modificación según reglas del PRD. |
| RF-DES-04 | Dificultad: BASICO / MEDIO / AVANZADO. |
| RF-DES-05 | Atributo `obligatorio`. |
| RF-DES-06 | Reintentos configurables 0–3. |
| RF-DES-07 | XP/monedas se derivan de parámetros globales (el profesor no fija montos). |

## Auditoría

| ID | Requisito |
|---|---|
| RF-AUD-01 | Registro de operaciones administrativas sensibles. |
| RF-AUD-02 | Datos mínimos: evento, usuario, rol, fecha, operación, recurso, resultado, motivo, correlation ID. |
| RF-AUD-03 | Obligatorias: alta/baja ADMIN, recuperación, cambios de config global, cambios críticos de curso, retención/anonimización, overrides. |
| RF-AUD-04 | Inmutabilidad lógica desde las APIs comunes. |

## Retención y datos

| ID | Requisito |
|---|---|
| RF-RET-01 | Conservación por el plazo del PRD (5 años). |
| RF-RET-02 | Vencimiento sin purga automática → estado pendiente de decisión. |
| RF-RET-03 | ADMIN decide: extender o anonimizar. |
| RF-RET-04 | Toda decisión auditada (responsable, fecha, alcance, motivo). |

## Reporting

| ID | Requisito |
|---|---|
| RF-REP-01 | Consultas para que ADMIN supervise la plataforma. |
| RF-REP-02 | PROFESOR consulta info de sus cursos. |
| RF-REP-03 | El reporting aplica las mismas reglas de autorización. |
| RF-REP-04 | Encuestas: respeta anonimato 100% (sin reconstruir autor ↔ respuesta). |