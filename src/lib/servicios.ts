// Servicios cercanos: buscar, filtrar y ordenar. Solo lógica, sin React ni Firebase.
import { filtrarPorDistancia, ordenarPorCercania } from './geo';
import type { Coordenada, TipoServicio } from '../types/modelos';

export const ETIQUETA_TIPO: Record<TipoServicio, string> = {
  farmacia: 'Farmacia',
  papeleria: 'Papelería',
  supermercado: 'Supermercado',
  parada: 'Parada de autobús',
};

/** Distancia máxima de la lista de servicios cuando hay ubicación. */
export const DISTANCIA_MAX_KM = 10;

/** Formato acordado: "9:00 a 21:00" (también "22:00 a 02:00" si cruza la medianoche). */
const HORARIO = /^([01]?\d|2[0-3]):([0-5]\d)\s*a\s*([01]?\d|2[0-3]):([0-5]\d)$/;

/** true = abierto, false = cerrado, null = no hay horario o no tiene el formato acordado. */
export function estaAbierto(horario: string | undefined, ahora: Date): boolean | null {
  if (!horario) return null;
  const m = HORARIO.exec(horario.trim());
  if (!m) return null;
  const abre = Number(m[1]) * 60 + Number(m[2]);
  const cierra = Number(m[3]) * 60 + Number(m[4]);
  const actual = ahora.getHours() * 60 + ahora.getMinutes();
  if (cierra > abre) return actual >= abre && actual < cierra;
  return actual >= abre || actual < cierra; // cruza la medianoche
}

/** Texto que se muestra para el resultado de estaAbierto. */
export function textoEstado(abierto: boolean | null): string {
  if (abierto === null) return 'Horario no disponible';
  return abierto ? 'Abierto ahora' : 'Cerrado';
}

/** Servicios que no tienen coordenadas válidas (para revisar que todos estén en el mapa). */
export function sinCoordenadas<T extends { latitud: unknown; longitud: unknown }>(lista: T[]): T[] {
  return lista.filter((s) => !Number.isFinite(s.latitud) || !Number.isFinite(s.longitud));
}

/** Lista de la pestaña Servicios: filtra por tipo; con ubicación, filtra a 10 km y ordena por cercanía. */
export function listaServicios<T extends Coordenada & { tipo: TipoServicio }>(
  servicios: T[],
  tipo: TipoServicio | 'todos',
  ubicacion: Coordenada | null,
): T[] {
  const delTipo = tipo === 'todos' ? servicios : servicios.filter((s) => s.tipo === tipo);
  if (!ubicacion) return delTipo;
  return ordenarPorCercania(filtrarPorDistancia(delTipo, ubicacion, DISTANCIA_MAX_KM), ubicacion);
}
