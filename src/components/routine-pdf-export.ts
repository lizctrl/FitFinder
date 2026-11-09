import type { Exercise } from '../types/exercise';
import type { Routine } from '../types/routine';

const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function createRoutinePdfExport(getRoutine: () => Routine | undefined, exercises: readonly Exercise[]): HTMLElement {
  const panel = document.createElement('details');
  panel.className = 'routine-pdf-export';
  panel.innerHTML = `
    <summary class="secondary-button">Descargar PDF</summary>
    <form>
      <fieldset>
        <legend>Días de entrenamiento</legend>
        <p class="routine-pdf-hint">Cada día seleccionado comienza en una hoja nueva.</p>
        <div class="routine-pdf-days">
          ${weekdays.map(day => `<label><input type="checkbox" name="day" value="${day}" /> ${day}</label>`).join('')}
        </div>
      </fieldset>
      <button type="submit" class="primary-button">Descargar rutina</button>
      <p class="routine-pdf-status" role="status"></p>
    </form>`;

  const form = panel.querySelector('form')!;
  const button = form.querySelector('button')!;
  const status = form.querySelector<HTMLParagraphElement>('.routine-pdf-status')!;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled) return;
    const days = new FormData(form).getAll('day').map(String);
    if (!days.length) {
      status.textContent = 'Selecciona al menos un día para descargar la rutina.';
      form.querySelector('input')?.focus();
      return;
    }
    const routine = getRoutine();
    if (!routine?.items.length) {
      status.textContent = 'Añade un ejercicio a la rutina para descargarla.';
      return;
    }

    button.disabled = true;
    status.textContent = 'Preparando el PDF…';
    try {
      const { downloadRoutinePdf } = await import('../services/routine-pdf');
      await downloadRoutinePdf(routine, days, exercises);
      status.textContent = 'Descarga del PDF iniciada.';
    } catch {
      status.textContent = 'No se pudo preparar el PDF. Intenta descargarlo de nuevo.';
    } finally {
      button.disabled = false;
    }
  });
  return panel;
}
