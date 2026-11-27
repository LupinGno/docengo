// Caja blanca: capa de riesgo, leyenda y acciones del mapa (RF-13, RF-30, RF-31, RF-32).
// Ver docs/pruebas-caja-blanca.md, sección 21.
import { Alert } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import CapaRiesgo from '../../src/components/mapa/CapaRiesgo';
import Leyenda from '../../src/components/mapa/Leyenda';
import { abrirZona, alMantenerPresionado } from '../../src/components/mapa/acciones';
import type { ZonaRiesgo } from '../../src/lib/zonas';
import { router } from 'expo-router';

// El mapa real necesita el celular; aquí se registran las props con que se dibuja cada pieza
const mockCircle = jest.fn();
const mockMarker = jest.fn();
jest.mock('react-native-maps', () => ({
  Circle: (p: object) => {
    mockCircle(p);
    return null;
  },
  Marker: (p: object) => {
    mockMarker(p);
    return null;
  },
}));
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

const zona = (id: string, nivel: ZonaRiesgo['nivel'], origen: ZonaRiesgo['origen'] = 'alerta'): ZonaRiesgo => ({
  id,
  nivel,
  origen,
  categoria: 'riesgo',
  titulo: `Zona ${id}`,
  descripcion: 'Calle sin luz',
  latitud: 20.21,
  longitud: -101.13,
});

beforeEach(() => jest.clearAllMocks());

describe('CapaRiesgo', () => {
  test('CB-CRI-1 dibuja un círculo y un marcador por zona, con el color de su nivel', async () => {
    await render(<CapaRiesgo zonas={[zona('a', 'alto'), zona('b', 'bajo')]} onAbrir={jest.fn()} />);
    expect(mockCircle).toHaveBeenCalledTimes(2);
    expect(mockMarker).toHaveBeenCalledTimes(2);
    expect(mockCircle.mock.calls[0][0]).toMatchObject({ radius: 300, strokeColor: '#C62828' });
    expect(mockMarker.mock.calls[1][0]).toMatchObject({
      title: 'Zona b',
      description: 'Riesgo bajo · Calle sin luz',
      pinColor: '#F9A825',
    });
  });

  test('CB-CRI-2 tocar el globo de una zona avisa cuál zona fue', async () => {
    const onAbrir = jest.fn();
    const z = zona('a', 'medio');
    await render(<CapaRiesgo zonas={[z]} onAbrir={onAbrir} />);
    mockMarker.mock.calls[0][0].onCalloutPress();
    expect(onAbrir).toHaveBeenCalledWith(z);
  });

  test('CB-CRI-3 sin zonas no dibuja nada', async () => {
    await render(<CapaRiesgo zonas={[]} onAbrir={jest.fn()} />);
    expect(mockCircle).not.toHaveBeenCalled();
  });
});

test('CB-LEY-1 la leyenda muestra los tres niveles', async () => {
  await render(<Leyenda />);
  for (const t of ['Alto', 'Medio', 'Bajo']) expect(screen.getByText(t)).toBeTruthy();
});

describe('acciones del mapa', () => {
  const botones = () => (jest.spyOn(Alert, 'alert').mock.calls[0][2] ?? []) as { text: string; onPress?: () => void }[];

  test('CB-ACC-1 mantener presionado ofrece agregar punto, reportar alerta, registrar parada o cancelar', () => {
    jest.spyOn(Alert, 'alert');
    alMantenerPresionado({ latitude: 20.2, longitude: -101.1 });
    expect(botones().map((b) => b.text)).toEqual([
      'Agregar punto',
      'Reportar alerta aquí',
      'Registrar parada aquí',
      'Cancelar',
    ]);
  });

  test('CB-ACC-6 "Registrar parada aquí" abre el formulario de parada con las coordenadas', () => {
    jest.spyOn(Alert, 'alert');
    alMantenerPresionado({ latitude: 20.2, longitude: -101.1 });
    botones()[2].onPress?.();
    expect(router.push).toHaveBeenCalledWith({ pathname: '/parada/nueva', params: { lat: '20.2', lon: '-101.1' } });
  });

  test('CB-ACC-2 "Agregar punto" abre el formulario con las coordenadas', () => {
    jest.spyOn(Alert, 'alert');
    alMantenerPresionado({ latitude: 20.2, longitude: -101.1 });
    botones()[0].onPress?.();
    expect(router.push).toHaveBeenCalledWith({ pathname: '/punto/nuevo', params: { lat: '20.2', lon: '-101.1' } });
  });

  test('CB-ACC-3 "Reportar alerta aquí" abre el formulario de alerta con las coordenadas', () => {
    jest.spyOn(Alert, 'alert');
    alMantenerPresionado({ latitude: 20.2, longitude: -101.1 });
    botones()[1].onPress?.();
    expect(router.push).toHaveBeenCalledWith({ pathname: '/alerta/nueva', params: { lat: '20.2', lon: '-101.1' } });
  });

  test('CB-ACC-4 abrir una zona de punto lleva a su ficha', () => {
    abrirZona({ origen: 'punto', id: 'p1' });
    expect(router.push).toHaveBeenCalledWith('/punto/p1');
  });

  test('CB-ACC-5 abrir una zona de alerta lleva a la pestaña Alertas', () => {
    abrirZona({ origen: 'alerta', id: 'a1' });
    expect(router.push).toHaveBeenCalledWith('/alertas');
  });
});
