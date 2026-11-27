// Quién puede editar o eliminar un contenido 
import type { Actor } from '../types/modelos';

export function puedeEditar(autorId: string, actor: Actor | null): boolean {
  if (!actor) return false;
  return actor.uid === autorId || actor.rol === 'admin';
}
