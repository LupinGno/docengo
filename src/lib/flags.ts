import type { Flag } from '../constants/flags';

/** Deja las opciones sin flag y las que tienen su flag encendida. */
export function opcionesVisibles<T extends { flag?: Flag }>(
  opciones: T[],
  flags: Record<Flag, boolean>,
): T[] {
  return opciones.filter((o) => !o.flag || flags[o.flag]);
}
