import type { Exercise } from '../types/exercise';

export function updateFavoriteButton(button: HTMLButtonElement, exercise: Exercise, active: boolean): void {
  button.setAttribute('aria-pressed', String(active));
  button.setAttribute('aria-label', `${active ? 'Quitar de' : 'Guardar en'} favoritos: ${exercise.name}`);
  button.title = active ? 'Quitar de favoritos' : 'Guardar en favoritos';
  button.classList.toggle('is-favorite', active);
}
export function favoriteButton(exercise: Exercise, active: boolean, onToggle: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'favorite-button';
  button.dataset.favoriteId = exercise.id;
  button.innerHTML = '<i data-lucide="heart" aria-hidden="true"></i>';
  updateFavoriteButton(button, exercise, active);
  button.addEventListener('click', onToggle);
  return button;
}
