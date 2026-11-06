# Etapa 9 — Duplicar rutinas

Cada tarjeta de rutina incluye **Duplicar rutina**. La copia conserva los ejercicios, su orden, las series y las repeticiones guardadas, y puede editarse sin cambiar la original.

## Archivos

- `src/state/routines.ts`: nueva operación `duplicate(id)`. Genera un ID nuevo, copia cada elemento y persiste el resultado. El nombre usa `(copia)`, `(copia 2)`, etc., evitando colisiones y manteniendo el límite de 60 caracteres.
- `src/components/routines-view.ts`: control de duplicación, mensaje de resultado y foco en el título de la copia. Los borradores de otras tarjetas se conservan al reconstruir la vista.
- `src/styles/main.css`: agrupación adaptable de acciones de las tarjetas.
- `tests/routines.test.mjs`: tres pruebas nuevas para independencia/persistencia, nombres/límites y almacenamiento bloqueado. Total: 27 pruebas.

## Cómo funciona

El ID distingue la copia de la original. `original.items.map(item => ({ ...item }))` crea objetos nuevos para que editar una prescripción no modifique la de la otra rutina. El orden se conserva porque se recorre el array original en su secuencia actual.

La copia toma los valores aplicados al modelo. Los cambios de nombre, series o repeticiones que todavía no se hayan guardado no se incluyen; tampoco se descartan de su tarjeta original. Para incluirlos, pulsa Guardar antes de duplicar.

La copia se guarda automáticamente. Si localStorage falla, sigue disponible durante la sesión y se muestra el aviso habitual. Una rutina vacía también puede duplicarse. Una rutina inexistente produce un error sin modificar el estado.

## Cómo probar

1. Crea una rutina y añade ejercicios con series/repeticiones.
2. Pulsa Duplicar rutina: aparece otra tarjeta con `(copia)` y el foco va a su título.
3. Edita y guarda las series de la copia; comprueba que la original conserva sus valores.
4. Recarga: ambas rutinas deben permanecer.
5. Duplica otra vez la original: el nombre debe terminar en `(copia 2)`.
6. Elimina la copia con la confirmación habitual; la original debe seguir disponible.
7. Prueba el control con Tab y Enter/Espacio, y a 320 px de ancho.
8. Ejecuta `npm test` y `npm run build`.

Verificado en navegador: creación con teclado, foco, nombres consecutivos, cambios independientes, recarga, eliminación de copias y ancho móvil sin desbordamiento. Se eliminaron solo las copias creadas durante QA y se conservó la rutina original.

Vercel sigue aplazado; no se ha creado un commit nuevo.
