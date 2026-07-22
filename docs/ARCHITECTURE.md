# Arquitectura del Sistema

La Plataforma Institucional opera bajo una arquitectura **Estrictamente Modular** regida por el principio de separación de responsabilidades. La aplicación se divide conceptualmente en dos grandes universos: el **Core** y los **Módulos**.

## 1. El Core (Núcleo)
El Core es el corazón de la plataforma. Proporciona todos los servicios fundamentales sin los cuales ningún otro sistema puede existir. Su código es altamente protegido, hiper-optimizado y no contiene lógica de negocio específica de la vida cotidiana de la organización, sino lógica de *sistemas funcionales*.

Responsabilidades exclusivas del Core:
- **Identidad**: Conocer quién es el usuario (Modelo de Usuario).
- **Autenticación**: Mecanismos de login, 2FA, gestión de sesiones y tokens.
- **Organización (Org Chart)**: Mapear la estructura política territorial e institucional de la Juventud (Regiones, Direcciones, Frentes).
- **Autorización y Permisos (PBAC)**: Evaluar si la *Identidad* tiene acceso a un *Recurso* en un *Contexto* específico.
- **Auditoría**: Registrar inmutablemente quién hizo qué, cuándo, desde dónde y bajo qué contexto.
- **Configuración Global**: Variables de entorno, conexiones a BD, servicios de correo, almacenamiento.

*Regla Arquitectónica*: El Core **NO DEPENDE** de ningún módulo. Ignora completamente la existencia de "Noticias", "Biblioteca" o "Escuela".

## 2. Los Módulos
Los Módulos encapsulan la lógica de negocio diaria. Son verticales, aislados e independientes entre sí en la medida de lo posible. 

Ejemplos: `Noticias`, `Escuela`, `Biblioteca`.

*Regla Arquitectónica*: 
- Los módulos **DEPENDEN** del Core para autenticación, autorización y registro de auditoría.
- Si un módulo se elimina del código base, el resto del sistema (y el Core) debe seguir compilando y funcionando sin alteraciones críticas.

## Flujo de Datos Arquitectónico
1. **Petición del Cliente** -> 2. **Core: Autenticación (Middleware)** -> 3. **Core: Resolución de Políticas de Permisos** -> 4. **Módulo: Lógica de Negocio** -> 5. **Core: Registro de Auditoría** -> 6. **Respuesta**.

## Principios de Inyección y Dependencias
Para mantener el bajo acoplamiento, los módulos consumen las herramientas del Core a través de interfaces y contratos estrictos provistos por el sistema base, evitando dependencias circulares y asegurando que las reglas de seguridad se apliquen uniformemente.
