import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import pptxgen from 'pptxgenjs'

const here = dirname(fileURLToPath(import.meta.url))
const outFile = resolve(here, '..', '..', 'Presentacion-BackOffice.pptx')

const C = {
  brand: '1971C2',
  front: 'E8590C',
  msg: '862E9C',
  db: '2F9E44',
  dark: '212529',
  muted: '6C757D',
  bg: 'FFFFFF',
  soft: 'F1F3F5',
  softline: 'DEE2E6'
}

const pptx = new pptxgen()
pptx.layout = 'LAYOUT_WIDE'
pptx.author = 'Equipo BackOffice — Tema 12'
pptx.title = 'BackOffice — Plataforma de Aprendizaje Gamificado'
pptx.subject = 'TPI 4° Cuatrimestre · Rol del equipo y flujos de trabajo'

function header(slide, title, kicker) {
  slide.background = { color: C.bg }
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.18, fill: { color: C.brand } })
  if (kicker) {
    slide.addText(kicker, { x: 0.5, y: 0.28, w: 12.3, h: 0.3, fontSize: 11, color: C.brand, bold: true, charSpacing: 1 })
  }
  slide.addText(title, { x: 0.5, y: kicker ? 0.6 : 0.32, w: 12.3, h: 0.7, fontSize: 26, bold: true, color: C.dark, fontFace: 'Calibri' })
}

function bullets(slide, items, opts = {}) {
  const rows = items.map((it) => {
    if (Array.isArray(it)) {
      return [{ text: it[0], options: { bold: true, color: C.dark, bullet: true, breakLine: false } },
              { text: it[1], options: { color: C.muted, breakLine: false } }]
    }
    return [{ text: it, options: { color: C.dark, bullet: true } }]
  })
  slide.addText(rows, {
    x: 0.6, y: 1.5, w: 12.1, h: opts.h || 5.2,
    fontSize: 16, fontFace: 'Calibri', lineSpacingMultiple: 1.15, valign: 'top'
  })
}

function band(slide, y, color, label, detail) {
  slide.addShape('roundRect', { x: 0.7, y, w: 11.9, h: 0.72, fill: { color: color, transparency: 88 }, line: { color, width: 1.25 } })
  slide.addText(label, { x: 1.0, y: y + 0.06, w: 4.6, h: 0.6, fontSize: 15, bold: true, color })
  slide.addText(detail, { x: 5.4, y: y + 0.06, w: 7.0, h: 0.6, fontSize: 12.5, color: C.dark, valign: 'middle' })
}

/* 1 — Portada */
{
  const s = pptx.addSlide()
  s.background = { color: C.bg }
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 2.6, fill: { color: C.brand } })
  s.addText('BackOffice · Tema 12', { x: 0.8, y: 0.7, w: 11.7, h: 0.6, fontSize: 40, bold: true, color: 'FFFFFF', fontFace: 'Calibri' })
  s.addText('Plataforma de Aprendizaje Gamificado de Programación', { x: 0.8, y: 1.5, w: 11.7, h: 0.5, fontSize: 18, color: 'D9E6FF' })
  s.addText('Trabajo Integrador — 4° Cuatrimestre', { x: 0.8, y: 1.95, w: 11.7, h: 0.4, fontSize: 14, color: 'AFCBFF' })
  s.addText('Rol del equipo: BFF por experiencia', { x: 0.8, y: 3.0, w: 11.7, h: 0.6, fontSize: 22, bold: true, color: C.brand })
  s.addText('Nginx · BFF · API Gateway · Kafka · Multitenancy + RLS · Despliegue', { x: 0.8, y: 3.7, w: 11.7, h: 0.5, fontSize: 14, color: C.muted })
}

/* 2 — Agenda */
{
  const s = pptx.addSlide()
  header(s, 'Agenda', 'HOY')
  bullets(s, [
    'Rol del equipo: BFF por experiencia',
    'Arquitectura general (capas: Front · Back · Mensajería · BD)',
    'Componentes del BackOffice',
    'Mensajería híbrida con Kafka (Outbox + caché TTL)',
    'Multitenancy + RLS (caso ADMIN global)',
    'Flujos y casos de uso, conectados con los demás equipos',
    'Despliegue del frontend (Docker 2 etapas + Nginx + CI/CD)'
  ])
}

/* 3 — Rol del equipo */
{
  const s = pptx.addSlide()
  header(s, 'Rol del equipo — BFF por experiencia', 'DEFINICIÓN DE ROLES')
  bullets(s, [
    ['BFF BackOffice', 'es del equipo BackOffice (patrón Backend for Frontend de la consigna de Front).'],
    ['Estándar de BFF de plataforma', 'una sola respuesta por pantalla · cookie → contexto · sirve datos al SSR · sin reglas de negocio.'],
    ['Librería compartida (@tup/ui, @tup/contracts)', 'proponemos coordinar la definición de quién la mantiene; aportamos los contratos/OpenAPI que generamos.'],
    ['Marketplace de skills', 'proponemos coordinar la asignación en clase; el BackOffice consume, no es dueño del marketplace.']
  ])
  s.addShape('roundRect', { x: 0.6, y: 5.6, w: 12.1, h: 1.0, fill: { color: C.soft }, line: { color: C.softline } })
  s.addText('Regla: el BFF no almacena reglas de negocio — solo orquesta y adapta contratos. No suma microservicios de dominio (el backend sigue con 2 servicios propietarios).', { x: 0.9, y: 5.75, w: 11.5, h: 0.7, fontSize: 13, italic: true, color: C.dark })
}

/* 4 — Arquitectura general */
{
  const s = pptx.addSlide()
  header(s, 'Arquitectura general (por capas)', 'VISIÓN GENERAL')
  band(s, 1.35, C.front, 'FRONT', 'Navegador → Nginx (web + reverse proxy + deep-links) → App Angular SSR · BFF BackOffice')
  band(s, 2.25, C.brand, 'BACK', 'API Gateway (T01) → Administration & Configuration · Reporting & Analytics · T01/T02')
  band(s, 3.15, C.msg, 'MENSAJERÍA', 'Kafka — eventos de configuración (exchange→topic), Outbox, idempotencia')
  band(s, 4.05, C.db, 'BASE DE DATOS', 'PostgreSQL por servicio · read models tenant-scoped (course_id) + RLS')
  s.addShape('roundRect', { x: 0.7, y: 5.1, w: 11.9, h: 1.3, fill: { color: C.soft }, line: { color: C.softline } })
  s.addText('El front nunca habla con la base ni con Kafka: entra por Nginx → BFF → Gateway → microservicios. Multitenancy lo resuelve el BFF (alcance curso puntual o ALL).', { x: 1.0, y: 5.3, w: 11.3, h: 0.9, fontSize: 13.5, color: C.dark })
}

/* 5 — Componentes */
{
  const s = pptx.addSlide()
  header(s, 'Componentes del BackOffice', 'STACK')
  bullets(s, [
    ['Nginx', 'servidor web + reverse proxy (/api/* → BFF) + deep-links + seguridad.'],
    ['BFF BackOffice', 'agrega las respuestas de Administration, Reporting y T02 por pantalla.'],
    ['API Gateway (T01)', 'única puerta: JWT, 2FA, rate limiting, correlation ID.'],
    ['Administration & Configuration', 'PAR-01..24, proveedores LLM (exclusivo ADMIN), evaluador, golden set.'],
    ['Reporting & Analytics', 'panel, reportes docentes, métricas/CSAT, export, alertas.'],
    ['Kafka + Outbox', 'propagación de configuración con idempotencia y caché TTL 10 min.'],
    ['PostgreSQL + RLS', 'una base por servicio; aislamiento por course_id en reporting.']
  ])
}

/* 6 — Kafka */
{
  const s = pptx.addSlide()
  header(s, 'Mensajería híbrida con Kafka', 'PATRÓN HÍBRIDO')
  bullets(s, [
    ['REST responde; los eventos avisan', 'REST por el gateway para lo síncrono; Kafka solo notifica cambios de configuración.'],
    ['Kafka = decisión de plataforma', 'Notificaciones y Banco también lo usan → un único broker (RabbitMQ queda como alternativa).'],
    ['Outbox', 'el evento se escribe en la misma transacción que el cambio → no se pierde.'],
    ['Idempotencia', 'por event_id y por version (el consumidor descarta v ≤ local).'],
    ['Caché con TTL 10 min', 'los consumidores (T03/05/08/10) guardan el valor; si el evento no llega, el TTL es el respaldo.'],
    ['Replay disponible', 'Kafka permite re-leer topics; los read models igual se reconstruyen por contratos REST.']
  ])
}

/* 7 — Multitenancy + RLS */
{
  const s = pptx.addSlide()
  header(s, 'Multitenancy + RLS', 'AISLAMIENTO DE DATOS')
  bullets(s, [
    ['Tenant = curso-cohorte (course_id)', 'multitenancy lógico: una base por servicio + columna course_id.'],
    ['TenantContext', 'setea app.current_course desde el contexto validado (token + matrícula T02) — nunca del request.'],
    ['RLS como refuerzo', 'la base no devuelve filas de otros cursos aunque el query olvide el WHERE.'],
    ['Caso ADMIN global', 'curso puntual o ALL (centinela); sin BYPASSRLS; PROFESOR con ALL → 403; lecturas globales auditadas.'],
    ['Prueba de aislamiento', 'PROFESOR A → curso A → 200 · curso B → 403 · ADMIN → panel global → 200.']
  ])
}

/* 8 — Casos de uso 1 */
{
  const s = pptx.addSlide()
  header(s, 'Casos de uso (1/2)', 'FLUJOS DE TRABAJO')
  bullets(s, [
    ['Login + 2FA', 'Front → BFF → Identity (T01): cookie httpOnly, 401 → login conservando el intento.'],
    ['Gestión de plataforma', 'alta de administradores, roles y operativas (Administration, con T01).'],
    ['Cambio de PAR-01', 'REST + Outbox + Kafka + caché TTL: Administration publica y los Temas 03/05/08/10 aplican hacia adelante (RF-CFG-06).'],
    ['Demostración en vivo', 'sección interactiva del sitio: flujos animados por capas.']
  ])
  s.addShape('roundRect', { x: 0.6, y: 5.4, w: 12.1, h: 0.9, fill: { color: C.soft }, line: { color: C.softline } })
  s.addText('Conexión con otros equipos: T01 (identidad/roles) · T02 (matrícula) · T03/05/08/10 (consumen la configuración).', { x: 0.9, y: 5.55, w: 11.5, h: 0.6, fontSize: 13, italic: true, color: C.dark })
}

/* 9 — Casos de uso 2 */
{
  const s = pptx.addSlide()
  header(s, 'Casos de uso (2/2)', 'FLUJOS DE TRABAJO')
  bullets(s, [
    ['Reporte por curso (RLS)', 'Reporting tenant-scoped; TenantContext + RLS; pertenencia validada con T02; caso ADMIN ALL.'],
    ['Proveedor LLM', 'exclusivo de ADMIN; golden set + calibración; el T07 lo consume (evento ModelProviderChanged).'],
    ['Exportación y alertas', 'panel y reportes con export (generado por backend) y alertas (CSAT bajo, retención próxima).'],
    ['Demostración en vivo', 'sección interactiva del sitio: multitenancy/RLS y despliegue.']
  ])
  s.addShape('roundRect', { x: 0.6, y: 5.4, w: 12.1, h: 0.9, fill: { color: C.soft }, line: { color: C.softline } })
  s.addText('Conexión: T02 (matrícula) · T04/05/07/08/10 (lecturas para métricas) · T01 (autorización).', { x: 0.9, y: 5.55, w: 11.5, h: 0.6, fontSize: 13, italic: true, color: C.dark })
}

/* 10 — Despliegue front */
{
  const s = pptx.addSlide()
  header(s, 'Despliegue del Frontend', 'NGINX + DOCKER + CI/CD')
  bullets(s, [
    ['Docker 2 etapas', 'node:20 compila → nginx:alpine sirve los estáticos (sin Node en producción).'],
    ['envsubst', 'el nginx.conf es una plantilla con ${BFF_URL}: misma imagen para staging y producción.'],
    ['CI/CD', 'GitHub Actions: build → tests → push imagen → deploy del compose.'],
    ['Estrategias', 'Rolling Update + Feature Flags (base); Blue-Green alternativa; Canary/A-B/Shadow descartadas.'],
    ['Load balancing', 'Round Robin · Weighted · Least Connections · IP Hash (para el TP alcanza 1 instancia).'],
    ['Monitoreo/rollback', 'healthchecks service_healthy + logs de Nginx + tags por versión.']
  ])
}

/* 11 — Integración con otros equipos */
{
  const s = pptx.addSlide()
  header(s, 'Integración con otros equipos', 'QUÉ DAMOS · QUÉ NECESITAMOS')
  const rows = [
    [{ text: 'Otro equipo', options: { bold: true, color: 'FFFFFF', fill: { color: C.brand } } },
     { text: 'Qué da / qué recibe con el BackOffice', options: { bold: true, color: 'FFFFFF', fill: { color: C.brand } } }],
    [{ text: 'T01 Identidad/roles/auditoría', options: { color: C.dark } }, { text: 'Nos da: login, roles, 2FA, gateway, auditoría (consumida).', options: { color: C.muted } }],
    [{ text: 'T02 Cursos / Matrícula', options: { color: C.dark } }, { text: 'Nos da: pertenencia a la cohorte (base del tenant).', options: { color: C.muted } }],
    [{ text: 'T03/05/08/10 Gamificación/Banco/Roadmap', options: { color: C.dark } }, { text: 'Reciben: la configuración de PAR (GlobalConfigurationChanged).', options: { color: C.muted } }],
    [{ text: 'T04/05/07/08/10 Lecturas', options: { color: C.dark } }, { text: 'Nos dan: contratos de lectura para reportes/métricas.', options: { color: C.muted } }],
    [{ text: 'T07 Evaluación LLM', options: { color: C.dark } }, { text: 'Recibe: el proveedor LLM (ModelProviderChanged, exclusivo ADMIN).', options: { color: C.muted } }],
    [{ text: 'Frontend (Caso A)', options: { color: C.dark } }, { text: 'Compartimos: BFF por experiencia, cookie de sesión, @tup/ui.', options: { color: C.muted } }]
  ]
  s.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [3.4, 8.7], fontSize: 13, rowH: 0.55, border: { type: 'solid', color: C.softline, pt: 1 }, valign: 'middle' })
}

/* 12 — Cierre */
{
  const s = pptx.addSlide()
  s.background = { color: C.bg }
  s.addShape('rect', { x: 0, y: 6.4, w: 13.33, h: 1.1, fill: { color: C.brand } })
  s.addText('BackOffice · Tema 12', { x: 0.8, y: 1.0, w: 11.7, h: 0.7, fontSize: 34, bold: true, color: C.brand })
  s.addText('Rol: BFF por experiencia · 2 servicios propietarios · consumidor puro', { x: 0.8, y: 1.85, w: 11.7, h: 0.5, fontSize: 18, color: C.dark })
  bullets(s, [
    'Próximos pasos: validar con la cátedra el broker (Kafka) y los contratos de lectura.',
    'Coordinar con los equipos: estándar BFF, librería compartida y marketplace.',
    'Soporte visual disponible: sección interactiva del sitio (flujos animados por capas).'
  ], { h: 2.6 })
  s.addText('Gracias', { x: 0.8, y: 4.6, w: 11.7, h: 0.8, fontSize: 30, bold: true, color: C.brand })
}

await pptx.writeFile({ fileName: outFile })
console.log('PPTX generado:', outFile)