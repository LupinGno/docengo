// Caja blanca: confirmar/desmentir alertas (T-06, RF-34).
// Ver docs/pruebas-caja-blanca.md, sección 8.
import { contarVotos, estadoAlerta, puedeVotar, siguienteVoto, type Voto } from '../../src/lib/votos';

const voto = (id: string, tipo: Voto['voto']): Voto => ({ id, voto: tipo, fecha: 1 });

describe('contarVotos: V(G) = 3', () => {
  test('CB-VOT-1 sin votos (el ciclo no se ejecuta)', () => {
    expect(contarVotos([])).toEqual({ confirmaciones: 0, desmentidos: 0 });
  });

  test('CB-VOT-2 votos mezclados (entra a ambos lados del if)', () => {
    const votos = [voto('b', 'confirma'), voto('c', 'desmiente'), voto('d', 'confirma')];
    expect(contarVotos(votos)).toEqual({ confirmaciones: 2, desmentidos: 1 });
  });
});

describe('estadoAlerta: V(G) = 3', () => {
  test('CB-VOT-3 nadie ha votado: sin verificar', () => {
    expect(estadoAlerta({ confirmaciones: 0, desmentidos: 0 })).toBe('sin_verificar');
  });

  test('CB-VOT-4 más confirmaciones que desmentidos: confirmada', () => {
    expect(estadoAlerta({ confirmaciones: 2, desmentidos: 1 })).toBe('confirmada');
  });

  test('CB-VOT-5 empate o más desmentidos: en duda', () => {
    expect(estadoAlerta({ confirmaciones: 1, desmentidos: 1 })).toBe('en_duda');
    expect(estadoAlerta({ confirmaciones: 0, desmentidos: 2 })).toBe('en_duda');
  });
});

describe('puedeVotar: condiciones múltiples', () => {
  test('CB-VOT-6 sin sesión no; el autor no; otro docente sí', () => {
    expect(puedeVotar('autor', null)).toBe(false);
    expect(puedeVotar('autor', 'autor')).toBe(false);
    expect(puedeVotar('autor', 'otro')).toBe(true);
  });
});

describe('siguienteVoto: V(G) = 2', () => {
  test('CB-VOT-7 tocar el mismo voto lo quita; tocar el otro lo cambia', () => {
    expect(siguienteVoto('confirma', 'confirma')).toBeNull();
    expect(siguienteVoto('confirma', 'desmiente')).toBe('desmiente');
    expect(siguienteVoto(null, 'confirma')).toBe('confirma');
  });
});
