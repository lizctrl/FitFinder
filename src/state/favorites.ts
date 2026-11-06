import { readStoredValue, writeStoredValue } from '../services/storage';

export const FAVORITES_KEY = 'fitfinder.favorites.v1';
export function createFavorites(validIds: readonly string[]) {
  const allowed = new Set(validIds);
  const stored = readStoredValue(FAVORITES_KEY);
  let warning = '';
  let ids = new Set<string>();
  if (!stored.ok) {
    warning = 'No pudimos leer tus favoritos. Puedes usarlos durante esta sesión; comprueba que el navegador permita guardar datos.';
  } else if (stored.value !== null) {
    if (Array.isArray(stored.value)) {
      ids = new Set(stored.value.filter((id): id is string => typeof id === 'string' && allowed.has(id)));
      if (ids.size !== stored.value.length) warning = 'Se omitieron favoritos duplicados o no válidos al cargar tus datos.';
    } else {
      warning = 'Los favoritos guardados no tienen un formato válido. Empieza una nueva selección para volver a guardarlos.';
    }
  }
  return {
    get list(): string[] { return [...ids]; },
    merge(incoming: readonly string[]): boolean {
      incoming.filter(id => allowed.has(id)).forEach(id => ids.add(id));
      const saved = writeStoredValue(FAVORITES_KEY, [...ids]);
      warning = saved ? '' : 'No se pudieron guardar los favoritos importados. Permanecen disponibles solo en esta sesión.';
      return saved;
    },
    has: (id: string): boolean => ids.has(id),
    get size(): number { return ids.size; },
    get warning(): string { return warning; },
    toggle(id: string): boolean {
      if (!allowed.has(id)) return false;
      if (ids.has(id)) ids.delete(id); else ids.add(id);
      const saved = writeStoredValue(FAVORITES_KEY, [...ids]);
      warning = saved ? '' : 'No se pudieron guardar los cambios. Tus favoritos funcionan en esta sesión, pero podrían perderse al recargar.';
      return saved;
    },
  };
}

export type FavoritesStore = ReturnType<typeof createFavorites>;
