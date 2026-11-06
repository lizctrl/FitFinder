import type { FavoritesStore } from '../state/favorites';
import type { RoutinesStore } from '../state/routines';
import { createBackup, parseBackup, newBackupRoutines, MAX_BACKUP_BYTES, type Backup } from '../services/backup';

export function createBackupPanel(container: HTMLElement, favorites: FavoritesStore, routines: RoutinesStore, validIds: string[], onChange: () => void) {
  container.innerHTML = `<details class="backup-panel"><summary><span>Tu progreso, contigo</span><span class="backup-summary-action">Copias de seguridad <span aria-hidden="true">＋</span></span></summary>
    <div class="backup-content"><p>Descarga tus favoritos y rutinas para llevarlos a otro navegador o recuperarlos después.</p><p class="backup-hint">La copia incluye los cambios guardados. Las series o nombres que aún estás editando no se incluyen. Formato JSON: hasta 1 MB y 100 rutinas.</p>
    <div class="backup-actions"><button type="button" class="secondary-button" id="backup-export">Descargar respaldo ↓</button><label class="backup-file-label" for="backup-file">Seleccionar respaldo<input id="backup-file" type="file" accept=".json,application/json" /></label></div>
    <p class="backup-status" role="status" aria-live="polite"></p>
    <section class="backup-preview" aria-labelledby="backup-preview-title" hidden><h3 id="backup-preview-title" tabindex="-1">Revisa tu respaldo</h3><p class="backup-counts"></p><p>Se añadirán los favoritos que falten y las rutinas diferentes. Tus datos actuales se conservarán; las rutinas idénticas se omitirán.</p><ul class="backup-routine-names"></ul><div class="backup-actions"><button type="button" id="backup-confirm" class="primary-button">Añadir respaldo</button><button type="button" id="backup-cancel" class="secondary-button">Cancelar</button></div></section></div></details>`;
  const fileInput = container.querySelector<HTMLInputElement>('#backup-file')!;
  const preview = container.querySelector<HTMLElement>('.backup-preview')!;
  const status = container.querySelector<HTMLElement>('.backup-status')!;
  const confirm = container.querySelector<HTMLButtonElement>('#backup-confirm')!;
  let pending: Backup | null = null;
  let selection = 0;
  const clear = (): void => { pending = null; preview.hidden = true; fileInput.value = ''; };
  const quantity = (count: number, singular: string, plural = `${singular}s`): string => `${count} ${count === 1 ? singular : plural}`;
  const counts = (data: Backup): void => {
    const newFavorites = data.favorites.filter(id => !favorites.has(id)).length;
    const newRoutines = newBackupRoutines(routines.list, data.routines);
    container.querySelector('.backup-counts')!.textContent = `El archivo contiene ${quantity(data.favorites.length, 'favorito')} y ${quantity(data.routines.length, 'rutina')}. Se añadirán ${quantity(newFavorites, 'favorito')} y ${quantity(newRoutines.length, 'rutina')}.`;
    container.querySelector('.backup-routine-names')!.replaceChildren(...newRoutines.map(routine => {
      const li = document.createElement('li'); li.textContent = `${routine.name} · ${quantity(routine.items.length, 'ejercicio')}`; return li;
    }));
  };
  fileInput.addEventListener('change', async () => {
    const token = ++selection;
    const file = fileInput.files?.[0];
    pending = null; preview.hidden = true; status.textContent = '';
    if (!file) return;
    if (file.size > MAX_BACKUP_BYTES) { status.textContent = 'Selecciona un archivo de hasta 1 MB.'; fileInput.value = ''; return; }
    status.textContent = 'Leyendo respaldo…';
    try {
      const text = await file.text();
      if (token !== selection) return;
      const result = parseBackup(text, validIds);
      if (!result.ok) { status.textContent = result.message; fileInput.value = ''; return; }
      pending = result.data; counts(pending); preview.hidden = false; status.textContent = 'Archivo válido. Revisa el resumen antes de añadirlo.';
      container.querySelector<HTMLHeadingElement>('#backup-preview-title')!.focus();
    } catch {
      if (token !== selection) return;
      status.textContent = 'No pudimos leer ese archivo. Vuelve a seleccionarlo.'; fileInput.value = '';
    }
  });
  container.querySelector('#backup-cancel')!.addEventListener('click', () => { ++selection; clear(); status.textContent = 'Importación cancelada. Tus datos no cambiaron.'; fileInput.focus(); });
  confirm.addEventListener('click', () => {
    if (!pending) return;
    // Recompute against current state so edits made after selecting the file are retained.
    const incoming = newBackupRoutines(routines.list, pending.routines);
    const favoriteCount = pending.favorites.filter(id => !favorites.has(id)).length;
    const favoritesSaved = favorites.merge(pending.favorites);
    const routinesSaved = routines.appendImported(incoming);
    clear(); onChange();
    status.textContent = favoritesSaved && routinesSaved ? `Respaldo añadido: ${quantity(favoriteCount, 'favorito')} y ${quantity(incoming.length, 'rutina')}.` : 'Respaldo añadido a esta sesión, pero no se pudieron guardar todos los datos. Descarga una copia antes de cerrar la página.';
    fileInput.focus();
  });
  container.querySelector('#backup-export')!.addEventListener('click', () => {
    let url: string | undefined;
    try {
      const data = createBackup(favorites.list, routines.list);
      const text = JSON.stringify(data, null, 2);
      const validation = parseBackup(text, validIds);
      if (!validation.ok) { status.textContent = `No se pudo crear un respaldo compatible: ${validation.message}`; return; }
      url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = `fitfinder-respaldo-${data.exportedAt.slice(0, 10)}.json`;
      document.body.append(link); link.click(); link.remove();
      status.textContent = 'Descarga del respaldo iniciada. Conserva el archivo para recuperar tus datos.';
      const objectUrl = url; window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch { if (url) URL.revokeObjectURL(url); status.textContent = 'No pudimos iniciar la descarga. Inténtalo de nuevo.'; }
  });
}
