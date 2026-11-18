// Caja blanca: mensajeDeError, V(G) = 3 → 3 caminos.
// Ver docs/pruebas-caja-blanca.md, sección 3.
import { mensajeDeError } from '../../src/lib/errores';

test('CB-ERR-1 código conocido', () => {
  expect(mensajeDeError('auth/invalid-credential')).toBe('Correo o contraseña incorrectos.');
});

test('CB-ERR-2 código desconocido', () => {
  expect(mensajeDeError('firestore/otro')).toBe('Ocurrió un error. Intenta de nuevo.');
});

test('CB-ERR-3 sin código', () => {
  expect(mensajeDeError(undefined)).toBe('Ocurrió un error. Intenta de nuevo.');
});
