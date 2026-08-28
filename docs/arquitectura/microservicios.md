# Microservicios

> División por **responsabilidades de negocio** (bounded contexts), no por entidad. Cada uno con su base (Database per Service) y capas Clean Architecture: `api → application → domain ← infrastructure`.

## Identity & User Service

**Responsabilidad:** identidad, cuentas y roles.

- Login, validación de credenciales, 2FA, sesiones.
- Gestión de usuarios, roles, estados de cuenta.
- Reglas de ADMIN: último ADMIN, auto-eliminación, recuperación (break-glass), baja reforzada.
- **Base:** `identity_db` · **No debe:** gestionar cursos ni modificar parámetros económicos.

## Course & Content Service

**Responsabilidad:** cursos y recursos académicos administrables.

- CRUD de cursos, estados (`draft → activo → archivado`), propietario.
- Padrón del curso (alta, carga masiva, modificación, baja lógica).
- Desafíos y configuración propia del curso.
- Validaciones de transición de estado (activación: padrón + calibración IA; archivado: cierre académico + cero scores pendientes).
- **Base:** `course_db`

## Configuration Service

**Responsabilidad:** configuración global de la plataforma.

- Parámetros de economía (PAR-01..18) y operativos configurables.
- Versionado de configuración y aplicación hacia adelante (RF-CFG-06).
- Validación de permisos ADMIN.
- **Base:** `configuration_db`

## Audit Service

**Responsabilidad:** evidencia de operaciones administrativas (transversal).

- Recepción de eventos de auditoría y persistencia.
- Consulta restringida.
- Actor + recurso + correlation ID + resultado + motivo.
- **Inmutable** desde las APIs administrativas.
- **Base:** `audit_db`

## Reporting Service

**Responsabilidad:** consultas y agregaciones para BackOffice.

- Métricas administrativas, consultas agregadas, info por curso y global.
- Consume eventos de otros servicios para construir **read models**.
- **No es dueño** de la información operacional original.
- **Base:** `reporting_db`

## Tabla de bases por servicio

| Servicio | Base |
|---|---|
| Identity & User | identity_db |
| Course & Content | course_db |
| Configuration | configuration_db |
| Audit | audit_db |
| Reporting | reporting_db |

> No existen Foreign Keys entre bases de microservicios; las relaciones entre dominios se representan con IDs.