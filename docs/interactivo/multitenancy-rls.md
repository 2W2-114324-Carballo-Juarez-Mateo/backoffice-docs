# Multitenancy + Row-Level Security (RLS)

Cada **curso-cohorte es un tenant** (`course_id`). El **TenantContext** resuelve el alcance desde la sesión validada (nunca del request) y **RLS** impone el aislamiento a nivel de base. Incluye el **caso ADMIN**: curso puntual o **todos los cursos** (centinela `'ALL'`), sin apagar RLS.

<ScenarioPage name="multitenancy" />

> Detalle completo: [Multitenancy y RLS](/backend/arquitectura/multitenancy) · doc BackOffice §17.5.