// Quién puede editar o eliminar un contenido (RF-13, RF-29, RF-45).
// Debe coincidir con firestore.rules: esAutor() || esAdmin().
import type { Actor } from '../types/modelos';

export function puedeEditar(autorId: string, actor: Actor | null): boolean {
  if (!actor) return false;
  return actor.uid === autorId || actor.rol === 'admin';
}
