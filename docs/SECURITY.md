# Políticas de Seguridad

La Plataforma maneja información política, personal y estratégica crítica. Toda decisión de ingeniería debe presumir que el entorno es hostil y que el sistema estará sujeto a intentos de vulneración.

## Filosofía Principal: Zero Trust (Confianza Cero)
El sistema **nunca** asume que un usuario o una petición es segura por el simple hecho de estar dentro de la red o por poseer una sesión válida. Cada petición, de cada módulo, debe verificar identidad, contexto y permisos antes de tocar la base de datos o el sistema de archivos.

## Pilares de Seguridad

### 1. Mínimo Privilegio
Todo usuario inicia con privilegios nulos (Deny por defecto). Los accesos deben ser explícitamente otorgados por el motor de políticas. Si una política no aprueba explícitamente una acción, se deniega.

### 2. Gestión de Sesiones
- **Cookies HttpOnly**: Los tokens de sesión jamás deben ser legibles vía JavaScript (`HttpOnly`, `Secure`, `SameSite=Strict`).
- **Rotación y Caducidad**: Las sesiones tienen tiempos de expiración estrictos. Inactividad prolongada obliga a re-autenticación.
- **Revocación**: Debe existir la capacidad técnica para invalidar globalmente la sesión de cualquier militante desde el panel administrativo (ej. en caso de pérdida de dispositivo).

### 3. Autenticación Robusta
- **Protección contra Fuerza Bruta**: Límite de intentos de login por IP y por cuenta (Rate Limiting).
- **2FA (Autenticación de Dos Factores)**: Obligatorio para usuarios con cargos de Dirección Nacional, Regional o Administradores de Sistema.

### 4. Mitigación de Vectores de Ataque Comunes
- **CSRF**: Toda mutación de estado (POST, PUT, DELETE) requiere validación de token Anti-CSRF.
- **XSS**: Sanitización estricta de cualquier entrada de texto (especialmente en Foros, Noticias y Formularios). Astro escapa por defecto, pero se requiere vigilancia extra al procesar Markdown o HTML.
- **Inyección SQL**: El uso de un ORM moderno previene SQLi tradicional. Prohibida la interpolación cruda de strings en consultas.

### 5. Registro y Auditoría (Audit Log)
- Toda acción que cree, modifique, elimine datos, o eleve privilegios, debe registrarse.
- Formato del log: `Actor (User ID)` + `Acción (Update)` + `Recurso (Documento ID)` + `Contexto (IP, User-Agent, Timestamp)` + `Resultado (Success/Fail)`.
- El log es **append-only** (solo inserción). Ningún administrador del sistema puede modificar el log de auditoría desde la aplicación.

## Sistema de Clasificación Documental
Todo archivo o registro sensible en la plataforma (Documentos de Biblioteca, Acuerdos, Resoluciones) debe nacer con un nivel de clasificación obligatorio:

1. **Público**: Acceso libre para cualquier usuario autenticado en la plataforma. (Ej. Comunicados generales, Historia de la JS).
2. **Interno**: Acceso restringido al territorio u orgánica de pertenencia. (Ej. Minuta de una reunión comunal solo visible por dicha comuna).
3. **Reservado**: Acceso limitado a roles de dirección de un territorio o nivel jerárquico específico. (Ej. Padrones locales, estrategias de campaña).
4. **Confidencial**: Acceso nominal estricto, altamente encriptado (Encryption at Rest). Solo accesible por la Mesa Nacional, Tribunal Supremo, o personas específicamente designadas en la política de acceso de dicho documento.

*Regla: Documentos Reservados y Confidenciales deben almacenarse en buckets privados y ser servidos a través de presigned URLs temporales (expiración < 5 min).*
