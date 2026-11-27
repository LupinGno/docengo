// Caja blanca: ficha de parada y capa de paradas del mapa (RF-39, RF-41).
// Ver docs/pruebas-caja-blanca.md, sección 22.
import { render, screen } from '@testing-library/react-native';
import FichaParada from '../../src/app/parada/[id]';
import CapaParadas from '../../src/components/mapa/CapaParadas';
import { escucharUno } from '../../src/services/db';
import { router } from 'expo-router';
import { userEvent } from '@testing-library/react-native';
import type { Parada } from '../../src/types/modelos';

const mockMarker = jest.fn();
jest.mock('react-native-maps', () => ({
  Marker: (p: { children?: unknown }) => {
    mockMarker(p);
    return null;
  },
}));
jest.mock('../../src/services/db', () => ({ escucharUno: jest.fn() }));
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'par1' }),
  Stack: { Screen: () => null },
  router: { push: jest.fn() },
}));

const parada: Parada = {
  id: 'par1',
  nombre: 'Parada Jardín Principal',
  localidad: 'Moroleón',
  rutas: ['Ruta 1', 'Ruta 3'],
  horarios: ['09:00', '07:00'],
  destino: 'Uriangato centro',
  duracionMin: 20,
  latitud: 20.1294,
  longitud: -101.1914,
  autorId: 'a1',
};

function entregar(p: Parada | null | 'nunca') {
  (escucharUno as jest.Mock).mockImplementation((_c: string, _id: string, cb: (x: Parada | null) => void) => {
    if (p !== 'nunca') cb(p);
    return () => {};
  });
}

beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.useRealTimers());

describe('Ficha de parada (RF-41)', () => {
  test('CB-FPA-1 datos completos: rutas, destino, próxima salida con llegada y tabla ordenada', async () => {
    jest.useFakeTimers({ now: new Date(2026, 10, 26, 6, 30) });
    entregar(parada);
    await render(<FichaParada />);
    expect(screen.getByText('Parada Jardín Principal')).toBeTruthy();
    expect(screen.getByText('Ruta 1, Ruta 3')).toBeTruthy();
    expect(screen.getByText('Uriangato centro')).toBeTruthy();
    expect(screen.getByText('Próxima salida 07:00 · llega 07:20')).toBeTruthy();
    expect(screen.getByText('Llega')).toBeTruthy();
    const celdas = screen.getAllByText(/^\d\d:\d\d$/).map((n) => n.props.children);
    expect(celdas).toEqual(['07:00', '07:20', '09:00', '09:20']); // ordenados, paso → llegada
  });

  test('CB-FPA-2 sin rutas, destino ni duración: textos de respaldo y sin columna "Llega"', async () => {
    jest.useFakeTimers({ now: new Date(2026, 10, 26, 6, 30) });
    entregar({ ...parada, rutas: [], destino: undefined, duracionMin: undefined });
    await render(<FichaParada />);
    expect(screen.getByText('Sin rutas registradas')).toBeTruthy();
    expect(screen.getByText('No registrado')).toBeTruthy();
    expect(screen.getByText('Próxima salida 07:00')).toBeTruthy();
    expect(screen.queryByText('Llega')).toBeNull();
  });

  test('CB-FPA-3 sin horarios: lo dice y no hay tabla', async () => {
    entregar({ ...parada, horarios: [] });
    await render(<FichaParada />);
    expect(screen.getByText('Sin horarios registrados')).toBeTruthy();
    expect(screen.queryByText('Pasa')).toBeNull();
  });

  test('CB-FPA-4 la parada ya no existe', async () => {
    entregar(null);
    await render(<FichaParada />);
    expect(screen.getByText('Esta parada ya no está disponible.')).toBeTruthy();
  });

  test('CB-FPA-6 muestra quién actualizó y lleva a "Actualizar horarios"', async () => {
    entregar({ ...parada, actualizadoPor: 'Ana', actualizado: new Date(2026, 10, 27, 9, 0).getTime() });
    await render(<FichaParada />);
    expect(screen.getByText('Actualizado por Ana el 27/11')).toBeTruthy();
    await userEvent.setup().press(screen.getByText('Actualizar horarios'));
    expect(router.push).toHaveBeenCalledWith('/parada/horarios/par1');
  });

  test('CB-FPA-7 actualizado sin nombre: "un docente"; nunca actualizado: sin la línea', async () => {
    entregar({ ...parada, actualizado: new Date(2026, 10, 27).getTime() });
    const { unmount } = await render(<FichaParada />);
    expect(screen.getByText('Actualizado por un docente el 27/11')).toBeTruthy();
    await unmount();
    entregar(parada);
    await render(<FichaParada />);
    expect(screen.queryByText(/Actualizado por/)).toBeNull();
  });

  test('CB-FPA-5 mientras carga no muestra datos', async () => {
    entregar('nunca');
    await render(<FichaParada />);
    expect(screen.queryByText('Rutas')).toBeNull();
  });
});

describe('Capa de paradas en el mapa (RF-39)', () => {
  test('CB-CPA-1 un marcador por parada, en su coordenada, con la próxima salida', async () => {
    const onAbrir = jest.fn();
    await render(<CapaParadas paradas={[parada]} ahora={new Date(2026, 10, 26, 8, 0)} onAbrir={onAbrir} />);
    expect(mockMarker).toHaveBeenCalledTimes(1);
    expect(mockMarker.mock.calls[0][0]).toMatchObject({
      coordinate: { latitude: 20.1294, longitude: -101.1914 },
      title: 'Parada Jardín Principal',
      description: 'Próxima salida 09:00 · llega 09:20',
    });
    mockMarker.mock.calls[0][0].onCalloutPress();
    expect(onAbrir).toHaveBeenCalledWith('par1');
  });
});
