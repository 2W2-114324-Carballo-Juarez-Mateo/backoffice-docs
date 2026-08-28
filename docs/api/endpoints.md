# Endpoints (contratos de API)

> Convención REST consistente, APIs versionadas (`/api/v1/...`), documentadas con OpenAPI/Swagger. Los endpoints son una **propuesta de diseño** a ajustar con los casos de uso definitivos.

## Identity & Auth

```http
POST /api/auth/login
POST /api/auth/2fa/verify

GET  /api/users
GET  /api/users/{id}

POST   /api/users/admin
DELETE /api/users/admin/{id}
```

## Courses

```http
GET  /api/courses
POST /api/courses
GET  /api/courses/{id}
PUT  /api/courses/{id}
POST /api/courses/{id}/activate
POST /api/courses/{id}/archive

GET  /api/courses/{id}/roster
POST /api/courses/{id}/roster
POST /api/courses/{id}/roster/import
```

## Configuration

```http
GET /api/configuration/global
GET /api/configuration/global/{key}
PUT /api/configuration/global/{key}
```

## Audit

```http
GET /api/audit
GET /api/audit/{id}
```

## Reporting

```http
GET /api/reports/platform
GET /api/reports/courses/{courseId}
```

## Autorización de ejemplo

| Endpoint | Requiere |
|---|---|
| `POST /api/courses` | `ROLE_ADMIN` **o** `ROLE_PROFESOR` |
| `PUT /api/configuration/global/PAR-01` | `ROLE_ADMIN` |
| `GET /api/courses/{id}/roster` | `ROLE_PROFESOR` **y** dueño del curso (alcance) |

## Matriz endpoint → rol → alcance

| Endpoint | Método | Roles | Regla de alcance |
|---|---|---|---|
| `/api/auth/login` | POST | público | — |
| `/api/auth/2fa/verify` | POST | todos | — |
| `/api/users` | GET | ADMIN | global |
| `/api/users/admin` | POST | ADMIN | contraseña + 2FA del solicitante (RF-ROL-03/06) |
| `/api/users/admin/{id}` | DELETE | ADMIN | no auto-eliminación + 2FA + confirmación + último ADMIN |
| `/api/courses` | GET | ADMIN, PROFESOR | ADMIN: todos; PROFESOR: solo los suyos |
| `/api/courses` | POST | ADMIN, PROFESOR | PROFESOR crea curso propio |
| `/api/courses/{id}` | GET/PUT | ADMIN, PROFESOR | PROFESOR: solo si es dueño |
| `/api/courses/{id}/activate` | POST | ADMIN, PROFESOR | padrón + calibración IA (RF-CUR-08b); sin override |
| `/api/courses/{id}/archive` | POST | ADMIN, PROFESOR | cierre académico + cero scores IA (RF-CUR-07) |
| `/api/courses/{id}/roster` | GET/POST | PROFESOR, ADMIN | PROFESOR: solo su curso |
| `/api/courses/{id}/roster/import` | POST | PROFESOR, ADMIN | carga masiva (RF-USR-05d) |
| `/api/configuration/global` | GET | ADMIN, PROFESOR | PROFESOR: solo lectura |
| `/api/configuration/global/{key}` | PUT | ADMIN | exclusivo ADMIN (RF-CFG-05) |
| `/api/audit` | GET | ADMIN | global |
| `/api/reports/platform` | GET | ADMIN | global |
| `/api/reports/courses/{courseId}` | GET | ADMIN, PROFESOR | PROFESOR: solo su curso |

> La autorización se valida **siempre** en el microservicio propietario (RNF-03), aunque el Gateway ya validó el JWT. El alcance se resuelve contra rol + membership/ownership del recurso.

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
| 422 | Validación semántica |
| 500 | Error inesperado |
| 503 | Dependencia no disponible |

> Nunca se devuelven stack traces, secretos, SQL, prompts internos ni información de otros tenants.