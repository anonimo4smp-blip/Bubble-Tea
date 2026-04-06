# Bubble Tea Espana

Plataforma editorial SEO-first para descubrir los mejores locales de bubble tea en Espana, con paginas por ciudad, ranking editorial, fichas de tienda y panel admin protegido con Supabase.

## Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Supabase` para auth y servicios
- `Postgres + Drizzle ORM`
- `Leaflet + OpenStreetMap`
- `Vercel`

## Desarrollo local

1. Instala dependencias:

```bash
npm install
```

2. Crea `.env.local` a partir de `.env.example`.

3. Arranca el proyecto:

```bash
npm run dev
```

4. QA minima antes de desplegar:

```bash
npm run lint
node ./node_modules/typescript/bin/tsc --noEmit
npm run build
```

## Variables de entorno

Necesarias en local y en Vercel:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL_ALLOWLIST`
- `NEXT_PUBLIC_SITE_URL`

Opcionales:

- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_GSC_VERIFICATION`

Referencia: usa `.env.example` como plantilla.

## Publicacion en Vercel

### 1. Configurar el proyecto

- Importa el repo en Vercel.
- Framework preset: `Next.js`
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: vacio

### 2. Cargar variables de entorno

- Anade en Vercel todas las variables de `.env.example`.
- `NEXT_PUBLIC_SITE_URL` debe ser tu dominio final, por ejemplo `https://bubbleteaespana.com`
- `ADMIN_EMAIL_ALLOWLIST` debe contener el email real que podra entrar al admin

### 3. Configurar Supabase Auth

En `Authentication > URL Configuration` anade:

- `Site URL`: tu dominio final
- `Redirect URLs`:
  - `https://tu-dominio.com/auth/callback`
  - `https://tu-proyecto.vercel.app/auth/callback`
  - tus preview URLs si usas previews con login admin

Sin esto, el magic link del admin puede fallar.

### 4. Dominio y analitica

- Conecta el dominio final en Vercel.
- Si usas Plausible, asegurate de que el `data-domain` en `app/layout.tsx` coincide con el dominio final.
- Si usas Search Console, anade `NEXT_PUBLIC_GSC_VERIFICATION`.

### 5. Checklist final de lanzamiento

- `npm run lint` pasa
- `node ./node_modules/typescript/bin/tsc --noEmit` pasa
- `npm run build` pasa
- `/admin/login` envia magic link correctamente
- `/auth/callback` vuelve al admin correctamente
- Home, ciudad, ranking y ficha cargan en preview
- No hay errores de `next/image` por hosts no permitidos
- `robots.txt` y `sitemap.xml` responden
- El dominio final coincide con `NEXT_PUBLIC_SITE_URL`

## Estado actual

El proyecto esta listo para desplegar en Vercel, con estas salvedades:

- Las rutas de ranking y fichas ya salen pre-generadas con `generateStaticParams`
- La ruta `/{city}` sigue apareciendo como dinamica en build por su implementacion actual
- El mapa usa attribution propia en JSX con enlace seguro a OpenStreetMap

## Estructura principal

- `app/` rutas publicas y admin
- `components/` UI reutilizable
- `db/` esquema y acceso a datos
- `lib/` helpers de SEO, auth y static params
- `data/` dataset editorial verificado
- `scripts/` utilidades de carga y sincronizacion
