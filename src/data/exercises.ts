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
    "image": "/images/anatomia/sentadilla-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de sentadilla: una mujer de pie y en posición de sentadilla, con cuádriceps y glúteos resaltados en rojo."
    }
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
    "image": "/images/anatomia/peso-muerto-rumano-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de peso muerto rumano con mancuernas: posición erguida y bisagra de cadera, con isquiotibiales y glúteos resaltados en rojo."
    }
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
    "image": "/images/anatomia/zancadas-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de zancadas: posición de pie y paso hacia delante con ambas rodillas flexionadas; cuádriceps y glúteos destacados en rojo."
    }
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
    "image": "/images/anatomia/elevacion-talones-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de elevación de talones: pies apoyados y talones elevados, con gemelos y sóleo destacados en rojo."
    }
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
    "image": "/images/anatomia/puente-gluteos-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de puente de glúteos: tumbada con rodillas flexionadas y cadera elevada, con glúteos destacados en rojo."
    }
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
    "image": "/images/anatomia/hip-thrust-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de hip thrust con barra: cadera baja y extensión de cadera con la espalda alta apoyada en un banco, glúteos destacados en rojo."
    }
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
    "image": "/images/anatomia/abduccion-cadera-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de abducción de cadera de pie con banda por encima de las rodillas: piernas juntas y una pierna separada lateralmente, glúteo medio destacado en rojo."
    }
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
    "image": "/images/anatomia/flexiones-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de flexiones: plancha con brazos extendidos y posición de descenso, con pecho y tríceps resaltados en rojo."
    }
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
    "image": "/images/anatomia/press-banca-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de press de banca con barra: brazos extendidos y barra próxima al pecho, con pectorales y tríceps destacados en rojo."
    }
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
    "image": "/images/anatomia/aperturas-mancuernas-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de aperturas con mancuernas en banco: pesas sobre el pecho y brazos abiertos con codos ligeramente flexionados, pectorales destacados en rojo."
    }
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
    "image": "/images/anatomia/remo-mancuerna-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de remo con mancuerna con apoyo en banco: brazo extendido y peso hacia la cadera, con dorsal ancho y romboides destacados en rojo."
    }
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
    "image": "/images/anatomia/dominadas-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de dominadas: suspensión con brazos extendidos y posición elevada con barbilla sobre la barra, dorsal ancho y bíceps destacados en rojo."
    }
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
    "image": "/images/anatomia/jalon-pecho-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de jalón al pecho en máquina: brazos elevados y barra hacia la parte superior del pecho, dorsal ancho destacado en rojo."
    }
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
    "image": "/images/anatomia/curl-biceps-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de curl de bíceps con mancuernas: brazos extendidos y codos flexionados, bíceps destacados en rojo."
    }
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
    "image": "/images/anatomia/extension-triceps-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de extensión de tríceps sobre la cabeza: brazos extendidos y peso detrás de la cabeza con los codos flexionados, tríceps destacados en rojo."
    }
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
    "image": "/images/anatomia/press-hombros-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de press de hombros con mancuernas: pesas a la altura de los hombros y brazos elevados, deltoides y tríceps destacados en rojo."
    }
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
    "image": "/images/anatomia/elevaciones-laterales-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de elevaciones laterales con mancuernas: brazos junto al cuerpo y elevados a los lados hasta los hombros, deltoides laterales destacados en rojo."
    }
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
    "image": "/images/anatomia/plancha-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de plancha sobre antebrazos desde dos ángulos, con el cuerpo alineado y la musculatura abdominal destacada en rojo."
    }
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
    "image": "/images/anatomia/dead-bug-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de dead bug: tumbada con brazos elevados y piernas a noventa grados, y extensión de brazo y pierna opuestos, abdomen destacado en rojo."
    }
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
    "image": "/images/anatomia/plancha-lateral-v1.png",
    "illustration": {
      "kind": "anatomical",
      "alt": "Ilustración anatómica de plancha lateral desde dos ángulos, con apoyo en antebrazo y pies y la cadera elevada, oblicuos destacados en rojo."
    }
  }
];
