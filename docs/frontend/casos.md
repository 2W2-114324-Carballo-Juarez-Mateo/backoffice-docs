# Frontend — Casos A/B (postura del grupo)

> Consigna de docentes: investigar y defender una alternativa para la arquitectura frontend de la plataforma. **Postura del grupo: Caso A.** Detalle completo en `frontend_arquitectura_analisis.md`. El plan de despliegue del BackOffice (Nginx + BFF + Docker 2 etapas) está en [Arquitectura y despliegue](/frontend/arquitectura-despliegue).

## Los dos casos

| | **Caso A** | **Caso B** |
|---|---|---|
| Integración | Enrutamiento por URL (Nginx) | Runtime centralizado (Shell) |
| Propiedad del código | Multirepos independientes | Shell + librerías publicadas |
| Acoplamiento entre equipos | Bajo | Alto |
| Release | Independiente por app | Coordinado con el Shell |
| Sensación de uso | Navegación por apps | Una sola SPA continua |

## Caso A — Apps Angular SSR en multirepos detrás de Nginx

- Cada dominio = su repo, su build, su deploy.
- **Nginx** presenta todas las apps bajo un mismo dominio por prefijo:
  - `/` → Alumno · `/backoffice` → BackOffice · `/profesor` → Profesor · `/api/*` → Gateway/BFF
- **SSR** entrega el HTML inicial desde el servidor y Angular hidrata después.

**Preocupaciones compartidas sin acoplar repos:**

| Preocupación | Solución |
|---|---|
| **Sesión** | Cookie httpOnly con `Domain=plataforma.edu.ar` → viaja sola a todas las apps |
| **Navegación** | Links por URL + barra superior común (componente de la librería UI) |
| **Estilos** | Librería `@tup/ui` (tokens + componentes), dependencia de build-time |
| **Contratos** | OpenAPI + tipos en `@tup/contracts` |
| **Estado** | Sin store global; Custom Events + Storage; servidor = fuente de verdad |

## Caso B — App Shell + librerías

- Un Shell concentra navegación/runtime; cada equipo publica una librería versionada.
- **Costos que reconocemos:** coordinación de releases, punto central de falla, fricción entre grupos, menos autonomía.

## Por qué conviene el Caso A

1. **Autonomía total:** cada equipo avanza a su ritmo; no hay "esperar al equipo del Shell".
2. **Aislamiento de fallas:** un bug en una app no tumba a las demás; Nginx enruta al resto.
3. **Cero conflictos de repos:** no se comparte código ni repo → sin merge conflicts entre grupos.
4. **Independencia de versionado/deploy:** rollback por app sin tocar a nadie.
5. **SSR:** mejor primer paint y SEO donde aplique.
6. **Infraestructura simple:** el único componente compartido es Nginx (+ Gateway/BFF).
7. Optimiza lo que este proyecto más necesita: **autonomía entre equipos y aislamiento**, a cambio de consistencia visual (resuelta con `@tup/ui`) y experiencia unificada.

**Riesgos reconocidos y mitigación:**

| Riesgo | Mitigación |
|---|---|
| Consistencia visual | `@tup/ui` + tokens; no sobreescribir estilos |
| Duplicación de bootstrap | Template inicial / tooling compartido |
| Coordinación de sesión | Contrato único de cookie + endpoint común de login/logout |
| Experiencia de navegación | Barra común + enlaces consistentes |

## Temas de investigación

### BFF (Backend for Frontend)

- Intermediario server-side propiedad del frontend: agrega respuestas, esconde microservicios, maneja cookie → autorización, sirve datos al SSR.
- **Alternativas:** BFF compartido (simple, cuello de botella) · BFF por dominio (alineado, pero el front llama a muchos) · **BFF por experiencia (recomendado: alumno, profesor, backoffice)**.

### Compartir información entre frontends

- **Custom Events:** `window.dispatchEvent(new CustomEvent('auth:logout'))` → avisos descoplados, no persisten.
- **Store compartido:** útil dentro de una misma app; **no recomendado** cross-app (frágil).
- **Storage:** localStorage/sessionStorage del mismo origen → preferencias/caché; **no** tokens (XSS).
- **Regla:** estado de negocio en el servidor; eventos/storage solo notifican o cachean.

### Cookies, sesión, login y logout

- Login único → JWT en cookie **httpOnly + Secure + SameSite** → viaja a todas las apps del dominio.
- Logout: invalida sesión + borra cookie + Custom Event `auth:logout` para otras pestañas.
- Expiración: 401 del BFF → redirigir a login conservando la navegación intentada.

### Librería CSS/UI compartida

- `@tup/ui` con **design tokens** (variables CSS) + componentes; consumo solo desde la librería; semver (breaking → major).

### Rol de Nginx

- Reverse proxy + TLS, sirve estáticos/SSR, enruta por prefijo, compresión/cache, headers de seguridad (CSP, HSTS), degradación controlada si una app cae.

### Marketplace de plugins para la TUP orientado a agentes de IA

| Capacidad | Qué implica |
|---|---|
| Publicar | Manifesto (id, nombre, versión, autor, permisos), SDK del agente |
| Versionar | Semver, versiones inmutables, canales stable/beta |
| Descubrir | Catálogo, búsqueda por agente/capacidad, trust score |
| Instalar/actualizar | Resolución de dependencias, compatibilidad, rollback |
| Validar | Análisis estático, sandbox, validación de tools (MCP), firma/checksums |
| Seguridad | Least privilege, aprobación explícita, cuotas, auditoría, scanning de secretos |

**Para agentes de IA:** el plugin expone un **contrato de tools** (idealmente **MCP**) que el agente invoca; el marketplace valida el esquema y los permisos declarados antes de que el usuario confirme.