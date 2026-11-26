// RF-28 y RF-29: valoraciones de lugares destacados y permisos del autor.
// Lógica pura: no depende de React ni de Firebase, por eso es fácil de probar.
// Una valoración por persona: se guarda en lugares/{lugarId}/valoraciones/{uid},
// así que valorar otra vez reemplaza la anterior en lugar de sumar otra.

// Se aplica con maxLength en src/components/ValorarLugar.tsx y en firestore.rules
export const MAX_COMENTARIO = 300;

/** Promedio de estrellas redondeado a un decimal, o null si nadie ha valorado. */
export function promedioEstrellas(valoraciones: { estrellas: number }[]): number | null {
  if (valoraciones.length === 0) return null;
  const suma = valoraciones.reduce((s, v) => s + v.estrellas, 0);
  return Math.round((suma / valoraciones.length) * 10) / 10;
}

/** Texto para la ficha: "Sin valoraciones", "★ 5.0 · 1 valoración" o "★ 3.5 · 2 valoraciones". */
export function textoPromedio(promedio: number | null, total: number): string {
  if (promedio === null) return 'Sin valoraciones';
  const palabra = total === 1 ? 'valoración' : 'valoraciones';
  return `★ ${promedio.toFixed(1)} · ${total} ${palabra}`;
}

/** Devuelve el mensaje de error o null si las estrellas son un entero del 1 al 5. */
export function validarEstrellas(estrellas: number): string | null {
  if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) return 'Elige de 1 a 5 estrellas.';
  return null;
}

/** RF-29: solo el autor edita o elimina su lugar (el admin lo hace desde Administración). */
export function puedeEditar(autorId: string, uid: string | undefined): boolean {
  return uid !== undefined && autorId === uid;
}
