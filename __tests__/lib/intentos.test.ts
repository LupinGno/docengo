// Caja blanca: contador de intentos (RF-06). Ver docs/pruebas-caja-blanca.md, sección 2.
import {
  estadoInicial,
  intentosRestantes,
  MAX_INTENTOS,
  registrarExito,
  registrarFallo,
} from '../../src/lib/intentos';

describe('registrarFallo: ambos resultados de fallidos >= MAX_INTENTOS', () => {
  test('CB-INT-1 primer y segundo fallo no bloquean', () => {
    const uno = registrarFallo(estadoInicial);
    const dos = registrarFallo(uno);
    expect(uno).toEqual({ fallidos: 1, bloqueada: false });
    expect(dos).toEqual({ fallidos: 2, bloqueada: false });
  });

  test('CB-INT-2 el tercer fallo bloquea', () => {
    const tres = registrarFallo(registrarFallo(registrarFallo(estadoInicial)));
    expect(tres).toEqual({ fallidos: MAX_INTENTOS, bloqueada: true });
  });

  test('CB-INT-3 no modifica el estado original', () => {
    registrarFallo(estadoInicial);
    expect(estadoInicial).toEqual({ fallidos: 0, bloqueada: false });
  });
});

describe('intentosRestantes: ambos lados de Math.max', () => {
  test('CB-INT-4 quedan intentos', () => {
    expect(intentosRestantes({ fallidos: 1, bloqueada: false })).toBe(2);
  });

  test('CB-INT-5 nunca devuelve negativos', () => {
    expect(intentosRestantes({ fallidos: 5, bloqueada: true })).toBe(0);
  });
});

test('CB-INT-6 registrarExito reinicia el contador', () => {
  expect(registrarExito()).toEqual({ fallidos: 0, bloqueada: false });
});
