// Pruebas del botón Guardar del formulario de punto. Explicación en docs/pruebas-caja-blanca.md, sección 18.
import { render, screen, userEvent } from '@testing-library/react-native';
import FormularioPunto from '../../src/components/FormularioPunto';

const yuriria = { latitud: 20.2108, longitud: -101.1328 };

async function preparar(onGuardar = jest.fn().mockResolvedValue(undefined), coordenada = yuriria) {
  const usuario = userEvent.setup();
  await render(<FormularioPunto coordenada={coordenada} textoBoton="Guardar punto" onGuardar={onGuardar} />);
  return { usuario, onGuardar };
}

test('CB-FRM-1 datos inválidos: muestra el error y no guarda', async () => {
  const { usuario, onGuardar } = await preparar();
  await usuario.press(screen.getByText('Guardar punto'));
  expect(screen.getByText('Escribe el nombre del punto.')).toBeTruthy();
  expect(onGuardar).not.toHaveBeenCalled();
});

test('CB-FRM-2 datos válidos: guarda los textos sin espacios sobrantes y con la coordenada', async () => {
  const { usuario, onGuardar } = await preparar();
  await usuario.type(screen.getByPlaceholderText('Ej. Plaza principal'), '  Plaza principal  ');
  await usuario.press(screen.getByText('Referencia'));
  await usuario.type(screen.getByPlaceholderText('Teléfono de 10 dígitos o correo'), ' 4451234567 ');
  await usuario.press(screen.getByText('Guardar punto'));

  expect(onGuardar).toHaveBeenCalledWith({
    nombre: 'Plaza principal',
    categoria: 'referencia',
    descripcion: '',
    contacto: '4451234567',
    ...yuriria,
  });
});

test('CB-FRM-3 Firestore rechaza el guardado: muestra un mensaje comprensible', async () => {
  const onGuardar = jest.fn().mockRejectedValue({ code: 'permission-denied' });
  const { usuario } = await preparar(onGuardar);
  await usuario.type(screen.getByPlaceholderText('Ej. Plaza principal'), 'Plaza');
  await usuario.press(screen.getByText('Interés'));
  await usuario.press(screen.getByText('Guardar punto'));
  expect(await screen.findByText('Ocurrió un error. Intenta de nuevo.')).toBeTruthy();
});

test('CB-FRM-4 al elegir Riesgo la descripción se marca como obligatoria', async () => {
  const { usuario } = await preparar();
  expect(screen.getByText('Descripción (opcional)')).toBeTruthy();
  await usuario.press(screen.getByText('Riesgo'));
  expect(screen.getByText('Descripción (obligatoria)')).toBeTruthy();
});

test('CB-FRM-5 mientras guarda no se puede presionar otra vez', async () => {
  const onGuardar = jest.fn().mockReturnValue(new Promise(() => {})); // nunca termina
  const { usuario } = await preparar(onGuardar);
  await usuario.type(screen.getByPlaceholderText('Ej. Plaza principal'), 'Plaza');
  await usuario.press(screen.getByText('Interés'));
  await usuario.press(screen.getByText('Guardar punto'));
  expect(screen.queryByText('Guardar punto')).toBeNull();
  expect(onGuardar).toHaveBeenCalledTimes(1);
});

test('CB-FRM-6 la coordenada viene con más campos: solo se usan latitud y longitud', async () => {
  const coordenadaConExtras = { ...yuriria, nombre: 'Nombre viejo' } as typeof yuriria;
  const { usuario, onGuardar } = await preparar(undefined, coordenadaConExtras);
  await usuario.type(screen.getByPlaceholderText('Ej. Plaza principal'), 'Nombre nuevo');
  await usuario.press(screen.getByText('Interés'));
  await usuario.press(screen.getByText('Guardar punto'));
  expect(onGuardar.mock.calls[0][0].nombre).toBe('Nombre nuevo');
});
