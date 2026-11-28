// Filtros y preferencias del mapa. Solo lógica, sin React ni Firebase, para poder probarla fácil.
import { distanciaKm } from './geo';
import type { CategoriaPunto, Coordenada } from '../types/modelos';

/** Capas que se pueden prender y apagar: las 3 categorías de puntos y el transporte. */
export type CapaMapa = CategoriaPunto | 'transporte';

export type PreferenciasMapa = {
  categorias: CapaMapa[];
  radioKm: number; // 0 = sin límite ("Todos")
  zoomDelta: number; // latitudeDelta inicial del mapa
};

export const PREFERENCIAS_DEFECTO: PreferenciasMapa = {
  categorias: ['interes', 'riesgo', 'referencia', 'transporte'],
  radioKm: 0,
  zoomDelta: 0.18,
};

/** Opciones de distancia que se muestran como chips. */
export const RADIOS_KM = [1, 5, 10, 0];

/** Completa las preferencias guardadas con los valores por defecto. */
export function preferenciasConDefecto(guardadas?: Partial<PreferenciasMapa>): PreferenciasMapa {
  const p = guardadas ?? {};
  return {
    categorias: p.categorias ?? PREFERENCIAS_DEFECTO.categorias,
    radioKm: p.radioKm ?? PREFERENCIAS_DEFECTO.radioKm,
    zoomDelta: p.zoomDelta ?? PREFERENCIAS_DEFECTO.zoomDelta,
  };
}

/** Puntos que pasan el filtro de categoría y, si hay radio y ubicación, el de distancia. */
export function puntosVisibles<T extends Coordenada & { categoria: CapaMapa }>(
  puntos: T[],
  f: { categorias: CapaMapa[]; radioKm: number; ubicacion: Coordenada | null },
): T[] {
  return puntos.filter((p) => {
    if (!f.categorias.includes(p.categoria)) return false;
    if (f.radioKm === 0 || !f.ubicacion) return true;
    return distanciaKm(f.ubicacion, p) <= f.radioKm;
  });
}

/** Agrega el valor si no está; lo quita si ya está. */
export function alternar<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor) ? lista.filter((x) => x !== valor) : [...lista, valor];
}

/** ¿El zoom cambió lo suficiente (más de 10 %) para guardarlo? Evita escribir en cada movimiento. */
export function zoomCambio(anterior: number, nuevo: number): boolean {
  return Math.abs(nuevo - anterior) / anterior > 0.1;
}

/** Texto del chip de distancia. */
export const etiquetaRadio = (km: number) => (km === 0 ? 'Todos' : `${km} km`);

/** Mensaje de la barra inferior del mapa, según el permiso de ubicación y el filtro. */
export function avisoMapa(permitida: boolean, radioKm: number, ubicacion: Coordenada | null): string {
  if (radioKm > 0 && !ubicacion) return 'Activa la ubicación para filtrar por distancia.';
  if (!permitida) return 'Activa la ubicación para ver tu posición (opcional). Mantén presionado el mapa para agregar.';
  return 'Mantén presionado el mapa para agregar.';
}
