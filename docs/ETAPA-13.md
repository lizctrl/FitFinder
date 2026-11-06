# Etapa 13 — Presentación del enlace público

## Archivos

- `index.html`: título, descripción e imagen Open Graph, tarjeta con imagen grande, texto alternativo y URL canónica.
- `public/social-preview.jpg`: captura real de la portada, 1200 × 630 píxeles, sin datos de usuario. Se verificaron formato y dimensiones del archivo.
- `public/robots.txt`: permite el rastreo e indica la ubicación del sitemap.
- `public/sitemap.xml`: incluye la URL pública principal, sin fragmentos ni rutas de datos locales.

Las URL absolutas utilizan el dominio publicado `https://fit-finder-coral.vercel.app/`. Si cambia el dominio, habrá que actualizar el HTML, robots y sitemap de forma consistente.

## Cómo funciona

Los metadatos se incluyen en el HTML inicial, de modo que no dependen de que una plataforma ejecute JavaScript. Open Graph presenta título, descripción, imagen y URL para representar el enlace. El título que cambia al navegar dentro de la app se conserva; la vista previa compartida utiliza el título general de FitFinder.

La URL canónica identifica la portada como página principal. No se incluyen `#favorites` ni `#routines` en el sitemap: representan vistas de la aplicación y los datos dependen del navegador del usuario. Esto no publica rutinas ni favoritos personales.

Referencias oficiales: [Open Graph](https://ogp.me/) y [URL canónica en Google Search](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## Validación

- Compilación de TypeScript y Vite correcta.
- HTML de `dist/index.html` con URL canónica única y metadatos consistentes.
- Imagen JPEG real de 1200 × 630; dimensiones declaradas coincidentes.
- Imagen, robots y sitemap presentes en `dist/`.
- Sitemap XML válido y URL coincidente con la canónica y Open Graph.

No se modificó la lógica de la aplicación ni se añadieron pruebas que reproduzcan las etiquetas HTML. La suite funcional permanece en 32 casos, verificados en la etapa anterior.

## Publicar y comprobar

Estos cambios están preparados localmente; no están verificados todavía en el sitio público.

1. Guarda los cambios en Git y súbelos al repositorio conectado a Vercel.
2. Espera el despliegue y abre `/social-preview.jpg`, `/robots.txt` y `/sitemap.xml` en el dominio público.
3. Revisa el HTML inicial de la portada para comprobar los metadatos.
4. Prueba compartir el enlace en la plataforma que utilices. Algunas plataformas conservan su vista previa en caché y no reflejan el cambio inmediatamente.

No se garantiza que todas las plataformas muestren la misma tarjeta ni que el sitio sea indexado o alcance una posición concreta. La vista previa real y la indexación pública quedan pendientes de esa comprobación posterior al despliegue.

No se ha creado un commit ni realizado un despliegue en esta etapa.
