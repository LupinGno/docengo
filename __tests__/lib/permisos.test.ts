// Caja blanca jose
import { puedeEditar } from '../../src/lib/permisos';

test('prueba 1 sin sesión no puede editar', () => {
  expect(puedeEditar('autor1', null)).toBe(false);
});

test('prueba 2 el autor puede editar', () => {
  expect(puedeEditar('autor1', { uid: 'autor1', rol: 'docente' })).toBe(true);
});

test('prueba 3 un admin puede editar lo ajeno', () => {
  expect(puedeEditar('autor1', { uid: 'otro', rol: 'admin' })).toBe(true);
});

test('prueba 4 un docente no puede editar lo ajeno', () => {
  expect(puedeEditar('autor1', { uid: 'otro', rol: 'docente' })).toBe(false);
});
