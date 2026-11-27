// Ubicación del docente (RF-15). Opcional: si se niega el permiso, la app sigue funcionando.
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { Coordenada } from '../types/modelos';

export function useUbicacion() {
  const [permitida, setPermitida] = useState(false);
  const [ubicacion, setUbicacion] = useState<Coordenada | null>(null);

  useEffect(() => {
    let suscripcion: Location.LocationSubscription | undefined;
    let activo = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!activo || status !== 'granted') return;
      setPermitida(true);
      // Se actualiza cada 50 m para que el filtro por distancia siga al docente
      suscripcion = await Location.watchPositionAsync({ distanceInterval: 50 }, (pos) =>
        setUbicacion({ latitud: pos.coords.latitude, longitud: pos.coords.longitude }),
      );
    })();

    return () => {
      activo = false;
      suscripcion?.remove();
    };
  }, []);

  return { permitida, ubicacion };
}
