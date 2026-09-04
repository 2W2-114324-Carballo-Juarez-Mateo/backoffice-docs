# Rol del equipo BackOffice — BFF por experiencia

> **Decisión del equipo** frente a la clase (consigna: definición de roles por grupo). Proponemos **implementar el BFF por experiencia** (el BFF del BackOffice es nuestro) y **un estándar de BFF de plataforma** para coordinar con los demás equipos.

## 1. Qué rol asumimos

| Rol de la consigna | Postura del equipo BackOffice |
|---|---|
| **Implementación del BFF** | ✅ **Nuestro rol**: el **BFF BackOffice** (patrón Backend for Frontend) es del equipo BackOffice, de la materia **Front**. Además proponemos un **estándar de BFF de plataforma** para que los 3 BFF (BackOffice, Alumno, Profesor) sean consistentes. |
| **Librería compartida** (`@tup/ui`, `@tup/contracts`) | Proponemos **coordinar la asignación en clase**. Aportamos los **contratos OpenAPI/tipos** que generamos (los consumimos como productores de API). |
| **Marketplace de skills** | Proponemos **coordinar la asignación en clase**. El BackOffice lo **consume** (configuración de agentes/plugins), no es dueño del marketplace. |

## 2. Estándar de BFF de plataforma (propuesta)

Cualquier BFF de la plataforma (Caso A) debe cumplir:

1. **Una sola respuesta por pantalla**: agrega las respuestas de los microservicios que la pantalla necesita.
2. **Cookie → contexto**: recibe la cookie httpOnly, valida en **Identity (T01)** y arma el contexto (usuario, rol, alcance).
3. **Sirve datos al SSR**: la misma fuente server/client → sin *hydration mismatch*.
4. **Sin reglas de negocio**: solo orquesta y adapta contratos (no duplica lógica de dominio).
5. **El front nunca toca la base ni Kafka**; el BFF resuelve el **multitenancy** (alcance curso puntual o `ALL`).

## 3. Tabla rol → entregable → dependencias

| Rol | Entregable del BackOffice | De quién depende |
|---|---|---|
| BFF BackOffice | Endpoints por pantalla agregados (`/panel`, `/reportes`, `/config`, `/proveedor-llm`) | Identity (T01), Administration, Reporting, Matrícula (T02) |
| Estándar BFF (propuesta) | Convención de BFF para los 3 equipos de Front | Coordinación en clase |
| Contratos OpenAPI | API de Administration y Reporting documentadas | Swagger/OpenAPI |

> Ver también: [Frontend — Arquitectura y despliegue](/frontend/arquitectura-despliegue) y el SDD `sdd/frontend/docs/02-bff.md`.