import { createIcons, Dumbbell, ArrowUpRight, Search, LayoutGrid, Focus, SlidersHorizontal, RotateCcw, MoveUpRight, Leaf, Heart } from 'lucide';
import { createRoutines } from './state/routines';
import { createRoutinesView } from './components/routines-view';
import { createFavorites } from './state/favorites';
import { exercises } from './data/exercises';
import { createExerciseDetail } from './components/exercise-detail';
import { exerciseCard } from './components/exercise-card';
import { filtersMarkup } from './components/filters';
import { filterExercises } from './filter-exercises';
import type { ExerciseFilters } from './types/exercise';
import './styles/main.css';

const icons = { Dumbbell, ArrowUpRight, Search, LayoutGrid, Focus, SlidersHorizontal, RotateCcw, MoveUpRight, Leaf, Heart };
const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('No se encontró el contenedor de FitFinder.');
app.innerHTML = `
  <a class="skip-link" href="#catalog">Saltar a los ejercicios</a>
  <header class="site-header"><div class="header-inner">
    <a href="./" class="brand" aria-label="FitFinder, inicio"><span class="brand-symbol"><i data-lucide="dumbbell" aria-hidden="true"></i></span>Fit<span>Finder</span><span class="brand-dot">.</span></a>
    <nav aria-label="Navegación principal"><a class="nav-link current" href="#catalog" data-view="exercises" aria-current="page">Ejercicios</a><a class="nav-link" href="#favorites" data-view="favorites">Favoritos <span id="favorite-count" class="favorite-count">0</span></a><a class="nav-link" href="#routines" data-view="routines">Rutinas</a></nav>
    <span class="header-note"><span></span> Tu ritmo. Tu progreso.</span>
  </div></header>
  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy"><span class="eyebrow"><span></span> CADA MOVIMIENTO CUENTA</span>
      <h1 id="hero-title">Encuentra el ejercicio<br>perfecto <em>para ti.</em></h1>
      <p>Más posibilidades, mejores movimientos. Explora ejercicios<br class="desktop-break"> y encuentra los que se adaptan a tu forma de entrenar.</p>
      <a href="#catalog" class="hero-link">Descubre tu próximo movimiento <i data-lucide="arrow-up-right" aria-hidden="true"></i></a></div>
      <div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="art-caption">ENCUENTRA TU EQUILIBRIO</span><div class="weight"><span class="weight-bar"></span><span class="plate plate-one"></span><span class="plate plate-two"></span><span class="plate plate-three"></span><span class="plate plate-four"></span></div><span class="art-badge"><i data-lucide="leaf"></i> Hecho para moverte</span><span class="art-plus">+</span></div>
    </section>
    <p id="save-warning" class="save-warning" role="status" aria-live="polite" hidden></p>
    <p id="favorite-feedback" class="sr-only" role="status" aria-live="polite"></p>
    <section id="catalog" class="catalog" aria-labelledby="catalog-title">
      <div class="section-heading"><div><span class="eyebrow muted">TU PRÓXIMO PASO EMPIEZA AQUÍ</span><h2 id="catalog-title">Explora los ejercicios<span>.</span></h2></div><span class="catalog-total">20 movimientos, muchas posibilidades <i data-lucide="move-up-right" aria-hidden="true"></i></span></div>
      ${filtersMarkup()}
      <div class="results-bar"><p id="result-count" role="status" aria-live="polite" aria-atomic="true"></p><button id="reset" type="button" class="reset-button" hidden><i data-lucide="rotate-ccw" aria-hidden="true"></i> Limpiar filtros</button><span class="results-note"><i data-lucide="sliders-horizontal" aria-hidden="true"></i> A tu medida</span></div>
      <div id="exercise-grid" class="exercise-grid"></div>
      <div id="empty-state" class="empty-state" hidden><i data-lucide="search" aria-hidden="true"></i><h3>No encontramos ese movimiento</h3><p>Prueba otro nombre o cambia los filtros para seguir explorando.</p><button id="empty-reset" class="primary-button" type="button">Ver todos los ejercicios</button></div>
    </section>
    <section id="routines" class="routines-section" aria-labelledby="routines-title" hidden></section>
    <aside class="bottom-note"><span class="note-icon"><i data-lucide="leaf" aria-hidden="true"></i></span><div><strong>El mejor entrenamiento empieza con un movimiento.</strong><p>Explora a tu ritmo y encuentra lo que funciona para ti.</p></div><span class="note-number">01 / EXPLORA</span></aside>
  </main>
  <footer><span class="footer-brand">FitFinder<span>.</span></span><span>Muévete con intención.</span><span>Catálogo local · Explora y aprende</span></footer>`;

const favorites = createFavorites(exercises.map(exercise => exercise.id));
const routines = createRoutines(exercises.map(exercise => exercise.id));
const viewFromHash = (): string => location.hash === '#routines' ? 'routines' : location.hash === '#favorites' ? 'favorites' : 'exercises';
let currentView = viewFromHash();
let detailChanged = false;
const detail = createExerciseDetail(app, {
  has: favorites.has,
  toggle: toggleFavorite,
  warning: () => favorites.warning,
  onClose: (id, opener) => {
    if (detailChanged) { render(); detailChanged = false; }
    if (currentView === 'routines') {
      routineView.render();
      const replacement = [...document.querySelectorAll<HTMLButtonElement>('[data-routine-exercise-id]')].find(button => button.dataset.routineExerciseId === opener?.dataset.routineExerciseId);
      if (!replacement) document.querySelector<HTMLHeadingElement>('#routines-title')!.focus({ preventScroll: true });
      return replacement ?? null;
    }
    const replacement = grid.querySelector<HTMLButtonElement>(`[data-detail-id="${id}"]`);
    if (!replacement) document.querySelector<HTMLHeadingElement>('#catalog-title')!.focus({ preventScroll: true });
    return replacement;
  },
}, routines, () => {
  showWarning();
});
const routineSection = document.querySelector<HTMLElement>('#routines')!;
const routineView = createRoutinesView(routineSection, routines, exercises, showWarning, detail.open);

const search = document.querySelector<HTMLInputElement>('#search')!;
const muscle = document.querySelector<HTMLSelectElement>('#muscle')!;
const difficulty = document.querySelector<HTMLSelectElement>('#difficulty')!;
const equipment = document.querySelector<HTMLSelectElement>('#equipment')!;
const reset = document.querySelector<HTMLButtonElement>('#reset')!;
const grid = document.querySelector<HTMLDivElement>('#exercise-grid')!;
const empty = document.querySelector<HTMLDivElement>('#empty-state')!;
const count = document.querySelector<HTMLParagraphElement>('#result-count')!;
const categories = document.querySelectorAll<HTMLButtonElement>('[data-group]');

function render(): void {
  const inRoutines = currentView === 'routines';
  document.querySelector<HTMLElement>('#catalog')!.hidden = inRoutines;
  routineSection.hidden = !inRoutines;
  if (inRoutines) routineView.render();
  const filters: ExerciseFilters = {
    query: search.value,
    muscleGroup: muscle.value as ExerciseFilters['muscleGroup'],
    difficulty: difficulty.value as ExerciseFilters['difficulty'],
    equipment: equipment.value as ExerciseFilters['equipment'],
  };
  const source = currentView === 'favorites' ? exercises.filter(exercise => favorites.has(exercise.id)) : exercises;
  const results = filterExercises(source, filters);
  grid.replaceChildren(...results.map(exercise => exerciseCard(exercise, exercises.indexOf(exercise), detail.open, favorites.has(exercise.id), () => toggleFavorite(exercise))));
  document.querySelector('#favorite-count')!.textContent = String(favorites.size);
  document.querySelector('#catalog-title')!.textContent = currentView === 'favorites' ? 'Tus ejercicios favoritos.' : 'Explora los ejercicios.';
  document.querySelector('#catalog-title')!.setAttribute('tabindex', '-1');
  document.querySelectorAll<HTMLAnchorElement>('[data-view]').forEach(link => {
    const active = link.dataset.view === currentView;
    link.classList.toggle('current', active);
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  const noFavorites = currentView === 'favorites' && favorites.size === 0;
  empty.querySelector('h3')!.textContent = noFavorites ? 'Tu selección empieza aquí' : 'No encontramos ese movimiento';
  empty.querySelector('p')!.textContent = noFavorites ? 'Guarda los ejercicios que te gusten con el corazón y vuelve a encontrarlos aquí.' : 'Prueba otro nombre o cambia los filtros para seguir explorando.';
  empty.querySelector('button')!.textContent = noFavorites ? 'Explorar ejercicios' : 'Limpiar filtros';
  showWarning();
  count.textContent = `${results.length} ${results.length === 1 ? 'ejercicio disponible' : 'ejercicios disponibles'}`;
  empty.hidden = results.length > 0;
  reset.hidden = !Object.values(filters).some(Boolean);
  categories.forEach(button => {
    const active = button.dataset.group === muscle.value;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  createIcons({ icons });
}
function showWarning(): void {
  const warning = document.querySelector<HTMLParagraphElement>('#save-warning')!;
  warning.textContent = [favorites.warning, routines.warning].filter(Boolean).join(' ');
  warning.hidden = !warning.textContent;
}
function toggleFavorite(exercise: typeof exercises[number]): void {
  const focused = document.activeElement;
  const index = focused instanceof HTMLButtonElement ? [...grid.querySelectorAll('[data-favorite-id]')].indexOf(focused) : -1;
  favorites.toggle(exercise.id);
  document.querySelector('#favorite-feedback')!.textContent = `${exercise.name}: ${favorites.has(exercise.id) ? 'guardado en' : 'eliminado de'} favoritos.`;
  if (detail.isOpen) {
    detailChanged = true;
    showWarning();
    return;
  }
  render();
  if (index >= 0) {
    const buttons = grid.querySelectorAll<HTMLButtonElement>('[data-favorite-id]');
    const replacement = grid.querySelector<HTMLButtonElement>(`[data-favorite-id="${exercise.id}"]`) ?? buttons[Math.min(index, buttons.length - 1)];
    if (replacement) replacement.focus({ preventScroll: true });
    else document.querySelector<HTMLHeadingElement>('#catalog-title')!.focus({ preventScroll: true });
  }
}
function syncView(): void {
  detail.close();
  currentView = viewFromHash();
  render();
  document.querySelector(currentView === 'routines' ? '#routines' : '#catalog')!.scrollIntoView({ block: 'start' });
  document.querySelector<HTMLHeadingElement>(currentView === 'routines' ? '#routines-title' : '#catalog-title')!.focus({ preventScroll: true });
}
window.addEventListener('hashchange', syncView);
function clearFilters(): void {
  search.value = muscle.value = difficulty.value = equipment.value = '';
  render();
  search.focus();
}
search.addEventListener('input', render);
[muscle, difficulty, equipment].forEach(select => select.addEventListener('change', render));
categories.forEach(button => button.addEventListener('click', () => {
  muscle.value = button.dataset.group ?? '';
  render();
}));
reset.addEventListener('click', clearFilters);
document.querySelector('#empty-reset')!.addEventListener('click', () => {
  if (currentView === 'favorites' && favorites.size === 0) {
    search.value = muscle.value = difficulty.value = equipment.value = '';
    location.hash = 'catalog';
  } else clearFilters();
});
document.addEventListener('keydown', event => {
  if (currentView !== 'routines' && !detail.isOpen && event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLSelectElement) && !(event.target instanceof HTMLTextAreaElement)) {
    event.preventDefault();
    search.focus();
  }
});
render();
