// Caja blanca: pantalla de punto nuevo (RF-13). Ver docs/pruebas-caja-blanca.md, sección 18.
import { render, screen, userEvent } from '@testing-library/react-native';
import NuevoPunto from '../../src/app/punto/nuevo';
import { crear } from '../../src/services/db';
import { router } from 'expo-router';

const parametros: { lat?: string; lon?: string } = {};

jest.mock('../../src/services/db', () => ({ crear: jest.fn().mockResolvedValue('nuevo-id') }));
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => parametros,
  Stack: { Screen: () => null },
  router: { back: jest.fn() },
}));
jest.mock('../../src/context/AuthContext', () => ({ useAuth: () => ({ usuario: { uid: 'u1' } }) }));

beforeEach(() => jest.clearAllMocks());

test('CB-NVP-1 sin coordenadas válidas: no muestra el formulario', async () => {
  parametros.lat = 'abc';
  parametros.lon = '-101.13';
  await render(<NuevoPunto />);
  expect(screen.getByText(/Ubicación no válida/)).toBeTruthy();
  expect(screen.queryByText('Guardar punto')).toBeNull();
});

test('CB-NVP-2 con coordenadas válidas: guarda a nombre del usuario y regresa', async () => {
  parametros.lat = '20.2108';
  parametros.lon = '-101.1328';
  const usuario = userEvent.setup();
  await render(<NuevoPunto />);
  await usuario.type(screen.getByPlaceholderText('Ej. Plaza principal'), 'Plaza');
  await usuario.press(screen.getByText('Interés'));
  await usuario.press(screen.getByText('Guardar punto'));

  expect(crear).toHaveBeenCalledWith('puntos', {
    nombre: 'Plaza',
    categoria: 'interes',
    descripcion: '',
    contacto: '',
    latitud: 20.2108,
    longitud: -101.1328,
    autorId: 'u1',
  });
  expect(router.back).toHaveBeenCalled();
});
