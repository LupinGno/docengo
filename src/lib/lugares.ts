// RF-26: lugares destacados que la comunidad docente recomienda en la región piloto.
// Lógica pura: no depende de React ni de Firebase, por eso es fácil de probar.
import type { Coordenada, Localidad } from '../types/modelos';
import { REGIONES } from './salas';

export const CATEGORIAS_LUGAR = ['Comida', 'Cafetería', 'Parque o recreación', 'Cultura', 'Compras', 'Otro'];

// Se aplican con maxLength en el formulario (src/app/lugares/nuevo.tsx)
export const MAX_NOMBRE = 60;
export const MAX_DESCRIPCION = 300;

/** Lo que el docente llenó en el formulario antes de publicar. */
export type BorradorLugar = {
  nombre: string;
  categoria: string;
  localidad: string;
  descripcion: string;
  ubicacion: Coordenada | null;
};

/** Devuelve el mensaje de error o null si el lugar se puede publicar. */
export function validarLugar(b: BorradorLugar): string | null {
  if (!b.nombre.trim()) return 'Escribe el nombre del lugar.';
  if (!CATEGORIAS_LUGAR.includes(b.categoria)) return 'Elige una categoría.';
  if (!REGIONES.includes(b.localidad as Localidad)) return 'Elige una localidad.';
  if (!b.descripcion.trim()) return 'Escribe una descripción.';
  if (!b.ubicacion) return 'Marca la ubicación en el mapa.';
  return null;
}

// RF-27: valor de los chips que no filtra
export const TODAS = 'Todas';

/** Deja los lugares de la localidad y la categoría elegidas; TODAS no filtra ese campo. */
export function filtrarLugares<T extends { localidad: string; categoria: string }>(
  lugares: T[],
  localidad: string,
  categoria: string,
): T[] {
  let r = lugares;
  if (localidad !== TODAS) r = r.filter((l) => l.localidad === localidad);
  if (categoria !== TODAS) r = r.filter((l) => l.categoria === categoria);
  return r;
}
