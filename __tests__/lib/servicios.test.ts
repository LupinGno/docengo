// Caja blanca: servicios (RF-16 a RF-19). Ver docs/pruebas-caja-blanca.md, sección 20.
import { estaAbierto, listaServicios, sinCoordenadas, textoEstado } from '../../src/lib/servicios';

const a = (h: number, m: number) => new Date(2026, 10, 24, h, m);

describe('estaAbierto: V(G) = 6', () => {
  test('CB-SRV-1 sin horario', () => expect(estaAbierto(undefined, a(10, 0))).toBeNull());
  test('CB-SRV-2 texto sin el formato acordado', () => expect(estaAbierto('todo el día', a(10, 0))).toBeNull());
  test('CB-SRV-3 horas inválidas', () => expect(estaAbierto('25:00 a 26:00', a(10, 0))).toBeNull());
  test('CB-SRV-4 dentro del horario', () => expect(estaAbierto('9:00 a 21:00', a(10, 0))).toBe(true));
  test('CB-SRV-5 un minuto antes de abrir (límite)', () => expect(estaAbierto('9:00 a 21:00', a(8, 59))).toBe(false));
  test('CB-SRV-6 justo al abrir (límite)', () => expect(estaAbierto('9:00 a 21:00', a(9, 0))).toBe(true));
  test('CB-SRV-7 justo al cerrar (cierre exclusivo)', () => expect(estaAbierto('9:00 a 21:00', a(21, 0))).toBe(false));
  test('CB-SRV-8 cruza medianoche, antes de las 12', () => expect(estaAbierto('22:00 a 02:00', a(23, 30))).toBe(true));
  test('CB-SRV-9 cruza medianoche, después de las 12', () => expect(estaAbierto('22:00 a 02:00', a(1, 0))).toBe(true));
  test('CB-SRV-10 cruza medianoche, a mediodía', () => expect(estaAbierto('22:00 a 02:00', a(12, 0))).toBe(false));
  test('CB-SRV-11 "0:00 a 0:00" = abierto las 24 horas', () => {
    expect(estaAbierto('0:00 a 0:00', a(3, 0))).toBe(true);
    expect(estaAbierto('0:00 a 0:00', a(15, 0))).toBe(true);
  });
});

test('CB-SRV-12 textoEstado: V(G) = 3, los tres resultados', () => {
  expect(textoEstado(null)).toBe('Horario no disponible');
  expect(textoEstado(true)).toBe('Abierto ahora');
  expect(textoEstado(false)).toBe('Cerrado');
});

describe('sinCoordenadas (RF-16): V(G) = 2 en el filtro', () => {
  test('CB-GEO2-1 todos con coordenadas', () => {
    expect(sinCoordenadas([{ latitud: 20.2, longitud: -101.1 }])).toEqual([]);
  });
  test('CB-GEO2-2 latitud faltante', () => {
    const malo = { latitud: undefined, longitud: -101.1 };
    expect(sinCoordenadas([malo])).toEqual([malo]);
  });
  test('CB-GEO2-3 longitud escrita como texto en la consola', () => {
    const malo = { latitud: 20.2, longitud: '-101.1' };
    expect(sinCoordenadas([malo])).toEqual([malo]);
  });
});

describe('listaServicios: V(G) = 3', () => {
  const farmaciaCerca = { id: 'f1', tipo: 'farmacia' as const, latitud: 20.2108, longitud: -101.1328 };
  const papeleria = { id: 'p1', tipo: 'papeleria' as const, latitud: 20.2, longitud: -101.13 };
  const farmaciaLejos = { id: 'f2', tipo: 'farmacia' as const, latitud: 20.9, longitud: -101.1 };
  const todos = [farmaciaLejos, papeleria, farmaciaCerca];
  const yo = { latitud: 20.21, longitud: -101.133 };

  test('CB-LSV-1 "Todos" sin ubicación: la lista completa sin ordenar', () => {
    expect(listaServicios(todos, 'todos', null)).toEqual(todos);
  });
  test('CB-LSV-2 solo farmacias sin ubicación', () => {
    expect(listaServicios(todos, 'farmacia', null).map((s) => s.id)).toEqual(['f2', 'f1']);
  });
  test('CB-LSV-3 con ubicación: quita lo de más de 10 km y ordena por cercanía', () => {
    expect(listaServicios(todos, 'todos', yo).map((s) => s.id)).toEqual(['f1', 'p1']);
  });
  test('CB-LSV-4 farmacias con ubicación', () => {
    expect(listaServicios(todos, 'farmacia', yo).map((s) => s.id)).toEqual(['f1']);
  });
});
