// Caja blanca: validarRegistro, V(G) = 4 → 4 caminos independientes.
// Ver docs/pruebas-caja-blanca.md, sección 1.
import { correoValido, validarRegistro } from '../../src/lib/validacion';

describe('validarRegistro: caminos básicos', () => {
  test('CB-VAL-1 nombre vacío', () => {
    expect(validarRegistro('   ', 'ana@correo.com', '12345678')).toBe('Escribe tu nombre.');
  });

  test('CB-VAL-2 correo inválido', () => {
    expect(validarRegistro('Ana', 'ana@', '12345678')).toBe('Escribe un correo válido.');
  });

  test('CB-VAL-3 contraseña corta', () => {
    expect(validarRegistro('Ana', 'ana@correo.com', '1234567')).toBe(
      'La contraseña debe tener al menos 8 caracteres.',
    );
  });

  test('CB-VAL-4 datos válidos', () => {
    expect(validarRegistro('Ana', 'ana@correo.com', '12345678')).toBeNull();
  });
});

describe('correoValido: ambos resultados de la condición', () => {
  test('CB-VAL-5 correo con formato correcto', () => {
    expect(correoValido('  docente@ugto.mx ')).toBe(true);
  });

  test('CB-VAL-6 correo sin dominio o con espacios', () => {
    expect(correoValido('docente@')).toBe(false);
    expect(correoValido('doc ente@ugto.mx')).toBe(false);
  });
});
