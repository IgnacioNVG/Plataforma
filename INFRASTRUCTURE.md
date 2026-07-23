# Infraestructura, filosofía de despliegue y estrategia de desarrollo

## Objetivo general

La plataforma debe diseñarse desde el primer día con una filosofía de independencia tecnológica. Ninguna decisión de infraestructura debe impedir migrar el proyecto a otro proveedor en el futuro.

El objetivo no es construir una aplicación dependiente de un servicio específico, sino una plataforma institucional que pueda mantenerse durante muchos años, independientemente de dónde se encuentre alojada.

Toda decisión debe privilegiar:

* Portabilidad.
* Seguridad.
* Escalabilidad.
* Modularidad.
* Reproducibilidad.
* Bajo costo durante el desarrollo.
* Facilidad de migración.

El proyecto debe poder comenzar utilizando servicios gratuitos o de muy bajo costo, pero sin adoptar características propietarias que obliguen a permanecer en un proveedor específico.

---

# Filosofía de infraestructura

La infraestructura debe entenderse como un conjunto de servicios intercambiables.

La aplicación nunca debe conocer el proveedor donde se ejecutan dichos servicios.

Por ejemplo:

* La aplicación no debe saber si la base de datos está en Supabase, Neon, Railway o un servidor propio.
* La aplicación no debe saber si el almacenamiento utiliza Supabase Storage, MinIO, Cloudflare R2 o Amazon S3.
* La aplicación no debe depender de un proveedor de autenticación específico.
* Todo debe abstraerse mediante interfaces propias.

La aplicación únicamente debe comunicarse con:

* Base de datos PostgreSQL.
* Servicio de almacenamiento compatible con S3.
* Servicio de correo.
* Variables de entorno.

Nunca directamente con un proveedor.

---

# Arquitectura deseada

La arquitectura debe seguir una separación estricta entre aplicación e infraestructura.

```text
Usuario

↓

Astro (Frontend)

↓

Astro Server

↓

Servicios internos

↓

PostgreSQL

↓

Storage

↓

Correo

↓

Logs
```

Cada servicio debe poder reemplazarse sin modificar la lógica de negocio.

---

# Variables de entorno

Toda configuración debe realizarse mediante variables de entorno.

Nunca escribir:

* URLs.
* Tokens.
* Secretos.
* Claves privadas.
* Credenciales.
* Endpoints.

Directamente dentro del código.

Debe existir siempre un archivo `.env.example` completamente documentado.

---

# Entornos del proyecto

El proyecto trabajará siempre con tres ambientes independientes.

## Desarrollo Local

Este entorno corresponde al computador del desarrollador.

Debe permitir trabajar completamente sin depender de producción.

Debe ser fácilmente reproducible.

Todo el proyecto debe poder levantarse mediante Docker o mediante las herramientas definidas en la documentación.

---

## Staging (Desarrollo Online)

Este será el entorno principal durante todo el desarrollo.

Aquí se publicarán los avances para ser revisados por un grupo reducido de personas.

No será público.

No será indexado por buscadores.

Debe encontrarse protegido mediante autenticación.

El objetivo del entorno de staging es permitir:

* mostrar avances;
* probar nuevas funcionalidades;
* recibir retroalimentación;
* validar diseño;
* detectar errores antes de producción.

Toda nueva funcionalidad debe desplegarse primero aquí.

Nunca directamente en producción.

---

## Producción

Este será el entorno definitivo.

Debe contener únicamente versiones estables.

Nunca debe utilizar datos de prueba.

Toda publicación deberá provenir exclusivamente de la rama principal del repositorio.

---

# Flujo de ramas

El repositorio utilizará una estrategia sencilla.

```text
feature/*

↓

develop

↓

staging

↓

main

↓

production
```

Las ramas feature desarrollan funcionalidades individuales.

La rama develop integra el trabajo.

Cada actualización de develop debe desplegar automáticamente el entorno de staging.

La rama main representa únicamente versiones estables.

---

# Despliegue continuo

Todo despliegue debe automatizarse.

No realizar despliegues manuales.

Cada push a la rama `develop` debe generar automáticamente un despliegue en staging.

Cada push a `main` deberá generar el despliegue de producción cuando el proyecto esté listo para ello.

Todo el proceso debe documentarse.

---

# Estado actual del proyecto

Durante esta primera etapa el proyecto se encuentra en desarrollo.

No existe todavía una plataforma pública.

El objetivo es disponer cuanto antes de una versión funcional online donde un pequeño grupo pueda iniciar sesión y revisar el progreso del desarrollo.

Por ello:

* inicialmente los usuarios serán creados manualmente;
* no existirá aún integración con el padrón;
* no existirán registros abiertos;
* únicamente existirán cuentas de prueba.

Posteriormente se implementará el sistema oficial de incorporación de usuarios.

---

# Estrategia de autenticación inicial

Durante el desarrollo:

* creación manual de usuarios;
* activación mediante invitación;
* recuperación de contraseña;
* sesiones seguras;
* cookies HttpOnly;
* CSRF;
* protección contra fuerza bruta.

Posteriormente se desarrollará el sistema definitivo de validación contra el padrón institucional.

---

# Estrategia futura de validación

Cuando la plataforma alcance un estado estable, el registro de nuevos usuarios deberá realizarse únicamente mediante validación contra el padrón oficial.

El flujo esperado será:

Usuario solicita crear cuenta

↓

El sistema consulta un servicio interno de validación

↓

Se verifica que la persona pertenece al padrón autorizado

↓

Si la validación es positiva:

* se habilita la activación;
* se genera un identificador interno;
* se registra la cuenta.

Si la validación falla:

la cuenta no se crea.

El padrón nunca deberá exponerse directamente.

La aplicación únicamente deberá conocer si una validación fue exitosa o no.

---

# Objetivo de independencia tecnológica

Toda la infraestructura deberá poder migrarse.

Ejemplos aceptables:

Hoy

Base de datos:
Supabase PostgreSQL

Mañana

PostgreSQL propio

Sin modificar el código.

---

Hoy

Storage:
Supabase Storage

Mañana

Cloudflare R2

MinIO

Amazon S3

Sin modificar el código.

---

Hoy

Correo:
Resend

Mañana

SMTP

Amazon SES

Postmark

Sin modificar el código.

---

# Docker

Toda la plataforma deberá poder ejecutarse mediante Docker.

El repositorio deberá incluir:

* Dockerfile.
* docker-compose para desarrollo.
* docker-compose para producción.
* scripts de inicialización.
* documentación.

Un nuevo desarrollador debe poder levantar el proyecto únicamente clonando el repositorio y configurando el archivo `.env`.

---

# Filosofía de despliegue

El proyecto nunca deberá depender de procedimientos manuales.

Toda instalación debe ser reproducible.

Toda configuración debe documentarse.

Todo servicio debe ser reemplazable.

Todo cambio importante de infraestructura deberá registrarse como una Architectural Decision Record (ADR).

---

# Objetivo final

El resultado esperado es una plataforma institucional que pueda comenzar funcionando sobre infraestructura gratuita durante el desarrollo, pero que posteriormente pueda migrarse a un servidor propio o a cualquier proveedor comercial sin necesidad de reescribir el código, modificar la arquitectura o cambiar la lógica de negocio.

La infraestructura debe ser un detalle de implementación y nunca una dependencia estructural del proyecto.
