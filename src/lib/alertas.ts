// RF-30: registro de alertas de inseguridad. Responsable: Carlos.
// Lógica pura: no depende de React ni de Firebase, por eso es fácil de probar.
import type { Alerta, Coordenada, Localidad, NivelRiesgo, TipoAlerta } from '../types/modelos';

export const MIN_DESCRIPCION = 10;
export const MAX_DESCRIPCION = 280;

export const NOMBRE_TIPO: Record<TipoAlerta, string> = {
  ambiente_toxico: 'Ambiente tóxico',
  crimen_organizado: 'Crimen organizado',
  baja_seguridad: 'Baja seguridad',
};

export const NOMBRE_NIVEL: Record<NivelRiesgo, string> = {
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
};

export const LOCALIDADES: Localidad[] = ['Yuriria', 'Uriangato', 'Moroleón'];

// Centro aproximado de cada localidad del piloto. Se usa cuando el docente
// no da permiso de ubicación (RF-15: la ubicación es opcional).
export const CENTRO_LOCALIDAD: Record<Localidad, Coordenada> = {
  Yuriria: { latitud: 20.2108, longitud: -101.1328 },
  Uriangato: { latitud: 20.1426, longitud: -101.1731 },
  Moroleón: { latitud: 20.1297, longitud: -101.1913 },
};

/** Lo que el docente va llenando en el formulario. */
export type BorradorAlerta = {
  tipo: TipoAlerta | null;
  nivel: NivelRiesgo | null;
  localidad: Localidad | null;
  descripcion: string;
};

/** El borrador ya revisado: sin campos vacíos. */
export type DatosAlerta = {
  tipo: TipoAlerta;
  nivel: NivelRiesgo;
  localidad: Localidad;
  descripcion: string;
};

export const borradorVacio: BorradorAlerta = {
  tipo: null,
  nivel: null,
  localidad: null,
  descripcion: '',
};

/**
 * Devuelve el mensaje de error o null si todo está bien.
 * Caja blanca: 5 decisiones → V(G) = 6 → 6 caminos independientes.
 */
export function validarAlerta(b: BorradorAlerta): string | null {
  if (!b.tipo) return 'Elige el tipo de alerta.';
  if (!b.nivel) return 'Elige el nivel de riesgo.';
  if (!b.localidad) return 'Elige la localidad.';
  const texto = b.descripcion.trim();
  if (texto.length < MIN_DESCRIPCION) {
    return `Describe lo que pasó (mínimo ${MIN_DESCRIPCION} caracteres).`;
  }
  if (texto.length > MAX_DESCRIPCION) {
    return `La descripción no puede pasar de ${MAX_DESCRIPCION} caracteres.`;
  }
  return null;
}

/**
 * Arma el documento que se guarda en la colección "alertas".
 * Toda alerta nueva empieza con 0 confirmaciones y 0 desmentidos (RF-34).
 * Caja blanca: sin decisiones → V(G) = 1.
 */
export function armarAlerta(
  datos: DatosAlerta,
  coordenada: Coordenada,
  autorId: string,
  fecha: number,
): Omit<Alerta, 'id'> {
  return {
    tipo: datos.tipo,
    nivel: datos.nivel,
    localidad: datos.localidad,
    descripcion: datos.descripcion.trim(),
    latitud: coordenada.latitud,
    longitud: coordenada.longitud,
    confirmaciones: 0,
    desmentidos: 0,
    autorId,
    fecha,
  };
}
