import type { Exercise } from '../types/exercise';

export const exercises: Exercise[] = [
  {
    "id": "ex-01",
    "name": "Sentadilla",
    "muscleGroup": "Piernas",
    "difficulty": "Principiante",
    "equipment": "Peso corporal",
    "primaryMuscles": [
      "Cuádriceps",
      "Glúteos"
    ],
    "description": "Un movimiento esencial para trabajar la fuerza del tren inferior.",
    "instructions": [
      "Separa los pies al ancho de los hombros.",
      "Flexiona caderas y rodillas manteniendo los talones apoyados.",
      "Sube de forma controlada hasta volver a la posición inicial."
    ],
    "image": "/images/piernas.svg"
  },
  {
    "id": "ex-02",
    "name": "Peso muerto rumano",
    "muscleGroup": "Piernas",
    "difficulty": "Intermedio",
    "equipment": "Mancuernas",
    "primaryMuscles": [
      "Isquiotibiales",
      "Glúteos"
    ],
    "description": "Entrena la cadena posterior con una bisagra de cadera controlada.",
    "instructions": [
      "Sostén las mancuernas delante de los muslos.",
      "Lleva la cadera atrás con las rodillas ligeramente flexionadas.",
      "Baja las pesas cerca de las piernas y vuelve a erguirte."
    ],
    "image": "/images/piernas.svg"
  },
  {
    "id": "ex-03",
    "name": "Zancadas",
    "muscleGroup": "Piernas",
    "difficulty": "Principiante",
    "equipment": "Peso corporal",
    "primaryMuscles": [
      "Cuádriceps",
      "Glúteos"
    ],
    "description": "Desarrolla fuerza y estabilidad con un trabajo unilateral.",
    "instructions": [
      "Da un paso hacia delante desde una postura erguida.",
      "Flexiona ambas rodillas con el tronco estable.",
      "Empuja con la pierna delantera para regresar y alterna lados."
    ],
    "image": "/images/piernas.svg"
  },
  {
    "id": "ex-04",
    "name": "Elevación de talones",
    "muscleGroup": "Piernas",
    "difficulty": "Principiante",
    "equipment": "Peso corporal",
    "primaryMuscles": [
      "Gemelos",
      "Sóleo"
    ],
    "description": "Trabaja las pantorrillas con un recorrido sencillo y controlado.",
    "instructions": [
      "Colócate de pie junto a un apoyo estable.",
      "Eleva los talones manteniendo el peso sobre el antepié.",
      "Desciende lentamente sin dejarte caer."
    ],
    "image": "/images/piernas.svg"
  },
  {
    "id": "ex-05",
    "name": "Puente de glúteos",
    "muscleGroup": "Glúteos",
    "difficulty": "Principiante",
    "equipment": "Peso corporal",
    "primaryMuscles": [
      "Glúteo mayor"
    ],
    "description": "Activa los glúteos con un movimiento desde el suelo.",
    "instructions": [
      "Túmbate boca arriba con rodillas flexionadas y pies apoyados.",
      "Eleva la cadera contrayendo los glúteos sin arquear la espalda.",
      "Baja de manera controlada."
    ],
    "image": "/images/glúteos.svg"
  },
  {
    "id": "ex-06",
    "name": "Hip thrust",
    "muscleGroup": "Glúteos",
    "difficulty": "Intermedio",
    "equipment": "Barra",
    "primaryMuscles": [
      "Glúteo mayor"
    ],
    "description": "Una extensión de cadera con apoyo y resistencia.",
    "instructions": [
      "Apoya la parte superior de la espalda en un banco estable.",
      "Coloca la barra acolchada sobre la cadera y planta los pies.",
      "Eleva la cadera hasta alinear el tronco y baja lentamente."
    ],
    "image": "/images/glúteos.svg"
  },
  {
    "id": "ex-07",
    "name": "Abducción de cadera",
    "muscleGroup": "Glúteos",
    "difficulty": "Principiante",
    "equipment": "Banda elástica",
    "primaryMuscles": [
      "Glúteo medio"
    ],
    "description": "Refuerza la musculatura lateral de la cadera.",
    "instructions": [
      "Coloca una banda por encima de las rodillas.",
      "Separa una pierna hacia el lado sin inclinar el tronco.",
      "Regresa despacio y repite con el otro lado."
    ],
    "image": "/images/glúteos.svg"
  },
  {
    "id": "ex-08",
    "name": "Flexiones",
    "muscleGroup": "Pecho",
    "difficulty": "Principiante",
    "equipment": "Peso corporal",
    "primaryMuscles": [
      "Pectoral mayor",
      "Tríceps"
    ],
    "description": "Un clásico para fortalecer el tren superior con tu propio peso.",
    "instructions": [
      "Apoya las manos bajo los hombros y alinea el cuerpo.",
      "Flexiona los codos acercando el pecho al suelo.",
      "Empuja para volver; apoya las rodillas si necesitas una variante más sencilla."
    ],
    "image": "/images/pecho.svg"
  },
  {
    "id": "ex-09",
    "name": "Press de banca",
    "muscleGroup": "Pecho",
    "difficulty": "Intermedio",
    "equipment": "Barra",
    "primaryMuscles": [
      "Pectoral mayor",
      "Tríceps"
    ],
    "description": "Un empuje horizontal para desarrollar fuerza en el pecho.",
    "instructions": [
      "Túmbate en el banco con los pies firmes en el suelo.",
      "Baja la barra hacia el pecho con control y ayuda de un observador.",
      "Empuja hacia arriba manteniendo los hombros estables."
    ],
    "image": "/images/pecho.svg"
  },
  {
    "id": "ex-10",
    "name": "Aperturas con mancuernas",
    "muscleGroup": "Pecho",
    "difficulty": "Intermedio",
    "equipment": "Mancuernas",
    "primaryMuscles": [
      "Pectoral mayor"
    ],
    "description": "Trabaja el pecho con un arco amplio y controlado.",
    "instructions": [
      "Túmbate en un banco con las pesas sobre el pecho.",
      "Abre los brazos con los codos ligeramente flexionados.",
      "Junta las pesas de nuevo sin golpear entre sí."
    ],
    "image": "/images/pecho.svg"
  },
  {
    "id": "ex-11",
    "name": "Remo con mancuerna",
    "muscleGroup": "Espalda",
    "difficulty": "Principiante",
    "equipment": "Mancuernas",
    "primaryMuscles": [
      "Dorsal ancho",
      "Romboides"
    ],
    "description": "Un tirón unilateral para fortalecer la espalda.",
    "instructions": [
      "Apoya una mano en un banco y mantén la espalda estable.",
      "Lleva la mancuerna hacia la cadera con el codo cerca del cuerpo.",
      "Extiende el brazo lentamente y cambia de lado."
    ],
    "image": "/images/espalda.svg"
  },
  {
    "id": "ex-12",
    "name": "Dominadas",
    "muscleGroup": "Espalda",
    "difficulty": "Avanzado",
    "equipment": "Barra",
    "primaryMuscles": [
      "Dorsal ancho",
      "Bíceps"
    ],
    "description": "Eleva tu cuerpo con un tirón vertical.",
    "instructions": [
      "Sujeta una barra fija y estable con las palmas hacia delante.",
      "Tira del cuerpo hacia arriba sin balancearte.",
      "Desciende con control hasta extender los brazos."
    ],
    "image": "/images/espalda.svg"
  },
  {
    "id": "ex-13",
    "name": "Jalón al pecho",
    "muscleGroup": "Espalda",
    "difficulty": "Principiante",
    "equipment": "Máquina",
    "primaryMuscles": [
      "Dorsal ancho"
    ],
    "description": "Una opción de tirón vertical con resistencia ajustable.",
    "instructions": [
      "Ajusta el asiento y fija las piernas bajo los apoyos.",
      "Lleva la barra hacia la parte superior del pecho.",
      "Devuelve la barra lentamente sin soltar la tensión."
    ],
    "image": "/images/espalda.svg"
  },
  {
    "id": "ex-14",
    "name": "Curl de bíceps",
    "muscleGroup": "Brazos",
    "difficulty": "Principiante",
    "equipment": "Mancuernas",
    "primaryMuscles": [
      "Bíceps"
    ],
    "description": "Flexiona los codos para trabajar la parte frontal de los brazos.",
    "instructions": [
      "Sostén las pesas a los lados con las palmas hacia delante.",
      "Flexiona los codos sin balancear el cuerpo.",
      "Baja las pesas lentamente."
    ],
    "image": "/images/brazos.svg"
  },
  {
    "id": "ex-15",
    "name": "Extensión de tríceps",
    "muscleGroup": "Brazos",
    "difficulty": "Intermedio",
    "equipment": "Mancuernas",
    "primaryMuscles": [
      "Tríceps"
    ],
    "description": "Fortalece la parte posterior de los brazos.",
    "instructions": [
      "Sujeta una mancuerna con ambas manos sobre la cabeza.",
      "Flexiona los codos llevando la pesa detrás de la cabeza.",
      "Extiende los brazos sin arquear la espalda."
    ],
    "image": "/images/brazos.svg"
  },
  {
    "id": "ex-16",
    "name": "Press de hombros",
    "muscleGroup": "Hombros",
    "difficulty": "Intermedio",
    "equipment": "Mancuernas",
    "primaryMuscles": [
      "Deltoides",
      "Tríceps"
    ],
    "description": "Un empuje vertical para trabajar los hombros.",
    "instructions": [
      "Coloca las pesas a la altura de los hombros.",
      "Empuja hacia arriba manteniendo el abdomen activo.",
      "Desciende de forma controlada."
    ],
    "image": "/images/hombros.svg"
  },
  {
    "id": "ex-17",
    "name": "Elevaciones laterales",
    "muscleGroup": "Hombros",
    "difficulty": "Principiante",
    "equipment": "Mancuernas",
    "primaryMuscles": [
      "Deltoides lateral"
    ],
    "description": "Trabaja los hombros con una carga ligera.",
    "instructions": [
      "Sostén las pesas junto al cuerpo con los codos suaves.",
      "Eleva los brazos hacia los lados hasta la altura de los hombros.",
      "Baja lentamente sin encoger los hombros."
    ],
    "image": "/images/hombros.svg"
  },
  {
    "id": "ex-18",
    "name": "Plancha",
    "muscleGroup": "Core",
    "difficulty": "Principiante",
    "equipment": "Peso corporal",
    "primaryMuscles": [
      "Recto abdominal",
      "Transverso abdominal"
    ],
    "description": "Estabilidad del tronco con una posición isométrica.",
    "instructions": [
      "Apoya los antebrazos con los codos bajo los hombros.",
      "Extiende las piernas y mantén el cuerpo alineado.",
      "Respira de forma continua sin dejar caer la cadera."
    ],
    "image": "/images/core.svg"
  },
  {
    "id": "ex-19",
    "name": "Dead bug",
    "muscleGroup": "Core",
    "difficulty": "Principiante",
    "equipment": "Peso corporal",
    "primaryMuscles": [
      "Transverso abdominal"
    ],
    "description": "Practica el control del tronco moviendo extremidades opuestas.",
    "instructions": [
      "Túmbate boca arriba con brazos elevados y rodillas a 90 grados.",
      "Extiende un brazo y la pierna contraria sin arquear la zona lumbar.",
      "Vuelve al centro y alterna los lados."
    ],
    "image": "/images/core.svg"
  },
  {
    "id": "ex-20",
    "name": "Plancha lateral",
    "muscleGroup": "Core",
    "difficulty": "Intermedio",
    "equipment": "Peso corporal",
    "primaryMuscles": [
      "Oblicuos"
    ],
    "description": "Desarrolla estabilidad lateral del tronco.",
    "instructions": [
      "Apoya un antebrazo bajo el hombro y coloca los pies de lado.",
      "Eleva la cadera manteniendo el cuerpo alineado.",
      "Mantén la postura respirando y repite del otro lado."
    ],
    "image": "/images/core.svg"
  }
];
