// Caja blanca: salas del chat (RF-21), V(G) = 1 por función, 3 casos.
// Ver docs/pruebas-caja-blanca.md, sección "Salas del chat".
import { idSala, tituloSala } from '../../src/lib/salas';

test('CB-SAL-1 idSala quita acentos, mayúsculas y espacios', () => {
  expect(idSala('Moroleón', 'Servicios básicos')).toBe('moroleon__servicios-basicos');
});

test('CB-SAL-2 el mismo tema en distinta región es otra sala', () => {
  expect(idSala('Uriangato', 'Escuela')).toBe('uriangato__escuela');
  expect(idSala('Uriangato', 'Escuela')).not.toBe(idSala('Yuriria', 'Escuela'));
});

test('CB-SAL-3 tituloSala muestra "Región · Tema"', () => {
  expect(tituloSala('Moroleón', 'Escuela')).toBe('Moroleón · Escuela');
});
