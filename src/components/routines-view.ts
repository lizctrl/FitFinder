import { createRoutinePdfExport } from './routine-pdf-export';
import type { Exercise } from '../types/exercise';
import type { RoutinesStore } from '../state/routines';
import type { Routine, RoutineResult } from '../types/routine';

export function createRoutinesView(container: HTMLElement, store: RoutinesStore, exercises: Exercise[], onChange: () => void, onOpen: (exercise: Exercise, trigger: HTMLButtonElement) => void) {
  container.innerHTML = `
    <div class="section-heading"><div><span class="eyebrow muted">UN PLAN QUE SE ADAPTA A TI</span><h2 id="routines-title" tabindex="-1">Tus rutinas<span>.</span></h2></div><span class="routine-kicker">TU ESPACIO PARA ENTRENAR</span></div>
    <form class="routine-create"><div><label for="routine-name">Crea tu próxima rutina</label><input id="routine-name" name="name" required maxlength="60" placeholder="Ej. Fuerza de cuerpo completo" /></div><button class="primary-button" type="submit">Crear rutina <span aria-hidden="true">↗</span></button></form>
    <p class="routine-status" role="status" aria-live="polite"></p><p class="routine-warning save-warning" role="status" hidden></p>
    <div class="routine-undo" hidden><div><p class="routine-undo-message" role="status" aria-live="polite"></p><p class="routine-undo-hint">Puedes recuperar la última rutina eliminada mientras esta página siga abierta.</p></div><button type="button" class="secondary-button" id="routine-undo-button">Deshacer eliminación</button></div>
    <div class="routines-list"></div>`;
  const list = container.querySelector<HTMLDivElement>('.routines-list')!;
  const input = container.querySelector<HTMLInputElement>('#routine-name')!;
  const status = container.querySelector<HTMLParagraphElement>('.routine-status')!;
  const undoPanel = container.querySelector<HTMLDivElement>('.routine-undo')!;
  const undoButton = container.querySelector<HTMLButtonElement>('#routine-undo-button')!;
  let deleted: { routine: Routine; index: number } | null = null;
  undoButton.addEventListener('click', () => {
    if (!deleted) return;
    const result = store.restore(deleted.routine, deleted.index);
    report(result);
    if (!result.ok) return;
    deleted = null; undoPanel.hidden = true;
    render(result.routineId);
  });
  function report(result: RoutineResult, localStatus?: HTMLElement): void {
    (localStatus ?? status).textContent = result.message;
    onChange();
    const warning = container.querySelector<HTMLParagraphElement>('.routine-warning')!;
    warning.textContent = store.warning;
    warning.hidden = !store.warning;
  }
  const action = (text: string, handler: () => void, className = 'secondary-button'): HTMLButtonElement => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = className; button.textContent = text;
    button.addEventListener('click', handler);
    return button;
  };
  function render(focusId?: string): void {
    // Preserve only edited fields. Clean fields must reflect the latest saved state.
    const drafts = new Map<string, string>();
    list.querySelectorAll<HTMLInputElement>('input[data-draft-key]').forEach(field => {
      if (field.value !== field.defaultValue) drafts.set(field.dataset.draftKey!, field.value);
    });
    list.replaceChildren();
    const routines = store.list;
    if (!routines.length) {
      const empty = document.createElement('div'); empty.className = 'empty-state routine-empty';
      empty.innerHTML = '<span class="empty-symbol" aria-hidden="true">＋</span><h3>Tu próximo entrenamiento empieza aquí</h3><p>Crea una rutina y añade ejercicios desde el catálogo. Tú eliges las series y repeticiones.</p>';
      list.append(empty);
    }
    for (const routine of routines) {
      const card = document.createElement('article'); card.className = 'routine-card'; card.dataset.routineId = routine.id; card.setAttribute('aria-label', routine.name);
      const heading = document.createElement('h3'); heading.textContent = routine.name; heading.tabIndex = -1;
      const meta = document.createElement('p'); meta.className = 'routine-meta'; meta.textContent = `${routine.items.length} ${routine.items.length === 1 ? 'ejercicio' : 'ejercicios'} · ${routine.items.reduce((sum, item) => sum + item.sets, 0)} series en total`;
      const localStatus = document.createElement('p'); localStatus.className = 'routine-local-status'; localStatus.setAttribute('role', 'status');
      const rename = document.createElement('form'); rename.className = 'routine-rename'; rename.setAttribute('aria-label', `Renombrar ${routine.name}`);
      const nameLabel = document.createElement('label'); nameLabel.className = 'sr-only'; nameLabel.textContent = 'Nombre de la rutina';
      const name = document.createElement('input'); name.defaultValue = routine.name; name.dataset.draftKey = `${routine.id}:name`; name.required = true; name.maxLength = 60;
      nameLabel.append(name);
      const saveName = document.createElement('button'); saveName.type = 'submit'; saveName.className = 'secondary-button'; saveName.textContent = 'Guardar nombre';
      rename.append(nameLabel, saveName);
      // The label wraps its input while remaining visually present for editing.
      nameLabel.className = 'routine-name-label';
      rename.addEventListener('submit', event => {
        event.preventDefault(); const result = store.rename(routine.id, name.value); report(result, localStatus);
        if (result.ok) { name.value = name.value.trim(); name.defaultValue = name.value; render(routine.id); status.textContent = result.message; }
      });
      card.append(heading, meta, rename, localStatus);
      if (!routine.items.length) {
        const text = document.createElement('p'); text.className = 'routine-hint'; text.textContent = 'Aún no hay ejercicios. Abre uno del catálogo y pulsa Agregar a mi rutina.'; card.append(text);
      }
      for (const [index, item] of routine.items.entries()) {
        const exercise = exercises.find(exercise => exercise.id === item.exerciseId)!;
        const row = document.createElement('div'); row.className = 'routine-exercise'; row.dataset.exerciseId = exercise.id;
        const title = action(exercise.name, () => onOpen(exercise, title), 'routine-exercise-title');
        title.dataset.routineExerciseId = `${routine.id}:${exercise.id}`;
        title.setAttribute('aria-haspopup', 'dialog');
        title.setAttribute('aria-controls', 'exercise-detail');
        const identity = document.createElement('div'); identity.className = 'routine-exercise-heading';
        const position = document.createElement('span'); position.className = 'routine-position';
        position.textContent = String(index + 1).padStart(2, '0');
        position.setAttribute('aria-label', `Posición ${index + 1} de ${routine.items.length}`);
        identity.append(position, title);
        const order = document.createElement('div'); order.className = 'routine-order-controls';
        order.setAttribute('role', 'group'); order.setAttribute('aria-label', `Orden de ${exercise.name}`);
        const orderLabel = document.createElement('span'); orderLabel.textContent = 'Orden'; orderLabel.className = 'order-label'; order.append(orderLabel);
        for (const direction of [-1, 1] as const) {
          const label = `${direction === -1 ? 'Subir' : 'Bajar'} ${exercise.name}`;
          const move = action(direction === -1 ? '↑' : '↓', () => {
            const result = store.moveExercise(routine.id, exercise.id, direction);
            report(result);
            if (!result.ok) return;
            render();
            status.textContent = `${exercise.name}: ${result.message}`;
            const updatedCard = [...list.querySelectorAll<HTMLElement>('[data-routine-id]')].find(card => card.dataset.routineId === routine.id);
            const updatedRow = [...(updatedCard?.querySelectorAll<HTMLElement>('[data-exercise-id]') ?? [])].find(row => row.dataset.exerciseId === exercise.id);
            const sameControl = [...(updatedRow?.querySelectorAll<HTMLButtonElement>('[data-move]') ?? [])].find(button => button.dataset.move === String(direction));
            if (sameControl && !sameControl.disabled) sameControl.focus();
            else updatedRow?.querySelector<HTMLButtonElement>('.routine-exercise-title')?.focus();
          }, 'order-button secondary-button');
          move.dataset.move = String(direction);
          move.setAttribute('aria-label', label); move.title = label;
          move.disabled = direction === -1 ? index === 0 : index === routine.items.length - 1;
          order.append(move);
        }
        const form = document.createElement('form'); form.className = 'routine-prescription'; form.setAttribute('aria-label', `Series y repeticiones de ${exercise.name} en ${routine.name}`);
        const numberField = (label: string, value: number, max: number) => {
          const field = document.createElement('label'); field.textContent = label;
          const number = document.createElement('input'); number.type = 'number'; number.required = true; number.min = '1'; number.max = String(max); number.step = '1'; number.defaultValue = String(value); number.dataset.draftKey = `${routine.id}:${exercise.id}:${label}`;
          number.setAttribute('aria-label', `${label} de ${exercise.name}`); field.append(number); form.append(field); return number;
        };
        const sets = numberField('Series', item.sets, 50); const reps = numberField('Repeticiones', item.reps, 100);
        const save = document.createElement('button'); save.type = 'submit'; save.className = 'secondary-button'; save.textContent = 'Guardar'; save.setAttribute('aria-label', `Guardar series y repeticiones de ${exercise.name}`); form.append(save);
        form.addEventListener('submit', event => {
          event.preventDefault(); const result = store.update(routine.id, exercise.id, sets.valueAsNumber, reps.valueAsNumber); report(result, localStatus);
          if (result.ok) { sets.defaultValue = sets.value; reps.defaultValue = reps.value; const updated = store.list.find(item => item.id === routine.id)!; meta.textContent = `${updated.items.length} ${updated.items.length === 1 ? 'ejercicio' : 'ejercicios'} · ${updated.items.reduce((sum, item) => sum + item.sets, 0)} series en total`; }
        });
        const remove = action('Quitar', () => { report(store.removeExercise(routine.id, exercise.id)); render(routine.id); }, 'text-button danger-button');
        remove.setAttribute('aria-label', `Quitar ${exercise.name} de ${routine.name}`);
        row.append(identity, order, form, remove); card.append(row);
      }
      if (routine.items.length) {
        card.append(createRoutinePdfExport(() => store.list.find(item => item.id === routine.id), exercises));
      }
      const footer = document.createElement('div'); footer.className = 'routine-card-footer';
      const browse = document.createElement('a'); browse.href = '#catalog'; browse.className = 'secondary-button'; browse.textContent = 'Añadir ejercicios ↗';
      const copyButton = action('Duplicar rutina', () => {
        const result = store.duplicate(routine.id); report(result);
        if (result.ok) render(result.routineId);
      });
      copyButton.setAttribute('aria-label', `Duplicar ${routine.name}`);
      copyButton.title = 'Crea una copia de los cambios guardados';
      const cardActions = document.createElement('div'); cardActions.className = 'routine-card-actions';
      const confirmation = document.createElement('div'); confirmation.className = 'routine-delete-confirm'; confirmation.hidden = true;
      const prompt = document.createElement('p'); prompt.textContent = `¿Eliminar “${routine.name}” y sus ejercicios?`;
      const deleteButton = action('Eliminar rutina', () => { confirmation.hidden = false; deleteButton.setAttribute('aria-expanded', 'true'); confirm.focus(); }, 'text-button danger-button');
      deleteButton.setAttribute('aria-expanded', 'false');
      confirmation.setAttribute('role', 'group');
      confirmation.setAttribute('aria-label', `Confirmar eliminación de ${routine.name}`);
      const confirm = action('Sí, eliminar', () => {
        // Read the latest saved data: this card's snapshot may predate a prescription edit.
        const current = store.list;
        const index = current.findIndex(item => item.id === routine.id);
        const snapshot = current[index];
        const result = store.remove(routine.id); report(result);
        if (!result.ok || !snapshot) return;
        deleted = { routine: snapshot, index };
        undoPanel.querySelector('.routine-undo-message')!.textContent = `“${snapshot.name}” se eliminó. Puedes deshacer esta acción.`;
        undoPanel.hidden = false;
        render(); undoButton.focus();
      }, 'secondary-button danger-button');
      const cancel = action('Conservar rutina', () => { confirmation.hidden = true; deleteButton.setAttribute('aria-expanded', 'false'); deleteButton.focus(); });
      confirmation.append(prompt, confirm, cancel); cardActions.append(copyButton, deleteButton); footer.append(browse, cardActions); card.append(footer, confirmation); list.append(card);
    }
    list.querySelectorAll<HTMLInputElement>('input[data-draft-key]').forEach(field => {
      const draft = drafts.get(field.dataset.draftKey!);
      if (draft !== undefined) field.value = draft;
    });
    const warning = container.querySelector<HTMLParagraphElement>('.routine-warning')!;
    warning.textContent = store.warning; warning.hidden = !store.warning;
    if (focusId) [...list.querySelectorAll<HTMLElement>('[data-routine-id]')].find(card => card.dataset.routineId === focusId)?.querySelector('h3')?.focus();
  }
  container.querySelector('.routine-create')!.addEventListener('submit', event => {
    event.preventDefault(); const result = store.create(input.value); report(result);
    if (result.ok) { input.value = ''; render(result.routineId); }
  });
  return { render };
}
