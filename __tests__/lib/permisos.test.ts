// Caja blanca: puedeEditar, V(G) = 3 → 3 caminos + 1 caso de condición.
// Ver docs/pruebas-caja-blanca.md, sección 7.
import { puedeEditar } from '../../src/lib/permisos';

test('CB-PRM-1 sin sesión no puede editar', () => {
  expect(puedeEditar('autor1', null)).toBe(false);
});

test('CB-PRM-2 el autor puede editar', () => {
  expect(puedeEditar('autor1', { uid: 'autor1', rol: 'docente' })).toBe(true);
});

test('CB-PRM-3 un admin puede editar lo ajeno', () => {
  expect(puedeEditar('autor1', { uid: 'otro', rol: 'admin' })).toBe(true);
});

test('CB-PRM-4 un docente no puede editar lo ajeno', () => {
  expect(puedeEditar('autor1', { uid: 'otro', rol: 'docente' })).toBe(false);
});
