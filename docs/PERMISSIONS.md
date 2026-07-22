# Sistema de Permisos (PBAC)

La plataforma utiliza un modelo de control de acceso basado en políticas (Policy-Based Access Control - PBAC), abandonando los modelos primitivos basados en roles estáticos (RBAC) estilo `if (user.role === 'admin')`.

## ¿Por qué PBAC?
En una organización política, los permisos son altamente contextuales. El *Presidente Comunal de Valparaíso* tiene permisos de edición (admin) sobre el padrón de *Valparaíso*, pero es un simple espectador (o no tiene acceso) al padrón de *Viña del Mar*. Un rol duro de "Admin" no puede modelar esto sin crear una explosión de roles como `Admin_Valparaiso`, lo cual es inmanejable.

## Componentes de una Evaluación de Política
Cada vez que un usuario intenta realizar una acción, el motor PBAC (ubicado en el Core) evalúa la solicitud basándose en seis pilares:

1. **Usuario (Subject)**: ¿Quién está intentando hacer esto?
2. **Cargo (Role/Assignment)**: ¿Bajo qué cargo activo está operando en este momento?
3. **Contexto (Context)**: Atributos de la petición (IP, Hora, Estado del sistema, Nivel de Autenticación 2FA).
4. **Territorio/Estructura (Scope)**: ¿A qué segmento orgánico pertenece esta solicitud? (Nacional, Comunal X, Frente Y).
5. **Acción (Action)**: ¿Qué verbo intenta ejecutar? (Leer, Crear, Publicar, Eliminar, Auditar).
6. **Recurso (Resource)**: ¿Sobre qué objeto actúa? (Un Documento Confidencial, un Foro, el Perfil de otro usuario).

## Flujo de Validación de Permisos

El pseudo-código abstracto de evaluación se ve así:

```typescript
const isAllowed = await PolicyEngine.evaluate({
  subject: currentUser.id,
  action: "publish",
  resource: "news_article",
  scope: { type: "region", id: "valparaiso" },
  context: currentRequest.context
});

if (!isAllowed) throw new ForbiddenError();
```

## Definición de Políticas (Policies)
Las políticas se almacenan en la base de datos y pueden ser editadas por la Dirección Nacional (o el Administrador del Sistema). 

**Ejemplo de una Política en formato lógico**:
> "PERMITIR [Acción: Evaluar Formulario] 
> SOBRE [Recurso: Ficha de Inscripción]
> SI [Cargo: Secretario de Organización] 
> Y [El Territorio del Usuario == El Territorio de la Ficha de Inscripción]"

## Antipatrones Prohibidos en el Código
- ❌ `if (user.isAdmin) { ... }` (Nunca usar validaciones booleanas globales).
- ❌ `if (user.role === "presidente") { ... }` (El nombre del cargo nunca se hardcodea).
- ❌ Dar acceso total de lectura (List/Read) a todos los usuarios autenticados sin verificar si el recurso tiene una etiqueta de seguridad 'Reservada' o 'Confidencial'.
