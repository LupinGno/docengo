// Caja blanca: función entrar() de la pantalla de login (RF-06), V(G) = 7.
// Ver docs/pruebas-caja-blanca.md, sección 6.
import { render, screen, userEvent } from '@testing-library/react-native';
import Login from '../../src/app/(auth)/login';
import { iniciarSesion } from '../../src/services/auth';

// Sustituimos Firebase y la navegación para probar solo la lógica de la pantalla
jest.mock('../../src/services/auth', () => ({ iniciarSesion: jest.fn() }));
jest.mock('expo-router', () => ({ router: { push: jest.fn(), back: jest.fn() } }));

const iniciarSesionMock = iniciarSesion as jest.Mock;

beforeEach(() => iniciarSesionMock.mockReset());

async function preparar() {
  const usuario = userEvent.setup();
  await render(<Login />);
  return {
    usuario,
    escribir: async (correo: string, contrasena: string) => {
      if (correo) await usuario.type(screen.getByPlaceholderText('Correo'), correo);
      if (contrasena) await usuario.type(screen.getByPlaceholderText('Contraseña'), contrasena);
    },
    entrar: () => usuario.press(screen.getByText('Entrar')),
  };
}

test('CB-LOG-2 correo vacío: no llama a Firebase', async () => {
  const { entrar } = await preparar();
  await entrar();
  expect(screen.getByText('Escribe tu correo y contraseña.')).toBeTruthy();
  expect(iniciarSesionMock).not.toHaveBeenCalled();
});

test('CB-LOG-3 correo lleno y contraseña vacía: no llama a Firebase', async () => {
  const { escribir, entrar } = await preparar();
  await escribir('docente@ugto.mx', '');
  await entrar();
  expect(screen.getByText('Escribe tu correo y contraseña.')).toBeTruthy();
  expect(iniciarSesionMock).not.toHaveBeenCalled();
});

test('CB-LOG-4 credenciales correctas: inicia sesión sin errores', async () => {
  iniciarSesionMock.mockResolvedValue({});
  const { escribir, entrar } = await preparar();
  await escribir('docente@ugto.mx', 'secreta123');
  await entrar();
  expect(iniciarSesionMock).toHaveBeenCalledWith('docente@ugto.mx', 'secreta123');
  expect(screen.queryByText(/incorrectos|Escribe tu/)).toBeNull();
});

test('CB-LOG-5 y CB-LOG-6 fallos: avisa los restantes y bloquea al tercero', async () => {
  iniciarSesionMock.mockRejectedValue({ code: 'auth/invalid-credential' });
  const { escribir, entrar } = await preparar();
  await escribir('docente@ugto.mx', 'incorrecta');

  await entrar();
  expect(await screen.findByText(/Intentos restantes: 2/)).toBeTruthy();
  await entrar();
  expect(await screen.findByText(/Intentos restantes: 1/)).toBeTruthy();
  await entrar();
  expect(await screen.findByText(/Cuenta bloqueada/)).toBeTruthy();
});

test('CB-LOG-1 cuenta bloqueada: un cuarto intento no llega a Firebase', async () => {
  iniciarSesionMock.mockRejectedValue({ code: 'auth/invalid-credential' });
  const { escribir, entrar } = await preparar();
  await escribir('docente@ugto.mx', 'incorrecta');
  for (let i = 0; i < 3; i++) await entrar();
  await screen.findByText(/Cuenta bloqueada/);

  await entrar();
  expect(iniciarSesionMock).toHaveBeenCalledTimes(3);
});

test('CB-LOG-7 un inicio exitoso reinicia el contador de fallos', async () => {
  iniciarSesionMock
    .mockRejectedValueOnce({ code: 'auth/invalid-credential' })
    .mockResolvedValueOnce({})
    .mockRejectedValueOnce({ code: 'auth/invalid-credential' });
  const { escribir, entrar } = await preparar();
  await escribir('docente@ugto.mx', 'secreta123');

  await entrar(); // falla: quedan 2
  expect(await screen.findByText(/Intentos restantes: 2/)).toBeTruthy();
  await entrar(); // éxito: reinicia
  await entrar(); // falla otra vez: vuelven a quedar 2, no 1
  expect(await screen.findByText(/Intentos restantes: 2/)).toBeTruthy();
});

test('CB-LOG-9 mientras Firebase responde: muestra indicador en lugar de "Entrar"', async () => {
  iniciarSesionMock.mockReturnValue(new Promise(() => {})); // nunca responde
  const { escribir, entrar } = await preparar();
  await escribir('docente@ugto.mx', 'secreta123');
  await entrar();
  expect(screen.queryByText('Entrar')).toBeNull();
});

test('CB-LOG-8 error sin código: muestra mensaje genérico', async () => {
  iniciarSesionMock.mockRejectedValue(undefined);
  const { escribir, entrar } = await preparar();
  await escribir('docente@ugto.mx', 'secreta123');
  await entrar();
  expect(await screen.findByText(/Ocurrió un error/)).toBeTruthy();
});
