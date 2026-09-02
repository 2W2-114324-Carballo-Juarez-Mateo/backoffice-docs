# Sección Interactiva — Flujos del BackOffice

> **Escenarios animados, paso a paso, con las capas del sistema:** Front · Back · Mensajería (Kafka) · Base de datos. Cada escenario muestra cómo viajan los datos (Front → Nginx → BFF → Gateway → microservicio → BD/evento) con las entidades reales del proyecto.

## Cómo usarla

En cada escenario podés:
- **▶ Reproducir** el flujo completo automáticamente.
- **◀ ▶** avanzar o retroceder paso a paso.
- **↺** reiniciar. Los **puntos** saltan a un paso puntual.
- Pasar el mouse por los **nodos** que se iluminan en cada paso.

## Escenarios

| | Escenario | Muestra |
|---|---|---|
| 🎛 | [Cambio de configuración (PAR-01)](flujo-config) | REST + **Outbox** + **Kafka** + **caché con TTL 10 min** (propagación híbrida) |
| 🔒 | [Multitenancy + RLS](multitenancy-rls) | **TenantContext**, **RLS**, prueba 200/403 y caso ADMIN global (`ALL`) |
| 🔑 | [Login y sesión](login) | Front → **BFF** → Identity: cookie httpOnly, 2FA, 401 → login |
| 🚀 | [Despliegue del Frontend](despliegue) | CI/CD, **Docker 2 etapas**, `envsubst`, Nginx, Rolling Update |

## Capas y conceptos incluidos

| Capa | Qué contiene |
|---|---|
| **Front** | Navegador · Nginx (reverse proxy) · **BFF BackOffice** |
| **Back** | **API Gateway (T01)** · Administration · Reporting · Outbox · Consumidores |
| **Mensajería** | **Kafka** (topic + consumer group por servicio) |
| **Base de datos** | `global_parameter`, `outbox_message`, `cohort_metrics_snapshot` (**tenant-scoped + RLS**) |

Cubre: **multitenancy por curso-cohorte**, **Row-Level Security**, **Kafka + Outbox + idempotencia por versión**, **caché local con TTL**, BFF por experiencia y estrategias de despliegue.