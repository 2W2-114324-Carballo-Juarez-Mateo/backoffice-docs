# Planificación y dimensionamiento

> Tareas asignadas al Backoffice (Tema 12) según `TUP_PIV_BE_PROPUESTA_ARQ.pdf`, divididas en las **3 columnas del documento** con nombres formales (MoSCoW) y **dimensionadas en talles T-shirt** (S / M / L).
> Regla del documento: **"Pedido para empezar"** = núcleo del dominio + lo que otros equipos necesitan para no quedar bloqueados; **"Para más adelante"** = se diseña ahora y se implementa después; **"Podría ser"** = extra si el núcleo está entregado.

## 🟢 Must — Núcleo (pedido para empezar · sprint 1)

| Ítem | RF | Subtareas | Talla | Dependencia |
|---|---|---|---|---|
| **Administración de plataforma** | RF-CFG-01/05 | Operativa de ADMIN sobre configuración y proveedores · consumo de auth/roles (Tema 01) · permisos de endpoints | **M** | T01 |
| **Registro de parámetros PAR-01..24** | RF-CFG-04/06 | CRUD `GlobalParameter` · versionado · hacia adelante (RF-CFG-06) · evento `GlobalConfigurationChanged` · validación ADMIN | **M** | Temas 03/05/08/10 la leen |
| **Gestión del proveedor LLM (exclusiva ADMIN)** | RF-IA-ADM-01..07 | CRUD proveedores · asignación modelo↔función · evaluador único · golden set + calibración · detección de deriva · evento `ModelProviderChanged` · auditoría emitida a T01 | **L** | T07 consume |
| **Contratos de lectura con los 6 temas** | RF-RPT-10 | Acordar contratos (02/04/05/07/08/10) · suscripción a eventos · adapters de lectura · read models base | **L** | Temas 02/04/05/07/08/10 |
| **Reportes docentes** | RF-RPT-01 | Read models por cohorte · endpoints de reporte · autorización por matrícula (T02) | **M** | Contratos de lectura |

## 🟡 Should — Para más adelante (diseñado ahora, implementado después)

| Ítem | RF | Subtareas | Talla | Dependencia |
|---|---|---|---|---|
| **Panel del profesor (indicador de alumno en riesgo)** | RF-RPT-03 | Modelo `AtRiskStudent` · indicador · endpoint | **M** | Lecturas T04/05/08/10 |
| **Frescura ≤ 15 minutos** | RF-RPT-06 | Consumo de eventos con SLA de frescura · monitoreo de lag | **S–M** | Contratos |
| **KPIs con CSAT 5★** | RF-RPT-02 | Agregados anónimos de encuestas · KPI CSAT por cohorte | **S–M** | T04 (encuestas) |
| **Alertas configurables** | RF-RPT-05 | Reglas de alerta configurables · endpoint `/api/alerts` | **S–M** | Lecturas |
| **Sin comparación entre docentes** | RF-RPT-07 | Regla de scope en reporting (no cross-docente) · tests | **S** | — |

## 🔵 Could — Podría ser (extra si el núcleo está entregado)

| Ítem | RF | Subtareas | Talla | Dependencia |
|---|---|---|---|---|
| **Exportación de datos** | RF-RPT-04 | Generación CSV/PDF · endpoints `/api/export/*` | **M** | Read models |

---

## Criterios de prioridad (del documento del profe)

- **Pedido para empezar** = lo que otros equipos necesitan para no quedar bloqueados (los **contratos de lectura** son dependencia crítica del sprint 1: *"sin contratos de lectura acordados en el sprint 1 no hay nada demostrable"*).
- **Para más adelante** = se prevé en el modelo y el contrato desde el inicio, aunque se implemente después.
- **Podría ser** = un extra a medias vale menos que un núcleo terminado.