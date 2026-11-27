// Validación de puntos aportados por la comunidad (RF-13).
import { REGION_LIMITES } from '../constants/tema';
import type { CategoriaPunto, Coordenada } from '../types/modelos';

export const CATEGORIAS_PUNTO = ['interes', 'riesgo', 'referencia'];

/** ¿La coordenada cae dentro de la región piloto? Los bordes cuentan como dentro. */
export function dentroDeRegion(c: Coordenada): boolean {
  return (
    c.latitud >= REGION_LIMITES.latMin &&
    c.latitud <= REGION_LIMITES.latMax &&
    c.longitud >= REGION_LIMITES.lonMin &&
    c.longitud <= REGION_LIMITES.lonMax
  );
}

/** Devuelve el mensaje de error o null si el punto se puede guardar. */
export function validarPunto(
  p: { nombre: string; categoria: string; descripcion: string } & Coordenada,
): string | null {
  if (!p.nombre.trim()) return 'Escribe el nombre del punto.';
  if (!CATEGORIAS_PUNTO.includes(p.categoria)) return 'Elige una categoría.';
  if (p.categoria === 'riesgo' && !p.descripcion.trim()) return 'Describe por qué es una zona de riesgo.';
  if (!dentroDeRegion(p)) return 'El punto está fuera de la región piloto.';
  return null;
}

/** Convierte los parámetros de la ruta (texto) en coordenada; null si no son números válidos. */
export function coordenadaDeParametros(lat?: string, lon?: string): Coordenada | null {
  const latitud = Number(lat);
  const longitud = Number(lon);
  if (!lat || !lon || !Number.isFinite(latitud) || !Number.isFinite(longitud)) return null;
  return { latitud, longitud };
}

export type CamposPunto = { nombre: string; categoria: CategoriaPunto | ''; descripcion: string; contacto: string };

/** Valores con los que arranca el formulario: vacíos al crear, los del punto al editar. */
export function formularioInicial(inicial?: Partial<CamposPunto>): CamposPunto {
  const i = inicial ?? {};
  return {
    nombre: i.nombre ?? '',
    categoria: i.categoria ?? '',
    descripcion: i.descripcion ?? '',
    contacto: i.contacto ?? '',
  };
}
