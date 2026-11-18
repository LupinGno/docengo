// Caja blanca: opcionesVisibles, V(G) = 2, con cobertura de condiciones múltiples = 3 casos.
// Ver docs/pruebas-caja-blanca.md, sección 5.
import type { Flag } from '../../src/constants/flags';
import { opcionesVisibles } from '../../src/lib/flags';

type Opcion = { titulo: string; flag?: Flag };

const flags = { lugares: true, hospedaje: false, transporte: false, perfil: false };

test('CB-FLG-1 opción sin flag siempre se muestra', () => {
  const ayuda: Opcion = { titulo: 'Ayuda' };
  expect(opcionesVisibles([ayuda], flags)).toEqual([ayuda]);
});

test('CB-FLG-2 opción con flag encendida se muestra', () => {
  const lugares: Opcion = { titulo: 'Lugares', flag: 'lugares' };
  expect(opcionesVisibles([lugares], flags)).toEqual([lugares]);
});

test('CB-FLG-3 opción con flag apagada se oculta', () => {
  const hospedaje: Opcion = { titulo: 'Hospedaje', flag: 'hospedaje' };
  expect(opcionesVisibles([hospedaje], flags)).toEqual([]);
});
