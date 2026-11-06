import { readStoredValue, writeStoredValue } from '../services/storage';
import type { Routine, RoutineItem, RoutineResult } from '../types/routine';

export const ROUTINES_KEY = 'fitfinder.routines.v1';
export const validSets = (value: number): boolean => Number.isInteger(value) && value >= 1 && value <= 50;
export const validReps = (value: number): boolean => Number.isInteger(value) && value >= 1 && value <= 100;
const validName = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 60;
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

export function createRoutines(validExerciseIds: readonly string[]) {
  const allowed = new Set(validExerciseIds);
  const stored = readStoredValue(ROUTINES_KEY);
  let routines: Routine[] = [];
  let warning = '';
  if (!stored.ok) warning = 'No pudimos leer tus rutinas. Puedes trabajar en esta sesión; comprueba que el navegador permita guardar datos.';
  else if (stored.value !== null) {
    let repaired = false;
    if (!Array.isArray(stored.value)) repaired = true;
    else {
      const seen = new Set<string>();
      for (const value of stored.value) {
        if (!record(value) || typeof value.id !== 'string' || !value.id || seen.has(value.id) || !validName(value.name) || !Array.isArray(value.items)) { repaired = true; continue; }
        const itemIds = new Set<string>();
        const items: RoutineItem[] = [];
        for (const item of value.items) {
          if (!record(item) || typeof item.exerciseId !== 'string' || !allowed.has(item.exerciseId) || itemIds.has(item.exerciseId) || typeof item.sets !== 'number' || !validSets(item.sets) || typeof item.reps !== 'number' || !validReps(item.reps)) { repaired = true; continue; }
          itemIds.add(item.exerciseId);
          items.push({ exerciseId: item.exerciseId, sets: item.sets, reps: item.reps });
        }
        seen.add(value.id);
        routines.push({ id: value.id, name: value.name.trim(), items });
      }
    }
    if (repaired) warning = 'Se omitieron datos de rutinas no válidos al cargar. Revisa tus rutinas antes de continuar.';
  }
  const persist = (): void => {
    warning = writeStoredValue(ROUTINES_KEY, routines) ? '' : 'No se pudieron guardar las rutinas. Los cambios funcionan en esta sesión, pero podrían perderse al recargar.';
  };
  const fail = (message: string): RoutineResult => ({ ok: false, message });
  return {
    get list(): Routine[] { return routines.map(routine => ({ ...routine, items: routine.items.map(item => ({ ...item })) })); },
    get warning(): string { return warning; },
    create(name: string): RoutineResult {
      if (!validName(name)) return fail('Escribe un nombre de entre 1 y 60 caracteres.');
      const routine: Routine = { id: crypto.randomUUID(), name: name.trim(), items: [] };
      routines.push(routine);
      persist();
      return { ok: true, message: 'Rutina creada.', routineId: routine.id };
    },
    rename(id: string, name: string): RoutineResult {
      const routine = routines.find(item => item.id === id);
      if (!routine) return fail('No encontramos esa rutina.');
      if (!validName(name)) return fail('Escribe un nombre de entre 1 y 60 caracteres.');
      routine.name = name.trim();
      persist();
      return { ok: true, message: 'Nombre actualizado.' };
    },
    remove(id: string): RoutineResult {
      if (!routines.some(item => item.id === id)) return fail('No encontramos esa rutina.');
      routines = routines.filter(item => item.id !== id);
      persist();
      return { ok: true, message: 'Rutina eliminada.' };
    },
    add(id: string, exerciseId: string, sets: number, reps: number): RoutineResult {
      const routine = routines.find(item => item.id === id);
      if (!routine) return fail('Selecciona una rutina válida.');
      if (!allowed.has(exerciseId)) return fail('No encontramos ese ejercicio.');
      if (!validSets(sets) || !validReps(reps)) return fail('Usa enteros: de 1 a 50 series y de 1 a 100 repeticiones.');
      if (routine.items.some(item => item.exerciseId === exerciseId)) return fail('Este ejercicio ya está en la rutina. Puedes editar sus series y repeticiones en Rutinas.');
      routine.items.push({ exerciseId, sets, reps });
      persist();
      return { ok: true, message: 'Ejercicio agregado a tu rutina.' };
    },
    update(id: string, exerciseId: string, sets: number, reps: number): RoutineResult {
      const item = routines.find(routine => routine.id === id)?.items.find(item => item.exerciseId === exerciseId);
      if (!item) return fail('No encontramos ese ejercicio en la rutina.');
      if (!validSets(sets) || !validReps(reps)) return fail('Usa enteros: de 1 a 50 series y de 1 a 100 repeticiones.');
      item.sets = sets;
      item.reps = reps;
      persist();
      return { ok: true, message: 'Series y repeticiones actualizadas.' };
    },
    removeExercise(id: string, exerciseId: string): RoutineResult {
      const routine = routines.find(item => item.id === id);
      if (!routine || !routine.items.some(item => item.exerciseId === exerciseId)) return fail('No encontramos ese ejercicio en la rutina.');
      routine.items = routine.items.filter(item => item.exerciseId !== exerciseId);
      persist();
      return { ok: true, message: 'Ejercicio quitado de la rutina.' };
    },
  };
}
export type RoutinesStore = ReturnType<typeof createRoutines>;
