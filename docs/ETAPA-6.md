# Etapa 6 — Legibilidad y edición sin pérdida de borradores

## Problema corregido

La vista de rutinas reconstruye sus tarjetas al cerrar un detalle, renombrar o quitar un ejercicio. Antes, esto reemplazaba los inputs y descartaba cambios todavía no guardados. Ahora identifica cada campo por rutina, ejercicio y tipo, y conserva su texto si difiere del valor guardado.

## Archivos

- `src/components/routines-view.ts`: captura de borradores antes de reconstruir el DOM, restauración en los campos que siguen existiendo, mensajes locales de guardado y nombres accesibles para rutinas y formularios. También corrige el resumen singular (`1 ejercicio`) tras guardar series.
- `src/styles/main.css`: descripciones de 13 px, metadatos de 11 px, títulos de 17 px, controles principales de al menos 44 px de altura, inputs móviles de 16 px y catálogo de una columna hasta 480 px. Los filtros pasan a una columna en móviles pequeños para mostrar sus opciones completas.

## Cómo funciona

`defaultValue` representa el valor guardado y `value` la edición actual. Antes del renderizado se guardan en un `Map` los campos donde ambos difieren. Tras crear las nuevas tarjetas se restauran esos borradores mediante `data-draft-key`. Al guardar correctamente, se actualiza `defaultValue`; así un valor ya guardado no se trata como borrador.

Los borradores se conservan durante la sesión de edición al reconstruir la vista. Solo los cambios enviados con Guardar se escriben en localStorage. Recargar la página descarta lo que aún no se haya guardado. Quitar un ejercicio o eliminar una rutina descarta también sus borradores.

Los formularios tienen nombres accesibles que identifican el ejercicio y la rutina. La confirmación de eliminación se anuncia como un grupo con nombre; el botón informa su estado abierto/cerrado mediante `aria-expanded`.

## Cómo probar

1. Crea una rutina y añade Sentadilla desde el catálogo.
2. En Rutinas cambia el nombre sin guardarlo. Cambia las series a 7 y las repeticiones a 15, también sin guardar.
3. Abre Sentadilla desde esa rutina y cierra con Escape. Los tres borradores deben mantenerse; el foco regresa al ejercicio.
4. Guarda el nombre. Las series y repeticiones sin guardar deben seguir siendo 7 y 15.
5. Guarda las series y repeticiones: debe mostrarse un mensaje en la tarjeta y el resumen `1 ejercicio · 7 series en total`.
6. Recarga: deben permanecer solamente los valores guardados.
7. Comprueba el catálogo a 320, 768 y 1280 px, sin desplazamiento horizontal.
8. Ejecuta `npm test` y `npm run build`.

Verificado en navegador: conservación de borradores, guardados independientes, devolución del foco, mensajes locales y los tres anchos indicados. Las 16 pruebas automatizadas existentes y la compilación pasan. Esta entrega no incluye una auditoría completa con lector de pantalla. Los datos creados para la prueba se retiraron.

No se ha publicado en Vercel ni se ha creado un commit de esta etapa.
