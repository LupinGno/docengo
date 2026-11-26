// Caja blanca: citaDe (RF-22), V(G) = 2 → 2 caminos independientes.
// Ver docs/pruebas-caja-blanca.md, sección "Respuestas del chat".
import { citaDe, MAX_CITA } from '../../src/lib/respuestas';

test('CB-RES-1 texto corto: la cita conserva el texto completo', () => {
  const mensaje = { id: 'm1', autorNombre: 'Ana', texto: '  ¿Hay internet en la escuela?  ' };
  expect(citaDe(mensaje)).toEqual({ id: 'm1', autorNombre: 'Ana', texto: '¿Hay internet en la escuela?' });
});

test('CB-RES-2 texto largo: la cita se recorta y termina en "…"', () => {
  const mensaje = { id: 'm2', autorNombre: 'Luis', texto: 'a'.repeat(MAX_CITA + 20) };
  const cita = citaDe(mensaje);
  expect(cita.texto).toBe(`${'a'.repeat(MAX_CITA)}…`);
  expect(cita.id).toBe('m2');
  expect(cita.autorNombre).toBe('Luis');
});
