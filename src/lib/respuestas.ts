// RF-22: responder dudas dentro de la conversación.
// La respuesta guarda una copia breve (cita) del mensaje original para mostrarla
// sin otra lectura a Firestore y aunque el original se borre.
import type { Cita, Mensaje } from '../types/modelos';

export const MAX_CITA = 80;

/** Cita del mensaje al que se responde; si el texto pasa de MAX_CITA caracteres se recorta con "…". */
export function citaDe(mensaje: Pick<Mensaje, 'id' | 'autorNombre' | 'texto'>): Cita {
  let texto = mensaje.texto.trim();
  if (texto.length > MAX_CITA) texto = `${texto.slice(0, MAX_CITA).trimEnd()}…`;
  return { id: mensaje.id, autorNombre: mensaje.autorNombre, texto };
}
