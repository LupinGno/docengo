// Caja blanca: zonas de riesgo del mapa (RF-31, RF-32). Ver docs/pruebas-caja-blanca.md, sección 21.
import { DESCRIPCION_RIESGO, puntosSinRiesgo, textoZona, zonasDeRiesgo } from '../../src/lib/zonas';
import type { Alerta, CategoriaPunto, NivelRiesgo, Punto, TipoAlerta } from '../../src/types/modelos';

const c = { latitud: 20.21, longitud: -101.13 };
const punto = (id: string, categoria: CategoriaPunto, descripcion?: string) =>
  ({ id, categoria, nombre: `Punto ${id}`, descripcion, ...c }) as Punto;
const alerta = (id: string, nivel: NivelRiesgo, tipo: TipoAlerta = 'baja_seguridad', descripcion = 'Calle sin luz') =>
  ({ id, nivel, tipo, descripcion, ...c }) as Alerta;

test('CB-ZON-1 un punto de riesgo + uno de interés + 2 alertas = 3 zonas', () => {
  const z = zonasDeRiesgo([punto('r', 'riesgo', 'Asaltos'), punto('i', 'interes')], [alerta('a1', 'alto'), alerta('a2', 'bajo')]);
  expect(z.map((x) => `${x.origen}:${x.id}`)).toEqual(['punto:r', 'alerta:a1', 'alerta:a2']);
});

test('CB-ZON-2 punto de riesgo sin descripción usa la descripción genérica y nivel medio', () => {
  const [z] = zonasDeRiesgo([punto('r', 'riesgo', '')], []);
  expect(z.descripcion).toBe(DESCRIPCION_RIESGO);
  expect(z.nivel).toBe('medio');
  expect(z.titulo).toBe('Punto r');
});

test('CB-ZON-3 criterio 100 % de RF-31: 10 puntos de riesgo y 10 alertas → 20 zonas, todas con descripción', () => {
  const puntos = Array.from({ length: 10 }, (_, i) => punto(`p${i}`, 'riesgo', i % 2 ? `Riesgo ${i}` : undefined));
  const alertas = Array.from({ length: 10 }, (_, i) => alerta(`a${i}`, (['alto', 'medio', 'bajo'] as const)[i % 3]));
  const z = zonasDeRiesgo(puntos, alertas);
  expect(z).toHaveLength(20);
  expect(z.every((x) => x.descripcion.trim().length > 0)).toBe(true);
});

test('CB-ZON-4 listas vacías', () => {
  expect(zonasDeRiesgo([], [])).toEqual([]);
});

test('CB-ZON-5 una alerta conserva su nivel (RF-32) y su tipo como título', () => {
  const [z] = zonasDeRiesgo([], [alerta('a', 'alto', 'crimen_organizado')]);
  expect(z).toMatchObject({ nivel: 'alto', titulo: 'Crimen organizado', origen: 'alerta', categoria: 'riesgo' });
});

test('CB-ZON-6 alerta con descripción vacía (dato mal capturado) también lleva texto', () => {
  const [z] = zonasDeRiesgo([], [alerta('a', 'bajo', 'ambiente_toxico', '')]);
  expect(z.descripcion).toBe(DESCRIPCION_RIESGO);
});

test('CB-ZON-7 puntosSinRiesgo deja fuera los de riesgo (se dibujan como zona, no como alfiler)', () => {
  expect(puntosSinRiesgo([punto('r', 'riesgo'), punto('i', 'interes'), punto('f', 'referencia')]).map((p) => p.id)).toEqual(['i', 'f']);
});

test('CB-ZON-8 textoZona', () => {
  expect(textoZona({ nivel: 'alto', descripcion: 'Calle sin luz' })).toBe('Riesgo alto · Calle sin luz');
});
