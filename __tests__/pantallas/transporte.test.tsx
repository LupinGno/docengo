// Caja blanca: pantallas de transporte (RF-40, RF-42). Ver docs/pruebas-caja-blanca.md, sección 23.
import { render, screen, userEvent } from '@testing-library/react-native';
import Transporte from '../../src/app/transporte';
import NuevaParada from '../../src/app/parada/nueva';
import ActualizarHorarios from '../../src/app/parada/horarios/[id]';
import { actualizar, crear, escuchar, escucharUno } from '../../src/services/db';
import { useUbicacion } from '../../src/hooks/useUbicacion';
import { useAuth } from '../../src/context/AuthContext';
import { router } from 'expo-router';
import type { Parada } from '../../src/types/modelos';

const parametros: Record<string, string | undefined> = {};
jest.mock('../../src/services/db', () => ({
  escuchar: jest.fn(),
  escucharUno: jest.fn(),
  crear: jest.fn().mockResolvedValue('nueva'),
  actualizar: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../src/hooks/useUbicacion', () => ({ useUbicacion: jest.fn() }));
jest.mock('../../src/context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => parametros,
  Stack: { Screen: () => null },
  router: { push: jest.fn(), back: jest.fn() },
}));

const moroleon = { latitud: 20.1294, longitud: -101.1914 };
const parada: Parada = {
  id: 'm1',
  nombre: 'Parada Jardín',
  localidad: 'Moroleón',
  rutas: [],
  horarios: ['07:00', '09:00'],
  duracionMin: 20,
  ...moroleon,
  autorId: 'otro',
};

function preparar(paradas: Parada[], ubicacion: object | null = null) {
  (escuchar as jest.Mock).mockImplementation((_c: string, cb: (l: Parada[]) => void) => {
    cb(paradas);
    return () => {};
  });
  (escucharUno as jest.Mock).mockImplementation((_c: string, _id: string, cb: (p: Parada | null) => void) => {
    cb(paradas[0] ?? null);
    return () => {};
  });
  (useUbicacion as jest.Mock).mockReturnValue({ permitida: !!ubicacion, ubicacion });
}

const sesion = (usuario: object | null = { uid: 'u1', displayName: 'Ana' }) =>
  (useAuth as jest.Mock).mockReturnValue({ usuario });

beforeEach(() => {
  jest.clearAllMocks();
  sesion();
  for (const k of Object.keys(parametros)) delete parametros[k];
});

describe('Pantalla Transporte (RF-40)', () => {
  test('CB-PTR-1 localidad sin paradas: alerta de medio alternativo', async () => {
    preparar([parada]);
    await render(<Transporte />); // empieza en Yuriria
    expect(screen.getByText('Sin transporte público registrado en esta zona.')).toBeTruthy();
  });

  test('CB-PTR-2 localidad con paradas: la lista, sin alerta; tocar abre la ficha', async () => {
    preparar([parada]);
    const usuario = userEvent.setup();
    await render(<Transporte />);
    await usuario.press(screen.getByText('Moroleón'));
    expect(screen.queryByText('Sin transporte público registrado en esta zona.')).toBeNull();
    await usuario.press(screen.getByText('Parada Jardín'));
    expect(router.push).toHaveBeenCalledWith('/parada/m1');
  });

  test('CB-PTR-3 "Mi ubicación" sin permiso: pide activar la ubicación, sin alerta', async () => {
    preparar([parada]);
    await render(<Transporte />);
    await userEvent.setup().press(screen.getByText('Mi ubicación'));
    expect(screen.getByText(/Activa la ubicación/)).toBeTruthy();
    expect(screen.queryByText('Sin transporte público registrado en esta zona.')).toBeNull();
  });

  test('CB-PTR-4 "Mi ubicación" junto a una parada: hay cobertura', async () => {
    preparar([parada], moroleon);
    await render(<Transporte />);
    await userEvent.setup().press(screen.getByText('Mi ubicación'));
    expect(screen.getByText('Parada Jardín')).toBeTruthy();
  });

  test('CB-PTR-5 "+ Registrar parada" abre el formulario', async () => {
    preparar([]);
    await render(<Transporte />);
    await userEvent.setup().press(screen.getByText('+ Registrar parada'));
    expect(router.push).toHaveBeenCalledWith('/parada/nueva');
  });
});

describe('Registrar parada (RF-42)', () => {
  test('CB-NPA-1 sin coordenadas en la ruta ni ubicación: explica cómo hacerlo', async () => {
    preparar([]);
    await render(<NuevaParada />);
    expect(screen.getByText(/Activa tu ubicación o mantén presionado el mapa/)).toBeTruthy();
  });

  test('CB-NPA-2 con coordenadas del mapa: guarda la parada y regresa', async () => {
    preparar([]);
    parametros.lat = String(moroleon.latitud);
    parametros.lon = String(moroleon.longitud);
    const usuario = userEvent.setup();
    await render(<NuevaParada />);
    await usuario.type(screen.getByPlaceholderText('Ej. Parada Jardín Principal'), 'Jardín');
    await usuario.press(screen.getByText('Moroleón'));
    await usuario.type(screen.getByPlaceholderText('Ej. 06:30, 07:00, 7:30'), '7:00, 08:00');
    await usuario.press(screen.getByText('Guardar parada'));
    expect(crear).toHaveBeenCalledWith('paradas', expect.objectContaining({
      nombre: 'Jardín', localidad: 'Moroleón', horarios: ['07:00', '08:00'], autorId: 'u1', ...moroleon,
    }));
    expect(router.back).toHaveBeenCalled();
  });

  test('CB-NPA-3 con ubicación del docente y datos incompletos: muestra el error y no guarda', async () => {
    preparar([], moroleon);
    await render(<NuevaParada />);
    await userEvent.setup().press(screen.getByText('Guardar parada'));
    expect(screen.getByText('Escribe el nombre de la parada.')).toBeTruthy();
    expect(crear).not.toHaveBeenCalled();
  });

  test('CB-NPA-4 Firestore falla: mensaje comprensible y se puede reintentar', async () => {
    preparar([], moroleon);
    (crear as jest.Mock).mockRejectedValueOnce({ code: 'permission-denied' });
    const usuario = userEvent.setup();
    await render(<NuevaParada />);
    await usuario.type(screen.getByPlaceholderText('Ej. Parada Jardín Principal'), 'Jardín');
    await usuario.press(screen.getByText('Moroleón'));
    await usuario.type(screen.getByPlaceholderText('Ej. 06:30, 07:00, 7:30'), '07:00');
    await usuario.press(screen.getByText('Guardar parada'));
    expect(await screen.findByText('Ocurrió un error. Intenta de nuevo.')).toBeTruthy();
    expect(screen.getByText('Guardar parada')).toBeTruthy();
  });
});

test('CB-NPA-5 sin sesión (caso defensivo): no intenta guardar', async () => {
  preparar([], moroleon);
  sesion(null);
  await render(<NuevaParada />);
  await userEvent.setup().press(screen.getByText('Guardar parada'));
  expect(crear).not.toHaveBeenCalled();
  expect(screen.queryByText('Escribe el nombre de la parada.')).toBeNull();
});

describe('Actualizar horarios (RF-42)', () => {
  test('CB-AHO-1 precarga los horarios y la duración actuales', async () => {
    preparar([parada]);
    await render(<ActualizarHorarios />);
    expect(screen.getByDisplayValue('07:00, 09:00')).toBeTruthy();
    expect(screen.getByDisplayValue('20')).toBeTruthy();
  });

  test('CB-AHO-2 guarda solo horarios, duración y quién/cuándo (lo que permiten las reglas)', async () => {
    preparar([parada]);
    const usuario = userEvent.setup();
    await render(<ActualizarHorarios />);
    await usuario.type(screen.getByDisplayValue('07:00, 09:00'), ', 10:30');
    await usuario.press(screen.getByText('Guardar horarios'));
    expect(actualizar).toHaveBeenCalledWith('paradas', 'm1', {
      horarios: ['07:00', '09:00', '10:30'],
      duracionMin: 20,
      actualizadoPor: 'Ana',
      actualizado: expect.any(Number),
    });
    expect(router.back).toHaveBeenCalled();
  });

  test('CB-AHO-3 horario mal escrito: dice cuál y no guarda', async () => {
    preparar([parada]);
    const usuario = userEvent.setup();
    await render(<ActualizarHorarios />);
    await usuario.type(screen.getByDisplayValue('07:00, 09:00'), ', 25:00');
    await usuario.press(screen.getByText('Guardar horarios'));
    expect(screen.getByText('Revisa estos horarios: 25:00. Usa el formato 07:30.')).toBeTruthy();
    expect(actualizar).not.toHaveBeenCalled();
  });

  test('CB-AHO-4 parada sin duración y Firestore falla: campo vacío y mensaje', async () => {
    preparar([{ ...parada, duracionMin: undefined }]);
    (actualizar as jest.Mock).mockRejectedValueOnce({});
    await render(<ActualizarHorarios />);
    expect(screen.getByPlaceholderText('Ej. 25').props.value).toBe('');
    await userEvent.setup().press(screen.getByText('Guardar horarios'));
    expect(await screen.findByText('Ocurrió un error. Intenta de nuevo.')).toBeTruthy();
  });

  test('CB-AHO-6 docente sin nombre en su cuenta: se guarda como "Docente"', async () => {
    preparar([parada]);
    sesion({ uid: 'u2', displayName: null });
    await render(<ActualizarHorarios />);
    await userEvent.setup().press(screen.getByText('Guardar horarios'));
    expect((actualizar as jest.Mock).mock.calls[0][2].actualizadoPor).toBe('Docente');
  });

  test('CB-AHO-5 la parada ya no existe', async () => {
    preparar([]);
    await render(<ActualizarHorarios />);
    expect(screen.getByText('Esta parada ya no está disponible.')).toBeTruthy();
  });
});
