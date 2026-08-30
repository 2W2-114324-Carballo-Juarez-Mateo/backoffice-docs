# Patrones de diseño aplicados

> Mapa de patrones GoF/Catálogo con el **lugar concreto** donde se aplican, el requisito que resuelven y el beneficio. Paquetes bajo `com.backoffice.<servicio>`.

## Domain

### Specification — Reglas compuestas

- **Dónde:** `identity.domain.specifications` (`AtLeastOneActiveAdminSpec`), `administration.domain.specifications` (reglas de cambio de parámetro/proveedor).
- **Resuelve:** RF-ROL-05, RF-CFG-06, RF-IA-35.
- **Beneficio:** reglas combinables (AND/OR), testeables aisladamente y reutilizables entre servicios.

### Strategy — Políticas intercambiables

- **Dónde:** `administration.domain.retention` (`RetentionDecisionStrategy`: extender vs anonimizar).
- **Resuelve:** RF-RET-03.
- **Beneficio:** el caso de uso no cambia cuando se ajusta una política.

### Null Object — Dependencia externa no disponible

- **Dónde:** `administration.infrastructure.external` (`ProviderRegistryClient` + `NoOpProviderClient`).
- **Resuelve:** RNF-06 (resiliencia).
- **Beneficio:** comportamiento neutro explícito, sin `if (client == null)`.

## Application

### Command — Casos de uso como objetos

- **Dónde:** `*.application.commands` (`UpdateParameterCommand`, `RegisterModelProviderCommand`, `AssignModelToFunctionCommand`, `DeleteAdminCommand`).
- **Resuelve:** estructura de capas; CQRS ligero.
- **Beneficio:** aísla HTTP del dominio; cada comando es testeable y auditable.

### Chain of Responsibility — Pipeline de validación

- **Dónde:** `identity.application.validation` (`AdminDeletionValidator`: auto-eliminación → 2FA → confirmación → último ADMIN); alcance por curso en `reporting.api.security`.
- **Resuelve:** RF-ROL-06, RF-RPT-04.
- **Beneficio:** cada validador es independiente y falla con su propio error.

### Decorator — Auditoría transversal

- **Dónde:** `audit.application` (`AuditableCommandDecorator`).
- **Resuelve:** RF-AUD-01/03.
- **Beneficio:** la auditoría se compone sobre el comando sin ensuciar el caso de uso.

## Infrastructure

### Adapter — Clientes a servicios externos

- **Dónde:** `*.infrastructure.external` (`IdentityClient`, `AIProviderClient`, `CourseClient`).
- **Resuelve:** contratos cross-team.
- **Beneficio:** aísla red y DTOs; testeo con mocks.

### Observer + Outbox — Eventos de dominio

- **Dónde:** `*.domain.events` + `*.messaging.outbox`.
- **Resuelve:** §12/§13, ADR-003.
- **Beneficio:** el dominio publica eventos puros; el Outbox garantiza la entrega en la misma transacción.

### Unit of Work — Transacción con Outbox

- **Dónde:** servicio `@Transactional` que persiste entidad + `OutboxMessage` en el mismo commit.
- **Resuelve:** §13.
- **Beneficio:** consistencia entre el cambio de negocio y su evento.

### Idempotency Key — operaciones críticas

- **Dónde:** `*.api.filter` / `*.application.commands` — PUT de configuración, proveedores, baja de ADMIN.
- **Resuelve:** duplicados + 429.
- **Beneficio:** ante un duplicado, el backend responde el resultado original.

## Tabla resumen

| Patrón | Paquete propuesto | RF | Servicio |
|---|---|---|---|
| Specification | `administration.domain.specifications` | RF-CFG-06 · RF-IA-35 | Administration |
| Strategy | `administration.domain.retention` | RF-RET-03 | Administration |
| Null Object | `administration.infrastructure.external` | RNF-06 | Administration |
| Command | `*.application.commands` | capas | Todos |
| Chain of Responsibility | `reporting.api.security` | RF-RPT-08 | Reporting |
| Decorator | (auditoría emitida al Tema 01) | RF-IA-ADM-01 | Administration |
| Adapter | `*.infrastructure.external` | contratos de lectura | Todos |
| Repository | `*.infrastructure.persistence` | RNF-04 | Todos |
| Observer + Outbox | `*.domain.events` · `*.messaging.outbox` | §12/§13 | Todos |
| Unit of Work | `@Transactional` | §13 | Todos |
| Idempotency Key | `*.api.filter` | 429/duplicados | Todos (críticas) |