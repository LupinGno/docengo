// Caja blanca: reportes del chat (RF-25).
// validarReporte V(G) = 3 → 3 caminos; idReporte V(G) = 1 → 1 camino.
// Ver docs/pruebas-caja-blanca.md, sección "Reportes del chat".
import { idReporte, MAX_DETALLE, validarReporte } from '../../src/lib/reportes';

describe('validarReporte: caminos básicos', () => {
  test('CB-REP-1 sin motivo o con motivo fuera de la lista', () => {
    expect(validarReporte('', '')).toBe('Elige un motivo.');
    expect(validarReporte('Me cae mal', '')).toBe('Elige un motivo.');
  });

  test('CB-REP-2 detalle de más de 300 caracteres', () => {
    expect(validarReporte('Spam', 'x'.repeat(MAX_DETALLE + 1))).toBe(
      'El detalle debe tener máximo 300 caracteres.',
    );
  });

  test('CB-REP-3 motivo válido con detalle vacío o en el límite', () => {
    expect(validarReporte('Otro', '')).toBeNull();
    expect(validarReporte('Información falsa', 'x'.repeat(MAX_DETALLE))).toBeNull();
  });
});

test('CB-REP-4 idReporte: un solo id por persona y mensaje', () => {
  expect(idReporte('msg1', 'uidA')).toBe('msg1_uidA');
  expect(idReporte('msg1', 'uidA')).toBe(idReporte('msg1', 'uidA'));
  expect(idReporte('msg1', 'uidA')).not.toBe(idReporte('msg1', 'uidB'));
});
