// Caja blanca: pantalla de edición de punto (RF-13). Ver docs/pruebas-caja-blanca.md, sección 18.
import { Alert } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';
import EditarPunto from '../../src/app/punto/editar/[id]';
import { actualizar, eliminar, escucharUno } from '../../src/services/db';
import { useAuth } from '../../src/context/AuthContext';
import { router } from 'expo-router';
import type { Punto } from '../../src/types/modelos';

jest.mock('../../src/services/db', () => ({
  escucharUno: jest.fn(),
  actualizar: jest.fn().mockResolvedValue(undefined),
  eliminar: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'p1' }),
  Stack: { Screen: () => null },
  router: { back: jest.fn(), replace: jest.fn() },
}));
jest.mock('../../src/context/AuthContext', () => ({ useAuth: jest.fn() }));

const punto: Punto = {
  id: 'p1',
  nombre: 'Plaza',
  categoria: 'referencia',
  latitud: 20.2108,
  longitud: -101.1328,
  autorId: 'autor1',
};

function preparar(uid: string, dato: Punto | null | 'nunca' = punto, rol = 'docente') {
  (useAuth as jest.Mock).mockReturnValue({ actor: { uid, rol } });
  (escucharUno as jest.Mock).mockImplementation((_c: string, _id: string, cb: (p: Punto | null) => void) => {
    if (dato !== 'nunca') cb(dato);
    return () => {};
  });
}

beforeEach(() => jest.clearAllMocks());

test('CB-EDP-1 un docente que no es el autor ve el aviso y no el formulario', async () => {
  preparar('otro');
  await render(<EditarPunto />);
  expect(screen.getByText('Solo el autor o un administrador puede editar este punto.')).toBeTruthy();
  expect(screen.queryByText('Guardar cambios')).toBeNull();
});

test('CB-EDP-2 el autor guarda: se actualizan los datos pero no las coordenadas', async () => {
  preparar('autor1');
  const usuario = userEvent.setup();
  await render(<EditarPunto />);
  await usuario.type(screen.getByDisplayValue('Plaza'), ' principal');
  await usuario.press(screen.getByText('Guardar cambios'));

  expect(actualizar).toHaveBeenCalledWith('puntos', 'p1', {
    nombre: 'Plaza principal',
    categoria: 'referencia',
    descripcion: '',
    contacto: '',
  });
  expect(router.back).toHaveBeenCalled();
});

test('CB-EDP-3 eliminar y cancelar: no se borra nada', async () => {
  preparar('autor1');
  const alerta = jest.spyOn(Alert, 'alert');
  await render(<EditarPunto />);
  await userEvent.setup().press(screen.getByText('Eliminar punto'));

  const botones = alerta.mock.calls[0][2]!;
  botones.find((b) => b.text === 'Cancelar')?.onPress?.();
  expect(eliminar).not.toHaveBeenCalled();
});

test('CB-EDP-4 eliminar y confirmar: se borra y regresa al mapa', async () => {
  preparar('autor1');
  const alerta = jest.spyOn(Alert, 'alert');
  await render(<EditarPunto />);
  await userEvent.setup().press(screen.getByText('Eliminar punto'));

  const botones = alerta.mock.calls[0][2]!;
  await botones.find((b) => b.text === 'Eliminar')?.onPress?.();
  expect(eliminar).toHaveBeenCalledWith('puntos', 'p1');
  expect(router.replace).toHaveBeenCalledWith('/');
});

test('CB-EDP-5 el punto ya no existe', async () => {
  preparar('autor1', null);
  await render(<EditarPunto />);
  expect(screen.getByText('Este punto ya no está disponible.')).toBeTruthy();
});

test('CB-EDP-6 mientras carga no muestra formulario ni aviso', async () => {
  preparar('autor1', 'nunca');
  await render(<EditarPunto />);
  expect(screen.queryByText('Guardar cambios')).toBeNull();
  expect(screen.queryByText(/Solo el autor/)).toBeNull();
});

test('CB-EDP-7 un admin puede editar un punto ajeno', async () => {
  preparar('otro', punto, 'admin');
  await render(<EditarPunto />);
  expect(screen.getByText('Guardar cambios')).toBeTruthy();
});
