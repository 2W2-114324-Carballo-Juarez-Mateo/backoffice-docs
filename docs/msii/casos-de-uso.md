# Flujos de trabajo y casos de uso (TPI)

> **Para la clase:** cada grupo muestra cómo se conecta su parte con los demás componentes. Estos son los flujos del **BackOffice (Tema 12)**, con su conexión a otros equipos. Demo en vivo: [Sección interactiva](/interactivo/).

## Caso 1 — Login y sesión (Front → BFF → Identity)

```mermaid
sequenceDiagram
    participant N as Navegador
    participant NG as Nginx
    participant BFF as BFF BackOffice
    participant GW as API Gateway (T01)
    participant ID as Identity (T01)

    N->>NG: POST /login (+ 2FA)
    NG->>BFF: /api/login
    BFF->>ID: valida cookie
    ID-->>BFF: JWT + rol + alcance
    BFF-->>N: sesión (cookie httpOnly)
```

**Conecta con:** **T01 Identity** (login, 2FA, roles, sesión).

## Caso 2 — Alta de administrador / gestión de plataforma

```mermaid
sequenceDiagram
    participant A as ADMIN
    participant GW as API Gateway (T01)
    participant AD as Administration
    participant T1 as T01 (auditoría)

    A->>GW: alta de admin / operativa
    GW->>AD: valida JWT + rol ADMIN
    AD->>AD: aplica + regla de negocio
    AD->>T1: evento de auditoría (persistida por T01)
```

**Conecta con:** **T01** (roles, auditoría). Ver tarea [Administración de plataforma](/msii/tareas/administracion-plataforma).

## Caso 3 — Cambio de configuración global (PAR-01) — Kafka + caché

```mermaid
sequenceDiagram
    participant A as ADMIN
    participant GW as API Gateway (T01)
    participant AD as Administration
    participant K as Kafka (administration.events)
    participant C as Consumidores T03/05/08/10

    A->>GW: PUT PAR-01
    GW->>AD: valida JWT + rol ADMIN
    AD->>AD: persiste v+1 + Outbox (misma tx)
    AD-->>A: 200
    AD->>K: GlobalConfigurationChanged {key, value, version}
    K->>C: cada consumer group actualiza su caché TTL 10 min (descarta v ≤ local)
```

**Conecta con:** **T03/05/08/10** (aplican la configuración hacia adelante, RF-CFG-06). Demo: [Interactivo](/interactivo/flujo-config).

## Caso 4 — Reporte por curso (multitenancy + RLS) y caso ADMIN

```mermaid
sequenceDiagram
    participant P as PROFESOR A / ADMIN
    participant BFF as BFF BackOffice
    participant TX as TenantContext
    participant R as Reporting
    participant DB as reporting_db (RLS)

    P->>BFF: GET reporte (alcance curso 7 o ALL)
    BFF->>TX: valida pertenencia (T02) → app.current_course
    TX->>R: consulta (sin WHERE garantizado)
    R->>DB: RLS filtra por course_id (o ALL para ADMIN)
    DB-->>R: solo filas del curso autorizado
    R-->>P: 200 (o 403 si no pertenece / intenta ALL sin ser ADMIN)
```

**Conecta con:** **T02 Matrícula** (pertenencia), **Reporting** (tenant-scoped). Demo: [Interactivo](/interactivo/multitenancy-rls).

## Caso 5 — Gestión del proveedor LLM (exclusivo ADMIN)

```mermaid
sequenceDiagram
    participant A as ADMIN
    participant AD as Administration
    participant K as Kafka
    participant T7 as T07 Evaluación LLM

    A->>AD: configura proveedor/evaluador (golden set)
    AD->>K: ModelProviderChanged
    K->>T7: T07 aplica el proveedor
```

**Conecta con:** **T07** (consume el proveedor). Ver tarea [Proveedor LLM](/msii/tareas/proveedor-llm).

## Caso 6 — Panel, exportación y alertas (Reporting)

```mermaid
sequenceDiagram
    participant U as ADMIN/PROFESOR
    participant BFF as BFF BackOffice
    participant RP as Reporting & Analytics
    participant L as Lecturas 02/04/05/07/08/10

    U->>BFF: panel / export / alertas
    BFF->>RP: reportes y métricas (tenant-scoped)
    RP->>L: contratos de lectura (progreso, encuestas, banco…)
    L-->>RP: agregados
    RP-->>U: panel + export (generado por backend)
```

**Conecta con:** lecturas de **T02/04/05/07/08/10** (contratos de lectura). Ver tarea [Reportes docentes](/msii/tareas/reportes-docentes).

---

> Todos los flujos respetan: sync por el **API Gateway (T01)** (regla no negociable), asíncrono por **Kafka** con **Outbox + idempotencia**, y **multitenancy + RLS** en el reporting.