import type { Routine } from '../types/routine';
import { validSets, validReps } from '../state/routines';

export const MAX_BACKUP_BYTES = 1024 * 1024;
export interface Backup {
  app: 'fitfinder';
  version: 1;
  exportedAt: string;
  favorites: string[];
  routines: Routine[];
}
export type BackupResult = { ok: true; data: Backup } | { ok: false; message: string };
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

/** All-or-nothing validation: a malformed file never partially changes the app. */
export function parseBackup(text: string, validIds: readonly string[]): BackupResult {
  const fail = (message: string): BackupResult => ({ ok: false, message });
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) return fail('El respaldo supera el límite de 1 MB.');
  let data: unknown;
  try { data = JSON.parse(text) as unknown; } catch { return fail('El archivo no contiene un JSON válido.'); }
  if (!record(data) || data.app !== 'fitfinder' || data.version !== 1) return fail('Selecciona un respaldo de FitFinder versión 1.');
  if (typeof data.exportedAt !== 'string' || !Number.isFinite(Date.parse(data.exportedAt))) return fail('El respaldo no tiene una fecha válida.');
  const allowed = new Set(validIds);
  if (!Array.isArray(data.favorites) || data.favorites.length > allowed.size || !data.favorites.every(id => typeof id === 'string' && allowed.has(id)) || new Set(data.favorites).size !== data.favorites.length) return fail('El respaldo contiene favoritos duplicados o desconocidos.');
  if (!Array.isArray(data.routines) || data.routines.length > 100) return fail('El respaldo debe contener un máximo de 100 rutinas.');
  const routines: Routine[] = [];
  const seen = new Set<string>();
  for (const value of data.routines) {
    if (!record(value) || typeof value.id !== 'string' || !value.id || value.id.length > 100 || seen.has(value.id) || typeof value.name !== 'string' || !value.name.trim() || value.name.trim().length > 60 || !Array.isArray(value.items) || value.items.length > allowed.size) return fail('Hay una rutina con nombre, identificador o ejercicios no válidos.');
    const items: Routine['items'] = [];
    const exerciseIds = new Set<string>();
    for (const item of value.items) {
      if (!record(item) || typeof item.exerciseId !== 'string' || !allowed.has(item.exerciseId) || exerciseIds.has(item.exerciseId) || typeof item.sets !== 'number' || !validSets(item.sets) || typeof item.reps !== 'number' || !validReps(item.reps)) return fail('Una rutina contiene ejercicios desconocidos, duplicados o series/repeticiones no válidas.');
      exerciseIds.add(item.exerciseId);
      items.push({ exerciseId: item.exerciseId, sets: item.sets, reps: item.reps });
    }
    seen.add(value.id);
    routines.push({ id: value.id, name: value.name.trim(), items });
  }
  return { ok: true, data: { app: 'fitfinder', version: 1, exportedAt: data.exportedAt, favorites: [...data.favorites] as string[], routines } };
}
export function createBackup(favorites: readonly string[], routines: readonly Routine[]): Backup {
  return { app: 'fitfinder', version: 1, exportedAt: new Date().toISOString(), favorites: [...favorites], routines: routines.map(routine => ({ ...routine, items: routine.items.map(item => ({ ...item })) })) };
}
// IDs are local identities. Comparing content makes repeated imports idempotent.
export const routineSignature = (routine: Routine): string => JSON.stringify({ name: routine.name, items: routine.items.map(item => ({ exerciseId: item.exerciseId, sets: item.sets, reps: item.reps })) });
export function newBackupRoutines(existing: readonly Routine[], incoming: readonly Routine[]): Routine[] {
  const signatures = new Set(existing.map(routineSignature));
  return incoming.filter(routine => {
    const signature = routineSignature(routine);
    if (signatures.has(signature)) return false;
    signatures.add(signature);
    return true;
  });
}
