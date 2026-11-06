import type { Exercise, ExerciseFilters } from './types/exercise';
const normalize = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function filterExercises(exercises: Exercise[], filters: ExerciseFilters): Exercise[] {
  const query = normalize(filters.query);
  return exercises.filter(exercise =>
    normalize(exercise.name).includes(query) &&
    (!filters.muscleGroup || exercise.muscleGroup === filters.muscleGroup) &&
    (!filters.difficulty || exercise.difficulty === filters.difficulty) &&
    (!filters.equipment || exercise.equipment === filters.equipment));
}
