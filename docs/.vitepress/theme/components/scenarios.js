export const scenarios = {
  config: {
    id: 'config',
    title: 'Cambio de configuración global (PAR-01)',
    intro:
      'Un ADMIN cambia PAR-01. El patrón es híbrido: REST por el gateway para la operación y Kafka + caché con TTL para propagar el cambio a los consumidores, sin que la respuesta dependa de la propagación.',
    layers: [
      { id: 'front', name: 'FRONT' },
      { id: 'back', name: 'BACK' },
      { id: 'msg', name: 'MENSAJERÍA' },
      { id: 'db', name: 'BASE DE DATOS' }
    ],
    nodes: [
      { id: 'admin', layer: 'front', label: 'ADMIN', note: 'panel de configuración', x: 12 },
      { id: 'nginx', layer: 'front', label: 'Nginx', note: '/api/* → BFF', x: 34 },
      { id: 'bff', layer: 'front', label: 'BFF BackOffice', note: 'cookie → contexto', x: 56 },
      { id: 'gw', layer: 'back', label: 'API Gateway (T01)', note: 'JWT + rol ADMIN', x: 20 },
      { id: 'adm', layer: 'back', label: 'Administration', note: 'Clean Architecture', x: 42 },
      { id: 'outbox', layer: 'back', label: 'Outbox', note: 'misma transacción', x: 52 },
      { id: 'consumer', layer: 'back', label: 'Consumidores', note: 'T03/05/08/10 · caché TTL 10 min', x: 90 },
      { id: 'rq', layer: 'msg', label: 'Kafka', note: 'topic administration.events', x: 60 },
      { id: 'dbpar', layer: 'db', label: 'global_parameter', note: 'key · value (jsonb) · version', x: 34 },
      { id: 'dbo', layer: 'db', label: 'outbox_message', note: 'eventId · payload · estado', x: 52 }
    ],
    edges: [
      { id: 'e1', from: 'admin', to: 'nginx', label: 'PUT PAR-01' },
      { id: 'e2', from: 'nginx', to: 'bff', label: '/api/administration/…' },
      { id: 'e3', from: 'bff', to: 'gw', label: 'cookie → contexto' },
      { id: 'e4', from: 'gw', to: 'adm', label: 'autoriza ADMIN' },
      { id: 'e5', from: 'adm', to: 'dbpar', label: 'persiste v+1' },
      { id: 'e6', from: 'adm', to: 'dbo', label: 'escribe Outbox (misma tx)' },
      { id: 'e7', from: 'outbox', to: 'rq', label: 'GlobalConfigurationChanged' },
      { id: 'e8', from: 'rq', to: 'consumer', label: 'entrega por consumer group' }
    ],
    steps: [
      { text: 'El ADMIN edita PAR-01 en el panel de configuración.', nodes: ['admin'], edges: [] },
      { text: 'Nginx actúa de reverse proxy: la petición /api/administration/… se reenvía al BFF.', nodes: ['admin', 'nginx', 'bff'], edges: ['e1', 'e2'] },
      { text: 'El BFF valida la cookie httpOnly contra Identity (T01) y arma el contexto de autorización.', nodes: ['bff'], edges: [] },
      { text: 'El API Gateway valida JWT + rol ADMIN y enruta a Administration.', nodes: ['gw', 'adm'], edges: ['e3', 'e4'] },
      { text: 'Administration persiste la nueva versión (v+1) en global_parameter.', nodes: ['adm', 'dbpar'], edges: ['e5'] },
      { text: 'En la MISMA transacción escribe el OutboxMessage: el evento no se pierde aunque el broker falle.', nodes: ['adm', 'dbo', 'outbox'], edges: ['e6'] },
      { text: 'El publisher lee el Outbox y publica GlobalConfigurationChanged en el topic administration.events (Kafka).', nodes: ['outbox', 'rq'], edges: ['e7'] },
      { text: 'Kafka entrega el evento a cada consumer group (con su offset): invalidan su caché si v > local, o lo descartan si v ≤ local (idempotencia por versión).', nodes: ['rq', 'consumer'], edges: ['e8'] },
      { text: 'Resiliencia: si el evento no llega, el TTL de 10 min es el respaldo; si el Backoffice cae, el consumidor sirve el último valor conocido.', nodes: ['consumer'], edges: [] }
    ],
    entities: [
      { name: 'GlobalParameter', detail: 'key (PAR-01..24) · value (jsonb) · version (incrementa por cambio)' },
      { name: 'OutboxMessage', detail: 'eventId · payload · estado (pending/sent) — garantiza entrega at-least-once' },
      { name: 'Caché del consumidor', detail: 'versión + valor con TTL 10 min; el evento invalida antes del vencimiento' }
    ]
  },

  multitenancy: {
    id: 'multitenancy',
    title: 'Multitenancy + RLS (reportes por curso)',
    intro:
      'Cada curso-cohorte es un tenant (course_id). El TenantContext resuelve el alcance desde la sesión validada (nunca del request) y RLS impone el aislamiento a nivel de base: aunque una consulta olvide el WHERE, no se mezclan cursos.',
    layers: [
      { id: 'front', name: 'FRONT' },
      { id: 'back', name: 'BACK' },
      { id: 'db', name: 'BASE DE DATOS' }
    ],
    nodes: [
      { id: 'prof', layer: 'front', label: 'PROFESOR A', note: 'elige su curso (cohorte 7)', x: 14 },
      { id: 'admin', layer: 'front', label: 'ADMIN', note: 'alcance curso puntual o ALL', x: 36 },
      { id: 'sel', layer: 'front', label: 'Selector de alcance', note: 'curso · todos (ALL)', x: 58 },
      { id: 'bff', layer: 'back', label: 'BFF BackOffice', note: 'valida pertenencia (T02)', x: 22 },
      { id: 'ctx', layer: 'back', label: 'TenantContext', note: 'setea app.current_course', x: 44 },
      { id: 'rpt', layer: 'back', label: 'Reporting', note: 'read models por course_id', x: 66 },
      { id: 'dbcohort', layer: 'db', label: 'cohort_metrics_snapshot', note: 'RLS: course_id = sesión', x: 40 },
      { id: 'dbrow', layer: 'db', label: 'filas por curso', note: 'curso 7 · curso 8 · curso 9', x: 66 }
    ],
    edges: [
      { id: 'p1', from: 'prof', to: 'sel', label: 'curso 7' },
      { id: 'p2', from: 'sel', to: 'bff', label: 'alcance' },
      { id: 'p3', from: 'bff', to: 'ctx', label: 'contexto validado' },
      { id: 'p4', from: 'ctx', to: 'rpt', label: 'app.current_course = 7' },
      { id: 'p5', from: 'rpt', to: 'dbcohort', label: 'SELECT (sin WHERE)' },
      { id: 'p6', from: 'dbcohort', to: 'dbrow', label: 'RLS filtra → solo curso 7' }
    ],
    steps: [
      { text: 'PROFESOR A elige su curso (cohorte 7) en el selector de alcance.', nodes: ['prof', 'sel'], edges: ['p1'] },
      { text: 'El BFF valida la pertenencia con la matrícula (T02): el curso 7 SÍ está en su matrícula.', nodes: ['sel', 'bff'], edges: ['p2'] },
      { text: 'TenantContext setea app.current_course = 7 desde el contexto validado — nunca confía en el course_id del request.', nodes: ['bff', 'ctx'], edges: ['p3'] },
      { text: 'Reporting consulta las métricas. Aunque el SELECT olvide el WHERE, RLS filtra en la base: solo filas del curso 7.', nodes: ['ctx', 'rpt', 'dbcohort', 'dbrow'], edges: ['p4', 'p5', 'p6'] },
      { text: 'Respuesta 200 (solo su curso). Si PROFESOR A pidiera el curso 8, la pertenencia T02 no lo autoriza → 403 (la base ni se consulta).', nodes: ['bff', 'rpt'], edges: [] },
      { text: "ADMIN con alcance GLOBAL ('ALL'): panel con todos los cursos. RLS contempla el centinela sin apagarse (sin BYPASSRLS).", nodes: ['admin', 'sel', 'ctx', 'rpt'], edges: [] },
      { text: "Un PROFESOR que intente 'ALL' recibe 403: quién puede usar el alcance global lo decide la aplicación (rol ADMIN), no el request.", nodes: ['bff', 'ctx'], edges: [] }
    ],
    entities: [
      { name: 'TenantContext', detail: 'JWT → identidad/rol → course_id → validación T02 → app.current_course autorizado' },
      { name: 'Política RLS', detail: "USING (course_id = current_setting('app.current_course')::uuid OR current_setting(...) = 'ALL')" },
      { name: 'CohortMetricsSnapshot', detail: 'read model tenant-scoped por course_id (curso-cohorte)' }
    ]
  },

  login: {
    id: 'login',
    title: 'Login y sesión (Front → BFF → Identity)',
    intro:
      'El login de la consola admin: la cookie httpOnly viaja sola a cada app, el BFF valida la sesión en Identity y expira → 401 → vuelve al login conservando el intento.',
    layers: [
      { id: 'front', name: 'FRONT' },
      { id: 'back', name: 'BACK' },
      { id: 'db', name: 'BASE DE DATOS' }
    ],
    nodes: [
      { id: 'nav', layer: 'front', label: 'Navegador', note: 'form login + 2FA', x: 14 },
      { id: 'nginx', layer: 'front', label: 'Nginx', note: '/api/* → BFF', x: 36 },
      { id: 'bff', layer: 'front', label: 'BFF BackOffice', note: 'cookie httpOnly', x: 58 },
      { id: 'gw', layer: 'back', label: 'API Gateway (T01)', note: 'rate limiting /login', x: 24 },
      { id: 'id', layer: 'back', label: 'Identity (T01)', note: 'JWT + 2FA + roles', x: 46 },
      { id: 'dbsess', layer: 'db', label: 'sesión', note: 'propiedad de Identity', x: 46 }
    ],
    edges: [
      { id: 'l1', from: 'nav', to: 'nginx', label: 'POST /login' },
      { id: 'l2', from: 'nginx', to: 'bff', label: '/api/login' },
      { id: 'l3', from: 'bff', to: 'gw', label: 'cookie → contexto' },
      { id: 'l4', from: 'gw', to: 'id', label: 'autentica' },
      { id: 'l5', from: 'id', to: 'dbsess', label: 'guarda sesión' },
      { id: 'l6', from: 'id', to: 'bff', label: 'JWT + rol ADMIN' }
    ],
    steps: [
      { text: 'El ADMIN ingresa en /backoffice; el formulario pide usuario y contraseña (+ 2FA).', nodes: ['nav'], edges: [] },
      { text: 'Nginx (reverse proxy) reenvía /api/login al BFF.', nodes: ['nav', 'nginx', 'bff'], edges: ['l1', 'l2'] },
      { text: 'El BFF valida la sesión en Identity (T01) con la cookie httpOnly; el token nunca queda en JS.', nodes: ['bff', 'gw', 'id'], edges: ['l3', 'l4'] },
      { text: 'Identity crea la sesión y devuelve identidad + rol (ADMIN/PROFESOR) al BFF.', nodes: ['id', 'dbsess'], edges: ['l5', 'l6'] },
      { text: 'El BFF arma el contexto (usuario, rol, alcance) y la UI carga el panel.', nodes: ['bff', 'nav'], edges: [] },
      { text: 'Si la sesión expira, el BFF responde 401 → redirect a login conservando el intento + evento auth:session-expired.', nodes: ['bff'], edges: [] }
    ],
    entities: [
      { name: 'Sesión', detail: 'cookie httpOnly + Secure + SameSite en el dominio compartido (propiedad de Identity/T01)' },
      { name: 'Contexto BFF', detail: 'usuario + rol + alcance (curso puntual o ALL) — base del multitenancy' }
    ]
  },

  despliegue: {
    id: 'despliegue',
    title: 'Despliegue del Frontend (CI/CD + Docker 2 etapas + Nginx)',
    intro:
      'Cada git push dispara el pipeline: build 2 etapas → imagen → deploy del compose. Nginx se configura con envsubst (misma imagen para staging/producción) y la liberación usa Rolling Update + Feature Flags.',
    layers: [
      { id: 'front', name: 'FRONT' },
      { id: 'back', name: 'BACK' },
      { id: 'db', name: 'BASE DE DATOS' }
    ],
    nodes: [
      { id: 'git', layer: 'front', label: 'Git push', note: 'repo de la app Angular', x: 14 },
      { id: 'ci', layer: 'front', label: 'GitHub Actions', note: 'build + test', x: 36 },
      { id: 'build', layer: 'back', label: 'Docker 2 etapas', note: 'node:20 → nginx:alpine', x: 22 },
      { id: 'reg', layer: 'back', label: 'Registro de imágenes', note: 'imagen versionada', x: 44 },
      { id: 'serv', layer: 'back', label: 'Servidor (compose)', note: 'frontend + BFF', x: 66 },
      { id: 'nginx', layer: 'front', label: 'Nginx (envsubst)', note: 'BFF_URL por entorno', x: 58 },
      { id: 'users', layer: 'front', label: 'Usuarios', note: 'Rolling Update', x: 86 }
    ],
    edges: [
      { id: 'd1', from: 'git', to: 'ci', label: 'webhook' },
      { id: 'd2', from: 'ci', to: 'build', label: 'compila + tests' },
      { id: 'd3', from: 'build', to: 'reg', label: 'push imagen' },
      { id: 'd4', from: 'reg', to: 'serv', label: 'deploy compose' },
      { id: 'd5', from: 'serv', to: 'nginx', label: 'envsubst + nginx' },
      { id: 'd6', from: 'nginx', to: 'users', label: 'Rolling Update / Blue-Green' }
    ],
    steps: [
      { text: 'El equipo hace git push a la app Angular del BackOffice.', nodes: ['git'], edges: [] },
      { text: 'GitHub Actions dispara el pipeline: build + tests.', nodes: ['git', 'ci'], edges: ['d1', 'd2'] },
      { text: 'Docker compila en 2 etapas: node:20 genera dist/ y nginx:alpine solo copia los estáticos (sin Node en producción).', nodes: ['ci', 'build'], edges: ['d2'] },
      { text: 'La imagen se sube al registro con su tag de versión.', nodes: ['build', 'reg'], edges: ['d3'] },
      { text: 'El servidor despliega el compose (frontend + BFF) y Nginx resuelve ${BFF_URL} con envsubst: misma imagen para staging/producción.', nodes: ['reg', 'serv', 'nginx'], edges: ['d4', 'd5'] },
      { text: 'Liberación: Rolling Update (reemplazo gradual) + Feature Flags (activar pantallas sin re-deploy).', nodes: ['nginx', 'users'], edges: ['d6'] }
    ],
    entities: [
      { name: 'Dockerfile (2 etapas)', detail: 'FROM node:20 AS build → npm run build → FROM nginx:alpine → copia dist/' },
      { name: 'nginx.conf.template', detail: 'usa ${BFF_URL} y se completa con envsubst al arrancar' },
      { name: 'docker-compose', detail: 'frontend-backoffice (8080) + bff-backoffice (expose interno) con healthcheck service_healthy' }
    ]
  }
}