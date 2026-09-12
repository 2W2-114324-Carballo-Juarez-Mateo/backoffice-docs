# Endpoints (contratos de API)

> Convención REST consistente, APIs versionadas (`/api/v1/...`), documentadas con OpenAPI/Swagger. La autorización se valida **siempre** en el microservicio (validar ≠ autorizar): el gateway (T01) valida el JWT y propaga contexto; cada servicio autoriza **localmente** (`@PreAuthorize`) sobre el rol propagado.

## Convención de rutas (contrato con T01)

Toda API pública vive bajo `/api/{servicio}/**` (prefijo definido en el gateway; sin él → 404). Nuestros endpoints propios están bajo `/api/administration/**` o `/api/reports/**`. Los servicios de otros temas se consumen bajo su prefijo (ej. T01 = `/api/users/**`).

## Identity & Access (lado ADMIN — de T01, consumidos)

```http
POST /api/auth/login
POST /api/auth/2fa/verify
POST /api/auth/logout

GET    /api/admin/accounts
GET    /api/admin/accounts/{id}
POST   /api/admin/accounts
DELETE /api/admin/accounts/{id}
```

## Administration & Configuration (`/api/administration/**`)

```http
GET  /api/administration/parameters
GET  /api/administration/parameters/{key}
PUT  /api/administration/parameters/{key}

GET    /api/administration/model-providers
POST   /api/administration/model-providers
PUT    /api/administration/model-providers/{id}
DELETE /api/administration/model-providers/{id}

GET  /api/administration/model-functions
PUT  /api/administration/model-functions/{function}

POST /api/administration/evaluator/activate
GET  /api/administration/evaluator/calibration
```

## Reporting & Analytics (`/api/reports/**` — reportes, métricas, export, alertas)

```http
GET /api/reports/platform
GET /api/reports/courses/{courseId}
GET /api/reports/courses/{courseId}/metrics
GET /api/reports/courses/{courseId}/teacher
GET /api/reports/courses/{courseId}/teacher/risk

GET /api/reports/export/courses/{courseId}      ← CSV/PDF
GET /api/reports/export/platform
GET /api/reports/alerts                          ← alertas configurables
```

## Auditoría y retención — consumidas del Tema 01 (`/api/users/**`)

```http
GET /api/users/audit        ← contrato de lectura de auditoría (ADMIN, paginado)
GET /api/users/audit/{id}
GET /api/users/retention/policy          ← opcional (postergado)
GET /api/users/retention/records         ← opcional (postergado)
```

## Matriz endpoint → rol → alcance

| Endpoint | Método | Roles | Regla de alcance |
|---|---|---|---|
| `/api/auth/login` | POST | público | — |
| `/api/auth/2fa/verify` | POST | todos | — |
| `/api/admin/accounts` | GET | ADMIN | global |
| `/api/admin/accounts` | POST | ADMIN | contraseña + 2FA del solicitante (RF-ROL-03/06) |
| `/api/admin/accounts/{id}` | DELETE | ADMIN | no auto-eliminación + 2FA + confirmación + último ADMIN |
| `/api/administration/parameters/{key}` | PUT | ADMIN | exclusivo ADMIN (RF-CFG-05) |
| `/api/administration/model-providers*` | GET/POST/PUT/DELETE | ADMIN | exclusivo ADMIN (RF-IA-35) |
| `/api/administration/model-functions*` | GET/PUT | ADMIN | exclusivo ADMIN (RF-IA-23/24) |
| `/api/administration/evaluator/*` | GET/POST | ADMIN | exclusivo ADMIN (RF-IA-25/28/31) |
| `/api/users/audit` | GET | ADMIN | global (lectura T01) |
| `/api/reports/platform` | GET | ADMIN | global (alcance `ALL` server-side) |
| `/api/reports/courses/{courseId}*` | GET | ADMIN, PROFESOR | PROFESOR: solo su cohorte (matrícula T02) |
| `/api/reports/export/*` | GET | ADMIN / PROFESOR | según recurso |
| `/api/reports/alerts` | GET | ADMIN, PROFESOR | según recurso |

> **Roles reales (contrato T01):** `ADMIN`, `PROFESOR`, `ALUMNO` (+ `MS` solo service-to-service). **No existe `AUDITOR`**: la lectura de auditoría es `ADMIN`.
> La autorización se valida **siempre** en el microservicio propietario (RNF-03), aunque el Gateway ya validó el JWT. El alcance del PROFESOR sobre un curso se valida contra la membresía real provista por el dominio de cursos (T02).

## Manejo de errores (formato uniforme)

```json
{
  "type": "https://example.com/errors/business-rule",
  "title": "Business rule violation",
  "status": 409,
  "detail": "Cannot delete the last active ADMIN.",
  "traceId": "abc-123"
}
```

| Código | Uso |
|---|---:|
| 200 / 201 / 204 | Operación exitosa |
| 400 | Datos inválidos |
| 401 | No autenticado |
| 403 | Sin permisos |
| 404 | Recurso inexistente |
| 409 | Conflicto / regla de negocio |
| **429** | **Demasiadas solicitudes** (rate limiting en Gateway) — con `Retry-After` |
| 422 | Validación semántica |
| 500 | Error inesperado |
| 503 | Dependencia no disponible |

## Rate limiting y 429

- Rate limiting en el **Gateway** (Spring Cloud Gateway + Bucket4j o Redis `RequestRateLimiter`) con umbrales por endpoint y rol; foco en `/login`, `/api/auth/*`, `/api/users/audit`.
- Respuesta **429** con **`Retry-After`**.
- **Idempotency Keys** en operaciones críticas (PUT de configuración, proveedores, baja de ADMIN).
- El front aplica **single-flight** + manejo de `Retry-After` (ver [Frontend — Plan de comunicación](/frontend/comunicacion)).

> Nunca se devuelven stack traces, secretos, SQL, prompts internos ni información de otros tenants.