import { createAddToRoutine } from './add-to-routine';
import type { RoutinesStore } from '../state/routines';
import { updateFavoriteButton } from './favorite-button';
import type { Exercise } from '../types/exercise';

/** A single native modal provides focus containment, Escape and an inert background. */
export function createExerciseDetail(container: HTMLElement, favorites: {
  has: (id: string) => boolean;
  toggle: (exercise: Exercise) => void;
  warning: () => string;
  onClose: (exerciseId: string, opener: HTMLButtonElement | null) => HTMLButtonElement | null;
}, routines: RoutinesStore, onRoutineChange: () => void) {
  const dialog = document.createElement('dialog');
  dialog.id = 'exercise-detail';
  dialog.className = 'exercise-detail';
  dialog.setAttribute('aria-labelledby', 'detail-title');
  dialog.setAttribute('aria-describedby', 'detail-description');
  dialog.innerHTML = `
    <div class="detail-topbar"><span class="eyebrow">CONOCE EL MOVIMIENTO</span><button type="button" class="detail-close" aria-label="Cerrar detalle del ejercicio" autofocus><span aria-hidden="true">×</span></button></div>
    <div class="detail-content">
      <figure class="detail-figure"><img width="520" height="310" alt="" /><figcaption>Ilustración del grupo muscular · No representa la técnica del ejercicio.</figcaption></figure>
      <div class="detail-heading"><span class="eyebrow" id="detail-group"></span><h2 id="detail-title"></h2><p id="detail-description"></p></div>
      <dl class="detail-facts"><div><dt>Grupo muscular</dt><dd id="detail-muscle"></dd></div><div><dt>Dificultad</dt><dd id="detail-difficulty"></dd></div><div><dt>Equipamiento</dt><dd id="detail-equipment"></dd></div></dl>
      <button type="button" class="detail-favorite primary-button"></button><p class="detail-save-status" role="status" aria-live="polite"></p>
      <section class="detail-section" aria-labelledby="detail-muscles-title"><h3 id="detail-muscles-title">Músculos principales</h3><ul class="muscle-tags"></ul></section>
      <section class="detail-section" aria-labelledby="detail-steps-title"><h3 id="detail-steps-title">Cómo hacerlo</h3><ol class="detail-steps"></ol></section>
      <p class="detail-footnote">Empieza por conocer el movimiento. Elige un ritmo y una carga que puedas controlar.</p>
    </div>`;
  const addToRoutine = createAddToRoutine(dialog.querySelector('.detail-content')!, routines, onRoutineChange);
  container.append(dialog);
  const closeButton = dialog.querySelector<HTMLButtonElement>('.detail-close')!;
  let trigger: HTMLButtonElement | null = null;
  let current: Exercise | null = null;
  const favorite = dialog.querySelector<HTMLButtonElement>('.detail-favorite')!;
  const updateFavorite = (): void => {
    if (!current) return;
    const active = favorites.has(current.id);
    updateFavoriteButton(favorite, current, active);
    favorite.textContent = active ? 'Guardado en favoritos' : 'Guardar en favoritos';
  };
  favorite.addEventListener('click', () => {
    if (!current) return;
    favorites.toggle(current);
    updateFavorite();
    dialog.querySelector('.detail-save-status')!.textContent = favorites.warning() || (favorites.has(current.id) ? 'Ejercicio guardado en favoritos.' : 'Ejercicio eliminado de favoritos.');
  });
  let pointerStartedOutside = false;
  const outside = (event: PointerEvent): boolean => {
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };
  // Keep Tab at the dialog boundaries, including in embedded browser surfaces.
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter(control => control.getClientRects().length > 0 && getComputedStyle(control).visibility !== 'hidden');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.querySelector('.routine-view-link')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('pointerdown', event => { pointerStartedOutside = outside(event); });
  dialog.addEventListener('pointerup', event => {
    if (pointerStartedOutside && outside(event)) dialog.close();
    pointerStartedOutside = false;
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('detail-open');
    const replacement = current ? favorites.onClose(current.id, trigger) : null;
    const target = replacement ?? (trigger?.isConnected && !trigger.closest('[hidden]') ? trigger : null);
    target?.focus({ preventScroll: true });
    current = null;
    trigger = null;
  });
  return {
    close(): void { if (dialog.open) dialog.close(); },
    get isOpen(): boolean { return dialog.open; },
    open(exercise: Exercise, opener: HTMLButtonElement): void {
      if (dialog.open) return;
      trigger = opener;
      current = exercise;
      addToRoutine.reset(exercise);
      updateFavorite();
      dialog.querySelector('.detail-save-status')!.textContent = favorites.warning();
      const text = (selector: string, value: string): void => {
        dialog.querySelector(selector)!.textContent = value;
      };
      text('#detail-title', exercise.name);
      text('#detail-group', exercise.muscleGroup);
      text('#detail-description', exercise.description);
      text('#detail-muscle', exercise.muscleGroup);
      text('#detail-difficulty', exercise.difficulty);
      text('#detail-equipment', exercise.equipment);
      const image = dialog.querySelector<HTMLImageElement>('img')!;
      image.src = exercise.image;
      image.alt = exercise.illustration?.alt ?? '';
      image.decoding = 'async';
      const anatomical = exercise.illustration?.kind === 'anatomical';
      dialog.querySelector('.detail-figure')!.classList.toggle('anatomy-figure', anatomical);
      text('figcaption', anatomical ? `Ilustración anatómica orientativa de ${exercise.name.toLowerCase()} · Músculos destacados en rojo.` : 'Ilustración del grupo muscular · No representa la técnica del ejercicio.');
      const populate = (selector: string, values: string[]): void => {
        dialog.querySelector(selector)!.replaceChildren(...values.map(value => {
          const item = document.createElement('li');
          item.textContent = value;
          return item;
        }));
      };
      populate('.muscle-tags', exercise.primaryMuscles);
      populate('.detail-steps', exercise.instructions);
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('detail-open');
      closeButton.focus({ preventScroll: true });
    },
  };
}
