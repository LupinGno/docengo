// RF-21: salas del chat organizadas por región y por temática.
// Una sala es la combinación de una localidad de la región piloto y un tema.
import type { Localidad } from '../types/modelos';

export const REGIONES: Localidad[] = ['Yuriria', 'Uriangato', 'Moroleón'];

export const TEMAS = ['General', 'Escuela', 'Ambiente laboral', 'Servicios básicos', 'Institucional'];

// Largo máximo de un mensaje; firestore.rules repite el límite (T-28, S6)
export const MAX_MENSAJE = 1000;

/** Quita acentos, pasa a minúsculas y cambia espacios por guiones: "Servicios básicos" → "servicios-basicos". */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

/** Identificador estable de la sala, ej. idSala('Moroleón', 'Escuela') → "moroleon__escuela". */
export function idSala(region: Localidad, tema: string): string {
  return `${normalizar(region)}__${normalizar(tema)}`;
}

/** Título visible de la sala, ej. "Moroleón · Escuela". */
export function tituloSala(region: Localidad, tema: string): string {
  return `${region} · ${tema}`;
}
