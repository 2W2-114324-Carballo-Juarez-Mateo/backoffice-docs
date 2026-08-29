# Trazabilidad RF → componente

> Cada requerimiento del PRD debe trazarse a un componente. Si un requerimiento no está trazado, no está hecho.

| Requerimiento | Microservicio |
|---|---|
| RF-ROL-* | Identity & Access |
| RF-USR-* (lado ADMIN) | Identity & Access |
| RF-CFG-* | Administration & Configuration |
| RF-IA-ADM-* (proveedores de modelo) | Administration & Configuration |
| RF-RPT-* / RF-REP-* (reportes, métricas, export) | Reporting & Analytics |
| RF-AUD-* | Audit |
| RF-RET-* | Administration & Configuration / Audit |
| RNF seguridad | Gateway + todos |
| RNF auditoría | Audit + todos |
| RNF observabilidad | Todos |
| RNF escalabilidad | Todos |
| RNF idempotencia | Todos los consumidores |

> **Fuera de la matriz (otros equipos):** RF-CUR-*, RF-DES-*, RF-USR onboarding, gamificación, ranking, chat, notificaciones, encuestas de alumno, IA como producto. El BackOffice **consume** sus eventos para reportes/métricas.

## Trazabilidad de flujos críticos

### Gestión de proveedor de modelo (ADMIN)

```text
RF-IA-ADM-01..07 (RF-IA-23/24/25/35)
    ↓
Administration & Configuration Service
    ├── ModelProvider / ModelFunctionAssignment / EvaluatorConfig / GoldenSet
    └── evento ModelProviderChanged → AI Service (cross-team)
```

### Baja de ADMIN

```text
RF-ROL-02/03/05/06
    ↓
Identity & Access Service
    ├── validaciones (auto-eliminación, último ADMIN, 2FA)
    └── Auditoría
```

### Configuración global

```text
RF-CFG-04/05/06
    ↓
Administration & Configuration Service
    ├── versionado + hacia adelante
    └── evento GlobalConfigurationChanged → Gamification (cross-team)
```

### Reportes y métricas de curso

```text
RF-RPT-01/02/03 · RF-REP-01..04
    ↓
Reporting & Analytics Service
    ├── consume course.events / gamification.events / ranking.events / survey.events
    └── read models agregados (satisfacción, engagement, aprobación) + exportación
```