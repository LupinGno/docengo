// Caja blanca: filtros de lugares destacados (RF-27).
// filtrarLugares V(G) = 3 → 3 caminos, más la combinación de ambos filtros.
// Ver docs/pruebas-caja-blanca.md, sección "Filtros de lugares".
import { filtrarLugares, TODAS } from '../../src/lib/lugares';

const lugares = [
  { id: '1', localidad: 'Moroleón', categoria: 'Cafetería' },
  { id: '2', localidad: 'Moroleón', categoria: 'Comida' },
  { id: '3', localidad: 'Yuriria', categoria: 'Cafetería' },
  { id: '4', localidad: 'Uriangato', categoria: 'Cultura' },
];
const ids = (l: { id: string }[]) => l.map((x) => x.id);

describe('filtrarLugares: caminos básicos', () => {
  test('CB-FLU-1 sin filtros devuelve todos', () => {
    expect(filtrarLugares(lugares, TODAS, TODAS)).toEqual(lugares);
  });

  test('CB-FLU-2 solo por localidad', () => {
    expect(ids(filtrarLugares(lugares, 'Moroleón', TODAS))).toEqual(['1', '2']);
  });

  test('CB-FLU-3 solo por categoría', () => {
    expect(ids(filtrarLugares(lugares, TODAS, 'Cafetería'))).toEqual(['1', '3']);
  });

  test('CB-FLU-4 por localidad y categoría, con y sin resultados', () => {
    expect(ids(filtrarLugares(lugares, 'Yuriria', 'Cafetería'))).toEqual(['3']);
    expect(filtrarLugares(lugares, 'Uriangato', 'Compras')).toEqual([]);
  });
});
