# Etapa 7 — Orden de ejercicios en las rutinas

Cada rutina muestra sus ejercicios numerados y dos controles: Subir y Bajar. El primer ejercicio no puede subir; el último no puede bajar. En una rutina de un solo ejercicio ambos controles están deshabilitados.

## Archivos

- `src/state/routines.ts`: nueva operación `moveExercise(routineId, exerciseId, direction)`. Acepta `-1` o `1`, valida IDs y límites, intercambia los elementos y guarda la rutina.
- `src/components/routines-view.ts`: numeración, controles de orden, anuncio de posición y recuperación del foco tras reconstruir la lista. Conserva los borradores de la etapa anterior.
- `src/styles/main.css`: distribución adaptable, botones de 44 px y estado deshabilitado.
- `tests/routines.test.mjs`: tres pruebas nuevas para orden/persistencia, límites/IDs y fallos de almacenamiento.

## Cómo funciona

La posición de cada elemento en `Routine.items` ya representa su orden; no hace falta un campo adicional ni migrar el formato guardado. Mover intercambia dos elementos completos, por lo que las series y repeticiones siguen unidas a su ejercicio. La operación no altera otras rutinas.

El nuevo orden se guarda inmediatamente. Las series y repeticiones todavía en edición siguen siendo borradores: reordenar no las guarda automáticamente. Si se recarga antes de pulsar Guardar, se recupera la prescripción guardada y el último orden persistido.

Cada control tiene un nombre accesible (`Subir Sentadilla`, por ejemplo). Tras mover se anuncia la posición y se recupera el foco en el mismo control; si llegó al límite y ese control está deshabilitado, el foco pasa al nombre del ejercicio. Se puede usar Tab y Enter/Espacio sin arrastrar elementos.

## Cómo probar

1. Crea una rutina y añade Sentadilla, Zancadas y Flexiones.
2. Cambia las series de Sentadilla a 7 sin guardarlas.
3. Pulsa Bajar Sentadilla. Debe ocupar la segunda posición manteniendo el borrador de 7 series.
4. Activa el mismo botón con Enter: Sentadilla pasa al final y su botón Bajar queda deshabilitado. El foco pasa al nombre del ejercicio.
5. Usa Subir para cambiar la posición de otro ejercicio.
6. Recarga: se conserva el orden, pero las series muestran el último valor guardado, no el borrador.
7. Comprueba que el primer elemento no puede subir y el último no puede bajar.
8. Ejecuta `npm test` (19 pruebas) y `npm run build`.

Verificado en navegador: rutina de tres ejercicios, teclado, foco, borradores, recarga y ancho de 320 px sin desbordamiento horizontal. Se retiró únicamente la rutina creada para las pruebas; la rutina existente del usuario se conservó.

Vercel sigue aplazado. Esta etapa y los cambios previos pendientes no se han convertido en un nuevo commit.
