# Design System

La plataforma adopta una estética **Editorial Contemporánea y Brutalista Moderno**. Está pensada para transmitir seriedad institucional, contraste claro para lectura intensa y un sentido de organización cruda pero ordenada, evitando interfaces corporativas blandas o tendencias superficiales (glassmorphism, degradados suaves, sombras difusas).

## 1. Principios Visuales
- **Alto Contraste**: Líneas duras, bordes sólidos (1px a 4px).
- **Legibilidad Editorial**: Jerarquías tipográficas enormes y drásticas.
- **Geometría Estricta**: Uso de cajas, separadores gruesos y estructuras reticulares marcadas.
- **Materialidad Digital**: Fondos planos y colores puros. Las sombras no difuminan, proyectan bloques sólidos (Neo-brutalismo).

## 2. Paleta de Colores
Toda la interfaz opera utilizando CSS Variables y Tailwind (v4) classes, soportando inherentemente temas claro/oscuro.

- **Primary**: Rojo Socialista (`#C8102E`). Color de acento, llamado a la acción y estados de foco.
- **Background**: Blanco puro (`#FAFAFA` o `#FFFFFF`) en light mode / Negro puro o gris profundo en dark mode (`#111111`).
- **Foreground**: Negro absoluto (`#000000`) en light mode para textos y bordes estructurales.
- **Secondary**: Gris claro (`#F3F3F3`) para fondos de contraste, tarjetas pasivas o paneles secundarios.
- **Muted**: Gris medio para metadatos y textos auxiliares (`#888888`).

## 3. Tipografía
- **Familia Única**: `IBM Plex Sans`. Su diseño geométrico, legible y levemente técnico la hace perfecta para interfaces institucionales complejas.
- **Jerarquías Extremas**:
  - Títulos principales (H1): Masivos, a menudo en Uppercase y tracking-tighter (ej. 4xl a 6xl).
  - Texto de lectura (Body): Tamaños cómodos para larga exposición (16px a 18px), interlineado relajado (leading-relaxed).
  - Metadatos (Eyebrows, Fechas): Pequeños, en mayúscula sostenida, pesados (bold) y con gran espaciado de letras (tracking-widest).

## 4. Grid y Espaciado (Spacing)
- **Sistema base de 8px**: (1 = 4px, 2 = 8px, 4 = 16px, 8 = 32px, etc).
- **Contenedores**: Retículas de 12 columnas para layouts principales. Cajas limitadas en ancho (`max-w-4xl`, `max-w-6xl`) para lectura ergonómica de textos.
- **Gutter y Borders**: Separación clara entre bloques de contenido usando `border-b` o `border-r` gruesos (2px a 4px) en lugar de sombras suaves.

## 5. Componentes Clave
- **Botones**: Bloques sólidos, a menudo con bordes oscuros o sombras duras (ej. `shadow-[4px_4px_0px_0px_var(--color-foreground)]`). Estados hover alteran el color de fondo dramáticamente sin difuminar.
- **Tarjetas (Cards)**: Cuadradas, bordes definidos. Cero redondeo exagerado (`rounded-none` o máximo `rounded-sm`).
- **Alertas / Badges**: Cajas de color de fondo agresivo con texto blanco o negro, muy estructuradas.

## 6. Iconografía
- Estilo lineal, grosores consistentes (2px), sobrios (Heroicons o Lucide). Cero íconos redondeados o infantiles.

## 7. Responsive
- Enfoque móvil primero (Mobile-first).
- Uso extensivo de flexbox y css grid para reorganizar el contenido. Los bordes decorativos o asimetrías extremas deben simplificarse en pantallas menores a 768px para privilegiar la legibilidad.
