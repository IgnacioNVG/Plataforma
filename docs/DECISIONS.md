# Registro de Decisiones de Arquitectura (ADR)

Este documento centraliza todas las decisiones arquitectónicas importantes tomadas durante la vida del proyecto. Nos permite recordar el "por qué" detrás de las elecciones técnicas.

### Herramientas principales elegidas (Frontend)
- **Astro**: Por su rendimiento, arquitectura de islas y soporte para colecciones de contenido estáticas.
- **Tailwind CSS**: Para el sistema de diseño brutalista basado en variables CSS strictas.

### Decisiones de Arquitectura Backend (2026-07-22)
- **Astro Server (SSR)**: La aplicación corre sobre Node.js Adapter de Astro para soportar protección de rutas por sesión, manejo dinámico de cookies y middleware (`output: 'server'`).
- **Base de Datos y ORM (Drizzle)**: Se escogió PostgreSQL. Para interactuar con la DB se utilizará **Drizzle ORM** debido a su ligereza, tipado estricto en TS y ausencia de un motor pesado (como en Prisma), manteniéndose agnóstico del proveedor de Postgres (Supabase, Neon, AWS o local).
- **Autenticación (Lucia Auth)**: Se optó por **Lucia Auth** como núcleo de autenticación. Razones: se abstrae completamente del proveedor, conecta nativamente con Drizzle, gestiona las cookies seguras (`HttpOnly`) a bajo nivel y se alinea con la filosofía de independencia descrita en `INFRASTRUCTURE.md`.

Formato para nuevos registros:
---
## ADR [Número]: [Título corto]
**Fecha:** [YYYY-MM-DD]
**Problema:** [Descripción breve del desafío o requerimiento]
**Alternativas consideradas:** [Lista de opciones evaluadas]
**Decisión adoptada:** [Qué elegimos hacer]
**Justificación:** [Razones por las que esta opción es la mejor frente a nuestros principios de seguridad, modularidad, etc.]
**Consecuencias:** [Positivos y negativos o compromisos adquiridos tras esta decisión]
---

## ADR 001: Adopción de Architecture-First y Modularidad Estricta
**Fecha:** 2026-07-22
**Problema:** Los sistemas políticos suelen degenerar en monolitos frágiles (espagueti de código) donde un error en el módulo de noticias impide que el sistema de autenticación funcione o donde permisos cruzados causan filtraciones de datos orgánicos sensibles.
**Alternativas consideradas:** 
- Arquitectura Monolítica tradicional MVC (Ej. Rails, Laravel, Django convencional).
- Microservicios distribuidos.
- Arquitectura Modular con un "Core" estricto.
**Decisión adoptada:** Arquitectura Modular con Core aislado.
**Justificación:** Los microservicios añaden complejidad de infraestructura innecesaria y costosa para una organización que requiere estabilidad y bajo costo. Un monolito tradicional acopla la lógica política (muy cambiante) a la lógica de seguridad (que no debe cambiar). El enfoque de Core + Módulos permite tener la simplicidad de un único código base con la seguridad y robustez del aislamiento lógico. Si falla la "Biblioteca", la "Identidad" sigue intacta.
**Consecuencias:** 
- Positivas: Código altamente mantenible. Auditoría centralizada garantizada. Se puede delegar la creación de un módulo a diferentes desarrolladores sin comprometer la seguridad central.
- Negativas (Compromisos): Curva de aprendizaje inicial para respetar las barreras arquitectónicas. Exige un diseño riguroso de interfaces entre el Core y los Módulos.

## ADR 002: Modelo Organizacional Dinámico en vez de Hardcodeado
**Fecha:** 2026-07-22
**Problema:** Los congresos políticos modifican la estructura de las organizaciones frecuentemente (ej. crear un "Frente X", o cambiar de "Secretario General" a "Coordinador General"). Hardcodear estos roles (`if role === "secretario_general"`) obligaría a modificar el código y redesplegar tras cada congreso.
**Alternativas consideradas:** 
- Roles rígidos en base de datos sincronizados con Enum en código.
- Asignaciones nominales atadas dinámicamente a Entidades Territoriales y de Estructura.
**Decisión adoptada:** Modelo dinámico de Asignaciones (Assignments) donde los roles son filas modificables en la base de datos (Entidades: Territorio, Estructura, Cargo, Asignación de Cargo).
**Justificación:** Se garantiza una longevidad operativa de la plataforma de décadas sin requerir programadores para actualizar la orgánica.
**Consecuencias:**
- La resolución de permisos requerirá un motor de evaluación más inteligente (PBAC) que cruce la asignación del usuario con el contexto del recurso.

## ADR 003: Policy-Based Access Control (PBAC)
**Fecha:** 2026-07-22
**Problema:** Un modelo basado en Roles (RBAC) es insuficiente. Un "Presidente Regional" de Valparaíso y uno del Biobío tienen el mismo rol, pero no pueden acceder a los mismos recursos orgánicos territoriales.
**Alternativas consideradas:**
- RBAC con Roles anidados (ej. Role: `Presidente_Valparaiso`).
- ABAC (Attribute-Based Access Control).
- PBAC (Policy-Based Access Control) cruzando Identidad, Atributos Orgánicos y Contexto.
**Decisión adoptada:** Implementación de PBAC nativo en el Core.
**Justificación:** Permite expresar reglas naturales y altamente legibles, ej: "Permitir publicar si Usuario.Territorio == Recurso.Territorio". Las reglas de RBAC explotarían a miles de roles; PBAC es conciso e impenetrable si se diseña correctamente por defecto (Default Deny).
**Consecuencias:** Implica construir o integrar un motor evaluador de políticas en el backend, añadiendo milisegundos de overhead computacional al verificar accesos, mitigables mediante uso eficiente de la base de datos.
