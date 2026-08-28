# Trazabilidad RF → componente

> Cada requerimiento del PRD debe trazarse a un componente. Si un requerimiento no está trazado, no está hecho.

| Requerimiento | Microservicio |
|---|---|
| RF-ROL-* | Identity |
| RF-USR-* | Identity / Course |
| RF-CFG-* | Configuration |
| RF-CUR-* | Course |
| RF-DES-* | Course |
| RF-AUD-* | Audit |
| RF-RET-* | Configuration / Audit / dominio correspondiente |
| RF-REP-* | Reporting |
| RNF seguridad | Gateway + todos |
| RNF auditoría | Audit + todos |
| RNF observabilidad | Todos |
| RNF escalabilidad | Todos |
| RNF idempotencia | Todos los consumidores |

## Trazabilidad de flujos críticos

### Creación y activación de curso

```text
RF-CUR-01..08b
    ↓
Course Service
    ├── User Service → padrón
    └── AI Service   → calibración (cross-team)
```

### Baja de ADMIN

```text
RF-ROL-02/03/05/06
    ↓
Identity Service
    ├── validaciones (auto-eliminación, último ADMIN, 2FA)
    └── Auditoría
```

### Configuración global

```text
RF-CFG-04/05/06
    ↓
Configuration Service
    ├── versionado + hacia adelante
    └── evento GlobalConfigurationChanged → Gamification (cross-team)
```

### Cierre de curso

```text
RF-RNK-10/13 · RF-CUR-07
    ↓
Course Service → Ranking (estado académico) → CourseArchived
    ↓
Audit + Reporting
```

## Definition of Done (BackOffice)

Una funcionalidad está terminada cuando:

- [ ] Tiene RF asociado y caso de uso.
- [ ] Tiene endpoint documentado (OpenAPI) y autorización.
- [ ] Tiene validaciones de dominio y persistencia.
- [ ] Tiene auditoría/eventos si corresponde.
- [ ] Tiene pruebas unitarias e integración.
- [ ] Maneja errores y logs, propaga correlation ID.
- [ ] No accede a la DB de otro microservicio.
- [ ] Corre en Docker Compose y tiene migraciones.
- [ ] Está en la matriz de trazabilidad.