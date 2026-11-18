// Caja blanca: cálculos de distancia (RF-17, RF-19). Ver docs/pruebas-caja-blanca.md, sección 4.
import {
  distanciaKm,
  filtrarPorDistancia,
  formatearDistancia,
  ordenarPorCercania,
} from '../../src/lib/geo';

const yuriria = { latitud: 20.2108, longitud: -101.1328 };
const moroleon = { latitud: 20.1294, longitud: -101.1914 };
const uriangato = { latitud: 20.1394, longitud: -101.1717 };
const lejos = { latitud: 20.9, longitud: -101.1 };

describe('distanciaKm (V(G) = 1)', () => {
  test('CB-GEO-1 mismo punto da 0', () => {
    expect(distanciaKm(yuriria, yuriria)).toBe(0);
  });

  test('CB-GEO-2 Yuriria a Moroleón entre 8 y 14 km, y es simétrica', () => {
    const ida = distanciaKm(yuriria, moroleon);
    expect(ida).toBeGreaterThan(8);
    expect(ida).toBeLessThan(14);
    expect(distanciaKm(moroleon, yuriria)).toBeCloseTo(ida);
  });
});

describe('filtrarPorDistancia: el ciclo y la condición <=', () => {
  test('CB-GEO-3 lista vacía (el ciclo no se ejecuta)', () => {
    expect(filtrarPorDistancia([], moroleon, 5)).toEqual([]);
  });

  test('CB-GEO-4 un elemento dentro y otro fuera', () => {
    const r = filtrarPorDistancia([{ id: 'u', ...uriangato }, { id: 'l', ...lejos }], moroleon, 5);
    expect(r.map((p) => p.id)).toEqual(['u']);
  });

  test('CB-GEO-5 valor límite: exactamente a maxKm sí se incluye', () => {
    const exacta = distanciaKm(moroleon, uriangato);
    expect(filtrarPorDistancia([uriangato], moroleon, exacta)).toHaveLength(1);
  });
});

describe('ordenarPorCercania', () => {
  test('CB-GEO-6 ordena del más cercano al más lejano', () => {
    const r = ordenarPorCercania(
      [{ id: 'l', ...lejos }, { id: 'y', ...yuriria }, { id: 'u', ...uriangato }],
      moroleon,
    );
    expect(r.map((p) => p.id)).toEqual(['u', 'y', 'l']);
  });

  test('CB-GEO-7 no modifica el arreglo original', () => {
    const original = [{ id: 'y', ...yuriria }, { id: 'u', ...uriangato }];
    ordenarPorCercania(original, moroleon);
    expect(original.map((p) => p.id)).toEqual(['y', 'u']);
  });
});

describe('formatearDistancia: V(G) = 2', () => {
  test('CB-GEO-8 menos de 1 km se muestra en metros', () => {
    expect(formatearDistancia(0.85)).toBe('850 m');
  });

  test('CB-GEO-9 1 km o más se muestra en km', () => {
    expect(formatearDistancia(3.24)).toBe('3.2 km');
  });

  test('CB-GEO-10 valor límite: exactamente 1 km', () => {
    expect(formatearDistancia(1)).toBe('1.0 km');
  });
});
