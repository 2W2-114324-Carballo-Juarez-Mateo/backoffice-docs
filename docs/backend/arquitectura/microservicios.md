# Microservicios

> División por **responsabilidades de negocio** alineadas a las tareas oficiales del BackOffice. **4 servicios**, cada uno con su base (Database per Service) y capas Clean Architecture: `api → application → domain ← infrastructure`.

## Identity & Access Service (lado ADMIN)

**Responsabilidad:** identidad de las cuentas administrativas, autenticación y autorización.

- Login, 2FA (TOTP), emisión/validación de sesión (JWT en cookie httpOnly).
- Roles y permisos (RBAC).
- Gestión de ADMIN (alta, baja, reglas de ADMIN, break-glass server-only).
- Validación del último ADMIN (incondicional, con concurrencia).
- **Base:** `identity_db`
- **No debe:** onboarding de usuarios (equipo Usuarios), ni modificar configuración/proveedores.

## Administration & Configuration Service

**Responsabilidad:** configuración global de la plataforma + **gestión de proveedores y modelos de IA** (exclusiva de ADMIN).

- Parámetros globales de economía (PAR-01..18) y operativos, versionados, cambios hacia adelante.
- Alta/sustitución/baja de proveedores LLM (RF-IA-35), auditada.
- Asignación modelo ↔ función (RF-IA-23/24).
- Evaluador único activo + cambio con calibración (RF-IA-25/28/31).
- Golden set base y calibración a nivel plataforma (RF-IA-30/31).
- Detección de deriva (RF-IA-32).
- **Base:** `administration_db`
- **No debe:** llamar a los LLM (eso es el AI Service); gestionar cursos/desafíos/usuarios.

## Reporting & Analytics Service

**Responsabilidad:** **reportes docentes**, **panel de métricas de curso** y **exportación de datos**.

- Reportes docentes por curso (PROFESOR) y consolidado de plataforma (ADMIN).
- Métricas de curso: satisfacción (encuestas agregadas/anónimas), engagement, aprobación/abandono.
- Exportación de resúmenes y reportes (CSV/PDF).
- Consume eventos de otros equipos (Cursos, Gamificación, Ranking, Encuestas) → read models.
- **Base:** `reporting_db` (no es dueño de la información operacional; reconstruye por replay de Kafka).

## Audit Service

**Responsabilidad:** registro de operaciones administrativas sensibles (transversal, **inmutable**).

- Recepción de eventos de auditoría, persistencia, consulta restringida.
- Actor + recurso + correlation ID + resultado + motivo.
- **Base:** `audit_db`

## Tabla de bases por servicio

| Servicio | Base |
|---|---|
| Identity & Access | identity_db |
| Administration & Configuration | administration_db |
| Reporting & Analytics | reporting_db |
| Audit | audit_db |

> No existen Foreign Keys entre bases de microservicios; las relaciones entre dominios se representan con IDs.