import { jsPDF } from 'jspdf';
import type { Exercise } from '../types/exercise';
import type { Routine, RoutineItem } from '../types/routine';

interface PdfRow extends RoutineItem {
  exercise: Exercise;
  image: string;
  imageRatio: number;
}

const ink = '#193458';
const pink = '#AA3569';
const left = 11;
const right = 199;
const tableTop = 51;
const rowHeight = 31.5;
const rowsPerPage = 7;

export function buildRoutinePdf(name: string, days: readonly string[], rows: readonly PdfRow[]): jsPDF {
  const pdf = new jsPDF({ format: 'a4', unit: 'mm', compress: true });
  pdf.setProperties({ title: name, author: 'FitFinder', subject: 'Rutina de entrenamiento' });
  const pagesPerDay = Math.ceil(rows.length / rowsPerPage);
  const totalPages = pagesPerDay * days.length;

  for (const [dayIndex, day] of days.entries()) {
    for (let offset = 0; offset < rows.length; offset += rowsPerPage) {
      if (dayIndex > 0 || offset > 0) pdf.addPage();
      const pageRows = rows.slice(offset, offset + rowsPerPage);

      pdf.setFillColor('#FFFEFB');
      pdf.rect(0, 0, 210, 297, 'F');
      pdf.setDrawColor('#E6EEF3');
      pdf.setLineWidth(0.18);
      for (let y = 8; y < 292; y += 6) pdf.line(left, y, right, y);

      pdf.setFont('times', 'bolditalic');
      pdf.setFontSize(26);
      pdf.setTextColor(ink);
      pdf.text(day, left + 5, 23);
      pdf.setDrawColor(pink);
      pdf.setLineWidth(0.45);
      pdf.line(left, 18, left + 3, 20);
      pdf.line(left, 23, left + 3, 23);
      pdf.line(left + 5, 26, left + 59, 26);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(pink);
      pdf.text('FITFINDER', right, 17, { align: 'right' });
      pdf.setFontSize(17);
      pdf.setTextColor(ink);
      const title: string[] = pdf.splitTextToSize(name.toLocaleUpperCase('es'), right - left);
      pdf.text(title, left, 35, { lineHeightFactor: 1.1 });
      if (offset > 0) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.text('Continuación', right, 47, { align: 'right' });
      }

      pdf.setFillColor('#FAEAF0');
      pdf.rect(left, tableTop, right - left, 8, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(ink);
      pdf.text('Ejercicio', 15, tableTop + 5.2);
      pdf.text('Ilustración', 99, tableTop + 5.2, { align: 'center' });
      pdf.text('Series', 147, tableTop + 5.2, { align: 'center' });
      pdf.text('Repeticiones', 180, tableTop + 5.2, { align: 'center' });

      pageRows.forEach((row, index) => {
        const y = tableTop + 8 + index * rowHeight;
        const center = y + rowHeight / 2;
        pdf.setDrawColor('#D5E3EB');
        pdf.setLineWidth(0.24);
        pdf.line(left, y + rowHeight, right, y + rowHeight);
        for (const x of [67, 132, 162]) pdf.line(x, y, x, y + rowHeight);

        pdf.setDrawColor(pink);
        pdf.circle(16, center, 3.4);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(pink);
        pdf.text(String(offset + index + 1), 16, center + 1, { align: 'center' });

        pdf.setFont('times', 'bolditalic');
        pdf.setFontSize(12);
        pdf.setTextColor(ink);
        const label: string[] = pdf.splitTextToSize(row.exercise.name, 41);
        const labelTop = center - (label.length - 1) * 2.3;
        pdf.text(label, 22, labelTop, { lineHeightFactor: 1.12 });

        const imageWidth = Math.min(61, (rowHeight - 3) * row.imageRatio);
        const imageHeight = imageWidth / row.imageRatio;
        pdf.addImage(row.image, 'JPEG', 99 - imageWidth / 2, center - imageHeight / 2,
          imageWidth, imageHeight, row.exerciseId);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.setTextColor(pink);
        pdf.text(String(row.sets), 147, center + 1.7, { align: 'center' });
        pdf.setTextColor(ink);
        pdf.text(String(row.reps), 180, center + 1.7, { align: 'center' });
      });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(ink);
      pdf.text('FitFinder  /  Plan de entrenamiento', left, 288);
      pdf.text(`${pdf.getNumberOfPages()} / ${totalPages}`, right, 288, { align: 'right' });
    }
  }
  return pdf;
}

async function loadIllustration(path: string): Promise<Pick<PdfRow, 'image' | 'imageRatio'>> {
  const response = await fetch(path, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('No se pudo cargar una ilustración.');
  const bitmap = await createImageBitmap(await response.blob());
  try {
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(640, bitmap.width);
    canvas.height = Math.round(canvas.width * bitmap.height / bitmap.width);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se pudo preparar la ilustración.');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return { image: canvas.toDataURL('image/jpeg', 0.88), imageRatio: canvas.width / canvas.height };
  } finally {
    bitmap.close();
  }
}

export async function downloadRoutinePdf(routine: Routine, days: readonly string[], exercises: readonly Exercise[]): Promise<void> {
  if (!days.length || !routine.items.length) throw new Error('Elige un día y añade ejercicios a la rutina.');
  const rows = await Promise.all(routine.items.map(async item => {
    const exercise = exercises.find(entry => entry.id === item.exerciseId);
    if (!exercise) throw new Error('No se encontró un ejercicio de la rutina.');
    return { ...item, exercise, ...await loadIllustration(exercise.image) };
  }));
  const filename = routine.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  buildRoutinePdf(routine.name, days, rows).save(`fitfinder-${filename || 'rutina'}.pdf`);
}
