import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// GitHub Pages sirve el sitio bajo /<repo>/. En local (dev) se usa '/'.
const base = process.env.VITEPRESS_BASE ?? '/'

export default withMermaid({
  lang: 'es-ES',
  title: 'BackOffice · Docs',
  description: 'Requerimientos y arquitectura del backend BackOffice — Plataforma Gamificada',
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
      { text: 'Resumen', link: '/resumen' },
      {
        text: 'Requerimientos',
        items: [
          { text: 'Funcionales (RF)', link: '/requerimientos/funcionales' },
          { text: 'No funcionales (RNF)', link: '/requerimientos/no-funcionales' }
        ]
      },
      {
        text: 'Arquitectura',
        items: [
          { text: 'Vista general', link: '/arquitectura/vista-general' },
          { text: 'Microservicios', link: '/arquitectura/microservicios' },
          { text: 'Comunicación', link: '/arquitectura/comunicacion' },
          { text: 'Estructura de carpetas', link: '/arquitectura/carpetas' }
        ]
      },
      { text: 'Modelo de datos', link: '/datos/modelo' },
      { text: 'API', link: '/api/endpoints' },
      { text: 'ADRs', link: '/decisiones/adr' },
      { text: 'Riesgos', link: '/riesgos' },
      { text: 'Frontend', link: '/frontend/casos' }
    ],

    sidebar: [
      {
        text: 'Guía',
        items: [
          { text: 'Inicio', link: '/' },
          { text: 'Resumen visual', link: '/resumen' }
        ]
      },
      {
        text: 'Requerimientos',
        items: [
          { text: 'Funcionales (RF)', link: '/requerimientos/funcionales' },
          { text: 'No funcionales (RNF)', link: '/requerimientos/no-funcionales' }
        ]
      },
      {
        text: 'Arquitectura',
        items: [
          { text: 'Vista general', link: '/arquitectura/vista-general' },
          { text: 'Microservicios', link: '/arquitectura/microservicios' },
          { text: 'Comunicación', link: '/arquitectura/comunicacion' },
          { text: 'Estructura de carpetas', link: '/arquitectura/carpetas' }
        ]
      },
      {
        text: 'Datos y API',
        items: [
          { text: 'Modelo de datos', link: '/datos/modelo' },
          { text: 'Endpoints', link: '/api/endpoints' }
        ]
      },
      {
        text: 'Decisiones',
        items: [
          { text: 'ADRs', link: '/decisiones/adr' },
          { text: 'Riesgos', link: '/riesgos' },
          { text: 'Trazabilidad RF → servicio', link: '/trazabilidad' }
        ]
      },
      {
        text: 'Coordinación',
        items: [
          { text: 'Ownership entre equipos', link: '/equipos/ownership' },
          { text: 'Frontend — Casos A/B', link: '/frontend/casos' }
        ]
      }
    ],

    footer: {
      message: 'Plataforma de Aprendizaje Gamificado · BackOffice · 4to Cuatrimestre',
      copyright: 'Trabajo Integrador — UTN'
    }
  }
})