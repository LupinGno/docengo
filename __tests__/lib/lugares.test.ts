// Caja blanca: publicar lugares destacados (RF-26).
// validarLugar V(G) = 6 → 6 caminos.
// Ver docs/pruebas-caja-blanca.md, sección "Lugares destacados".
import { validarLugar, type BorradorLugar } from '../../src/lib/lugares';

// Borrador válido; cada caso cambia solo el campo que quiere probar
const valido: BorradorLugar = {
  nombre: 'Café La Plaza',
  categoria: 'Cafetería',
  localidad: 'Moroleón',
  descripcion: 'Buen café y wifi para planear clases.',
  ubicacion: { latitud: 20.1283, longitud: -101.1917 },
};

describe('validarLugar: caminos básicos', () => {
  test('CB-LUG-1 nombre vacío o solo espacios', () => {
    expect(validarLugar({ ...valido, nombre: '' })).toBe('Escribe el nombre del lugar.');
    expect(validarLugar({ ...valido, nombre: '   ' })).toBe('Escribe el nombre del lugar.');
  });

  test('CB-LUG-2 categoría vacía o fuera de la lista', () => {
    expect(validarLugar({ ...valido, categoria: '' })).toBe('Elige una categoría.');
    expect(validarLugar({ ...valido, categoria: 'Antro' })).toBe('Elige una categoría.');
  });

  test('CB-LUG-3 localidad vacía o fuera de la región piloto', () => {
    expect(validarLugar({ ...valido, localidad: '' })).toBe('Elige una localidad.');
    expect(validarLugar({ ...valido, localidad: 'Celaya' })).toBe('Elige una localidad.');
  });

  test('CB-LUG-4 descripción vacía o solo espacios', () => {
    expect(validarLugar({ ...valido, descripcion: '' })).toBe('Escribe una descripción.');
    expect(validarLugar({ ...valido, descripcion: '  \n ' })).toBe('Escribe una descripción.');
  });

  test('CB-LUG-5 sin ubicación', () => {
    expect(validarLugar({ ...valido, ubicacion: null })).toBe('Marca la ubicación en el mapa.');
  });

  test('CB-LUG-6 todos los campos correctos', () => {
    expect(validarLugar(valido)).toBeNull();
    expect(validarLugar({ ...valido, categoria: 'Otro', localidad: 'Yuriria' })).toBeNull();
  });
});
