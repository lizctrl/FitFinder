# Etapa 5 — Preparación para publicar

## Qué cambia

Esta entrega añade `.github/workflows/checks.yml`, `vercel.json`, `.nvmrc` y pruebas del catálogo. Actualiza la descripción de la página, los requisitos de Node y la documentación. No añade cuentas, backend ni servicios de pago.

GitHub ejecutará instalación reproducible (`npm ci`), pruebas y compilación en cada push a `main` y en cada pull request. El workflow está creado, pero aún no se ha ejecutado en GitHub.

Vercel instalará mediante `npm ci`, ejecutará `npm test && npm run build` y publicará `dist`. No hay reglas de reescritura: la navegación usa fragmentos (`#catalog`, `#favorites`, `#routines`) sobre una sola página.

## Revisión local

```bash
nvm use
npm ci
npm test
npm run build
npm run preview
```

`nvm use` es opcional si Node 22 ya está instalado; requiere nvm. Usa la URL que muestre Vite para comprobar la compilación de producción. Las pruebas se ejecutan con el runner incluido en Node y utilizan TypeScript para cargar los módulos: no necesitan otra herramienta de testing.

Los 16 casos automatizados comprueban datos y recursos del catálogo, búsquedas, filtros, favoritos y rutinas, persistencia simulada, datos inválidos y errores de almacenamiento. La compilación verifica TypeScript estricto y genera los archivos estáticos.

En las etapas anteriores se verificaron en navegador los controles, teclado y tamaños móviles de 375 px. Antes de presentar el proyecto como auditado, falta una revisión con lector de pantalla. No se ha ejecutado una auditoría WCAG completa ni se garantiza una puntuación Lighthouse.

## Primera subida a GitHub

El repositorio local tiene configurado este destino:

https://github.com/lizctrl/FitFinder

Todavía no hay commits locales. Cuando se autorice la subida:

```bash
git add .gitignore .nvmrc .github package.json package-lock.json tsconfig.json vercel.json index.html src public tests docs README.md
git commit -m "Build FitFinder exercise explorer, favorites and routines"
git push -u origin main
```

Antes de ejecutar el push, comprobar que ese repositorio es el destino deseado, que no contiene historia remota que deba conservarse y que la cuenta tiene acceso. Si hay historia remota, integrarla; no usar force push. `node_modules`, `dist`, `.env` y `.vercel` están excluidos. No se han añadido tokens ni secretos.

## Importar en Vercel

1. Inicia sesión en tu cuenta de Vercel y elige importar un repositorio Git.
2. Selecciona `lizctrl/FitFinder` y la raíz del repositorio.
3. Usa el preset Vite y Node 22. El archivo `vercel.json` fija instalación, build y salida.
4. No agregues variables de entorno: esta versión no las necesita.
5. Revisa el proyecto y publica. Conserva la URL que devuelva Vercel; no hay una URL pública confirmada todavía.
6. Conecta la URL del sitio en la sección About de GitHub cuando esté verificada.

Referencias oficiales: [Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite) y [despliegue estático de Vite](https://vite.dev/guide/static-deploy.html).

## Comprobación del sitio publicado

- Abrir catálogo y comprobar las 20 tarjetas y sus imágenes.
- Buscar `BICEPS` y combinar filtros, incluyendo un resultado vacío.
- Guardar un favorito, abrir Favoritos y recargar.
- Crear una rutina, añadir un ejercicio desde el detalle, guardar series/repeticiones y recargar.
- Abrir directamente las URLs con `#favorites` y `#routines`.
- Usar Tab, Enter y Escape, y comprobar que el foco regresa al cerrar el detalle.
- Revisar móvil y consola, y retirar solo los datos creados durante estas pruebas.

Los datos del servidor local no se copian al sitio publicado: localStorage pertenece a cada origen. La aplicación conserva favoritos y rutinas por navegador; no ofrece copias en una cuenta ni sincronización entre dispositivos.
