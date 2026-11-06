export interface RoutineItem {
  exerciseId: string;
  sets: number;
  reps: number;
}
export interface Routine {
  id: string;
  name: string;
  items: RoutineItem[];
}
export interface RoutineResult {
  ok: boolean;
  message: string;
  routineId?: string;
}
