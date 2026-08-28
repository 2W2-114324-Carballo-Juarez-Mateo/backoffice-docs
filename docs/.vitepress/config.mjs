import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// GitHub Pages sirve el sitio bajo /<repo>/. En local (dev) se usa '/'.
const base = process.env.VITEPRESS_BASE ?? '/'

export default withMermaid({
  lang: 'es-ES',
  title: 'BackOffice · Docs',
  description: 'Documentación por materia — Backend · Frontend · MSII — Plataforma Gamificada',
  cleanUrls: true,
  base,

  vite: {
    optimizeDeps: {
      include: ['fastdom', 'mermaid']
    }
  },

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Inicio', link: '/' },
      {
        text: 'Backend',
        link: '/backend/',
        items: [
          { text: 'Resumen', link: '/backend/resumen' },
          { text: 'Vista general', link: '/backend/arquitectura/vista-general' },
          { text: 'Microservicios', link: '/backend/arquitectura/microservicios' },
          { text: 'Comunicación', link: '/backend/arquitectura/comunicacion' },
          { text: 'Patrones de diseño', link: '/backend/arquitectura/patrones' },
          { text: 'Estructura de carpetas', link: '/backend/arquitectura/carpetas' },
          { text: 'Modelo de datos', link: '/backend/datos/modelo' },
          { text: 'API', link: '/backend/api/endpoints' },
          { text: 'ADRs', link: '/backend/decisiones/adr' },
          { text: 'Riesgos', link: '/backend/riesgos' },
          { text: 'Ownership entre equipos', link: '/backend/equipos/ownership' }
        ]
      },
      { text: 'Frontend', link: '/frontend/' },
      { text: 'MSII', link: '/msii/' }
    ],

    sidebar: [
      {
        text: 'General',
        items: [
          { text: 'Inicio', link: '/' }
        ]
      },
      {
        text: 'Backend',
        collapsed: false,
        items: [
          { text: 'Portada Backend', link: '/backend/' },
          { text: 'Resumen visual', link: '/backend/resumen' },
          {
            text: 'Arquitectura',
            items: [
              { text: 'Vista general', link: '/backend/arquitectura/vista-general' },
              { text: 'Microservicios', link: '/backend/arquitectura/microservicios' },
              { text: 'Comunicación', link: '/backend/arquitectura/comunicacion' },
              { text: 'Patrones de diseño', link: '/backend/arquitectura/patrones' },
              { text: 'Estructura de carpetas', link: '/backend/arquitectura/carpetas' }
            ]
          },
          { text: 'Modelo de datos', link: '/backend/datos/modelo' },
          { text: 'Endpoints', link: '/backend/api/endpoints' },
          { text: 'ADRs', link: '/backend/decisiones/adr' },
          { text: 'Riesgos', link: '/backend/riesgos' },
          { text: 'Ownership entre equipos', link: '/backend/equipos/ownership' }
        ]
      },
      {
        text: 'Frontend',
        collapsed: false,
        items: [
          { text: 'Portada Frontend', link: '/frontend/' },
          { text: 'Plan de comunicación', link: '/frontend/comunicacion' },
          { text: 'Casos A/B — postura', link: '/frontend/casos' }
        ]
      },
      {
        text: 'MSII (Análisis)',
        collapsed: false,
        items: [
          { text: 'Portada MSII', link: '/msii/' },
          { text: 'Requerimientos funcionales', link: '/msii/requerimientos-funcionales' },
          { text: 'Requerimientos no funcionales', link: '/msii/requerimientos-no-funcionales' },
          { text: 'Trazabilidad RF → servicio', link: '/msii/trazabilidad' }
        ]
      }
    ],

    footer: {
      message: 'Plataforma de Aprendizaje Gamificado · Backend · Frontend · MSII',
      copyright: 'Trabajo Integrador — 4to Cuatrimestre'
    }
  }
})