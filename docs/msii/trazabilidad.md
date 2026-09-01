# Trazabilidad RF → componente

> Cada requerimiento del PRD debe trazarse a un componente. El Backoffice (Tema 12) es **consumidor puro**: traza solo sus RF; el resto es de otros temas.

| Requerimiento | Servicio / Tema |
|---|---|
| RF-CFG-* | Administration & Configuration (Backoffice) |
| RF-IA-ADM-* (proveedores de modelo) | Administration & Configuration (Backoffice) |
| RF-RPT-* / RF-REP-* (reportes, panel, métricas, export, alertas) | Reporting & Analytics (Backoffice) |
| RF-ROL-* · RF-USR onboarding · RF-AUD-* · RF-RET-* | **Tema 01** (consumidos) |
| RF-CUR-* (cohorte) · matrícula | **Tema 02** (consumidos) |
| RF-DES-*, RF-IA-* producto, gamificación, ranking, chat, encuestas | Temas 03-11 (solo lectura 02/04/05/07/08/10) |
| RNF seguridad | Gateway (Tema 01) + servicios |
| RNF-04b/04c **multitenancy + RLS** | Reporting & Analytics (tenant-scoped) + Administration (global a propósito) · TenantContext + RLS |
| RNF observabilidad / escalabilidad / idempotencia | Todos |

## Trazabilidad de flujos críticos

### Gestión de proveedor de modelo (ADMIN)

```text
RF-IA-ADM-01..07 (RF-IA-23/24/25/35)
    ↓
Administration & Configuration Service
    ├── ModelProvider / ModelFunctionAssignment / EvaluatorConfig / GoldenSet
    └── evento ModelProviderChanged → T07 (Evaluación LLM, cross-team)
```

### Configuración global

```text
RF-CFG-04/05/06
    ↓
Administration & Configuration Service
    ├── versionado + hacia adelante
    └── evento GlobalConfigurationChanged → Temas 03/05/08/10 (aplican la config)
```

### Reportes y métricas de curso

```text
RF-RPT-01..10
    ↓
Reporting & Analytics Service
    ├── consume lecturas de los temas 02/04/05/07/08/10 (frescura ≤ 15 min)
    ├── read models agregados (CSAT, engagement, alumno en riesgo) + exportación
    └── multitenancy: tenant-scoped por course_id (TenantContext) + RLS (defensa en profundidad)
```

### Multitenancy (transversal)

```text
RNF-04b/04c
    ↓
TenantContext (course_id + pertenencia vía T02)
    ├── Reporting → read models acotados por course_id (PROFESOR → sus cohortes)
    ├── RLS → filtro por tenant a nivel DB (app.current_course)
    └── Administration → global a propósito (PAR/proveedores)
```

## Definition of Done (Backoffice)

Una funcionalidad está terminada cuando:

- [ ] Tiene RF asociado y caso de uso.
- [ ] Tiene endpoint documentado (OpenAPI) y autorización.
- [ ] Tiene validaciones de dominio y persistencia.
- [ ] Emite/consume eventos según el contrato (Outbox + idempotencia).
- [ ] Tiene pruebas unitarias e integración.
- [ ] Maneja errores y logs, propaga correlation ID.
- [ ] No accede a la DB de otro microservicio; **toda llamada síncrona pasa por el gateway**.
- [ ] Corre en Docker Compose y tiene migraciones.
- [ ] Está en la matriz de trazabilidad.