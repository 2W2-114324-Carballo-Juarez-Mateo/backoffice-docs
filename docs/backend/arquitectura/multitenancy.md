# Multitenancy y Row-Level Security (RLS)

> **Decisión:** multitenancy **lógico** (tenant = curso-cohorte) + **RLS de PostgreSQL** como refuerzo. Es parte de nuestra propuesta de backend: aislamiento robusto por `course_id` sin infraestructura física por tenant.

## 1. Por qué multitenancy lógico

El documento oficial define el **curso-cohorte como el contexto compartido** de la plataforma: es la clave que viaja en cada operación y contra la que se acota cada consulta. Por eso el **tenant = curso-cohorte (`course_id`)** es el modelo natural.

Elegimos **multitenancy lógico** (base compartida por servicio + columna `course_id`) y **no** base/esquema por tenant porque:

- Los cursos son **muchos y chicos**: crear una base o esquema por tenant multiplica la infraestructura sin beneficio real.
- El PRD **no** requiere aislamiento físico por tenant (no hay compliance/backup per-tenant que lo exija).
- Es barato, un solo esquema, migraciones simples, y el riesgo de fuga se mitiga con **TenantContext + RLS + pruebas**.

## 2. Dónde aplica en el Backoffice

| Capa | Multitenancy |
|---|---|
| **Administration & Configuration** (PAR-01..24, proveedores, evaluador, golden set) | **Global a propósito** (no tenant-scoped): la economía debe valer igual en todos los cursos. |
| **Reporting & Analytics** (métricas, reportes docentes, panel) | **SÍ multitenant**: read models acotados por `course_id` + pertenencia del actor. |

## 3. TenantContext

Componente transversal que determina, por operación, el alcance del usuario:

```text
JWT (T01)
  ↓
Identidad + rol
  ↓
Curso solicitado (course_id)
  ↓
Validación de pertenencia (matrícula T02)
  ↓
TenantContext autorizado
```

- **Nunca confía** en el `course_id` del request: se valida contra la membresía real (T02 para PROFESOR; ADMIN = global).
- Es la base para setear `app.current_course` en la sesión de base de datos (para RLS).

## 4. Row-Level Security (RLS) como refuerzo

**Problema que resuelve:** si un desarrollador "se olvida" del `WHERE course_id = ?`, la fuga de tenant aparece. RLS hace que **la propia base filtre por tenant**:

```sql
-- política en cada tabla tenant-scoped
CREATE POLICY tenant_isolation ON cohort_metrics_snapshot
  USING (course_id = current_setting('app.current_course')::uuid);
```

- El `TenantContext` setea `app.current_course` al inicio del request.
- PostgreSQL **no devuelve filas de otros tenants** aunque falte el filtro en la query.
- Es **defensa en profundidad** a nivel datos.

> **Importante:** RLS **no reemplaza la autorización** (*validar ≠ autorizar*). RLS filtra filas dentro de un tenant ya autorizado; la pertenencia a la cohorte se sigue validando en la aplicación (T02).

## 5. Convención multitenancy de plataforma (para coordinar con otros equipos)

Para que toda la plataforma aplique lo mismo, esta convención se propone a los demás grupos en la sesión de integración:

1. **Tenant = curso-cohorte (`course_id`)** en toda entidad tenant-scoped.
2. **Clave de sesión común:** `app.current_course` (PostgreSQL `current_setting`), seteada por el `TenantContext` **siempre desde el contexto validado** (token + pertenencia), nunca desde el request.
3. **RLS habilitado en las tablas tenant-scoped** de cada servicio (cada equipo sobre su propia base).
4. **RLS complementa, no reemplaza** la autorización por pertenencia.
5. Caso de prueba obligatorio de aislamiento (ver abajo).

**Caso de prueba multitenancy (obligatorio):**

```text
PROFESOR A → GET /reports/courses/{cohorteA}/metrics → 200 (su cohorte)
PROFESOR A → GET /reports/courses/{cohorteB}/metrics → 403 (otra cohorte)
```

## 6. Alternativas descartadas

| Enfoque | Por qué NO |
|---|---|
| Base por tenant | Costo/operación inviable (miles de cursos chicos) |
| Esquema por tenant | Sobreringería: migraciones y backups por schema; sin beneficio real acá |
| Solo filtro en app (sin RLS) | Depende de acordarse del filtro en cada query → riesgo de fuga |

> La combinación **lógico + TenantContext + RLS + read models por `course_id`** da aislamiento robusto y barato, alineado con el concepto de cohorte del documento oficial.