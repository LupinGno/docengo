// Caja blanca: notificaciones de mensajes nuevos (RF-24).
// tokenValido V(G) = 2, destinatarios V(G) = 3, avisoDe V(G) = 2,
// salaDeNotificacion V(G) = 3, debeAvisar V(G) = 3.
// Ver docs/pruebas-caja-blanca.md, sección "Notificaciones".
import {
  avisoDe,
  debeAvisar,
  destinatarios,
  MAX_CUERPO,
  salaDeNotificacion,
  tokenValido,
} from '../../src/lib/notificaciones';

const TOKEN_A = 'ExponentPushToken[aaa]';
const TOKEN_B = 'ExpoPushToken[bbb]';

test('CB-NOT-1 tokenValido acepta solo tokens de Expo', () => {
  expect(tokenValido(TOKEN_A)).toBe(true);
  expect(tokenValido(TOKEN_B)).toBe(true);
  expect(tokenValido(undefined)).toBe(false);
  expect(tokenValido('')).toBe(false);
  expect(tokenValido('ExponentPushToken[]')).toBe(false);
  expect(tokenValido('fcm:abc123')).toBe(false);
});

test('CB-NOT-2 destinatarios excluye a quien envía, tokens inválidos y repetidos', () => {
  const usuarios = [
    { id: 'remitente', pushToken: 'ExponentPushToken[yo]' },
    { id: 'u1', pushToken: TOKEN_A },
    { id: 'u2', pushToken: TOKEN_A }, // misma instalación con dos cuentas
    { id: 'u3' }, // Expo Go: sin token
    { id: 'u4', pushToken: 'basura' },
    { id: 'u5', pushToken: TOKEN_B },
  ];
  expect(destinatarios(usuarios, 'remitente')).toEqual([TOKEN_A, TOKEN_B]);
  expect(destinatarios([], 'remitente')).toEqual([]);
});

test('CB-NOT-3 avisoDe arma título de la sala y recorta el cuerpo', () => {
  const corto = avisoDe({ region: 'Moroleón', tema: 'Escuela', autorNombre: 'Ana', texto: '  ¿Hay junta?  ' });
  expect(corto).toEqual({
    title: 'Moroleón · Escuela',
    body: 'Ana: ¿Hay junta?',
    data: { region: 'Moroleón', tema: 'Escuela' },
  });

  const largo = avisoDe({ region: 'Yuriria', tema: 'General', autorNombre: 'Ana', texto: 'a'.repeat(200) });
  expect(largo.body).toHaveLength(MAX_CUERPO + 1);
  expect(largo.body.endsWith('…')).toBe(true);
});

test('CB-NOT-4 salaDeNotificacion solo acepta salas reales', () => {
  expect(salaDeNotificacion({ region: 'Uriangato', tema: 'Escuela', t: '123' })).toEqual({
    region: 'Uriangato',
    tema: 'Escuela',
  });
  expect(salaDeNotificacion(null)).toBeNull();
  expect(salaDeNotificacion('Uriangato')).toBeNull();
  expect(salaDeNotificacion({ region: 'Celaya', tema: 'Escuela' })).toBeNull();
  expect(salaDeNotificacion({ region: 'Uriangato', tema: 'Fiestas' })).toBeNull();
  expect(salaDeNotificacion({})).toBeNull();
});

test('CB-NOT-5 debeAvisar: no propios, no la sala abierta, solo mis salas', () => {
  const misSalas = ['moroleon__escuela', 'yuriria__general'];
  const deAna = { autorId: 'ana', sala: 'moroleon__escuela' };
  expect(debeAvisar({ autorId: 'yo', sala: 'moroleon__escuela' }, 'yo', null, misSalas)).toBe(false);
  expect(debeAvisar(deAna, 'yo', 'moroleon__escuela', misSalas)).toBe(false);
  expect(debeAvisar({ autorId: 'ana', sala: 'uriangato__general' }, 'yo', null, misSalas)).toBe(false);
  expect(debeAvisar(deAna, 'yo', null, misSalas)).toBe(true);
  expect(debeAvisar(deAna, 'yo', 'yuriria__general', misSalas)).toBe(true);
});
