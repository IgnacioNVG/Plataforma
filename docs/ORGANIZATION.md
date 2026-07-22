# Modelo Organizacional

El modelo organizacional de la plataforma no debe ser hardcodeado (codificado rígidamente en el software). La estructura de la Juventud Socialista de Chile es dinámica; los nombres de los cargos, frentes y comisiones pueden cambiar tras cada Congreso General. Por lo tanto, el sistema debe ser capaz de modelar una jerarquía flexible.

## Entidades Estructurales

### 1. Territorios (Niveles Administrativos)
Definen la geografía política del usuario.
- **Nacional**: Alcance completo sobre toda la estructura.
- **Regional**: Alcance limitado a una región administrativa.
- **Provincial**: (Opcional o utilizado según requerimiento orgánico).
- **Comunal**: La base territorial fundamental. Un usuario pertenece primordialmente a una base comunal.

### 2. Estructuras Transversales
Entidades que agrupan usuarios independientemente (o de forma paralela) a su territorio.
- **Frentes de Masas**: Ej. Frente Estudiantil, Frente Sindical, Frente Secundario.
- **Comisiones**: Grupos de trabajo específicos (ej. Comisión de Educación, Comisión Organizadora de Congreso).

### 3. Cargos y Roles (Assignments)
Un "Cargo" es un título nominal que otorga un conjunto de capacidades dentro de un límite (Contexto).
- **Nombre**: (ej. "Presidente", "Encargado de Finanzas", "Militante Base").
- **Tipo de Alcance**: Territorial (Asociado a una Comuna/Región) o Transversal (Asociado a un Frente/Comisión).

## Flexibilidad del Modelo
Un usuario en el sistema no tiene el rol de `"admin"`. Un usuario tiene una lista de **Asignaciones de Cargos** (Assignments).

Ejemplo de perfil de un militante:
- Asignación 1: *Militante Base* en *Comuna de Santiago*.
- Asignación 2: *Secretario Político* en *Región Metropolitana*.
- Asignación 3: *Delegado* en *Frente Sindical*.

Si mañana el Congreso decide que "Secretario Político" pasa a llamarse "Encargado General", este cambio es una simple actualización en la tabla de `Cargos`, sin requerir modificación alguna en el código fuente de la aplicación.

## Restricciones y Resoluciones Organizánicas
- La jerarquía territorial fluye hacia abajo: Un cargo de control en la Dirección Nacional tiene visibilidad sobre todas las Regiones, pero no viceversa.
- Las asignaciones tienen fecha de inicio y (opcionalmente) fecha de fin, permitiendo preservar el historial político de un cuadro dentro del sistema sin borrar su pasado al asumir un nuevo rol.
