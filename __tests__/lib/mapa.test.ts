// Pruebas de los filtros y las preferencias del mapa. Explicación en docs/pruebas-caja-blanca.md, sección 19.
import {
  alternar,
  avisoMapa,
  etiquetaRadio,
  PREFERENCIAS_DEFECTO as D,
  preferenciasConDefecto,
  puntosVisibles,
  zoomCambio,
} from '../../src/lib/mapa';
import { distanciaKm } from '../../src/lib/geo';

const centroYuriria = { latitud: 20.2108, longitud: -101.1328 };
// ~3.3 km al sur del centro
const cerca = { id: 'cerca', categoria: 'interes' as const, latitud: 20.181, longitud: -101.1328 };
// Moroleón, ~11 km
const lejos = { id: 'lejos', categoria: 'interes' as const, latitud: 20.1294, longitud: -101.1914 };
const riesgo = { id: 'riesgo', categoria: 'riesgo' as const, ...centroYuriria };

describe('preferenciasConDefecto: V(G) = 5', () => {
  test('CB-MAP-1 sin preferencias guardadas: todos los valores por defecto', () => {
    expect(preferenciasConDefecto(undefined)).toEqual(D);
  });

  test('CB-MAP-2 solo radio guardado: el resto por defecto', () => {
    expect(preferenciasConDefecto({ radioKm: 5 })).toEqual({ ...D, radioKm: 5 });
  });

  test('CB-MAP-3 radio 0 ("Todos") se conserva y no se cambia por el valor por defecto', () => {
    expect(preferenciasConDefecto({ radioKm: 0, zoomDelta: 0.05 }).radioKm).toBe(0);
  });

  test('CB-MAP-4 preferencias completas se devuelven igual', () => {
    const p = { categorias: ['interes' as const], radioKm: 10, zoomDelta: 0.05 };
    expect(preferenciasConDefecto(p)).toEqual(p);
  });
});

describe('puntosVisibles: V(G) = 4 en el filtro', () => {
  const todas = { categorias: D.categorias, radioKm: 0, ubicacion: centroYuriria };

  test('CB-MAP-5 categoría apagada: se oculta', () => {
    expect(puntosVisibles([riesgo], { ...todas, categorias: ['interes'] })).toEqual([]);
  });

  test('CB-MAP-6 radio 0 ("Todos"): se muestran todos los de la categoría', () => {
    expect(puntosVisibles([cerca, lejos], todas)).toHaveLength(2);
  });

  test('CB-MAP-7 radio 5 km sin ubicación: se ignora el radio', () => {
    expect(puntosVisibles([cerca, lejos], { ...todas, radioKm: 5, ubicacion: null })).toHaveLength(2);
  });

  test('CB-MAP-8 radio 5 km: el punto a ~3 km sí se ve', () => {
    expect(puntosVisibles([cerca], { ...todas, radioKm: 5 })).toEqual([cerca]);
  });

  test('CB-MAP-9 radio 5 km: el punto a ~11 km no se ve', () => {
    expect(puntosVisibles([lejos], { ...todas, radioKm: 5 })).toEqual([]);
  });

  test('CB-MAP-10 valor límite: punto exactamente a radioKm sí se ve', () => {
    const exacta = distanciaKm(centroYuriria, lejos);
    expect(puntosVisibles([lejos], { ...todas, radioKm: exacta })).toEqual([lejos]);
  });
});

describe('funciones auxiliares', () => {
  test('CB-MAP-11 alternar agrega si no está y quita si está', () => {
    expect(alternar(['interes'], 'riesgo')).toEqual(['interes', 'riesgo']);
    expect(alternar(['interes', 'riesgo'], 'interes')).toEqual(['riesgo']);
  });

  test('CB-MAP-12 zoomCambio: más de 10 % sí, 10 % exacto o menos no', () => {
    expect(zoomCambio(0.1, 0.05)).toBe(true);
    expect(zoomCambio(0.1, 0.11)).toBe(false); // 10 %: límite, no se guarda
    expect(zoomCambio(0.1, 0.1)).toBe(false);
  });

  test('CB-MAP-13 etiquetaRadio', () => {
    expect(etiquetaRadio(0)).toBe('Todos');
    expect(etiquetaRadio(5)).toBe('5 km');
  });
});

describe('avisoMapa: V(G) = 4', () => {
  test('CB-MAP-14 radio activo sin ubicación: pide activar la ubicación para filtrar', () => {
    expect(avisoMapa(false, 5, null)).toBe('Activa la ubicación para filtrar por distancia.');
  });

  test('CB-MAP-15 sin permiso y sin radio: aviso opcional', () => {
    expect(avisoMapa(false, 0, null)).toMatch(/opcional/);
  });

  test('CB-MAP-16 con permiso: solo la ayuda de mantener presionado', () => {
    expect(avisoMapa(true, 5, centroYuriria)).toBe('Mantén presionado el mapa para agregar.');
  });
});
