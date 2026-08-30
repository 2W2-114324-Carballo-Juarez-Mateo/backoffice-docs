# Ownership entre equipos

> Según `TUP_PIV_BE_PROPUESTA_ARQ.pdf` la plataforma se divide en **12 temas**. El Backoffice es el **Tema 12** y es **consumidor puro**: tiene 2 servicios propietarios y consume/lee el resto.

## Matriz de ownership por tema

| Tema | Dominio | Rol del Backoffice |
|---|---|---|
| **T12 (Backoffice)** | Administración de plataforma · **PAR-01..24** · proveedor LLM (exclusiva ADMIN) · reportes docentes · panel del profesor (alumno en riesgo) · métricas CSAT · exportación · alertas | **Propietario (2 servicios)** |
| **T01** | Identidad, auth, 2FA, roles, token, sesión, **auditoría**, retención, **API Gateway** | **Consume** (auth/autorización/auditoría; gateway de plataforma) |
| **T02** | Cursos y Matrícula (curso-cohorte, padrón, invitación) | **Consume** (cohorte `course_id`, pertenencia docente) |
| T03 | Motor de Desafíos | Solo lectura |
| T04 | Teóricos y Encuestas | Solo lectura (agregados anónimos) |
| T05 | Desafíos Prácticos | Solo lectura |
| T06 | Sandbox/Runtime | — |
| T07 | Evaluación LLM | Solo lectura (consume config de proveedores que administramos) |
| T08 | Banco | Solo lectura |
| T09 | Mercado | — |
| T10 | Roadmap y Progreso | Solo lectura |
| T11 | Social y Notificaciones | — |

> Regla "cada entidad tiene un único dueño": matriz a acordar en la sesión de integración.

## Contratos cross-team (dependencias críticas)

### 1. Configuración de proveedores de modelo → T07 (Evaluación LLM)
- **Mecanismo:** evento `ModelProviderChanged` / `GlobalConfigurationChanged` en `administration.events`.
- **Regla:** solo ADMIN puede cambiarla (RF-IA-35).

### 2. Parámetros de economía → los aplican T03, T05, T08, T10
- **Mecanismo:** evento `GlobalConfigurationChanged` (`{key, value, version}`); esos temas leen la configuración (no la hardcodean).
- **Regla:** cambios hacia adelante (RF-CFG-06).

### 3. Contratos de lectura del Backoffice (consumidor puro)
- **Mecanismo:** Reporting & Analytics lee de los temas **02, 04, 05, 07, 08, 10** (eventos/APIs a través del gateway) para read models. **Sin esos contratos en el sprint 1 no hay nada demostrable.**
- **Encuestas:** solo agregados anónimos (RF-ENC-04/12).

### 4. Autorización y auditoría
- **Auth/autorización:** el gateway (T01) valida el token y propaga contexto; la decisión la toma el servicio dueño de la regla (*validar ≠ autorizar*).
- **Auditoría:** el Backoffice emite eventos de auditoría; T01 los persiste.

> **Convención de eventos:** todos siguen `{eventId, eventType, occurredAt, correlationId, actorId, source, payload}`, con contrato versionado.