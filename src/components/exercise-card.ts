import { favoriteButton } from './favorite-button';
import type { Exercise } from '../types/exercise';

export function exerciseCard(exercise: Exercise, index: number, onOpen: (exercise: Exercise, trigger: HTMLButtonElement) => void, isFavorite: boolean, onToggle: () => void): HTMLElement {
  const card = document.createElement('article');
  card.className = 'exercise-card';
  const anatomical = exercise.illustration?.kind === 'anatomical';
  // This template contains only the trusted, local catalog; search input is never inserted here.
  card.innerHTML = `
    <div class="card-image${anatomical ? ' anatomy-image' : ''}">
      <img src="${exercise.image}" alt="" decoding="async" loading="lazy" width="${anatomical ? 1536 : 260}" height="${anatomical ? 1024 : 210}" />
      <span class="image-label">${anatomical ? 'Anatomía' : 'Ilustración'} · ${String(index + 1).padStart(2, '0')}</span>
      <span class="equipment-label">${exercise.equipment}</span>
    </div>
    <div class="card-body">
      <div class="card-meta"><span>${exercise.muscleGroup}</span><span class="level"><span class="level-dot ${exercise.difficulty.toLowerCase()}"></span>${exercise.difficulty}</span></div>
      <h3>${exercise.name}</h3>
      <p>${exercise.description}</p>
      <div class="card-footer"><i data-lucide="focus" aria-hidden="true"></i><span>${exercise.primaryMuscles.join(' · ')}</span></div>
    </div>`;
  card.querySelector<HTMLImageElement>('img')!.alt = exercise.illustration?.alt ?? '';
  const openButton = document.createElement('button');
  openButton.type = 'button';
  openButton.dataset.detailId = exercise.id;
  openButton.className = 'card-detail-button';
  openButton.textContent = 'Ver ejercicio';
  openButton.setAttribute('aria-label', `Ver detalle de ${exercise.name}`);
  openButton.setAttribute('aria-haspopup', 'dialog');
  openButton.setAttribute('aria-controls', 'exercise-detail');
  openButton.addEventListener('click', () => onOpen(exercise, openButton));
  card.querySelector('.card-body')!.append(openButton);
  card.querySelector('.card-image')!.append(favoriteButton(exercise, isFavorite, onToggle));
  return card;
}
