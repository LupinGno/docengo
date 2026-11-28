// Transporte público: horarios, próxima salida y paradas. Solo lógica, sin React ni Firebase.
// Horarios en formato "HH:MM" (24 horas).
import { filtrarPorDistancia } from './geo';
import { dentroDeRegion } from './puntos';
import type { Coordenada } from '../types/modelos';

export const LOCALIDADES = ['Yuriria', 'Uriangato', 'Moroleón'];

/** Color de la capa de transporte en el mapa (chip y marcadores). */
export const COLOR_TRANSPORTE = '#6A1B9A';

/** "07:05" → 425 minutos desde las 0:00. */
export const aMinutos = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));

/** 425 → "07:05". */
export const aHora = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Siguiente salida a partir de ahora (incluye la de este mismo minuto); null si ya no hay hoy. */
export function proximaSalida(horarios: string[], ahora: Date): string | null {
  const actual = ahora.getHours() * 60 + ahora.getMinutes();
  let mejor: number | null = null;
  for (const h of horarios) {
    const m = aMinutos(h);
    if (m >= actual && (mejor === null || m < mejor)) mejor = m;
  }
  return mejor === null ? null : aHora(mejor);
}

/** Primera salida del día (para "Primera de mañana"); null si no hay horarios. */
export function primeraSalida(horarios: string[]): string | null {
  if (horarios.length === 0) return null;
  return aHora(Math.min(...horarios.map(aMinutos)));
}

/** Hora de llegada: paso + duración, dando la vuelta a la medianoche. */
export function horaLlegada(paso: string, duracionMin: number): string {
  return aHora((aMinutos(paso) + duracionMin) % 1440);
}

/** Texto de la próxima salida para la ficha y el globo del mapa. */
export function textoProximaSalida(horarios: string[], ahora: Date, duracionMin?: number): string {
  if (horarios.length === 0) return 'Sin horarios registrados';
  const proxima = proximaSalida(horarios, ahora);
  if (!proxima) return `No hay más salidas hoy. Primera de mañana: ${primeraSalida(horarios)}`;
  return duracionMin ? `Próxima salida ${proxima} · llega ${horaLlegada(proxima, duracionMin)}` : `Próxima salida ${proxima}`;
}

/** Agrega categoría "transporte" para usar el mismo filtro del mapa (chip y distancia). */
export const comoCapa = <T extends object>(paradas: T[]) =>
  paradas.map((p) => ({ ...p, categoria: 'transporte' as const }));

// ───────────── Zonas sin paradas y registro de paradas ─────────────

/** Radio para "Mi ubicación": si no hay parada a 1 km o menos, se considera sin cobertura. */
export const RADIO_COBERTURA_KM = 1;

export type ZonaTransporte =
  | { tipo: 'localidad'; localidad: string }
  | { tipo: 'ubicacion'; coord: Coordenada; radioKm: number };

/** Paradas que dan servicio a la zona consultada. */
export function paradasDeZona<T extends Coordenada & { localidad: string }>(paradas: T[], zona: ZonaTransporte): T[] {
  if (zona.tipo === 'localidad') return paradas.filter((p) => p.localidad === zona.localidad);
  return filtrarPorDistancia(paradas, zona.coord, zona.radioKm);
}

/** Si la zona no tiene paradas, se muestra el aviso de buscar otro medio. */
export const necesitaMedioAlternativo = (paradasZona: unknown[]) => paradasZona.length === 0;

/** "07:00, 7:30, 25:00" → horarios válidos normalizados y ordenados, y los que no se entendieron. */
export function parsearHorarios(texto: string): { horarios: string[]; invalidos: string[] } {
  const validos = new Set<string>();
  const invalidos: string[] = [];
  for (const parte of texto.split(',')) {
    const t = parte.trim();
    if (!t) continue;
    const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(t);
    if (m) validos.add(`${m[1].padStart(2, '0')}:${m[2]}`);
    else invalidos.push(t);
  }
  return { horarios: [...validos].sort(), invalidos };
}

/** "Ruta 1, Ruta 3, Ruta 1" → ["Ruta 1", "Ruta 3"]. */
export const textoALista = (texto: string) =>
  [...new Set(texto.split(',').map((x) => x.trim()).filter((x) => x.length > 0))];

/** Duración del trayecto: vacío = no se registra (null); si se escribe, entero de 1 a 300 minutos. */
export function leerDuracion(texto: string): { valor: number | null; error: string | null } {
  if (!texto.trim()) return { valor: null, error: null };
  const n = Number(texto);
  if (!Number.isInteger(n) || n < 1 || n > 300) return { valor: null, error: 'La duración debe ser de 1 a 300 minutos.' };
  return { valor: n, error: null };
}

/** Revisa que los horarios que escribió la comunidad sean válidos. */
export function validarHorarios(horariosTexto: string, duracionTexto: string): string | null {
  const { horarios, invalidos } = parsearHorarios(horariosTexto);
  if (invalidos.length > 0) return `Revisa estos horarios: ${invalidos.join(', ')}. Usa el formato 07:30.`;
  if (horarios.length === 0) return 'Escribe al menos un horario.';
  return leerDuracion(duracionTexto).error;
}

/** Revisa el formulario de parada nueva. */
export function validarParada(
  p: { nombre: string; localidad: string; horariosTexto: string; duracionTexto: string } & Coordenada,
): string | null {
  if (!p.nombre.trim()) return 'Escribe el nombre de la parada.';
  if (!LOCALIDADES.includes(p.localidad)) return 'Elige la localidad.';
  if (!dentroDeRegion(p)) return 'La parada está fuera de la región piloto.';
  return validarHorarios(p.horariosTexto, p.duracionTexto);
}

/** Cambios que se guardan al actualizar horarios; sin campos undefined (Firestore no los acepta). */
export function cambiosDeHorarios(horariosTexto: string, duracionTexto: string, quien: string, ahora: number) {
  const { horarios } = parsearHorarios(horariosTexto);
  const { valor } = leerDuracion(duracionTexto);
  return {
    horarios,
    ...(valor !== null ? { duracionMin: valor } : {}),
    actualizadoPor: quien,
    actualizado: ahora,
  };
}

/** 1764194400000 → "26/11". */
export function fechaCorta(ms: number): string {
  const d = new Date(ms);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Zona que se consulta según el chip elegido; null si eligió "Mi ubicación" sin tener ubicación. */
export function zonaElegida(eleccion: string, ubicacion: Coordenada | null): ZonaTransporte | null {
  if (eleccion !== 'ubicacion') return { tipo: 'localidad', localidad: eleccion };
  if (!ubicacion) return null;
  return { tipo: 'ubicacion', coord: ubicacion, radioKm: RADIO_COBERTURA_KM };
}

/** Documento de una parada nueva, listo para Firestore (sin campos undefined). */
export function armarParada(
  f: { nombre: string; localidad: string; rutasTexto: string; destino: string; horariosTexto: string; duracionTexto: string },
  coord: Coordenada,
  autorId: string,
) {
  const { valor } = leerDuracion(f.duracionTexto);
  return {
    nombre: f.nombre.trim(),
    localidad: f.localidad,
    rutas: textoALista(f.rutasTexto),
    destino: f.destino.trim(),
    horarios: parsearHorarios(f.horariosTexto).horarios,
    ...(valor !== null ? { duracionMin: valor } : {}),
    latitud: coord.latitud,
    longitud: coord.longitud,
    autorId,
  };
}
