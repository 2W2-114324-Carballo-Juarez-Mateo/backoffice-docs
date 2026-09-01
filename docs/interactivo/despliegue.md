# Despliegue del Frontend (CI/CD + Docker + Nginx)

Cada `git push` dispara el pipeline: **build en 2 etapas** (`node:20` → `nginx:alpine`), push de la imagen y deploy del compose. Nginx se configura con **`envsubst`** (misma imagen para staging/producción) y la liberación usa **Rolling Update + Feature Flags**.

<ScenarioPage name="despliegue" />

> Detalle completo: [Arquitectura y despliegue](/frontend/arquitectura-despliegue) · SDD `sdd/frontend/docs/09-despliegue.md`.