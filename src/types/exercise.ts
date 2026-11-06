export const muscleGroups = ['Piernas', 'Glúteos', 'Pecho', 'Espalda', 'Brazos', 'Hombros', 'Core'] as const;
export const difficulties = ['Principiante', 'Intermedio', 'Avanzado'] as const;
export const equipmentOptions = ['Peso corporal', 'Mancuernas', 'Barra', 'Máquina', 'Banda elástica'] as const;
export type MuscleGroup = typeof muscleGroups[number];
export type Difficulty = typeof difficulties[number];
export type Equipment = typeof equipmentOptions[number];
export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  equipment: Equipment;
  primaryMuscles: string[];
  instructions: string[];
  image: string;
}
export interface ExerciseFilters {
  query: string;
  muscleGroup: MuscleGroup | '';
  difficulty: Difficulty | '';
  equipment: Equipment | '';
}
