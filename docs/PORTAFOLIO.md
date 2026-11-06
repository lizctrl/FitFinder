# Presentar FitFinder

## Descripción breve

FitFinder es una aplicación frontend para explorar ejercicios y crear rutinas personalizadas. Implementa búsqueda y filtros combinables, favoritos, edición y orden de rutinas, copias independientes y respaldos JSON. Está construida con Vite, TypeScript estricto y componentes DOM reutilizables, sin backend.

## Demostración de 90 segundos

| Tiempo | Acción | Qué muestra |
| --- | --- | --- |
| 0–15 s | Abrir el catálogo y buscar `BICEPS` | Búsqueda sin distinción de tildes o mayúsculas |
| 15–30 s | Limpiar y combinar Piernas, Intermedio y Mancuernas | Filtros sincronizados y resultado inmediato |
| 30–45 s | Abrir Peso muerto rumano y guardarlo en favoritos | Detalle, instrucciones y estado accesible |
| 45–60 s | Añadirlo a una nueva rutina con 3 series y 12 repeticiones | Formularios e integración de módulos |
| 60–75 s | Abrir Rutinas, duplicar y editar la copia | Estado independiente y persistencia |
| 75–90 s | Recargar y abrir Copias de seguridad | Datos conservados y respaldo local |

Ensaya con una rutina creada para la demo, sin modificar las rutinas que quieras conservar. Para mostrar el orden, prepara antes una rutina con dos ejercicios. Puedes mostrar el uso de Escape y Tab si dispones de más tiempo.

## Explicación técnica

**Componentes sin framework.** Las funciones construyen nodos y reciben callbacks. Esto permite explicar eventos, composición y ciclo de renderizado sin introducir una capa de framework para un catálogo local pequeño.

**Estado y persistencia.** Las operaciones de rutinas validan nombres y prescripciones, devuelven resultados explícitos y guardan las colecciones bajo claves versionadas. El acceso a localStorage está protegido. Las consultas devuelven copias para impedir mutaciones accidentales.

**Borradores.** Los formularios distinguen `value` y `defaultValue` para que reconstruir una tarjeta no borre una edición sin guardar. Los borradores no se escriben automáticamente en almacenamiento ni en respaldos.

**Importación de datos.** El JSON se trata como `unknown`, se valida completo y se muestra un resumen antes de aplicar cambios. La combinación es aditiva. Las rutinas se comparan por nombre, orden y prescripción, y las incorporadas reciben identidades locales nuevas.

**Accesibilidad.** El detalle usa un diálogo nativo modal; los controles tienen etiquetas y el foco se recupera después de cerrar o modificar elementos. Hay soporte de teclado, estados anunciados y reducción de movimiento.

## Evidencia y límites

Se pueden mostrar 32 pruebas automatizadas y una compilación TypeScript correcta. No conviene describir estas pruebas como E2E: prueban lógica y almacenamiento simulado. Las comprobaciones de navegador están descritas en las guías de cada etapa.

No hay backend, cuentas, sincronización automática, estadísticas de progreso ni seguimiento de entrenamientos. Las imágenes son ilustraciones locales de grupos musculares. No hay métricas de usuarios, auditoría completa de accesibilidad ni puntuación Lighthouse verificadas.

Sitio publicado y verificado: [FitFinder](https://fit-finder-coral.vercel.app/). Esta URL ya puede utilizarse como demostración en GitHub y en el portafolio.
