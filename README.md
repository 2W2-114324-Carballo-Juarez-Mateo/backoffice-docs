# BackOffice Docs — Sitio de documentación

Sitio estático (VitePress) con la arquitectura y requerimientos del backend BackOffice de la Plataforma Gamificada.

## Requisitos

- Node.js 18+

## Comandos

```bash
npm install        # instalar dependencias
npm run docs:dev   # servidor local con hot-reload (http://localhost:5173)
npm run docs:build # build estático en docs/.vitepress/dist
npm run docs:preview # previsualizar el build
```

## Despliegue en GitHub Pages

El repo ya tiene el workflow `.github/workflows/deploy-pages.yml`. Para publicarlo:

1. Creá un repo en GitHub (ej. `backoffice-docs`, público).
2. Conectá el repo local:
   ```bash
   git remote add origin https://github.com/<TU-USUARIO>/backoffice-docs.git
   git branch -M main
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. La primera corrida del workflow publica el sitio en `https://<TU-USUARIO>.github.io/backoffice-docs/`. Cada `git push` a `main` lo actualiza solo.

> El `base` de VitePress se ajusta automáticamente con `VITEPRESS_BASE` (seteado por el workflow). En local no se setea → funciona como `/`.

## Despliegue rápido (Netlify Drop)

Si querés una URL al instante sin git: andá a https://app.netlify.com/drop y arrastrá la carpeta `docs/.vitepress/dist`.

## Estructura

```
docs-site/
├── docs/
│   ├── .vitepress/config.mjs     ← navegación, sidebar, plugin mermaid
│   ├── public/logo.svg
│   ├── index.md                  ← home
│   ├── resumen.md
│   ├── requerimientos/{funcionales,no-funcionales}.md
│   ├── arquitectura/{vista-general,microservicios,comunicacion,carpetas}.md
│   ├── datos/modelo.md
│   ├── api/endpoints.md
│   ├── decisiones/adr.md
│   ├── riesgos.md
│   ├── trazabilidad.md
│   ├── equipos/ownership.md
│   └── frontend/casos.md
└── package.json
```

## Notas

- Los diagramas mermaid se renderizan en el navegador (plugin `vitepress-plugin-mermaid`).
- Documentos fuente en la carpeta raíz del proyecto: `backoffice_backend_requerimientos_arquitectura.md`, `frontend_arquitectura_analisis.md`, `BackOffice Resumen Visual.md`.