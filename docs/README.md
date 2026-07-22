# Proyecto Plataforma Institucional JS

## Visión del Proyecto
Construir una plataforma institucional privada para la Juventud Socialista de Chile que centralice, organice y proteja la gestión política, formativa y administrativa de la organización a nivel nacional, regional y comunal.

## Qué es
- Una plataforma modular para la organización política.
- Una herramienta de formación de cuadros.
- Un sistema de administración documental seguro.
- Un centro de gestión interna, comunicación formal y toma de decisiones.
- Un entorno seguro con control de acceso basado en políticas (PBAC) y auditoría profunda.

## Qué NO es
- No es un LMS (Learning Management System) tradicional.
- No es una red social de uso distendido o efímero.
- No es una instancia de Canvas genérica.
- No es un foro sin estructura o de debate libre desvinculado de la orgánica.

## Objetivos
1. **Centralización Segura**: Unificar todos los recursos de la organización bajo un estándar de seguridad riguroso.
2. **Escalabilidad Modular**: Permitir el crecimiento orgánico de la plataforma agregando módulos sin afectar el Core.
3. **Mapeo Orgánico Real**: Reflejar fielmente la compleja estructura de la organización (Territorios, Frentes, Comisiones, Niveles Directivos).
4. **Trazabilidad y Auditoría**: Mantener un registro inmutable de acciones críticas para garantizar la transparencia interna y seguridad de la información.

## Tecnologías Principales
- **Framework**: Astro (con integraciones modulares en React/Solid según necesidad futura).
- **Estilos**: Tailwind CSS v4 (Design System Brutalista/Editorial personalizado).
- **Lenguaje**: TypeScript (Strict mode obligatorio).
- **Gestor de Paquetes**: pnpm.
- **Base de Datos**: PostgreSQL (a definir ORM en DECISIONS.md, preferentemente Prisma o Drizzle).

## Principios
1. **Seguridad Ante Todo (Security-First)**: Privacidad absoluta de los datos de la militancia y resoluciones internas.
2. **Bajo Acoplamiento**: Los módulos son conectables y desconectables del Core.
3. **Mantenibilidad**: Código limpio, pequeño y bien tipado.
4. **Diseño Identitario**: Un entorno digital sobrio, maduro, brutalista y de alto contraste (Editorial Socialista).
