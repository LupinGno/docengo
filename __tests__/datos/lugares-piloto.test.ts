// T-29: validación de los datos reales de lugares (scripts/datos/lugares-piloto.json).
// No son pruebas de caja blanca: revisan que los datos cumplan lo que exige la app y el SRS
// antes de cargarlos con scripts/cargar-lugares.mjs. Ver docs/datos-piloto.md.
import datos from '../../scripts/datos/lugares-piloto.json';
import { MAX_DESCRIPCION, MAX_NOMBRE, validarLugar } from '../../src/lib/lugares';
import { REGIONES } from '../../src/lib/salas';
import { CENTRO_LOCALIDAD } from '../../src/lib/alertas';
import { distanciaKm } from '../../src/lib/geo';
import type { Localidad } from '../../src/types/modelos';

const { lugares } = datos;
const MINIMO_TOTAL = 5; // RF-26 y A-8
const MINIMO_POR_LOCALIDAD = 3; // meta del equipo para probar los filtros (RF-27)
const RADIO_KM = 8;

const slug = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

test('DAT-1 cada lugar pasa validarLugar, respeta los máximos y declara su fuente', () => {
  for (const l of lugares) {
    const ubicacion = { latitud: l.latitud, longitud: l.longitud };
    expect([l.id, validarLugar({ ...l, ubicacion })]).toEqual([l.id, null]);
    expect(l.nombre.length).toBeLessThanOrEqual(MAX_NOMBRE);
    expect(l.descripcion.length).toBeLessThanOrEqual(MAX_DESCRIPCION);
    expect(l.fuente).toMatch(/^OpenStreetMap /);
    expect(typeof l.verificado).toBe('boolean');
  }
});

test('DAT-2 hay al menos 5 lugares y al menos 3 por localidad', () => {
  expect(lugares.length).toBeGreaterThanOrEqual(MINIMO_TOTAL);
  for (const localidad of REGIONES) {
    const enLocalidad = lugares.filter((l) => l.localidad === localidad);
    expect([localidad, enLocalidad.length >= MINIMO_POR_LOCALIDAD]).toEqual([localidad, true]);
  }
});

test('DAT-3 cada coordenada está a 8 km o menos del centro de su localidad', () => {
  for (const l of lugares) {
    const km = distanciaKm(CENTRO_LOCALIDAD[l.localidad as Localidad], l);
    expect([l.id, km <= RADIO_KM]).toEqual([l.id, true]);
  }
});

test('DAT-4 los ids son únicos y tienen el formato piloto-<localidad>-<nombre>', () => {
  const ids = lugares.map((l) => l.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const l of lugares) {
    expect(l.id).toMatch(/^piloto-[a-z]+-[a-z0-9-]+$/);
    expect(l.id.startsWith(`piloto-${slug(l.localidad)}-`)).toBe(true);
  }
});
