# Etapa 10 — Deshacer la eliminación de una rutina

Tras confirmar la eliminación, aparece **Deshacer eliminación**. Recupera la última rutina eliminada, con su ID, ubicación en la lista, ejercicios, orden y prescripciones guardadas. Si la lista cambió y aquella ubicación ya no existe, se restaura al final.

## Archivos

- `src/state/routines.ts`: operación `restore(snapshot, index)`. Comprueba identificador, posición, nombre y prescripciones antes de insertar una copia independiente y guardarla.
- `src/components/routines-view.ts`: conserva la instantánea de la última rutina borrada y su posición, muestra el aviso y gestiona el foco de teclado. La instantánea se toma del estado actual al confirmar la eliminación, para incluir las prescripciones guardadas después de dibujar la tarjeta.
- `src/styles/main.css`: presentación adaptable del aviso y su botón.
- `tests/routines.test.mjs`: tres pruebas nuevas sobre restauración, persistencia, validación y fallos de almacenamiento. Total: 30 pruebas.

## Alcance

Solo se puede deshacer la última eliminación de rutina. La instantánea se conserva en memoria mientras siga abierta la página; recargar o cerrar elimina esa posibilidad. El aviso permanece al cambiar entre vistas durante la misma sesión.

Deshacer no recupera borradores que no se hubieran guardado ni ejercicios quitados individualmente. Para conservar datos entre sesiones, utiliza los respaldos JSON de la etapa 8.

La eliminación se guarda inmediatamente. Al deshacer se vuelve a guardar la rutina recuperada; si localStorage falla, se mantiene en memoria y aparece el aviso habitual. No se sobrescribe una rutina que ya tenga el mismo ID.

## Cómo probar

1. Crea o duplica una rutina para la prueba.
2. Edita las series y pulsa Guardar.
3. Elimina esa rutina y confirma. El foco debe ir a Deshacer eliminación.
4. Activa el botón con Enter: debe reaparecer la rutina con las últimas series guardadas y el foco en su título.
5. Recarga después de recuperar: la rutina debe seguir presente y el aviso de deshacer debe estar oculto.
6. Repite una eliminación y recarga sin deshacer: el aviso ya no estará disponible.
7. Comprueba que la rutina original no cambió si utilizaste una copia.
8. Ejecuta `npm test` y `npm run build`.

Validado: 30 pruebas automatizadas, compilación, eliminación/recuperación con teclado, foco, última prescripción guardada, persistencia tras recarga y ancho de 320 px sin desbordamiento. Se retiró únicamente la copia usada durante QA y se conservó la rutina original del usuario.

Vercel sigue aplazado. No se ha creado un commit nuevo de esta etapa.
