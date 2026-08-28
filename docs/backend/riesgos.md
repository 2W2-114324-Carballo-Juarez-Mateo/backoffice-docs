# Riesgos técnicos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Complejidad de microservicios | Alto | Pocos servicios y dominios claros |
| Saturación/abuso de endpoints administrativos (429) | Medio | Rate limiting en Gateway + Idempotency Keys |
| Fallos de Kafka | Medio | Outbox + retry |
| Eventos duplicados | Medio | Idempotencia (event_id) |
| Inconsistencia eventual | Medio | Definir qué operaciones requieren respuesta síncrona |
| Pérdida de trazabilidad | Alto | Correlation ID |
| Borrado accidental | Alto | Baja lógica + reglas de negocio |
| Eliminación del último ADMIN | Crítico | Transacción + regla incondicional |
| Acceso indebido entre cursos | Alto | Autorización por recurso + multitenancy |
| Exposición de secretos | Alto | Variables de entorno / secret manager |
| Acoplamiento entre servicios | Alto | APIs/eventos, sin DB compartida |

## Qué NO se debe hacer

**No compartir una base entre microservicios:**

```text
Incorrecto:  Identity ──┐
             Course ────┼──► PostgreSQL compartido
             Audit ─────┘

Correcto:    Identity ──► identity_db
             Course ────► course_db
             Audit ─────► audit_db
```

**No acceder a tablas de otro servicio:**

```java
// Incorrecto: consulta directa a datos de otro dominio
courseRepository.findByUserEmail(...);

// Correcto: Course Service → Identity API, o evento/read model
```

**No poner reglas de negocio en controllers:** `Controller → Application → Domain → Infrastructure`.

**No confiar únicamente en el frontend:** una restricción administrativa siempre se valida en backend (`Frontend oculta el botón` ≠ `Backend: operación imposible`).