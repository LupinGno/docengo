// Pruebas de la ficha de un punto y de su botón Editar.
// Ver docs/pruebas-caja-blanca.md, secciones 8 y 9.
import { Linking } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';
import FichaPunto from '../../src/app/punto/[id]';
import { escucharUno } from '../../src/services/db';
import { useAuth } from '../../src/context/AuthContext';
import { router } from 'expo-router';
import type { Punto } from '../../src/types/modelos';

// Sustituimos Firestore y la navegación: solo se prueba la pantalla
jest.mock('../../src/services/db', () => ({ escucharUno: jest.fn() }));
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'p1' }),
  Stack: { Screen: () => null },
  router: { push: jest.fn() },
}));
jest.mock('../../src/context/AuthContext', () => ({ useAuth: jest.fn() }));

const escucharUnoMock = escucharUno as jest.Mock;
const useAuthMock = useAuth as jest.Mock;
const sesion = (uid: string, rol = 'docente') => useAuthMock.mockReturnValue({ actor: { uid, rol } });

const base: Punto = {
  id: 'p1',
  nombre: 'Farmacia del Centro',
  categoria: 'interes',
  descripcion: 'Abre hasta las 10 de la noche',
  latitud: 20.21,
  longitud: -101.13,
  autorId: 'autor1',
};

/** Hace que escucharUno entregue `punto` en cuanto la pantalla se suscribe. */
function entregar(punto: Punto | null | 'nunca') {
  escucharUnoMock.mockImplementation((_col: string, _id: string, cb: (p: Punto | null) => void) => {
    if (punto !== 'nunca') cb(punto);
    return () => {};
  });
}

beforeEach(() => {
  escucharUnoMock.mockReset();
  sesion('otro');
});

test('CB-FPT-1 punto con teléfono: muestra los 4 datos y el botón Llamar', async () => {
  entregar({ ...base, contacto: '445 123 4567' });
  await render(<FichaPunto />);

  expect(screen.getByText('Farmacia del Centro')).toBeTruthy();
  expect(screen.getByText('Interés')).toBeTruthy();
  expect(screen.getByText('Abre hasta las 10 de la noche')).toBeTruthy();
  expect(screen.getByText('445 123 4567')).toBeTruthy();
  expect(escucharUnoMock).toHaveBeenCalledWith('puntos', 'p1', expect.any(Function));

  const abrir = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  await userEvent.setup().press(screen.getByText('Llamar'));
  expect(abrir).toHaveBeenCalledWith('tel:4451234567');
});

test('CB-FPT-2 punto sin contacto: no aparece ningún botón ni la sección Contacto', async () => {
  entregar(base);
  await render(<FichaPunto />);

  expect(screen.queryByText('Contacto')).toBeNull();
  expect(screen.queryByText('Llamar')).toBeNull();
  expect(screen.queryByText('Escribir correo')).toBeNull();
});

test('CB-FPT-3 el punto ya no existe', async () => {
  entregar(null);
  await render(<FichaPunto />);
  expect(screen.getByText('Este punto ya no está disponible.')).toBeTruthy();
});

test('CB-FPT-4 mientras carga no muestra datos', async () => {
  entregar('nunca');
  await render(<FichaPunto />);
  expect(screen.queryByText('Descripción')).toBeNull();
});

test('CB-FPT-5 contacto por correo y punto sin descripción', async () => {
  entregar({ ...base, categoria: 'riesgo', descripcion: undefined, contacto: 'renta@correo.com' });
  await render(<FichaPunto />);
  expect(screen.getByText('Riesgo')).toBeTruthy();
  expect(screen.getByText('Sin descripción.')).toBeTruthy();
  expect(screen.getByText('Escribir correo')).toBeTruthy();
});

test('CB-FPT-6 contacto que no es teléfono ni correo: se muestra pero sin botón', async () => {
  entregar({ ...base, contacto: 'Preguntar en la tienda' });
  await render(<FichaPunto />);
  expect(screen.getByText('Preguntar en la tienda')).toBeTruthy();
  expect(screen.queryByText('Llamar')).toBeNull();
});

test('CB-FPT-7 el autor ve "Editar punto" y lo lleva a la edición', async () => {
  sesion('autor1');
  entregar(base);
  await render(<FichaPunto />);
  await userEvent.setup().press(screen.getByText('Editar punto'));
  expect(router.push).toHaveBeenCalledWith('/punto/editar/p1');
});

test('CB-FPT-8 un docente que no es el autor no ve "Editar punto"', async () => {
  entregar(base);
  await render(<FichaPunto />);
  expect(screen.queryByText('Editar punto')).toBeNull();
});

test('CB-FPT-9 un admin ve "Editar punto" en un punto ajeno', async () => {
  sesion('otro', 'admin');
  entregar(base);
  await render(<FichaPunto />);
  expect(screen.getByText('Editar punto')).toBeTruthy();
});
