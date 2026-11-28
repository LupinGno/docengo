// Pruebas de transporte: horarios, zonas sin paradas y registro de paradas. Explicación en docs/pruebas-caja-blanca.md, secciones 22 y 23.
import {
  aHora,
  aMinutos,
  armarParada,
  cambiosDeHorarios,
  comoCapa,
  fechaCorta,
  horaLlegada,
  leerDuracion,
  necesitaMedioAlternativo,
  paradasDeZona,
  parsearHorarios,
  primeraSalida,
  proximaSalida,
  textoALista,
  textoProximaSalida,
  validarHorarios,
  validarParada,
  zonaElegida,
} from '../../src/lib/transporte';
import { distanciaKm } from '../../src/lib/geo';

const a = (h: number, m: number) => new Date(2026, 10, 26, h, m);

describe('proximaSalida: V(G) = 6', () => {
  test('CB-TRA-1 sin horarios (el ciclo no se ejecuta)', () => {
    expect(proximaSalida([], a(10, 0))).toBeNull();
  });
  test('CB-TRA-2 antes de todas las salidas: la primera', () => {
    expect(proximaSalida(['07:00', '09:00'], a(6, 0))).toBe('07:00');
  });
  test('CB-TRA-3 justo a la hora de una salida: esa misma (límite >=)', () => {
    expect(proximaSalida(['07:00', '09:00'], a(7, 0))).toBe('07:00');
  });
  test('CB-TRA-4 después de todas: null', () => {
    expect(proximaSalida(['07:00', '09:00'], a(9, 1))).toBeNull();
  });
  test('CB-TRA-5 horarios desordenados: la menor de las futuras', () => {
    expect(proximaSalida(['09:00', '07:30', '08:00'], a(7, 10))).toBe('07:30');
  });
});

describe('funciones de hora', () => {
  test('CB-TRA-6 horaLlegada suma la duración', () => {
    expect(horaLlegada('07:00', 45)).toBe('07:45');
  });
  test('CB-TRA-7 horaLlegada cruza la medianoche', () => {
    expect(horaLlegada('23:50', 20)).toBe('00:10');
  });
  test('CB-TRA-8 aMinutos y aHora son inversas', () => {
    expect(aMinutos('07:05')).toBe(425);
    expect(aHora(425)).toBe('07:05');
  });
  test('CB-TRA-9 primeraSalida: vacía → null; con datos → la menor', () => {
    expect(primeraSalida([])).toBeNull();
    expect(primeraSalida(['09:00', '06:15', '07:00'])).toBe('06:15');
  });
});

describe('textoProximaSalida: V(G) = 4', () => {
  test('CB-TRA-10 sin horarios', () => {
    expect(textoProximaSalida([], a(10, 0))).toBe('Sin horarios registrados');
  });
  test('CB-TRA-11 ya no hay salidas hoy: dice la primera de mañana', () => {
    expect(textoProximaSalida(['06:00', '07:00'], a(22, 0))).toBe('No hay más salidas hoy. Primera de mañana: 06:00');
  });
  test('CB-TRA-12 con duración: salida y llegada', () => {
    expect(textoProximaSalida(['07:30'], a(7, 0), 45)).toBe('Próxima salida 07:30 · llega 08:15');
  });
  test('CB-TRA-13 sin duración: solo la salida', () => {
    expect(textoProximaSalida(['07:30'], a(7, 0))).toBe('Próxima salida 07:30');
  });
});

test('CB-TRA-14 comoCapa marca las paradas como capa "transporte"', () => {
  expect(comoCapa([{ id: 'p1' }])).toEqual([{ id: 'p1', categoria: 'transporte' }]);
});

// ───────────── Zonas sin paradas y registro de paradas (sección 23) ─────────────

const moroleon = { latitud: 20.1294, longitud: -101.1914 };
const pMoroleon1 = { id: 'm1', localidad: 'Moroleón', latitud: 20.1294, longitud: -101.1914 };
const pMoroleon2 = { id: 'm2', localidad: 'Moroleón', latitud: 20.13, longitud: -101.19 };
const pYuriria = { id: 'y1', localidad: 'Yuriria', latitud: 20.2108, longitud: -101.1328 };
const todas = [pMoroleon1, pMoroleon2, pYuriria];

describe('paradasDeZona y necesitaMedioAlternativo (RF-40)', () => {
  test('CB-COB-1 localidad con 2 paradas', () => {
    const r = paradasDeZona(todas, { tipo: 'localidad', localidad: 'Moroleón' });
    expect(r.map((p) => p.id)).toEqual(['m1', 'm2']);
    expect(necesitaMedioAlternativo(r)).toBe(false);
  });

  test('CB-COB-2 localidad sin paradas: alerta de medio alternativo', () => {
    const r = paradasDeZona(todas, { tipo: 'localidad', localidad: 'Uriangato' });
    expect(r).toEqual([]);
    expect(necesitaMedioAlternativo(r)).toBe(true);
  });

  test('CB-COB-3 ubicación con una parada a menos de 1 km: hay cobertura', () => {
    const cerca = { latitud: moroleon.latitud + 0.008, longitud: moroleon.longitud }; // ~0.9 km
    expect(distanciaKm(cerca, pMoroleon1)).toBeLessThan(1);
    expect(necesitaMedioAlternativo(paradasDeZona([pMoroleon1], { tipo: 'ubicacion', coord: cerca, radioKm: 1 }))).toBe(false);
  });

  test('CB-COB-4 ubicación con la parada más cercana a ~3 km: sin cobertura', () => {
    const lejos = { latitud: moroleon.latitud + 0.027, longitud: moroleon.longitud };
    expect(necesitaMedioAlternativo(paradasDeZona([pMoroleon1], { tipo: 'ubicacion', coord: lejos, radioKm: 1 }))).toBe(true);
  });
});

describe('zonaElegida: V(G) = 3', () => {
  test('CB-ZEL-1 una localidad', () => {
    expect(zonaElegida('Yuriria', null)).toEqual({ tipo: 'localidad', localidad: 'Yuriria' });
  });
  test('CB-ZEL-2 "Mi ubicación" sin ubicación: null', () => {
    expect(zonaElegida('ubicacion', null)).toBeNull();
  });
  test('CB-ZEL-3 "Mi ubicación" con ubicación: radio de 1 km', () => {
    expect(zonaElegida('ubicacion', moroleon)).toEqual({ tipo: 'ubicacion', coord: moroleon, radioKm: 1 });
  });
});

describe('parsearHorarios: V(G) = 4', () => {
  test('CB-HOR-1 texto vacío', () => expect(parsearHorarios('')).toEqual({ horarios: [], invalidos: [] }));
  test('CB-HOR-2 normaliza 7:30 → 07:30', () =>
    expect(parsearHorarios('07:00, 7:30').horarios).toEqual(['07:00', '07:30']));
  test('CB-HOR-3 separa los inválidos', () =>
    expect(parsearHorarios('25:00, 07:00, 7.30')).toEqual({ horarios: ['07:00'], invalidos: ['25:00', '7.30'] }));
  test('CB-HOR-4 quita duplicados y ordena', () =>
    expect(parsearHorarios('08:00,07:00,08:00').horarios).toEqual(['07:00', '08:00']));
  test('CB-HOR-5 ignora huecos entre comas', () => expect(parsearHorarios(' , 07:00 , ').horarios).toEqual(['07:00']));
});

describe('leerDuracion: V(G) = 5', () => {
  test('CB-DUR-1 vacía: no se registra', () => expect(leerDuracion('  ')).toEqual({ valor: null, error: null }));
  test('CB-DUR-2 válida', () => expect(leerDuracion('25')).toEqual({ valor: 25, error: null }));
  test('CB-DUR-3 límites 1 y 300 válidos; 0 y 301 no', () => {
    expect(leerDuracion('1').valor).toBe(1);
    expect(leerDuracion('300').valor).toBe(300);
    expect(leerDuracion('0').error).not.toBeNull();
    expect(leerDuracion('301').error).not.toBeNull();
  });
  test('CB-DUR-4 no entera o texto', () => {
    expect(leerDuracion('2.5').error).not.toBeNull();
    expect(leerDuracion('veinte').error).not.toBeNull();
  });
});

describe('validarHorarios y validarParada', () => {
  const base = { nombre: 'Jardín', localidad: 'Moroleón', horariosTexto: '07:00', duracionTexto: '', ...moroleon };

  test('CB-VHO-1 horario inválido: dice cuál', () =>
    expect(validarHorarios('07:00, 25:00', '')).toBe('Revisa estos horarios: 25:00. Usa el formato 07:30.'));
  test('CB-VHO-2 sin horarios', () => expect(validarHorarios(' , ', '')).toBe('Escribe al menos un horario.'));
  test('CB-VHO-3 duración inválida', () => expect(validarHorarios('07:00', '0')).toMatch(/1 a 300/));
  test('CB-VHO-4 todo válido', () => expect(validarHorarios('07:00', '20')).toBeNull());

  test('CB-VPA-1 sin nombre', () => expect(validarParada({ ...base, nombre: ' ' })).toMatch(/nombre/));
  test('CB-VPA-2 sin localidad', () => expect(validarParada({ ...base, localidad: '' })).toMatch(/localidad/));
  test('CB-VPA-3 fuera de la región', () => expect(validarParada({ ...base, latitud: 21 })).toMatch(/región/));
  test('CB-VPA-4 delega en validarHorarios', () => expect(validarParada({ ...base, horariosTexto: '' })).toMatch(/al menos/));
  test('CB-VPA-5 todo válido', () => expect(validarParada(base)).toBeNull());
});

describe('armado de documentos (sin campos undefined)', () => {
  test('CB-ARM-1 parada con duración', () => {
    const f = { nombre: ' Jardín ', localidad: 'Moroleón', rutasTexto: 'Ruta 1, Ruta 3, Ruta 1', destino: ' Centro ', horariosTexto: '8:00, 07:00', duracionTexto: '20' };
    expect(armarParada(f, moroleon, 'u1')).toEqual({
      nombre: 'Jardín',
      localidad: 'Moroleón',
      rutas: ['Ruta 1', 'Ruta 3'],
      destino: 'Centro',
      horarios: ['07:00', '08:00'],
      duracionMin: 20,
      ...moroleon,
      autorId: 'u1',
    });
  });

  test('CB-ARM-2 parada sin duración: no lleva el campo duracionMin', () => {
    const f = { nombre: 'J', localidad: 'Moroleón', rutasTexto: '', destino: '', horariosTexto: '07:00', duracionTexto: '' };
    expect(armarParada(f, moroleon, 'u1')).not.toHaveProperty('duracionMin');
  });

  test('CB-ARM-3 cambios de horarios con y sin duración', () => {
    expect(cambiosDeHorarios('07:00', '15', 'Ana', 1)).toEqual({ horarios: ['07:00'], duracionMin: 15, actualizadoPor: 'Ana', actualizado: 1 });
    expect(cambiosDeHorarios('07:00', '', 'Ana', 1)).not.toHaveProperty('duracionMin');
  });

  test('CB-ARM-4 textoALista y fechaCorta', () => {
    expect(textoALista(' a, ,b ,a')).toEqual(['a', 'b']);
    expect(fechaCorta(new Date(2026, 0, 5).getTime())).toBe('05/01');
  });
});
