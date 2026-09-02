# Mensajería híbrida con Kafka

> **Decisión:** patrón **híbrido** de comunicación — REST por el API Gateway para lo síncrono + **Kafka** para eventos de configuración, con **caché local con TTL** en los consumidores. **RabbitMQ** queda documentado como alternativa.

## 1. Por qué un patrón híbrido

En el Backoffice conviven dos tipos de necesidad de comunicación:

1. **Síncrona (REST por el gateway):** consultas, operaciones y contratos de lectura que necesitan **respuesta inmediata** (ej. validar la pertenencia a una cohorte contra la matrícula T02).
2. **Asíncrona (eventos por Kafka):** **avisar** cambios de configuración global (PAR-01..24, proveedores LLM) a los consumidores, sin que la respuesta al ADMIN dependa de la propagación.

La regla que separa ambos caminos es simple: **REST responde preguntas u operaciones; los eventos notifican cambios que otros deben conocer.** Kafka **no reemplaza** al gateway ni convierte la arquitectura en event-driven: es un segundo camino, acotado, para avisar.

## 2. Por qué Kafka (y no otro broker)

- **Decisión de plataforma:** los grupos de **Notificaciones y Banco** también adoptaron Kafka → un único broker para toda la plataforma simplifica integración y contratos.
- **Replay / histórico:** Kafka conserva los eventos por retención configurable y permite **re-leer un topic** desde un offset anterior (útil para reconstruir read models o auditar).
- **Orden por partición:** particionando por clave de negocio (`courseId`/`key`) se garantiza **orden por curso** sin bloqueos globales.
- **Robustez y escala:** **particiones + consumer groups** permiten escalar el procesamiento por dominio y tolerar caídas del consumidor (el **offset** persiste).
- **Soporte maduro con Spring:** Spring for Apache Kafka (KafkaTemplate/@KafkaListener).

**Alternativa considerada — RabbitMQ:** más liviano y excelente para *work-queues* punto a punto, pero **no es la decisión de la plataforma** (los demás grupos usan Kafka). Se mantiene documentado como alternativa; el patrón híbrido (REST + eventos + caché TTL + Outbox) es idéntico.

> Nota: los **read models de Reporting se reconstruyen vía contratos de lectura REST** desde los dominios dueños (no dependemos del replay del broker, aunque Kafka lo ofrece como capacidad).

## 3. Cómo fluye un cambio de configuración

```mermaid
sequenceDiagram
    participant A as ADMIN
    participant GW as API Gateway
    participant AD as Administration Service
    participant RQ as Kafka (topic administration.events)
    participant C as Consumidores (consumer group por servicio + caché TTL 10 min)

    A->>GW: PUT PAR-01 = 150
    GW->>AD: valida JWT + rol ADMIN
    AD->>AD: persiste v+1 + Outbox (misma tx)
    AD-->>A: 200 OK (sin esperar la propagación)
    AD->>RQ: GlobalConfigurationChanged {key, value, version}
    RQ->>C: entrega a cada consumer group
    C->>C: v > local → actualiza caché (o descarta v ≤ local)
```

**Mecanismo en los consumidores (caché con TTL 10 min):**
- Cada consumidor guarda los parámetros en una **caché local con TTL de 10 minutos** (versión + valor).
- El **evento invalida/actualiza** la caché antes del vencimiento.
- Si el evento no llega, el TTL actúa como respaldo (a lo sumo 10 minutos con un valor anterior).
- Si **Backoffice está caído**, el consumidor sigue sirviendo el **último valor conocido** (no se bloquea la operación).

**Estados de la caché:** vacía → vigente (valor v_n) → invalidada (por evento) → vencida (por TTL).

## 4. Contrato mínimo del evento

El evento identifica el cambio, no transporta lógica de negocio. Con la **versión**, el consumidor descarta eventos repetidos o antiguos:

```json
{
  "eventId": "9f2c…",
  "parameterKey": "PAR-01",
  "version": 42,
  "value": 150,
  "validFrom": "2026-09-01T14:00:00Z",
  "timestamp": "2026-09-01T14:00:01Z"
}
```

**Garantías por paso:**
- **Persistir antes de publicar (Outbox):** si el broker no está, el parámetro ya quedó guardado y el TTL de 10 min actúa como respaldo. El **Outbox** garantiza que el evento no se pierda tras el commit.
- **Consumer group por servicio:** cada servicio lee el topic con su offset propio y recibe solo lo que le interesa.
- **Invalidación idempotente:** versión recibida `≤` versión local → se descarta (RF-CFG-06: los cambios rigen hacia adelante; el evento representa la configuración vigente, nunca una orden de recalcular históricos).

## 5. Topic y consumer groups del Backoffice

| Topic | Eventos | Consumer group por servicio |
|---|---|---|
| `administration.events` | GlobalConfigurationChanged, ModelProviderChanged, ModelFunctionChanged | `gamification`, `challenges`, `bank`, `roadmap`… |
| `audit.events` | eventos de auditoría | `audit` |
| `retention.events` | RetentionDecisionCreated, DataAnonymized | `audit`, `reporting`… |
| `identity.events` | AdminCreated/Deleted, RoleChanged | `audit`, `reporting`… |
| `course.events` / `gamification.events` / `ranking.events` / `survey.events` | eventos de otros temas (consumo) | `reporting` |

## 6. Relación con el resto de la propuesta

- **Multitenancy + RLS** (aislamiento de datos) es **independiente** de este mecanismo: la mensajería define *cómo viajan los cambios*; el multitenancy define *cómo se separan los datos*. Ambos conviven (ver [Multitenancy y RLS](/backend/arquitectura/multitenancy)).
- **Outbox + idempotencia** por `event_id` y `version` son la base de confiabilidad.
- **Validación con la cátedra:** el broker es infraestructura compartida de la plataforma → se coordina con los demás equipos y se valida la elección de Kafka.

> Patrón documentado en ADR-003 y detallado en las tareas de configuración (ver [Registro de parámetros](/msii/tareas/registro-parametros)).