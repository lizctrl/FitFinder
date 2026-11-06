import type { Exercise } from '../types/exercise';
import type { RoutinesStore } from '../state/routines';

/** Inline form inside the exercise dialog avoids stacking modals. */
export function createAddToRoutine(container: HTMLElement, store: RoutinesStore, onChange: () => void) {
  const section = document.createElement('section'); section.className = 'add-to-routine';
  section.setAttribute('aria-labelledby', 'add-routine-title');
  section.innerHTML = `<h3 id="add-routine-title">Tu próximo entrenamiento</h3>
    <form><label for="target-routine">Rutina</label><select id="target-routine" required></select>
    <div class="new-routine-field"><label for="new-routine-name">Nombre de la nueva rutina</label><input id="new-routine-name" maxlength="60" placeholder="Ej. Mi sesión de fuerza" /></div>
    <div class="add-prescription"><label for="add-sets">Series<input id="add-sets" type="number" min="1" max="50" step="1" value="3" required /></label><label for="add-reps">Repeticiones<input id="add-reps" type="number" min="1" max="100" step="1" value="12" required /></label></div>
    <button type="submit" class="primary-button">Agregar a mi rutina <span aria-hidden="true">＋</span></button></form>
    <p class="add-routine-status" role="status" aria-live="polite"></p><a class="routine-view-link" href="#routines">Ver mis rutinas ↗</a>`;
  container.append(section);
  const select = section.querySelector<HTMLSelectElement>('select')!;
  const name = section.querySelector<HTMLInputElement>('#new-routine-name')!;
  const newField = section.querySelector<HTMLDivElement>('.new-routine-field')!;
  const sets = section.querySelector<HTMLInputElement>('#add-sets')!;
  const reps = section.querySelector<HTMLInputElement>('#add-reps')!;
  const status = section.querySelector<HTMLParagraphElement>('.add-routine-status')!;
  let current: Exercise | null = null;
  const updateNewField = (): void => { newField.hidden = select.value !== 'new'; name.required = select.value === 'new'; };
  function populate(selected?: string): void {
    select.replaceChildren(...store.list.map(routine => new Option(routine.name, routine.id)), new Option('＋ Crear una nueva rutina', 'new'));
    if (selected && [...select.options].some(option => option.value === selected)) select.value = selected;
    updateNewField();
  }
  select.addEventListener('change', () => { updateNewField(); status.textContent = ''; });
  section.querySelector('form')!.addEventListener('submit', event => {
    event.preventDefault(); if (!current) return;
    let id = select.value;
    if (id === 'new') {
      const result = store.create(name.value);
      if (!result.ok || !result.routineId) { status.textContent = result.message; return; }
      id = result.routineId; populate(id); name.value = '';
    }
    const result = store.add(id, current.id, sets.valueAsNumber, reps.valueAsNumber);
    status.textContent = `${result.message}${store.warning ? ` ${store.warning}` : ''}`;
    onChange();
  });
  return {
    reset(exercise: Exercise): void {
      current = exercise; populate(select.value); name.value = ''; sets.value = '3'; reps.value = '12'; status.textContent = store.warning;
    },
  };
}
