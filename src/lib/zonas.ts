// Zonas de riesgo del mapa (RF-31, RF-32). Lógica pura: sin React ni Firebase.
// Una zona es un punto de categoría "riesgo" o una alerta de inseguridad.
import type { Alerta, Coordenada, NivelRiesgo, Punto, TipoAlerta } from '../types/modelos';

export const NOMBRE_TIPO_ALERTA: Record<TipoAlerta, string> = {
  ambiente_toxico: 'Ambiente tóxico',
  crimen_organizado: 'Crimen organizado',
  baja_seguridad: 'Baja seguridad',
};

export const DESCRIPCION_RIESGO = 'Zona de riesgo reportada por la comunidad.';

/** Radio del círculo que marca una zona, en metros. */
export const RADIO_ZONA_M = 300;

export type ZonaRiesgo = Coordenada & {
  id: string;
  categoria: 'riesgo'; // permite usar el mismo filtro del mapa (puntosVisibles)
  origen: 'punto' | 'alerta';
  titulo: string;
  descripcion: string;
  nivel: NivelRiesgo;
};

/** Junta los puntos de riesgo y las alertas en una sola lista; todas llevan descripción. */
export function zonasDeRiesgo(
  puntos: Pick<Punto, 'id' | 'categoria' | 'nombre' | 'descripcion' | 'latitud' | 'longitud'>[],
  alertas: Pick<Alerta, 'id' | 'tipo' | 'nivel' | 'descripcion' | 'latitud' | 'longitud'>[],
): ZonaRiesgo[] {
  const dePuntos: ZonaRiesgo[] = puntos
    .filter((p) => p.categoria === 'riesgo')
    .map((p) => ({
      id: p.id,
      categoria: 'riesgo',
      origen: 'punto',
      latitud: p.latitud,
      longitud: p.longitud,
      titulo: p.nombre,
      descripcion: p.descripcion || DESCRIPCION_RIESGO,
      nivel: 'medio',
    }));
  const deAlertas: ZonaRiesgo[] = alertas.map((a) => ({
    id: a.id,
    categoria: 'riesgo',
    origen: 'alerta',
    latitud: a.latitud,
    longitud: a.longitud,
    titulo: NOMBRE_TIPO_ALERTA[a.tipo],
    descripcion: a.descripcion || DESCRIPCION_RIESGO,
    nivel: a.nivel,
  }));
  return [...dePuntos, ...deAlertas];
}

/** Puntos que se dibujan como alfiler: los de riesgo ya se dibujan como zona. */
export const puntosSinRiesgo = <T extends { categoria: string }>(puntos: T[]) =>
  puntos.filter((p) => p.categoria !== 'riesgo');

/** Texto del globo de una zona: "Riesgo alto · Calle sin alumbrado". */
export const textoZona = (z: Pick<ZonaRiesgo, 'nivel' | 'descripcion'>) => `Riesgo ${z.nivel} · ${z.descripcion}`;
