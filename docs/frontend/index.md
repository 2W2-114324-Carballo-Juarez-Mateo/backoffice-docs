# Frontend

> Materia **Front** · Estado: **plan definido (Caso A)** — apps Angular SSR + Nginx + BFF por experiencia, alineado a la consigna de Arquitectura y Despliegue (Unidad 1).

El frontend de la plataforma sigue la postura del grupo (**Caso A**). Para el **BackOffice** el plan queda definido en las páginas de esta sección: la app admin es Angular SSR, el BFF de BackOffice es del equipo, y el despliegue usa Nginx (servidor web + reverse proxy) con build Docker en dos etapas.

## Contenido de esta sección

| Página | Qué contiene |
|---|---|
| [Casos A/B — postura del grupo](/frontend/casos) | Caso A (apps Angular SSR + Nginx) vs Caso B (Shell + librerías) y por qué elegimos A |
| [Plan de comunicación](/frontend/comunicacion) | Decisiones: BFF por experiencia, Custom Events, contrato de sesión, `@tup/ui`, Nginx, single-flight/429, marketplace |
| [Arquitectura y despliegue](/frontend/arquitectura-despliegue) | **BackOffice**: Nginx (web + reverse proxy + deep-links), BFF, conexiones con microservicios, Docker 2 etapas, `envsubst`, load balancing y estrategia de despliegue |

## Estado

- **Plan de frontend:** definido (Caso A) + detalle de despliegue del BackOffice.
- **Detalle operativo:** ver [Arquitectura y despliegue](/frontend/arquitectura-despliegue).