// Cálculos de distancia para "servicios cercanos" (RF-14, RF-17, RF-19).
// Lógica pura: no depende de React ni de Firebase, por eso es fácil de probar.
import type { Coordenada } from '../types/modelos';

const RADIO_TIERRA_KM = 6371;
const aRadianes = (grados: number) => (grados * Math.PI) / 180;

/** Distancia en km entre dos coordenadas (fórmula de Haversine). */
export function distanciaKm(a: Coordenada, b: Coordenada): number {
  const dLat = aRadianes(b.latitud - a.latitud);
  const dLon = aRadianes(b.longitud - a.longitud);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(a.latitud)) * Math.cos(aRadianes(b.latitud)) * Math.sin(dLon / 2) ** 2;
  return 2 * RADIO_TIERRA_KM * Math.asin(Math.sqrt(h));
}

/** Deja solo los elementos a `maxKm` o menos del origen. */
export function filtrarPorDistancia<T extends Coordenada>(
  elementos: T[],
  origen: Coordenada,
  maxKm: number,
): T[] {
  return elementos.filter((e) => distanciaKm(origen, e) <= maxKm);
}

/** Devuelve una copia ordenada del más cercano al más lejano. */
export function ordenarPorCercania<T extends Coordenada>(elementos: T[], origen: Coordenada): T[] {
  return [...elementos].sort((x, y) => distanciaKm(origen, x) - distanciaKm(origen, y));
}

/** Texto amigable: "850 m" o "3.2 km". */
export function formatearDistancia(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}
