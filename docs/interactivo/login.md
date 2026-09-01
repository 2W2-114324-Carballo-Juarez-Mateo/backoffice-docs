# Login y sesión (Front → BFF → Identity)

Cómo ingresa el ADMIN a la consola: la **cookie httpOnly** viaja sola a cada app, el **BFF** valida la sesión en **Identity (T01)** y, al expirar, responde **401 → redirect al login** conservando el intento.

<ScenarioPage name="login" />

> Detalle completo: [Plan de comunicación](/frontend/comunicacion) · [Arquitectura y despliegue](/frontend/arquitectura-despliegue).