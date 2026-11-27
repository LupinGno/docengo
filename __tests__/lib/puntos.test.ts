// Caja blanca: validación de puntos (RF-13). Ver docs/pruebas-caja-blanca.md, sección 18.
import { coordenadaDeParametros, dentroDeRegion, formularioInicial, validarPunto } from '../../src/lib/puntos';
import { REGION_LIMITES as L } from '../../src/constants/tema';

const yuriria = { latitud: 20.2108, longitud: -101.1328 };
const valido = { nombre: 'Plaza principal', categoria: 'referencia', descripcion: '', ...yuriria };

describe('validarPunto: V(G) = 6', () => {
  test('CB-PTO-1 nombre vacío', () => {
    expect(validarPunto({ ...valido, nombre: '   ' })).toBe('Escribe el nombre del punto.');
  });

  test('CB-PTO-2 categoría inválida', () => {
    expect(validarPunto({ ...valido, categoria: 'tienda' })).toBe('Elige una categoría.');
  });

  test('CB-PTO-3 riesgo sin descripción', () => {
    expect(validarPunto({ ...valido, categoria: 'riesgo', descripcion: '  ' })).toBe(
      'Describe por qué es una zona de riesgo.',
    );
  });

  test('CB-PTO-4 interés sin descripción sí se acepta (lado falso del &&)', () => {
    expect(validarPunto({ ...valido, categoria: 'interes', descripcion: '' })).toBeNull();
  });

  test('CB-PTO-5 riesgo con descripción pero fuera de la región', () => {
    expect(
      validarPunto({ ...valido, categoria: 'riesgo', descripcion: 'Calle sin luz', latitud: 21.0 }),
    ).toBe('El punto está fuera de la región piloto.');
  });

  test('CB-PTO-6 riesgo con descripción dentro de la región', () => {
    expect(validarPunto({ ...valido, categoria: 'riesgo', descripcion: 'Calle sin luz' })).toBeNull();
  });
});

describe('dentroDeRegion: V(G) = 4, valores límite', () => {
  test('CB-PTO-7 los bordes exactos cuentan como dentro', () => {
    expect(dentroDeRegion({ latitud: L.latMin, longitud: L.lonMax })).toBe(true);
    expect(dentroDeRegion({ latitud: L.latMax, longitud: L.lonMin })).toBe(true);
  });

  test('CB-PTO-8 latitud justo debajo del mínimo', () => {
    expect(dentroDeRegion({ latitud: L.latMin - 0.0001, longitud: yuriria.longitud })).toBe(false);
  });

  test('CB-PTO-9 latitud justo arriba del máximo', () => {
    expect(dentroDeRegion({ latitud: L.latMax + 0.0001, longitud: yuriria.longitud })).toBe(false);
  });

  test('CB-PTO-10 longitud justo debajo del mínimo', () => {
    expect(dentroDeRegion({ latitud: yuriria.latitud, longitud: L.lonMin - 0.0001 })).toBe(false);
  });

  test('CB-PTO-11 longitud justo arriba del máximo', () => {
    expect(dentroDeRegion({ latitud: yuriria.latitud, longitud: L.lonMax + 0.0001 })).toBe(false);
  });
});

describe('coordenadaDeParametros: V(G) = 5', () => {
  test('CB-PTO-12 parámetros válidos', () => {
    expect(coordenadaDeParametros('20.21', '-101.13')).toEqual({ latitud: 20.21, longitud: -101.13 });
  });

  test('CB-PTO-13 falta la latitud', () => {
    expect(coordenadaDeParametros(undefined, '-101.13')).toBeNull();
  });

  test('CB-PTO-14 falta la longitud', () => {
    expect(coordenadaDeParametros('20.21', '')).toBeNull();
  });

  test('CB-PTO-15 latitud que no es número', () => {
    expect(coordenadaDeParametros('abc', '-101.13')).toBeNull();
  });

  test('CB-PTO-16 longitud que no es número', () => {
    expect(coordenadaDeParametros('20.21', 'xyz')).toBeNull();
  });
});

describe('formularioInicial: V(G) = 6, ambos lados de cada ??', () => {
  test('CB-PTO-17 sin valores iniciales (punto nuevo): todo vacío', () => {
    expect(formularioInicial(undefined)).toEqual({ nombre: '', categoria: '', descripcion: '', contacto: '' });
  });

  test('CB-PTO-18 con todos los valores (editar): se conservan', () => {
    const v = { nombre: 'Plaza', categoria: 'riesgo' as const, descripcion: 'Sin luz', contacto: '4451234567' };
    expect(formularioInicial(v)).toEqual(v);
  });
});
