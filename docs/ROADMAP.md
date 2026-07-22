# Roadmap del Proyecto

Este documento define las fases de desarrollo de la Plataforma Institucional JS. Ninguna fase debe iniciarse sin que la anterior haya cumplido sus objetivos y criterios de aceptación.

## Fase 1: Fundamentos y Diseño
**Objetivo**: Establecer la base tecnológica, la documentación arquitectónica y la estructura visual del sistema.
- [ ] Configuración inicial del repositorio (pnpm, Astro, TypeScript, ESLint, Prettier).
- [ ] Redacción de la Documentación Arquitectónica (`/docs`).
- [ ] Desarrollo del Design System en Tailwind (Tokens, Colores, Tipografía).
- [ ] Implementación del Layout base (Sidebar, Header, Grilla base).
- [ ] Sistema de Navegación escalable.
- **Criterio de éxito**: Repositorio limpio con reglas de linting estrictas y layout base renderizando a 60fps sin errores, 100% responsivo.

## Fase 2: Core de Identidad
**Objetivo**: Construir el motor de autenticación y la estructura de sesiones.
- [ ] Modelo de usuarios en base de datos.
- [ ] Flujos de Autenticación (Login, Recuperación, Cambio de credenciales).
- [ ] Gestión de Sesiones seguras (Cookies HttpOnly, CSRF, rotación de tokens).
- [ ] Modelo organizacional (Reflejo de estatutos: Nacional, Regional, etc.).
- **Criterio de éxito**: Un usuario puede iniciar sesión de forma segura, el sistema reconoce su identidad y su ubicación dentro de la estructura orgánica.

## Fase 3: Autorización y Control
**Objetivo**: Implementar el control de acceso y monitoreo del sistema.
- [ ] Motor de Permisos Basado en Políticas (PBAC).
- [ ] Middleware de validación de contexto (Territorio, Acción, Recurso).
- [ ] Sistema de Auditoría (Log inmutable de acciones críticas).
- [ ] Panel Administrativo Core (Gestión de usuarios y políticas).
- **Criterio de éxito**: Es imposible acceder a una ruta protegida o ejecutar una acción sin que la política específica lo permita y quede registrado en el log de auditoría.

## Fase 4: Módulos de Información y Gestión
**Objetivo**: Proveer las herramientas de consumo diario para la militancia.
- [ ] Módulo Biblioteca (Repositorio documental estructurado).
- [ ] Módulo Noticias (Boletín oficial, comunicados).
- [ ] Módulo Agenda (Calendario orgánico, hitos).
- [ ] Sistema de clasificación documental (Público, Interno, Reservado, Confidencial).
- **Criterio de éxito**: Los documentos y noticias pueden ser creados, clasificados por seguridad y leídos solo por quienes tienen autorización territorial/orgánica.

## Fase 5: Interactividad Estructurada
**Objetivo**: Permitir la recolección de datos y procesos administrativos internos.
- [ ] Constructor de formularios dinámicos.
- [ ] Motor de flujos de aprobación (ej. fichaje, votaciones simples, encuestas).
- [ ] Exportación segura de resultados.
- **Criterio de éxito**: Un administrador puede crear un formulario para un evento, limitar quién puede responderlo y extraer los datos de forma estructurada y auditada.

## Fase 6: Formación Política
**Objetivo**: Desplegar el espacio educativo de la Juventud.
- [ ] Módulo Escuela de Formación (Arquitectura de Cursos, Módulos, Materiales).
- [ ] Trazabilidad de progreso formativo.
- [ ] Evaluación y validación de conocimientos.
- **Criterio de éxito**: Un militante puede inscribirse en un curso, consumir sus módulos ordenadamente y registrar su progreso en su ficha de vida militante.

## Fase 7: Inteligencia Orgánica
**Objetivo**: Proveer herramientas de toma de decisiones a las direcciones.
- [ ] Módulo Analíticas.
- [ ] Dashboards de crecimiento y participación territorial.
- [ ] Reportes de actividad del sistema.
- **Criterio de éxito**: Direcciones pueden visualizar mapas de calor, estadísticas de retención y métricas de formación en tiempo real bajo estrictos permisos.

## Fase 8: Endurecimiento y Salida a Producción
**Objetivo**: Preparar el sistema para un entorno hostil y asegurar alta disponibilidad.
- [ ] Optimización de rendimiento (Caching, compresión de assets).
- [ ] Auditoría de seguridad avanzada (Pen-testing interno, rate limiting agresivo, WAF).
- [ ] Implementación de 2FA obligatorio para perfiles de alto rango.
- [ ] Despliegue en infraestructura definitiva (CI/CD, Backups automatizados).
- **Criterio de éxito**: La plataforma es impenetrable por ataques comunes, los tiempos de carga son ínfimos y existe un plan de contingencia y recuperación ante desastres probado.
