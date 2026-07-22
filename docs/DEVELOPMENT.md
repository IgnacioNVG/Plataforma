# Guía de Desarrollo (Development Guidelines)

Toda aportación de código al proyecto debe someterse a estas reglas inquebrantables para asegurar la mantenibilidad a largo plazo por distintos equipos de trabajo.

## 1. Stack Tecnológico Obligatorio
- **Runtime & Paquetes**: Node.js (LTS), gestión estricta con `pnpm`. Prohibido usar `npm` o `yarn` en el entorno local para evitar desincronización del `pnpm-lock.yaml`.
- **Framework**: `Astro`. Aprovechar su arquitectura en islas y HTML estático para vistas de solo lectura.
- **Componentes Reactivos**: Si se requiere estado complejo en el cliente (Foros, Formularios dinámicos), utilizar componentes framework-agnostic o preferentemente React integrados vía Astro.
- **Estilos**: `Tailwind CSS v4`. Prohibido escribir CSS tradicional (archivos `.css` sueltos) excepto el archivo de capa base y variables (Design System tokens).

## 2. Tipado Estricto (TypeScript)
- `strict: true` en `tsconfig.json` no es negociable.
- Prohibido el uso de `any`. Si un tipo es desconocido, usar `unknown` y estrechar (type narrowing).
- Todo contrato de base de datos o API debe tener interfaces o tipos explícitamente definidos y exportados.

## 3. Calidad y Formateo
- **ESLint & Prettier**: Obligatorios. Ningún commit debe pasar si no cumple las reglas del linter. Configurar formateo al guardar (Format on Save) en el editor.
- **Sin Código Muerto**: Imports no utilizados o funciones comentadas (comentarios de código antiguo) deben borrarse antes del commit.
- **Cero Duplicación de Código**: Si un fragmento lógico o visual (como una Tarjeta Brutalista o la lógica de validación del RUT) se usa más de dos veces, DEBE abstraerse en un componente o función de utilidad.

## 4. Filosofía de Commits y Trabajo
- **Commits Pequeños y Atómicos**: Cada commit debe hacer solo una cosa (arreglar un bug, crear un componente). Formato de mensajes estándar (Convencional Commits: `feat:`, `fix:`, `docs:`, `refactor:`).
- **PRs (Pull Requests)**: Ningún código sube a la rama principal (main/master) directamente. Todo pasa por revisión.

## 5. Diseño de Componentes
- **Dumb Components**: Los componentes UI (Botones, Tarjetas, Inputs) no hacen peticiones de red ni conocen la lógica de negocio. Solo reciben `props` y emiten eventos.
- **Smart Components / Paginas**: La extracción de datos (fetch) y evaluación de permisos (PBAC) ocurre a nivel de la ruta (`src/pages/*.astro` o controladores de API).

## 6. Seguridad en el Código
- Jamás registrar datos sensibles (passwords, tokens) en `console.log`.
- No incluir claves secretas o tokens de APIs en el código fuente. Utilizar variables de entorno (`.env`) e inyectarlas apropiadamente.
- Todas las validaciones de datos recibidos del cliente deben hacerse siempre del lado del servidor utilizando librerías robustas (ej. Zod), asumiendo que el frontend puede ser bypasseado.
