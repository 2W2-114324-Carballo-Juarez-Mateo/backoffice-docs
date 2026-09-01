# Cambio de configuración global (PAR-01)

El patrón **híbrido** de mensajería: REST por el gateway para la operación + **RabbitMQ** + **caché con TTL** para propagar el cambio a los consumidores (Temas 03/05/08/10), sin que la respuesta al ADMIN dependa de la propagación.

<ScenarioPage name="config" />

> Detalle completo: [Mensajería híbrida](/backend/arquitectura/mensajeria) · [ADRs](/backend/decisiones/adr) · Tarea [Registro de parámetros](/msii/tareas/registro-parametros).