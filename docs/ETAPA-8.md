# Etapa 8 — Respaldo de favoritos y rutinas

## Dónde se usa

Al final de cualquier vista, abre **Tu progreso, contigo → Copias de seguridad**. Puedes descargar una copia JSON o elegir un archivo de respaldo. Todo se procesa en el navegador; el archivo no se envía a un servidor.

## Archivos

- `src/services/backup.ts`: formato versionado, validación completa y comparación de rutinas por contenido.
- `src/components/backup-panel.ts`: descarga, lectura de archivos, resumen, confirmación y cancelación.
- `src/state/favorites.ts`: lectura de IDs para exportación y combinación aditiva.
- `src/state/routines.ts`: incorporación de rutinas validadas con nuevos IDs locales.
- `src/main.ts`: integración del panel y actualización de las vistas.
- `src/styles/main.css`: sección desplegable y diseño adaptable.
- `tests/backup.test.mjs`: cinco casos nuevos; 24 pruebas en total.

## Formato

El documento contiene `app: "fitfinder"`, `version: 1`, una fecha ISO `exportedAt`, `favorites` (IDs) y `routines` (nombre, ID, ejercicios ordenados con series y repeticiones). Los límites son 1 MB y 100 rutinas por archivo. Si una colección supera esos límites, la exportación comunica que no puede crear una copia compatible; no descarga una copia incompleta.

`parseBackup` trata el JSON como `unknown`: comprueba versión, fecha, listas, IDs, nombres, duplicados, catálogo y prescripciones. Rechaza todo el archivo si algún dato no es válido. No modifica el estado durante la lectura o el resumen. Las rutinas se reconstruyen con campos conocidos y sus nombres se presentan mediante `textContent`.

## Importación

1. Selecciona el archivo JSON.
2. Revisa cuántos favoritos y rutinas contiene y cuántos se añadirán.
3. Pulsa Añadir respaldo para confirmar o Cancelar para salir sin cambios.

La importación conserva los datos actuales. Los favoritos se combinan sin duplicados. Las rutinas idénticas por nombre, orden y prescripción se omiten, incluso si sus IDs difieren. Una rutina con el mismo nombre pero contenido diferente se añade como otra rutina: no sobrescribe la existente. Las incorporadas reciben IDs nuevos para evitar colisiones.

Antes de confirmar se vuelve a comparar el archivo con el estado actual. Así se respetan cambios realizados después de seleccionar el archivo. El último archivo elegido prevalece si se solapan lecturas asíncronas.

La selección y el resumen no persisten nada. Al confirmar, favoritos y rutinas se guardan por separado en sus claves habituales de localStorage. Si una escritura falla, puede haberse guardado una colección y la otra no: el aviso informa que no se guardó todo y recomienda descargar una copia. Ambas colecciones siguen disponibles en memoria durante esa sesión.

Los borradores aún no guardados de nombres/series/repeticiones no se exportan ni se guardan por importar una copia. Solo se exporta el estado aplicado al modelo. Los cambios que fallaron al escribirse en localStorage también se pueden recuperar descargando ese estado de sesión.

## Cómo probar

1. Guarda favoritos y crea una rutina con dos ejercicios.
2. Descarga el respaldo y verifica que aparece un archivo `fitfinder-respaldo-FECHA.json` en las descargas del navegador.
3. Selecciónalo para importar: el resumen debe indicar cero incorporaciones porque esos datos ya existen.
4. Cancela y verifica que no cambió nada.
5. Usa el archivo en otro navegador con FitFinder: revisa el resumen, confirma y recarga; deben conservarse favoritos, orden y prescripciones.
6. Prueba un archivo con JSON inválido: debe mostrar un error sin cambiar tus datos.
7. Usa Tab y Enter para abrir la sección y recorrer sus controles.
8. Ejecuta `npm test` y `npm run build`.

Validado: 24 pruebas automatizadas, compilación, rechazo de JSON dañado, resumen/cancelación, importación aditiva, persistencia tras recarga, descarga real y reimportación del archivo generado sin duplicados. Revisado a 320 px sin desbordamiento horizontal. Solo se eliminó la rutina temporal de QA; la rutina existente se conservó. El archivo descargado durante QA contiene esa rutina temporal y puede omitirse al usar la aplicación normalmente.

No hay subida a Vercel ni commit nuevo en esta etapa.
