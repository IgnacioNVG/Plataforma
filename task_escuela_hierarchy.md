# Tareas: Reestructuración Escuela de Formación

- `[x]` 1. **Base de Datos**: 
    - Añadir tabla `schoolTable` en `src/db/schema.ts`.
    - Modificar `courseTable` para añadir `schoolId` como FK.
    - Eliminar/Recrear base de datos de pruebas local y remoto.
- `[x]` 2. **Rutas Públicas (Estudiantes)**:
    - Modificar `/escuela/index.astro` para listar Escuelas a las que se está inscrito + Progreso.
    - Modificar `/escuela/catalogo.astro` para mostrar lista de Escuelas (en vez de cursos).
    - Crear `/escuela/escuela/[schoolId]/index.astro` para listar Cursos de una Escuela.
    - Actualizar `/escuela/curso/[courseId]/index.astro` (Sílabo).
    - Actualizar `/escuela/curso/[courseId]/modulo/[moduleId].astro` (Lector).
- `[x]` 3. **Rutas Administrativas (Gestores)**:
    - Reestructurar `/admin/escuela/` a `[schoolId]`.
    - Crear CRUD de Escuela (`/admin/escuela/crear`, `/admin/escuela/[schoolId]/editar`).
    - Mover vistas de curso a `/admin/escuela/[schoolId]/cursos/crear` y `/admin/escuela/curso/[courseId]/editar`.
    - Mover vistas de módulo.
- `[x]` 4. **Despliegue y Verificación**:
    - Generar migraciones D1 (`npm run db:generate` y `npm run db:migrate:local/remote`).
    - Desplegar cambios en Cloudflare (`npm run deploy`).
