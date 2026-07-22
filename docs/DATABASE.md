# Modelo de Base de Datos (Conceptual)

El modelo de datos prioriza la integridad referencial y la trazabilidad. A continuación se presentan las entidades principales agrupadas lógicamente.

## 1. Esquema CORE: Identidad y Seguridad

### Entidad: `User` (Usuario/Militante)
- `id` (PK)
- `email` (Unique, encriptado)
- `rut` (Unique, hash opcional)
- `first_name`, `last_name`
- `status` (Active, Suspended, Archived)
- `created_at`, `updated_at`, `last_login`

### Entidad: `Session`
- `id` (PK)
- `user_id` (FK)
- `refresh_token_hash`
- `ip_address`, `user_agent`
- `expires_at`
- `is_revoked` (Boolean)

### Entidad: `AuditLog`
- `id` (PK)
- `actor_id` (FK -> User)
- `action` (Enum: CREATE, UPDATE, DELETE, LOGIN, EXPORT...)
- `resource_type` (String: "Document", "UserRole", "News")
- `resource_id` (String)
- `context_ip`
- `timestamp`

---

## 2. Esquema ORG: Estructura Organizacional

### Entidad: `Territory` (Región, Comuna)
- `id` (PK)
- `type` (Enum: Nacional, Regional, Provincial, Comunal)
- `name`
- `parent_id` (FK -> Territory, jerarquía en árbol)

### Entidad: `Structure` (Frentes, Comisiones)
- `id` (PK)
- `type` (Enum: Front, Commission, Dept)
- `name`
- `description`

### Entidad: `Role` (Cargo Nominal)
- `id` (PK)
- `name` (Ej: "Secretario General")
- `scope_type` (Enum: Territory, Structure)

### Entidad: `UserAssignment` (Asignación de cargos)
- `id` (PK)
- `user_id` (FK -> User)
- `role_id` (FK -> Role)
- `territory_id` (FK -> Territory, Nullable si es transversal)
- `structure_id` (FK -> Structure, Nullable si es territorial)
- `start_date`
- `end_date` (Nullable)
- `status` (Active, Historic)

---

## 3. Esquema PBAC: Autorización

### Entidad: `Policy`
- `id` (PK)
- `name` (Ej: "Solo secretarios publican noticias regionales")
- `action_target` (Ej: "news:publish")
- `conditions_json` (Reglas lógicas evaluables por el motor)
- `effect` (Allow, Deny)

---

## 4. Esquema CONTENT: Módulos

### Entidad: `Document` (Biblioteca)
- `id` (PK)
- `title`
- `description`
- `file_url`
- `security_level` (Enum: Public, Internal, Reserved, Confidential)
- `author_id` (FK -> User)
- `uploaded_at`

### Entidad: `NewsArticle` (Noticias)
- `id` (PK)
- `title`, `slug`, `content_md`
- `author_id` (FK -> User)
- `territory_scope_id` (FK -> Territory, Nullable para alcance nacional)
- `published_at`

*Nota: Entidades para Escuela, Foros y Formularios se diseñarán detalladamente en su respectiva fase. Se mantendrán en tablas lógicamente separadas, referenciando siempre a `User` en el Core.*
