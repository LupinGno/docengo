// Caja blanca: valoraciones de lugares (RF-28) y permisos del autor (RF-29).
// promedioEstrellas V(G) = 2, textoPromedio V(G) = 3, validarEstrellas V(G) = 2, puedeEditar V(G) = 1.
// Ver docs/pruebas-caja-blanca.md, sección "Valoraciones de lugares".
import { promedioEstrellas, puedeEditar, textoPromedio, validarEstrellas } from '../../src/lib/valoraciones';

const v = (...estrellas: number[]) => estrellas.map((e) => ({ estrellas: e }));

describe('promedioEstrellas', () => {
  test('CB-VLR-1 sin valoraciones devuelve null', () => {
    expect(promedioEstrellas([])).toBeNull();
  });

  test('CB-VLR-2 A da 5 y B da 3 → 4.0', () => {
    expect(promedioEstrellas(v(5, 3))).toBe(4);
  });

  test('CB-VLR-3 A cambia a 4 → 3.5 (sigue habiendo 2 votos) y se redondea a un decimal', () => {
    expect(promedioEstrellas(v(4, 3))).toBe(3.5);
    expect(promedioEstrellas(v(5, 4, 4))).toBe(4.3);
  });
});

describe('textoPromedio', () => {
  test('CB-VLR-4 sin promedio', () => {
    expect(textoPromedio(null, 0)).toBe('Sin valoraciones');
  });

  test('CB-VLR-5 una valoración (singular)', () => {
    expect(textoPromedio(5, 1)).toBe('★ 5.0 · 1 valoración');
  });

  test('CB-VLR-6 varias valoraciones (plural)', () => {
    expect(textoPromedio(3.5, 2)).toBe('★ 3.5 · 2 valoraciones');
  });
});

describe('validarEstrellas', () => {
  test('CB-VLR-7 fuera de 1 a 5 o con decimales', () => {
    expect(validarEstrellas(0)).toBe('Elige de 1 a 5 estrellas.');
    expect(validarEstrellas(6)).toBe('Elige de 1 a 5 estrellas.');
    expect(validarEstrellas(3.5)).toBe('Elige de 1 a 5 estrellas.');
  });

  test('CB-VLR-8 en los límites 1 y 5', () => {
    expect(validarEstrellas(1)).toBeNull();
    expect(validarEstrellas(5)).toBeNull();
  });
});

describe('puedeEditar', () => {
  test('CB-VLR-9 solo el autor con sesión puede editar o eliminar', () => {
    expect(puedeEditar('uidA', 'uidA')).toBe(true);
    expect(puedeEditar('uidA', 'uidB')).toBe(false);
    expect(puedeEditar('uidA', undefined)).toBe(false);
  });
});
