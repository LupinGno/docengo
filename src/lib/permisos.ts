// Decide quién puede editar o borrar algo: quien lo creó o un admin.
// Debe coincidir con firestore.rules: esAutor() || esAdmin().
import type { Actor } from '../types/modelos';

export function puedeEditar(autorId: string, actor: Actor | null): boolean {
  if (!actor) return false;
  return actor.uid === autorId || actor.rol === 'admin';
}
