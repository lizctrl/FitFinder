import { difficulties, equipmentOptions, muscleGroups } from '../types/exercise';

function options(items: readonly string[]): string {
  return items.map(item => `<option value="${item}">${item}</option>`).join('');
}
export function filtersMarkup(): string {
  return `<section class="filter-panel" aria-label="Buscar y filtrar ejercicios">
    <div class="search-field"><i data-lucide="search" aria-hidden="true"></i><label class="sr-only" for="search">Buscar por nombre</label><input id="search" type="search" placeholder="¿Qué quieres entrenar hoy?" autocomplete="off" maxlength="100" aria-keyshortcuts="Control+k Meta+k" aria-describedby="search-shortcut-hint" /><kbd aria-hidden="true">Ctrl/⌘ K</kbd><span id="search-shortcut-hint" class="sr-only">Atajo: Control más K, o Comando más K en Mac, cuando no estás editando un campo.</span></div>
    <div class="select-field"><label for="muscle">Grupo muscular</label><select id="muscle"><option value="">Todos los músculos</option>${options(muscleGroups)}</select></div>
    <div class="select-field"><label for="difficulty">Dificultad</label><select id="difficulty"><option value="">Todos los niveles</option>${options(difficulties)}</select></div>
    <div class="select-field"><label for="equipment">Equipamiento</label><select id="equipment"><option value="">Todo el equipamiento</option>${options(equipmentOptions)}</select></div>
  </section>
  <div class="categories" role="group" aria-label="Categorías musculares">
    <button type="button" class="category active" data-group="" aria-pressed="true"><i data-lucide="layout-grid" aria-hidden="true"></i>Todos</button>
    ${muscleGroups.map(group => `<button type="button" class="category" data-group="${group}" aria-pressed="false">${group}</button>`).join('')}
  </div>`;
}
