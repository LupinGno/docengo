// RF-25: reportar mensajes por contenido inapropiado.
// Cada persona puede reportar un mismo mensaje una sola vez: el id del documento
// en "reportes" se forma con el id del mensaje y el uid de quien reporta.

export const MOTIVOS = ['Spam', 'Ofensivo o acoso', 'Información falsa', 'Datos personales', 'Otro'];

export const MAX_DETALLE = 300;

/** Id del reporte, ej. idReporte('abc', 'uid1') → "abc_uid1". */
export function idReporte(mensajeId: string, uid: string): string {
  return `${mensajeId}_${uid}`;
}

/** Devuelve el mensaje de error o null si el reporte es válido. El detalle es opcional. */
export function validarReporte(motivo: string, detalle: string): string | null {
  if (!MOTIVOS.includes(motivo)) return 'Elige un motivo.';
  if (detalle.trim().length > MAX_DETALLE) return `El detalle debe tener máximo ${MAX_DETALLE} caracteres.`;
  return null;
}
