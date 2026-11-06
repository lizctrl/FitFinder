import type { Exercise } from '../types/exercise';
import type { RoutinesStore } from '../state/routines';
import type { RoutineResult } from '../types/routine';

export function createRoutinesView(container: HTMLElement, store: RoutinesStore, exercises: Exercise[], onChange: () => void, onOpen: (exercise: Exercise, trigger: HTMLButtonElement) => void) {
  container.innerHTML = `
    <div class="section-heading"><div><span class="eyebrow muted">UN PLAN QUE SE ADAPTA A TI</span><h2 id="routines-title" tabindex="-1">Tus rutinas<span>.</span></h2></div><span class="routine-kicker">TU ESPACIO PARA ENTRENAR</span></div>
    <form class="routine-create"><div><label for="routine-name">Crea tu próxima rutina</label><input id="routine-name" name="name" required maxlength="60" placeholder="Ej. Fuerza de cuerpo completo" /></div><button class="primary-button" type="submit">Crear rutina <span aria-hidden="true">↗</span></button></form>
    <p class="routine-status" role="status" aria-live="polite"></p><p class="routine-warning save-warning" role="status" hidden></p>
    <div class="routines-list"></div>`;
  const list = container.querySelector<HTMLDivElement>('.routines-list')!;
  const input = container.querySelector<HTMLInputElement>('#routine-name')!;
  const status = container.querySelector<HTMLParagraphElement>('.routine-status')!;
  function report(result: RoutineResult): void {
    status.textContent = result.message;
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
    list.replaceChildren();
    const routines = store.list;
    if (!routines.length) {
      const empty = document.createElement('div'); empty.className = 'empty-state routine-empty';
      empty.innerHTML = '<span class="empty-symbol" aria-hidden="true">＋</span><h3>Tu próximo entrenamiento empieza aquí</h3><p>Crea una rutina y añade ejercicios desde el catálogo. Tú eliges las series y repeticiones.</p>';
      list.append(empty);
    }
    for (const routine of routines) {
      const card = document.createElement('article'); card.className = 'routine-card'; card.dataset.routineId = routine.id;
      const heading = document.createElement('h3'); heading.textContent = routine.name; heading.tabIndex = -1;
      const meta = document.createElement('p'); meta.className = 'routine-meta'; meta.textContent = `${routine.items.length} ${routine.items.length === 1 ? 'ejercicio' : 'ejercicios'} · ${routine.items.reduce((sum, item) => sum + item.sets, 0)} series en total`;
      const rename = document.createElement('form'); rename.className = 'routine-rename';
      const nameLabel = document.createElement('label'); nameLabel.className = 'sr-only'; nameLabel.textContent = 'Nombre de la rutina';
      const name = document.createElement('input'); name.value = routine.name; name.required = true; name.maxLength = 60;
      nameLabel.append(name);
      const saveName = document.createElement('button'); saveName.type = 'submit'; saveName.className = 'secondary-button'; saveName.textContent = 'Guardar nombre';
      rename.append(nameLabel, saveName);
      // The label wraps its input while remaining visually present for editing.
      nameLabel.className = 'routine-name-label';
      rename.addEventListener('submit', event => {
        event.preventDefault(); const result = store.rename(routine.id, name.value); report(result);
        if (result.ok) render(routine.id);
      });
      card.append(heading, meta, rename);
      if (!routine.items.length) {
        const text = document.createElement('p'); text.className = 'routine-hint'; text.textContent = 'Aún no hay ejercicios. Abre uno del catálogo y pulsa Agregar a mi rutina.'; card.append(text);
      }
      for (const item of routine.items) {
        const exercise = exercises.find(exercise => exercise.id === item.exerciseId)!;
        const row = document.createElement('div'); row.className = 'routine-exercise';
        const title = action(exercise.name, () => onOpen(exercise, title), 'routine-exercise-title');
        title.dataset.routineExerciseId = `${routine.id}:${exercise.id}`;
        title.setAttribute('aria-haspopup', 'dialog');
        const form = document.createElement('form'); form.className = 'routine-prescription';
        const numberField = (label: string, value: number, max: number) => {
          const field = document.createElement('label'); field.textContent = label;
          const number = document.createElement('input'); number.type = 'number'; number.required = true; number.min = '1'; number.max = String(max); number.step = '1'; number.value = String(value);
          number.setAttribute('aria-label', `${label} de ${exercise.name}`); field.append(number); form.append(field); return number;
        };
        const sets = numberField('Series', item.sets, 50); const reps = numberField('Repeticiones', item.reps, 100);
        const save = document.createElement('button'); save.type = 'submit'; save.className = 'secondary-button'; save.textContent = 'Guardar'; save.setAttribute('aria-label', `Guardar series y repeticiones de ${exercise.name}`); form.append(save);
        form.addEventListener('submit', event => {
          event.preventDefault(); const result = store.update(routine.id, exercise.id, sets.valueAsNumber, reps.valueAsNumber); report(result);
          if (result.ok) { const updated = store.list.find(item => item.id === routine.id)!; meta.textContent = `${updated.items.length} ejercicios · ${updated.items.reduce((sum, item) => sum + item.sets, 0)} series en total`; }
        });
        const remove = action('Quitar', () => { report(store.removeExercise(routine.id, exercise.id)); render(routine.id); }, 'text-button danger-button');
        remove.setAttribute('aria-label', `Quitar ${exercise.name} de ${routine.name}`);
        row.append(title, form, remove); card.append(row);
      }
      const footer = document.createElement('div'); footer.className = 'routine-card-footer';
      const browse = document.createElement('a'); browse.href = '#catalog'; browse.className = 'secondary-button'; browse.textContent = 'Añadir ejercicios ↗';
      const confirmation = document.createElement('div'); confirmation.className = 'routine-delete-confirm'; confirmation.hidden = true;
      const prompt = document.createElement('p'); prompt.textContent = `¿Eliminar “${routine.name}” y sus ejercicios?`;
      const deleteButton = action('Eliminar rutina', () => { confirmation.hidden = false; confirm.focus(); }, 'text-button danger-button');
      const confirm = action('Sí, eliminar', () => {
        report(store.remove(routine.id)); render(); input.focus();
      }, 'secondary-button danger-button');
      const cancel = action('Conservar rutina', () => { confirmation.hidden = true; deleteButton.focus(); });
      confirmation.append(prompt, confirm, cancel); footer.append(browse, deleteButton); card.append(footer, confirmation); list.append(card);
    }
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
