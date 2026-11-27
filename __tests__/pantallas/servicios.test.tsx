// Caja blanca: pestaña Servicios y ficha de servicio (RF-16 a RF-19).
// Ver docs/pruebas-caja-blanca.md, sección 20.
import { Linking } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';
import Servicios from '../../src/app/(tabs)/servicios';
import FichaServicio from '../../src/app/servicio/[id]';
import { escuchar, escucharUno } from '../../src/services/db';
import { useUbicacion } from '../../src/hooks/useUbicacion';
import { router } from 'expo-router';
import type { Servicio } from '../../src/types/modelos';

jest.mock('../../src/services/db', () => ({ escuchar: jest.fn(), escucharUno: jest.fn() }));
jest.mock('../../src/hooks/useUbicacion', () => ({ useUbicacion: jest.fn() }));
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 's1' }),
  Stack: { Screen: () => null },
  router: { push: jest.fn() },
}));
jest.mock('react-native-maps', () => {
  const { View } = jest.requireActual('react-native');
  return { __esModule: true, default: View, Marker: View };
});

const farmacia: Servicio = {
  id: 's1',
  nombre: 'Farmacia del Centro',
  tipo: 'farmacia',
  direccion: 'Hidalgo 10',
  horario: '0:00 a 0:00', // 24 horas: la prueba no depende de la hora del día
  telefono: '445 123 4567',
  latitud: 20.2108,
  longitud: -101.1328,
  autorId: 'a1',
};
const papeleria: Servicio = { ...farmacia, id: 's2', nombre: 'Papelería Lupita', tipo: 'papeleria' };

function datos(lista: Servicio[], uno: Servicio | null | 'nunca' = farmacia, ubicacion: object | null = null) {
  (escuchar as jest.Mock).mockImplementation((_c: string, cb: (l: Servicio[]) => void) => {
    cb(lista);
    return () => {};
  });
  (escucharUno as jest.Mock).mockImplementation((_c: string, _id: string, cb: (s: Servicio | null) => void) => {
    if (uno !== 'nunca') cb(uno);
    return () => {};
  });
  (useUbicacion as jest.Mock).mockReturnValue({ permitida: !!ubicacion, ubicacion });
}

beforeEach(() => jest.clearAllMocks());

describe('Pestaña Servicios', () => {
  test('CB-LST-1 tocar un servicio abre su ficha', async () => {
    datos([farmacia, papeleria]);
    await render(<Servicios />);
    await userEvent.setup().press(screen.getByText('Farmacia del Centro'));
    expect(router.push).toHaveBeenCalledWith('/servicio/s1');
  });

  test('CB-LST-2 el chip "Farmacias" deja solo farmacias (RF-17)', async () => {
    datos([farmacia, papeleria]);
    await render(<Servicios />);
    await userEvent.setup().press(screen.getByText('Farmacias'));
    expect(screen.getByText('Farmacia del Centro')).toBeTruthy();
    expect(screen.queryByText('Papelería Lupita')).toBeNull();
  });

  test('CB-LST-3 sin ubicación avisa que no se ordena', async () => {
    datos([farmacia]);
    await render(<Servicios />);
    expect(screen.getByText('Sin ubicación: se muestran todos sin ordenar.')).toBeTruthy();
  });

  test('CB-LST-5 servicio sin dirección', async () => {
    datos([{ ...farmacia, direccion: undefined }]);
    await render(<Servicios />);
    expect(screen.getByText('Sin dirección')).toBeTruthy();
  });

  test('CB-LST-4 con ubicación muestra la distancia', async () => {
    datos([farmacia], farmacia, { latitud: 20.2108, longitud: -101.1328 });
    await render(<Servicios />);
    expect(screen.getByText('A 0 m')).toBeTruthy();
  });
});

describe('Ficha de servicio (RF-18)', () => {
  test('CB-FSV-1 con todos los datos: campos, estado, distancia y Llamar', async () => {
    datos([], farmacia, { latitud: 20.2108, longitud: -101.1328 });
    await render(<FichaServicio />);
    for (const texto of ['Farmacia del Centro', 'Farmacia', 'Hidalgo 10', '0:00 a 0:00', 'Abierto ahora', '445 123 4567', 'A 0 m']) {
      expect(screen.getByText(texto)).toBeTruthy();
    }
    const abrir = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    await userEvent.setup().press(screen.getByText('Llamar'));
    expect(abrir).toHaveBeenCalledWith('tel:4451234567');
  });

  test('CB-FSV-2 sin dirección, horario ni teléfono: "No disponible" y sin Llamar', async () => {
    datos([], { ...farmacia, direccion: undefined, horario: undefined, telefono: undefined });
    await render(<FichaServicio />);
    expect(screen.getAllByText('No disponible')).toHaveLength(3);
    expect(screen.getByText('Horario no disponible')).toBeTruthy();
    expect(screen.queryByText('Llamar')).toBeNull();
    expect(screen.queryByText(/^A /)).toBeNull();
  });

  test('CB-FSV-3 el servicio ya no existe', async () => {
    datos([], null);
    await render(<FichaServicio />);
    expect(screen.getByText('Este servicio ya no está disponible.')).toBeTruthy();
  });

  test('CB-FSV-4 mientras carga no muestra datos', async () => {
    datos([], 'nunca');
    await render(<FichaServicio />);
    expect(screen.queryByText('Dirección')).toBeNull();
  });

  test('CB-FSV-5 fuera de horario: "Cerrado" (reloj fijo a las 12:00)', async () => {
    jest.useFakeTimers({ now: new Date(2026, 10, 24, 12, 0) });
    try {
      datos([], { ...farmacia, horario: '9:00 a 10:00' });
      await render(<FichaServicio />);
      expect(screen.getByText('Cerrado')).toBeTruthy();
    } finally {
      jest.useRealTimers();
    }
  });
});
