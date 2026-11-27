// Caja blanca: contactoComoEnlace, V(G) = 4 → 4 caminos.
// Ver docs/pruebas-caja-blanca.md, sección 17.
import { contactoComoEnlace } from '../../src/lib/contacto';

test('CB-CON-1 sin contacto', () => {
  expect(contactoComoEnlace(undefined)).toBeNull();
  expect(contactoComoEnlace('')).toBeNull();
});

test('CB-CON-2 teléfono con guiones o espacios', () => {
  expect(contactoComoEnlace('445-123-4567')).toBe('tel:4451234567');
  expect(contactoComoEnlace('445 123 45 67')).toBe('tel:4451234567');
});

test('CB-CON-3 correo', () => {
  expect(contactoComoEnlace(' renta@correo.com ')).toBe('mailto:renta@correo.com');
});

test('CB-CON-4 texto que no es teléfono ni correo', () => {
  expect(contactoComoEnlace('Preguntar en la tienda')).toBeNull();
});

test('CB-CON-5 valor límite: 9 dígitos no es teléfono', () => {
  expect(contactoComoEnlace('445123456')).toBeNull();
});
