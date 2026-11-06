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

Añadidas configuración de GitHub Actions, configuración de Vercel, versión de Node y pruebas del catálogo. Las 16 pruebas y la compilación pasan localmente. Primer commit, subida a GitHub y despliegue remoto pendientes. Pasos concretos en `docs/PUBLICACION.md`. El workflow aún no se ha ejecutado en GitHub.
