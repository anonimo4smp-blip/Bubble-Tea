# Bubble Tea España — Contexto del proyecto para Claude

## Qué es este proyecto

Plataforma web editorial multi-ciudad para descubrir los mejores locales de bubble tea en España. El enfoque es SEO-first, solo español, sin comunidad ni monetización en el MVP.

**Ciudades de lanzamiento:** Madrid (mín. 20 locales), Barcelona (mín. 20), Vigo (mín. 8).

## Stack técnico

- **Framework:** Next.js con App Router y TypeScript
- **Estilos:** Tailwind CSS
- **DB y Auth:** Supabase (auth por magic link, un solo admin)
- **ORM:** Drizzle ORM
- **Despliegue:** Vercel
- **Mapa:** Leaflet + OpenStreetMap
- **Analítica:** Plausible + Google Search Console
- **Sin Docker.** Desarrollo local con `npm run dev`.

## Rutas

### Públicas
- `/`
- `/[city]`
- `/[city]/mejores-bubble-tea`
- `/[city]/[shopSlug]`

### Admin (privadas)
- `/admin`
- `/admin/cities`
- `/admin/shops`

## Modelo de datos (tablas principales)

- `cities` — ciudades con SEO, coordenadas, estado y descripción editorial
- `shops` — locales con precio, coordenadas, redes sociales, texto editorial, estado
- `shop_features` — características del local (vegan, wifi, pet-friendly, etc.)
- `shop_hours` — horarios por día de la semana
- `shop_scores` — score mixto editorial por dimensión
- `shop_images` — imágenes con alt text y orden
- `seo_pages` — metadata, h1, intro, FAQs por entidad
- `audit_logs` — registro de acciones del admin

## Sistema de ranking

Ranking mixto editorial con esta fórmula:
- 35% calidad editorial
- 15% precio
- 15% variedad
- 10% experiencia
- 15% rating Google normalizado
- 10% popularidad social

**Requisitos para aparecer en ranking:** estado `published`, datos mínimos completos, revisado en los últimos 120 días.

## Estados editoriales

`draft` → `published` → `needs_update` → `archived`

Estados especiales: `cerrado_temporal` (ficha visible, fuera del ranking), `cerrado_definitivo` (fuera de listados).

## SEO

- Renderizado estático o ISR para páginas públicas
- Sitemap automático, robots.txt, canonical, metadata dinámica
- Schemas: `BreadcrumbList`, `CollectionPage`, `LocalBusiness`, `FAQPage`
- Filtros con query params — las combinaciones filtradas **no se indexan**
- Solo se indexan: páginas de ciudad, ranking y fichas

## Fases de implementación

1. **Base técnica** — Next.js, Tailwind, Supabase, Drizzle, variables de entorno, layout y rutas
2. **Modelo editorial y admin** — tablas, auth, CRUD de ciudades y locales, validaciones de publicación
3. **Frontend público** — home, ciudad con filtros y mapa, ranking, fichas
4. **SEO y analítica** — metadata dinámica, schema, sitemap, Plausible, Search Console
5. **Carga y lanzamiento** — contenido inicial de las 3 ciudades, QA, publicación

## Reglas de diseño (Design System: "Urban Tea Atelier")

### Identidad visual
- Estética editorial de revista lifestyle premium — asimetría intencional, espacio negativo como elemento estructural
- "Sunlight-First": sin dark mode primario; la base es cálida y luminosa

### Colores principales
| Token | Hex | Uso |
|---|---|---|
| `surface` | `#fff8f3` | Fondo base de página |
| `surface-container-low` | `#fcf2e7` | Bloques de sección |
| `surface-container-lowest` | `#ffffff` | Cards interactivas |
| `primary` | `#4c6700` | Botones primarios, énfasis |
| `primary-container` | `#8fb339` | Callouts de acento |
| `primary-fixed` | `#c9f16f` | Chips seleccionados |
| `secondary-container` | `#feb289` | Botones secundarios |
| `tertiary` | `#af2f25` | Navegación editorial |
| `on-surface` | `#1f1b14` | Texto y sombras |

### Tipografía
- **Serif (Noto Serif):** headlines y display — editorial, autoridad. `display-lg` = 3.5rem, letra apretada (-2%) en grandes.
- **Sans-serif (Plus Jakarta Sans):** títulos, body, labels — claridad moderna.
- Combinar `display-md` serif con `label-md` sans-serif en mayúsculas (10% letter-spacing) para look de firma.

### Reglas estrictas de diseño
- **Prohibido usar bordes de 1px** para separar secciones. Separar solo con cambio de tono de fondo.
- **Prohibido gris puro:** usar siempre tokens `on-surface` u `outline` (tienen warmth de marca).
- **No dark mode** como experiencia principal.
- **Glassmorphism** para elementos flotantes (nav, price tags): `surface` al 80% opacidad + `24px` backdrop-blur.
- **Sombras "Whisper":** blur 40-60px, opacidad 4-6%, color `on-surface`. Nunca sombras pesadas.
- **Cards:** `rounded-xl` (1.5rem), sin divisores internos, imágenes que "sangran" hasta el borde.
- **Botones primarios:** `rounded-full` (forma boba). Secundarios: `rounded-xl`.
- **Chips activos:** `primary-fixed` (#c9f16f).

## Lo que NO entra en el MVP

- Registro/cuentas de usuarios finales
- Reviews o favoritos públicos
- Comparador avanzado, newsletter, app móvil
- Monetización
- Panel para negocios
- Importación automática de datos
- Docker
