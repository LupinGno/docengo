// Caja blanca: validarAlerta, V(G) = 6 → 6 caminos independientes.
// armarAlerta, V(G) = 1 → 1 camino.
// Ver docs/pruebas-caja-blanca.md, sección 7.
import {
  armarAlerta,
  borradorVacio,
  CENTRO_LOCALIDAD,
  MAX_DESCRIPCION,
  validarAlerta,
  type BorradorAlerta,
} from '../../src/lib/alertas';

const valido: BorradorAlerta = {
  tipo: 'baja_seguridad',
  nivel: 'medio',
  localidad: 'Yuriria',
  descripcion: 'Calle sin alumbrado cerca de la escuela.',
};

describe('validarAlerta: caminos básicos', () => {
  test('CB-ALE-1 sin tipo', () => {
    expect(validarAlerta(borradorVacio)).toBe('Elige el tipo de alerta.');
  });

  test('CB-ALE-2 sin nivel', () => {
    expect(validarAlerta({ ...valido, nivel: null })).toBe('Elige el nivel de riesgo.');
  });

  test('CB-ALE-3 sin localidad', () => {
    expect(validarAlerta({ ...valido, localidad: null })).toBe('Elige la localidad.');
  });

  test('CB-ALE-4 descripción corta (solo espacios no cuentan)', () => {
    expect(validarAlerta({ ...valido, descripcion: '   corta   ' })).toBe(
      'Describe lo que pasó (mínimo 10 caracteres).',
    );
  });

  test('CB-ALE-5 descripción demasiado larga', () => {
    expect(validarAlerta({ ...valido, descripcion: 'a'.repeat(MAX_DESCRIPCION + 1) })).toBe(
      'La descripción no puede pasar de 280 caracteres.',
    );
  });

  test('CB-ALE-6 datos válidos (incluye el límite exacto de 280)', () => {
    expect(validarAlerta(valido)).toBeNull();
    expect(validarAlerta({ ...valido, descripcion: 'a'.repeat(MAX_DESCRIPCION) })).toBeNull();
  });
});

describe('armarAlerta', () => {
  test('CB-ALE-7 arma el documento con contadores en cero y texto recortado', () => {
    const datos = { tipo: 'crimen_organizado', nivel: 'alto', localidad: 'Uriangato', descripcion: '  Balacera en la plaza  ' } as const;
    expect(armarAlerta(datos, CENTRO_LOCALIDAD.Uriangato, 'uid-123', 1700000000000)).toEqual({
      tipo: 'crimen_organizado',
      nivel: 'alto',
      localidad: 'Uriangato',
      descripcion: 'Balacera en la plaza',
      latitud: CENTRO_LOCALIDAD.Uriangato.latitud,
      longitud: CENTRO_LOCALIDAD.Uriangato.longitud,
      confirmaciones: 0,
      desmentidos: 0,
      autorId: 'uid-123',
      fecha: 1700000000000,
    });
  });
});
