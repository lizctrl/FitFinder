# Etapa 12 — Revisión de accesibilidad de teclado y estructura

## Correcciones

- `src/keyboard.ts`: atajo de búsqueda con Ctrl+K o Comando+K. Un carácter aislado ya no mueve el foco; tampoco se activa durante composición de texto.
- `src/components/filters.ts`: ayuda visual y accesible del nuevo atajo mediante `aria-keyshortcuts` y una descripción asociada.
- `src/components/exercise-detail.ts`: asociación de la descripción breve al diálogo y manejo explícito de Tab/Shift+Tab en sus límites. Se omiten controles deshabilitados u ocultos.
- `src/main.ts`: título de pestaña según Ejercicios, Favoritos o Rutinas. El atajo sigue suspendido dentro del detalle, en Rutinas y al editar campos.
- `src/styles/main.css`: indicaciones de selección y foco para modo de colores forzados.
- `tests/keyboard.test.mjs`: dos casos de atajos válidos y combinaciones que deben ignorarse. Total: 32 pruebas automatizadas.

## Hallazgos y pruebas

El atajo anterior `/` era global y no tenía una opción de desactivación o reasignación. Se cambió por una combinación con modificador. Referencia: [W3C, atajos de caracteres](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html).

En el navegador integrado, al pulsar Tab sobre el último enlace del detalle el foco pasaba al documento. Se añadió un recorrido explícito de límites. Se verificó que Tab desde Ver mis rutinas va a Cerrar detalle y Shift+Tab desde Cerrar detalle vuelve al enlace final. Escape sigue cerrando y devolviendo el foco a la tarjeta.

Se revisó la estructura visible de Rutinas: idioma español, un único main, ausencia de IDs duplicados y campos con etiqueta asociada, etiqueta envolvente o nombre ARIA. Se comprobaron títulos de vista y ancho móvil de 320 px. No se modificaron datos del usuario.

Contraste calculado a partir de las combinaciones sólidas principales:

| Combinación | Relación |
| --- | --- |
| Texto principal `#F5F7EF` / fondo `#0C0F0B` | 17.85:1 |
| Texto secundario `#B8C3AC` / tarjeta `#191F15` | 9.17:1 |
| Texto `#0C0F0B` / botón lima `#C4F58A` | 15.41:1 |
| Texto `#E4EED9` / control secundario `#293322` | 11.02:1 |

Estas mediciones usan la fórmula de luminancia relativa descrita en [W3C, contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Solo representan las cuatro combinaciones indicadas; no son un análisis automático de todos los estados, degradados, iconos o superposiciones.

## Cómo probar

1. En Ejercicios, con foco fuera de un campo, pulsa Ctrl+K o Comando+K: se enfoca el buscador.
2. Pulsa `/` fuera de los campos: no debe activar el buscador.
3. Abre un detalle, recorre con Tab y Shift+Tab y comprueba los límites del panel.
4. Cierra con Escape y verifica que el foco vuelve a su tarjeta.
5. Cambia de vista y comprueba el título de la pestaña.
6. Revisa la navegación a 320 px y ejecuta `npm test` y `npm run build`.

Las 32 pruebas y la compilación pasan. Se realizó la revisión de teclado indicada, no una certificación WCAG. Siguen pendientes las pruebas con lector de pantalla (VoiceOver/NVDA), reconocimiento de voz, colores forzados reales, ampliación de texto/zoom y una auditoría de todos los estados. Las reglas de colores forzados se añadieron, pero no se ha probado ese modo en un sistema que lo tenga activado.

No se ha publicado en Vercel ni creado un commit nuevo.
