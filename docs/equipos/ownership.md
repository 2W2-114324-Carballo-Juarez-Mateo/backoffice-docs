# Ownership entre equipos

> La clase se dividió por módulos (microservicios). Cada módulo tiene un **dueño**. Este sitio cubre el **BackOffice**, pero varios dominios son tocados por equipos vecinos: definir fronteras evita que dos equipos implementen lo mismo.

## Matriz de ownership (borrador para coordinar)

| Servicio / Dominio | Dueño | Alcance BackOffice |
|---|---|---|
| Identity & Auth (login, 2FA, roles, ADMIN) | **BackOffice** | Propietario completo |
| User (datos, legajo, avatar) | a definir | BackOffice consulta/administra según PRD |
| Course (cursos, roadmap, padrón, estados) | a definir | BackOffice administra curso + padrón + transiciones |
| Challenge (desafíos) | a definir | BackOffice crea/consulta desafíos del dominio |
| Configuration (PAR-01..18) | **BackOffice** | Propietario completo |
| Audit | **BackOffice** | Propietario completo |
| Reporting / Analytics | **BackOffice** | Propietario (read models) |
| Gamification (XP, monedas, vidas) | equipo Gamificación | BackOffice **no implementa**, solo configura PAR |
| Ranking / Cierre académico | equipo Ranking | BackOffice consume al archivar |
| AI Service | equipo IA | BackOffice **no implementa**; consume calibración |
| Communication (chat) | equipo Comunicación | BackOffice no implementa; reacciona a eventos |

> **Importante:** acordar esta matriz con los demás equipos antes de la defensa.

## Contratos cross-team (dependencias críticas)

### 1. Activación de curso exige calibración de IA (RF-CUR-08b, RF-IA-36)

- **Dependencia:** Course Service (BackOffice) → AI Service (equipo IA).
- **Mecanismo:** consulta síncrona REST al activar.
- **Regla:** sin calibración aprobada → el curso NO pasa de `draft` a `activo`. No existe override.

### 2. Archivado exige cero scores IA pendientes (RF-IA-34)

- **Dependencia:** Course Service → AI Service.
- **Mecanismo:** consulta síncrona al archivar.
- **Regla:** con scores pendientes → se bloquea el archivado.

### 3. Parámetros de economía consumidos por Gamification (RF-CFG-04)

- **Dependencia:** Configuration Service (BackOffice) → Gamification Service.
- **Mecanismo:** evento `GlobalConfigurationChanged` (payload: `{key, value, version}`) publicado en el topic `configuration.events` de Kafka.
- **Regla:** los cambios rigen solo hacia adelante (RF-CFG-06).

### 4. Cierre de curso consume estado académico (RF-RNK-10/13)

- **Dependencia:** Course Service → Ranking Service.
- **Mecanismo:** BackOffice emite `CourseArchived`; Ranking reacciona.

### 5. Reporting consume eventos de todos los dominios

- Reporting (BackOffice) consume eventos de Gamification, Challenge, Ranking, Survey para read models, sin acceder a sus bases.

> **Convención de eventos:** todos siguen `{eventId, eventType, occurredAt, correlationId, actorId, source, payload}`, con contrato versionado.