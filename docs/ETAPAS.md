# Plan de desarrollo

## 1. Explorar — implementada

Archivos: configuración raíz, `src/types/exercise.ts`, `src/data/exercises.ts`, `src/filter-exercises.ts`, `src/components/filters.ts`, `src/components/exercise-card.ts`, `src/main.ts`, `src/styles/main.css` y recursos en `public/`.

Aprendizaje: tipos de unión, funciones puras, composición de componentes DOM y eventos. Los tres filtros se combinan mediante AND. El estado está en los controles; el renderizado deriva de ese estado y no modifica el catálogo original. Consulta el README para las pruebas manuales.

## 2. Detalle — implementada

Creado `src/components/exercise-detail.ts`; tarjetas, composición y estilos adaptados. Un diálogo nativo muestra todos los datos en un panel lateral de escritorio y uno inferior en móvil. Incluye Escape, foco inicial, modalidad nativa, devolución del foco, cierre por botón y fondo. Verificado con teclado y en 375 px. Auditoría con lector de pantalla pendiente. Consulta el README para la explicación y pruebas.

## 3. Favoritos — implementada

Añadidos `src/services/storage.ts`, `src/state/favorites.ts`, `src/components/favorite-button.ts` y la vista Favoritos, integrada en `src/main.ts`. IDs persistidos en `fitfinder.favorites.v1`, validación de datos y avisos ante errores. Tarjetas y detalle permiten guardar/quitar. Verificadas recarga, filtros y teclado en navegador; nueve pruebas automatizadas de almacenamiento en `tests/favorites.test.mjs`. Consulta el README para la explicación y pruebas.

## 4. Rutinas — implementada; publicación pendiente

Añadidos modelo, estado y componentes de rutinas. Permite crear desde la vista o el detalle, añadir ejercicios sin duplicados, guardar series/repeticiones, quitar ejercicios, renombrar y eliminar con confirmación. Persistencia versionada y validada. Paleta adaptada a negro, oliva y lima según la referencia del usuario. Trece pruebas automatizadas; flujo de recarga y responsive verificado en navegador. Auditoría con lector de pantalla y publicación en GitHub/Vercel pendientes.

Cada etapa se entrega y explica por separado. Continuar solo después de la confirmación del usuario.

## 5. Preparación de publicación — implementada

Añadidas configuración de GitHub Actions, configuración de Vercel, versión de Node y pruebas del catálogo. Las 16 pruebas y la compilación pasan localmente. El primer commit ya fue creado por el usuario; las mejoras posteriores y el despliegue siguen pendientes. Pasos concretos en `docs/PUBLICACION.md`. La ejecución remota del workflow no se ha verificado.

## 6. Legibilidad y edición — implementada

Conservación de borradores al reconstruir las rutinas, formularios con nombre accesible, mensajes locales y texto/controles ampliados. Filtros y tarjetas en una columna para móviles pequeños. Pruebas de navegador a 320, 768 y 1280 px, 16 pruebas automatizadas y compilación correctas. Explicación y reproducción en `docs/ETAPA-6.md`. Vercel queda aplazado a petición del usuario.

## 7. Organización de rutinas — implementada

Ejercicios numerados, controles accesibles para subir/bajar, persistencia del orden, protección de límites y conservación de borradores. Diecinueve pruebas y compilación correctas; teclado y móvil verificados en navegador. Explicación en `docs/ETAPA-7.md`. Vercel continúa aplazado.

## 8. Respaldo de datos — implementada

Descarga JSON versionada de favoritos/rutinas, importación validada con resumen y confirmación, combinación aditiva sin duplicados y errores de almacenamiento comunicados. Veinticuatro pruebas automatizadas y compilación correctas. Explicación en `docs/ETAPA-8.md`. Vercel continúa aplazado.

## 9. Duplicación de rutinas — implementada

Copias independientes con ID nuevo, nombres consecutivos y prescripciones guardadas. Persistencia, navegación por teclado y diseño móvil verificados. Veintisiete pruebas y compilación correctas. Explicación en `docs/ETAPA-9.md`. Vercel sigue aplazado.

## 10. Recuperación de rutinas — implementada

Deshacer la última eliminación durante la sesión de página, con restauración de ID, posición y configuración guardada. Teclado, foco, persistencia y móvil verificados. Treinta pruebas y compilación correctas. Explicación en `docs/ETAPA-10.md`. Vercel sigue aplazado.

## 11. Cierre de portafolio — implementada

README consolidado, explicaciones históricas conservadas, guía de demostración y estado de publicación corregido. Treinta pruebas, compilación y flujo principal de producción local verificados. Detalles y límites en `docs/ETAPA-11.md`. Funciones de la primera versión completas; accesibilidad integral y Vercel pendientes.

## 12. Teclado y estructura accesible — implementada

Atajo con modificador, límites de foco del diálogo, descripción asociada y títulos de vista. Revisión de etiquetas y cuatro combinaciones principales de contraste. Treinta y dos pruebas y compilación correctas. Detalles, fuentes y pruebas pendientes en `docs/ETAPA-12.md`. No equivale a una auditoría WCAG completa.

## Publicación — verificada

El propietario publicó https://fit-finder-coral.vercel.app/. Verificados catálogo, búsqueda, detalle, favoritos, rutinas y recarga en el sitio público; móvil a 375 px sin desbordamiento. Se retiraron solo los datos creados para QA. README y guía de presentación actualizados con la URL.

## 13. Presentación del enlace — preparada localmente

Imagen de vista previa, Open Graph, URL canónica, robots y sitemap. Compilación, metadatos y recursos de `dist` verificados. Explicación en `docs/ETAPA-13.md`. Commit, despliegue y comprobación de las tarjetas en plataformas públicas pendientes.
