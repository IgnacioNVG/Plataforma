# Módulos del Sistema

Este documento describe los módulos de negocio planificados para la plataforma. Ninguno de estos módulos forma parte del "Core". Cada uno debe diseñarse para ser acoplable y desacoplable.

---

## 1. Módulo: Noticias (Boletín Oficial)
- **Objetivo**: Difusión unilateral de información formal, comunicados y columnas de opinión institucionales.
- **Dependencias**: Core (Autorización), Core (Organización para segmentación por región/frente).
- **Permisos requeridos**: `news:read` (Público militante), `news:publish` (Equipos de comunicaciones).
- **Componentes**: Editor de contenido enriquecido (Markdown/HTML estricto), Visor tipo periódico, Gestor de portadas.

## 2. Módulo: Biblioteca
- **Objetivo**: Repositorio centralizado de documentos históricos, doctrinales, resoluciones de congresos y manuales.
- **Dependencias**: Core (Storage/Bucket API para PDFs), Core (Clasificación de Seguridad).
- **Permisos requeridos**: Lectura segmentada por nivel de clasificación (Público, Interno, Reservado, Confidencial).
- **Componentes**: Buscador indexado, Ficha técnica del documento, Lector integrado/Bóveda de descargas temporales.

## 3. Módulo: Escuela de Formación
- **Objetivo**: Administración, impartición y seguimiento del currículo de educación política.
- **Dependencias**: Módulo de Biblioteca (para apuntes).
- **Permisos requeridos**: `course:enroll`, `course:manage`, `course:grade`.
- **Componentes**: Reproductor de módulos (Video/Texto), Tracker de progreso, Constructor de Evaluaciones.

## 4. Módulo: Agenda
- **Objetivo**: Calendario unificado de hitos políticos, plenos, reuniones orgánicas y efemérides.
- **Dependencias**: Core (Organización).
- **Permisos requeridos**: `event:create` limitado por jerarquía territorial (Un presidente comunal crea eventos comunales).
- **Componentes**: Vista mensual/semanal, Sistema de RSVP (Asistencia), Sincronización de calendario (Exportación iCal).

## 5. Módulo: Foros
- **Objetivo**: Espacios de debate asíncrono, estructurado y auditable sobre temas programáticos.
- **Dependencias**: Core (Auditoría - alta criticidad para moderación).
- **Permisos requeridos**: `forum:participate`, `forum:moderate`.
- **Componentes**: Vista de hilos (Threads), Editor de texto plano con Markdown, Sistema de Moderación/Bloqueo.

## 6. Módulo: Formularios
- **Objetivo**: Motor dinámico para recolectar datos (actualización de padrón, encuestas internas, inscripciones a congresos).
- **Dependencias**: Core (Autorización - Restricción de acceso al formulario).
- **Permisos requeridos**: `form:create`, `form:fill`, `form:export_data`.
- **Componentes**: Form Builder (Drag & drop o JSON), Visor de encuestas, Tablero de resultados (Exportador CSV).

## 7. Módulo: Analíticas e Inteligencia Organizacional
- **Objetivo**: Proveer mapas de calor de participación, métricas de retención, y demografía partidaria a las directivas.
- **Dependencias**: Todos los módulos (Solo-lectura de sus bases de datos) + Core (Logs de Auditoría).
- **Permisos requeridos**: Acceso altamente restringido (Nivel Confidencial).
- **Componentes**: Dashboards gráficos, Filtros demográficos/territoriales, Exportadores de reportes PDF.

## 8. Módulo: Administración (Org Manager)
- **Objetivo**: Interfaz gráfica para alterar la configuración del Core (crear territorios, definir cargos, ajustar PBAC).
- **Dependencias**: Directamente inyectado al Core.
- **Permisos requeridos**: Solo `Super_Admin` de sistema o Dirección Nacional.
- **Componentes**: Árboles organizacionales interactivos, Matriz de Políticas de Permisos, Visor del Audit Log en crudo.
