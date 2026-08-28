---
layout: home

hero:
  name: "BackOffice"
  text: "Backend administrativo de la Plataforma Gamificada"
  tagline: "Configuración, roles, permisos, auditoría y reporting · Java + Spring · Microservicios"
  actions:
    - theme: brand
      text: Ver resumen
      link: /resumen
    - theme: alt
      text: Arquitectura
      link: /arquitectura/vista-general
    - theme: alt
      text: Requerimientos
      link: /requerimientos/funcionales

features:
  - icon: 🧩
    title: 5 microservicios
    details: Identity & User, Course & Content, Configuration, Audit y Reporting. Base de datos por servicio.
  - icon: 🔐
    title: Seguridad por diseño
    details: JWT + 2FA, autorización en Gateway y en cada servicio, protección del último ADMIN.
  - icon: 📡
    title: REST + eventos
    details: Comunicación síncrona para consultas y eventos RabbitMQ con Outbox e idempotencia para el resto.
  - icon: 🧭
    title: Frontend por definir
    details: Caso A (apps Angular SSR + Nginx) como postura del grupo. Ver sección Frontend.
---

## Alcance

Este sitio documenta el **backend del módulo BackOffice**: la parte administrativa que usan ADMIN y PROFESOR. El frontend está **por definir** por los docentes.

> Documentos fuente: `backoffice_backend_requerimientos_arquitectura.md` (detalle completo) · `frontend_arquitectura_analisis.md` (postura frontend) · `Explicacion General.md` (PRD oficial).