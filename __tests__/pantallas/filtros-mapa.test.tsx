// Pruebas de los botones de filtros del mapa y de las preferencias guardadas.
// Ver docs/pruebas-caja-blanca.md, sección 19.
import { act, render, renderHook, screen, userEvent } from '@testing-library/react-native';
import FiltrosMapa from '../../src/components/mapa/FiltrosMapa';
import { usePreferenciasMapa } from '../../src/hooks/usePreferenciasMapa';
import { PREFERENCIAS_DEFECTO } from '../../src/lib/mapa';
import { actualizar } from '../../src/services/db';
import { useAuth } from '../../src/context/AuthContext';

jest.mock('../../src/services/db', () => ({ actualizar: jest.fn().mockResolvedValue(undefined) }));
jest.mock('../../src/context/AuthContext', () => ({ useAuth: jest.fn() }));

beforeEach(() => jest.clearAllMocks());

describe('FiltrosMapa', () => {
  async function preparar(categorias = ['interes', 'riesgo'] as ('interes' | 'riesgo' | 'referencia')[], radioKm = 0) {
    const onCategorias = jest.fn();
    const onRadio = jest.fn();
    await render(
      <FiltrosMapa categorias={categorias} radioKm={radioKm} onCategorias={onCategorias} onRadio={onRadio} />,
    );
    return { onCategorias, onRadio, usuario: userEvent.setup() };
  }

  test('CB-FMA-1 tocar una categoría encendida la apaga', async () => {
    const { onCategorias, usuario } = await preparar();
    await usuario.press(screen.getByText('Riesgo'));
    expect(onCategorias).toHaveBeenCalledWith(['interes']);
  });

  test('CB-FMA-2 tocar una categoría apagada la enciende', async () => {
    const { onCategorias, usuario } = await preparar();
    await usuario.press(screen.getByText('Referencia'));
    expect(onCategorias).toHaveBeenCalledWith(['interes', 'riesgo', 'referencia']);
  });

  test('CB-FMA-3 tocar "5 km" cambia el radio', async () => {
    const { onRadio, usuario } = await preparar();
    await usuario.press(screen.getByText('5 km'));
    expect(onRadio).toHaveBeenCalledWith(5);
  });

  test('CB-FMA-4 el chip del radio actual aparece seleccionado', async () => {
    await preparar(['interes'], 10);
    expect(screen.getByRole('button', { name: '10 km', selected: true })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Todos', selected: false })).toBeTruthy();
  });
});

describe('usePreferenciasMapa', () => {
  const sesion = (preferencias?: object, uid: string | null = 'u1') =>
    (useAuth as jest.Mock).mockReturnValue({
      usuario: uid ? { uid } : null,
      perfil: uid ? { id: uid, rol: 'docente', preferencias } : null,
    });

  test('CB-PRF-1 sin preferencias guardadas: valores por defecto', async () => {
    sesion(undefined);
    const { result } = await renderHook(() => usePreferenciasMapa());
    expect(result.current.prefs).toEqual(PREFERENCIAS_DEFECTO);
    expect(result.current.cargadas).toBe(true);
  });

  test('CB-PRF-2 con preferencias guardadas: se usan', async () => {
    sesion({ categorias: ['interes'], radioKm: 5 });
    const { result } = await renderHook(() => usePreferenciasMapa());
    expect(result.current.prefs.categorias).toEqual(['interes']);
    expect(result.current.prefs.radioKm).toBe(5);
  });

  test('CB-PRF-3 cambiar aplica al instante y guarda TODAS las preferencias en el perfil', async () => {
    sesion(undefined);
    const { result } = await renderHook(() => usePreferenciasMapa());
    await act(async () => result.current.cambiar({ radioKm: 10 }));
    expect(result.current.prefs.radioKm).toBe(10);
    expect(actualizar).toHaveBeenCalledWith('usuarios', 'u1', {
      preferencias: { ...PREFERENCIAS_DEFECTO, radioKm: 10 },
    });
  });

  test('CB-PRF-4 sin sesión: cambia en pantalla pero no intenta guardar', async () => {
    sesion(undefined, null);
    const { result } = await renderHook(() => usePreferenciasMapa());
    expect(result.current.cargadas).toBe(false);
    await act(async () => result.current.cambiar({ radioKm: 1 }));
    expect(result.current.prefs.radioKm).toBe(1);
    expect(actualizar).not.toHaveBeenCalled();
  });

  test('CB-PRF-5 perfil aún cargando: no guarda y no tapa lo guardado cuando llega', async () => {
    (useAuth as jest.Mock).mockReturnValue({ usuario: { uid: 'u1' }, perfil: null });
    const { result, rerender } = await renderHook(() => usePreferenciasMapa());
    expect(result.current.cargadas).toBe(false);
    await act(async () => result.current.cambiar({ zoomDelta: 0.3 }));
    expect(actualizar).not.toHaveBeenCalled();

    sesion({ categorias: ['interes'], radioKm: 5 });
    await rerender({});
    expect(result.current.prefs).toEqual({ categorias: ['interes'], radioKm: 5, zoomDelta: 0.3 });
  });

  test('CB-PRF-6 cambiar con preferencias guardadas: guarda lo guardado más el cambio', async () => {
    sesion({ categorias: ['interes'], radioKm: 5 });
    const { result } = await renderHook(() => usePreferenciasMapa());
    await act(async () => result.current.cambiar({ radioKm: 10 }));
    expect(actualizar).toHaveBeenCalledWith('usuarios', 'u1', {
      preferencias: { categorias: ['interes'], radioKm: 10, zoomDelta: PREFERENCIAS_DEFECTO.zoomDelta },
    });
  });
});
