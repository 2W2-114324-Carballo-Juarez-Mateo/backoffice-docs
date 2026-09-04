import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import pptxgen from 'pptxgenjs'

const here = dirname(fileURLToPath(import.meta.url))
const outFile = resolve(here, '..', '..', 'Presentacion-BackOffice.pptx')

const C = {
  brand: '1971C2',
  brandDark: '15518F',
  front: 'E8590C',
  msg: '862E9C',
  db: '2F9E44',
  dark: '1F2933',
  muted: '52606D',
  bg: 'FFFFFF',
  soft: 'F5F7FA',
  line: 'CBD2D9'
}

const pptx = new pptxgen()
pptx.layout = 'LAYOUT_WIDE'
pptx.author = 'Equipo BackOffice — Tema 12'
pptx.title = 'BackOffice — Plataforma de Aprendizaje Gamificado'
pptx.subject = 'TPI 4° Cuatrimestre · Rol del equipo y flujos de trabajo'

let pageNo = 0
function footer(slide, total) {
  slide.addShape('rect', { x: 0, y: 7.28, w: 13.33, h: 0.02, fill: { color: C.line } })
  slide.addText('BackOffice · Tema 12 · Plataforma Gamificada', { x: 0.5, y: 7.08, w: 8, h: 0.25, fontSize: 8.5, color: C.muted })
  slide.addText(`${String(pageNo).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, { x: 11.9, y: 7.08, w: 0.9, h: 0.25, fontSize: 8.5, color: C.muted, align: 'right' })
}

function decor(slide, kicker, title, accent) {
  pageNo++
  slide.background = { color: C.bg }
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.14, fill: { color: accent || C.brand } })
  if (kicker) slide.addText(kicker.toUpperCase(), { x: 0.5, y: 0.3, w: 12.3, h: 0.3, fontSize: 11, bold: true, color: accent || C.brand, charSpacing: 1.5 })
  slide.addText(title, { x: 0.5, y: kicker ? 0.62 : 0.34, w: 12.3, h: 0.62, fontSize: 25, bold: true, color: C.dark, fontFace: 'Calibri' })
  slide.addShape('rect', { x: 0.5, y: 1.28, w: 1.1, h: 0.06, fill: { color: accent || C.brand } })
}

function bullets(slide, items, opts = {}) {
  const paras = []
  for (const it of items) {
    if (Array.isArray(it)) {
      paras.push({ text: it[0], options: { bullet: true, bold: true, color: C.dark, paraSpaceAfter: 2 } })
      paras.push({ text: it[1], options: { indentLevel: 1, color: C.muted, paraSpaceAfter: 9 } })
    } else {
      paras.push({ text: it, options: { bullet: true, color: C.dark } })
    }
  }
  slide.addText(paras, {
    x: 0.6, y: opts.y || 1.55, w: opts.w || 12.1, h: opts.h || 5.4,
    fontSize: 16, fontFace: 'Calibri', lineSpacingMultiple: 1.12, valign: 'top'
  })
}

function box(slide, x, y, w, color, label, sub) {
  const h = 0.72
  slide.addShape('roundRect', { x, y, w, h, fill: { color, transparency: 84 }, line: { color, width: 1.5 } })
  slide.addText(label, { x: x + 0.06, y: y + 0.03, w: w - 0.12, h: 0.34, fontSize: 11.5, bold: true, color: C.dark, align: 'center', valign: 'middle' })
  if (sub) slide.addText(sub, { x: x + 0.06, y: y + 0.37, w: w - 0.12, h: 0.3, fontSize: 8.5, color: C.muted, align: 'center', valign: 'middle' })
}
function arrow(slide, x, y, dir, color) {
  slide.addText(dir, { x, y, w: 0.44, h: 0.3, fontSize: 16, bold: true, color: color || C.muted, align: 'center', valign: 'middle' })
}
function note(slide, y, text, h) {
  slide.addShape('roundRect', { x: 0.6, y, w: 12.1, h: h || 0.95, fill: { color: C.soft }, line: { color: C.line } })
  slide.addText(text, { x: 0.95, y: y + 0.12, w: 11.4, h: (h || 0.95) - 0.24, fontSize: 13.5, italic: true, color: C.dark, valign: 'middle' })
}

const TOTAL = 14

/* 1 — Portada */
{
  const s = pptx.addSlide()
  pageNo++
  s.background = { color: C.bg }
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 3.0, fill: { color: C.brand } })
  s.addShape('rect', { x: 0, y: 3.0, w: 13.33, h: 0.12, fill: { color: C.front } })
  s.addText('BackOffice · Tema 12', { x: 0.8, y: 0.75, w: 11.7, h: 0.7, fontSize: 42, bold: true, color: 'FFFFFF', fontFace: 'Calibri' })
  s.addText('Plataforma de Aprendizaje Gamificado de Programación', { x: 0.8, y: 1.65, w: 11.7, h: 0.5, fontSize: 19, color: 'D9E6FF' })
  s.addText('Trabajo Integrador · 4° Cuatrimestre', { x: 0.8, y: 2.15, w: 11.7, h: 0.4, fontSize: 14, color: 'AFCBFF' })
  s.addText('Rol del equipo: BFF por experiencia', { x: 0.8, y: 3.5, w: 11.7, h: 0.6, fontSize: 24, bold: true, color: C.brand })
  s.addText('Nginx · BFF · API Gateway · Kafka · Multitenancy + RLS · Despliegue', { x: 0.8, y: 4.15, w: 11.7, h: 0.5, fontSize: 14, color: C.muted })
  footer(s, TOTAL)
}

/* 2 — Definición de roles por grupo */
{
  const s = pptx.addSlide()
  decor(s, 'Consigna del profe', 'Definición de roles por grupo', C.brand)
  const rows = [
    [{ text: 'Rol (de la consigna)', options: { bold: true, color: 'FFFFFF', fill: { color: C.brand } } },
     { text: 'Quién lo asume', options: { bold: true, color: 'FFFFFF', fill: { color: C.brand } } },
     { text: 'Estado', options: { bold: true, color: 'FFFFFF', fill: { color: C.brand } } }],
    [{ text: 'Implementación del BFF', options: { bold: true, color: C.dark } },
     { text: 'Equipo BackOffice (BFF por experiencia)', options: { color: C.brand, bold: true } },
     { text: '✅ Asumido', options: { color: C.db, bold: true } }],
    [{ text: 'Librería compartida (@tup/ui, @tup/contracts)', options: { color: C.dark } },
     { text: 'A coordinar en clase', options: { color: C.muted } },
     { text: '⏳ Proponemos aportar contratos OpenAPI', options: { color: C.muted } }],
    [{ text: 'Marketplace de skills', options: { color: C.dark } },
     { text: 'A coordinar en clase', options: { color: C.muted } },
     { text: '⏳ El BackOffice lo consume', options: { color: C.muted } }]
  ]
  s.addTable(rows, { x: 0.6, y: 1.6, w: 12.1, colW: [4.3, 4.3, 3.5], fontSize: 13.5, rowH: 0.72, border: { type: 'solid', color: C.line, pt: 1 }, valign: 'middle' })
  note(s, 5.3, 'Nuestra postura: asumimos el BFF por experiencia (el BFF BackOffice es del equipo) y proponemos un estándar de BFF de plataforma. Librería y marketplace se coordinan en clase.')
  footer(s, TOTAL)
}

/* 3 — Qué hacemos como BackOffice (simple) */
{
  const s = pptx.addSlide()
  decor(s, 'Nuestro rol en la plataforma', 'Qué hacemos como BackOffice', C.brand)
  bullets(s, [
    ['Somos el "tablero de control" de la plataforma', 'no fabricamos los datos de juego: los leemos de los demás equipos (consumidor puro).'],
    ['Administramos la configuración global', 'parámetros de economía (PAR-01..24) y proveedores de IA — una decisión que vale para todos los cursos.'],
    ['Mostramos reportes y métricas', 'por curso, aislados entre sí (cada curso es su propio salón).'],
    ['El acceso siempre ordenado', 'el front entra por Nginx → BFF → Gateway; nunca toca la base ni el broker.'],
    ['Rol frente a la clase: BFF por experiencia', 'construimos el BFF del BackOffice y proponemos el estándar de BFF para la plataforma.']
  ])
  footer(s, TOTAL)
}

/* 4 — Agenda */
{
  const s = pptx.addSlide()
  decor(s, 'HOY', 'Agenda', C.brand)
  bullets(s, [
    'Rol del equipo: BFF por experiencia',
    'Qué hacemos como BackOffice (en simple)',
    'Arquitectura general (capas: Front · Back · Mensajería · BD)',
    'Analogía: recepcionista, mesero y guardia',
    'Mensajería híbrida con Kafka (Outbox + caché TTL)',
    'Multitenancy + RLS (caso ADMIN global)',
    'Flujos y casos de uso, conectados con los demás equipos',
    'Despliegue del frontend (Docker 2 etapas + Nginx + CI/CD)'
  ])
  footer(s, TOTAL)
}

/* 5 — Arquitectura general (diagrama dibujado) */
{
  const s = pptx.addSlide()
  decor(s, 'VISIÓN GENERAL', 'Arquitectura general (por capas)', C.brand)
  const col = { nav: 3.52, gw: 6.27, adm: 9.02, rpt: 11.55 } // centros de columna
  // Lane backgrounds
  s.addShape('roundRect', { x: 0.3, y: 1.35, w: 12.7, h: 2.6, fill: { color: C.front, transparency: 92 }, line: { color: C.front, width: 0.75 } })
  s.addShape('roundRect', { x: 0.3, y: 4.05, w: 12.7, h: 1.0, fill: { color: C.brand, transparency: 92 }, line: { color: C.brand, width: 0.75 } })
  s.addShape('roundRect', { x: 0.3, y: 5.15, w: 12.7, h: 1.0, fill: { color: C.msg, transparency: 92 }, line: { color: C.msg, width: 0.75 } })
  s.addText('FRONT', { x: 0.42, y: 1.42, w: 1.6, h: 0.28, fontSize: 11, bold: true, color: C.front })
  s.addText('BACK', { x: 0.42, y: 4.12, w: 1.6, h: 0.28, fontSize: 11, bold: true, color: C.brand })
  s.addText('MENSAJERÍA + BD', { x: 0.42, y: 5.22, w: 1.9, h: 0.28, fontSize: 11, bold: true, color: C.msg })

  // FRONT — fila superior + BFF (columna NGX)
  box(s, 2.45, 1.8, 2.15, C.front, 'Navegador', 'el ADMIN')
  arrow(s, 4.68, 2.0, '→', C.muted)
  box(s, 5.2, 1.8, 2.15, C.front, 'Nginx', 'web + /api/*')
  arrow(s, 7.44, 2.0, '→', C.muted)
  box(s, 7.98, 1.8, 2.1, C.front, 'Angular SSR', 'consola admin')
  arrow(s, col.gw - 0.22, 2.53, '↓', C.muted)
  box(s, 5.2, 3.05, 2.15, C.front, 'BFF BackOffice', 'agrega por pantalla')

  // BACK — GW · ADM · RPT
  arrow(s, col.gw - 0.22, 3.78, '↓', C.muted)
  box(s, 5.2, 4.15, 2.15, C.brand, 'API Gateway (T01)', 'JWT + rol')
  arrow(s, 7.44, 4.35, '→', C.muted)
  box(s, 7.98, 4.15, 2.1, C.brand, 'Administration', 'PAR + proveedores')
  arrow(s, 10.17, 4.35, '→', C.muted)
  box(s, 10.7, 4.15, 2.0, C.brand, 'Reporting', 'panel · reportes')

  // MENSAJERÍA + BD — Kafka (bajo ADM) y reporting_db (bajo Reporting)
  arrow(s, col.adm - 0.22, 4.88, '↓', C.msg)
  box(s, 7.98, 5.25, 2.1, C.msg, 'Kafka', 'administration.events')
  arrow(s, col.rpt - 0.22, 4.88, '↓', C.db)
  box(s, 10.7, 5.25, 2.0, C.db, 'PostgreSQL', 'reporting + RLS')
  footer(s, TOTAL)
}

/* 6 — Analogía del edificio */
{
  const s = pptx.addSlide()
  decor(s, 'PARA ENTENDERLO FÁCIL', 'El front no entra directo a las oficinas', C.front)
  const cards = [
    ['Recepcionista', 'NGINX', 'Decide a qué oficina mandarte y reencamina si te perdés.'],
    ['Mesero', 'BFF BackOffice', 'Junta todo lo que pedís en una sola bandeja (una respuesta por pantalla).'],
    ['Guardia', 'API Gateway (T01)', 'Valida tu credencial y te deja pasar solo a las oficinas que te corresponden.'],
    ['Oficinas', 'Microservicios', 'Cada una hace su tarea; vos no entrás a la cocina.']
  ]
  const cw = 2.95, gap = 0.13, x0 = 0.6, y0 = 1.6, ch = 3.3
  cards.forEach((card, i) => {
    const x = x0 + i * (cw + gap)
    s.addShape('roundRect', { x, y: y0, w: cw, h: ch, fill: { color: C.soft }, line: { color: C.line } })
    s.addShape('roundRect', { x: x + 0.15, y: y0 + 0.18, w: cw - 0.3, h: 0.62, fill: { color: i === 0 ? C.front : i === 1 ? C.brand : i === 2 ? C.msg : C.db, transparency: 12 }, line: { color: 'FFFFFF', width: 1 } })
    s.addText(card[1], { x, y: y0 + 0.28, w: cw, h: 0.42, fontSize: 13, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' })
    s.addText(card[0], { x: x + 0.12, y: y0 + 0.95, w: cw - 0.24, h: 0.5, fontSize: 15, bold: true, color: C.dark, align: 'center' })
    s.addText(card[2], { x: x + 0.18, y: y0 + 1.55, w: cw - 0.36, h: 1.6, fontSize: 11.5, color: C.muted, align: 'center', valign: 'top' })
  })
  note(s, 5.2, 'Resultado: una sola puerta, un solo pedido y datos siempre de la fuente correcta. El front nunca habla con la base ni con Kafka.')
  footer(s, TOTAL)
}

/* 7 — Componentes */
{
  const s = pptx.addSlide()
  decor(s, 'STACK', 'Componentes del BackOffice', C.brand)
  bullets(s, [
    ['Nginx', 'servidor web + reverse proxy (/api/* → BFF) + deep-links + seguridad.'],
    ['BFF BackOffice', 'agrega las respuestas de Administration, Reporting y T02 por pantalla.'],
    ['API Gateway (T01)', 'única puerta: JWT, 2FA, rate limiting, correlation ID.'],
    ['Administration & Configuration', 'PAR-01..24, proveedores LLM (exclusivo ADMIN), evaluador, golden set.'],
    ['Reporting & Analytics', 'panel, reportes docentes, métricas/CSAT, export, alertas.'],
    ['Kafka + Outbox', 'propagación de configuración con idempotencia y caché TTL 10 min.'],
    ['PostgreSQL + RLS', 'una base por servicio; aislamiento por course_id en reporting.']
  ], { y: 1.5 })
  footer(s, TOTAL)
}

/* 8 — Kafka */
{
  const s = pptx.addSlide()
  decor(s, 'PATRÓN HÍBRIDO', 'Mensajería híbrida con Kafka', C.msg)
  bullets(s, [
    ['REST responde; los eventos avisan', 'REST por el gateway para lo síncrono; Kafka solo notifica cambios de configuración.'],
    ['Kafka = decisión de plataforma', 'Notificaciones y Banco también lo usan → un único broker (RabbitMQ queda como alternativa).'],
    ['Outbox', 'el evento se escribe en la misma transacción que el cambio → no se pierde.'],
    ['Idempotencia', 'por event_id y por version (el consumidor descarta v ≤ local).'],
    ['Caché con TTL 10 min', 'los consumidores (T03/05/08/10) guardan el valor; si el evento no llega, el TTL es el respaldo.'],
    ['Replay disponible', 'Kafka permite re-leer topics; los read models igual se reconstruyen por contratos REST.']
  ])
  footer(s, TOTAL)
}

/* 9 — Multitenancy + RLS */
{
  const s = pptx.addSlide()
  decor(s, 'AISLAMIENTO DE DATOS', 'Multitenancy + RLS', C.db)
  bullets(s, [
    ['Tenant = curso-cohorte (course_id)', 'multitenancy lógico: una base por servicio + columna course_id.'],
    ['TenantContext', 'setea app.current_course desde el contexto validado (token + matrícula T02) — nunca del request.'],
    ['RLS como refuerzo', 'la base no devuelve filas de otros cursos aunque el query olvide el WHERE.'],
    ['Caso ADMIN global', 'curso puntual o ALL (centinela); sin BYPASSRLS; PROFESOR con ALL → 403; lecturas globales auditadas.'],
    ['Prueba de aislamiento', 'PROFESOR A → curso A → 200 · curso B → 403 · ADMIN → panel global → 200.']
  ])
  footer(s, TOTAL)
}

/* 10 — Casos de uso 1 */
{
  const s = pptx.addSlide()
  decor(s, 'FLUJOS DE TRABAJO · 1/2', 'Casos de uso del BackOffice', C.brand)
  bullets(s, [
    ['Login + 2FA', 'Front → BFF → Identity (T01): cookie httpOnly, 401 → login conservando el intento.'],
    ['Gestión de plataforma', 'alta de administradores, roles y operativas (Administration, con T01).'],
    ['Cambio de PAR-01', 'REST + Outbox + Kafka + caché TTL: Administration publica y los Temas 03/05/08/10 aplican hacia adelante (RF-CFG-06).'],
    ['Demo en vivo', 'sección interactiva del sitio: flujos animados por capas.']
  ])
  note(s, 5.4, 'Conecta con: T01 (identidad/roles) · T02 (matrícula) · T03/05/08/10 (consumen la configuración).')
  footer(s, TOTAL)
}

/* 11 — Casos de uso 2 */
{
  const s = pptx.addSlide()
  decor(s, 'FLUJOS DE TRABAJO · 2/2', 'Casos de uso del BackOffice', C.brand)
  bullets(s, [
    ['Reporte por curso (RLS)', 'Reporting tenant-scoped; TenantContext + RLS; pertenencia validada con T02; caso ADMIN ALL.'],
    ['Proveedor LLM', 'exclusivo de ADMIN; golden set + calibración; el T07 lo consume (evento ModelProviderChanged).'],
    ['Exportación y alertas', 'panel y reportes con export (generado por backend) y alertas (CSAT bajo, retención próxima).'],
    ['Demo en vivo', 'sección interactiva del sitio: multitenancy/RLS y despliegue.']
  ])
  note(s, 5.4, 'Conecta con: T02 (matrícula) · T04/05/07/08/10 (lecturas para métricas) · T01 (autorización).')
  footer(s, TOTAL)
}

/* 12 — Despliegue del Frontend */
{
  const s = pptx.addSlide()
  decor(s, 'NGINX + DOCKER + CI/CD', 'Despliegue del Frontend', C.front)
  bullets(s, [
    ['Docker 2 etapas', 'node:20 compila → nginx:alpine sirve los estáticos (sin Node en producción).'],
    ['envsubst', 'el nginx.conf es una plantilla con ${BFF_URL}: misma imagen para staging y producción.'],
    ['CI/CD', 'GitHub Actions: build → tests → push imagen → deploy del compose.'],
    ['Estrategias', 'Rolling Update + Feature Flags (base); Blue-Green alternativa; Canary/A-B/Shadow descartadas.'],
    ['Load balancing', 'Round Robin · Weighted · Least Connections · IP Hash (para el TP alcanza 1 instancia).'],
    ['Monitoreo/rollback', 'healthchecks service_healthy + logs de Nginx + tags por versión.']
  ], { y: 1.5 })
  footer(s, TOTAL)
}

/* 13 — Integración con otros equipos */
{
  const s = pptx.addSlide()
  decor(s, 'QUÉ DAMOS · QUÉ NECESITAMOS', 'Integración con otros equipos', C.brand)
  const rows = [
    [{ text: 'Otro equipo', options: { bold: true, color: 'FFFFFF', fill: { color: C.brand } } },
     { text: 'Qué da / qué recibe con el BackOffice', options: { bold: true, color: 'FFFFFF', fill: { color: C.brand } } }],
    [{ text: 'T01 Identidad/roles/auditoría', options: { color: C.dark, bold: true } }, { text: 'Nos da: login, roles, 2FA, gateway, auditoría (consumida).', options: { color: C.muted } }],
    [{ text: 'T02 Cursos / Matrícula', options: { color: C.dark, bold: true } }, { text: 'Nos da: pertenencia a la cohorte (base del tenant).', options: { color: C.muted } }],
    [{ text: 'T03/05/08/10 Gamificación/Banco/Roadmap', options: { color: C.dark, bold: true } }, { text: 'Reciben: la configuración de PAR (GlobalConfigurationChanged).', options: { color: C.muted } }],
    [{ text: 'T04/05/07/08/10 Lecturas', options: { color: C.dark, bold: true } }, { text: 'Nos dan: contratos de lectura para reportes/métricas.', options: { color: C.muted } }],
    [{ text: 'T07 Evaluación LLM', options: { color: C.dark, bold: true } }, { text: 'Recibe: el proveedor LLM (ModelProviderChanged, exclusivo ADMIN).', options: { color: C.muted } }],
    [{ text: 'Frontend (Caso A)', options: { color: C.dark, bold: true } }, { text: 'Compartimos: BFF por experiencia, cookie de sesión, @tup/ui.', options: { color: C.muted } }]
  ]
  s.addTable(rows, { x: 0.6, y: 1.55, w: 12.1, colW: [3.6, 8.5], fontSize: 13.5, rowH: 0.62, border: { type: 'solid', color: C.line, pt: 1 }, valign: 'middle' })
  footer(s, TOTAL)
}

/* 14 — Cierre */
{
  const s = pptx.addSlide()
  decor(s, 'PRÓXIMOS PASOS', 'Resumen y cierre', C.brand)
  bullets(s, [
    ['Rol: BFF por experiencia', '2 servicios propietarios · consumidor puro · soporte visual interactivo en el sitio.'],
    ['Validar con la cátedra', 'el broker (Kafka) y los contratos de lectura con los demás equipos.'],
    ['Coordinar en clase', 'estándar BFF, librería compartida y marketplace.']
  ], { h: 3.0 })
  s.addText('¡Gracias!', { x: 0.6, y: 4.6, w: 12.1, h: 1.0, fontSize: 30, bold: true, color: C.brand })
  footer(s, TOTAL)
}

await pptx.writeFile({ fileName: outFile })
console.log('PPTX generado:', outFile, '·', TOTAL, 'slides')