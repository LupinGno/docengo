// Acciones del mapa que no dependen de dibujar el mapa (así se pueden probar sin MapView).
import { Alert } from 'react-native';
import { router } from 'expo-router';
import type { ZonaRiesgo } from '../../lib/zonas';

type Coordenadas = { latitude: number; longitude: number };

/** Opciones al mantener presionado el mapa: agregar un punto, reportar una alerta o registrar una parada. */
export function alMantenerPresionado({ latitude, longitude }: Coordenadas) {
  const params = { lat: String(latitude), lon: String(longitude) };
  Alert.alert('¿Qué quieres agregar aquí?', undefined, [
    { text: 'Agregar punto', onPress: () => router.push({ pathname: '/punto/nuevo', params }) },
    // El formulario de alertas está en la pestaña Alertas y toma la ubicación del celular.
    { text: 'Reportar alerta', onPress: () => router.push('/alertas') },
    { text: 'Registrar parada aquí', onPress: () => router.push({ pathname: '/parada/nueva', params }) },
    { text: 'Cancelar', style: 'cancel' },
  ]);
}

/** Tocar el globo de una zona: los puntos abren su ficha; las alertas, la pestaña de Alertas. */
export function abrirZona(zona: Pick<ZonaRiesgo, 'origen' | 'id'>) {
  if (zona.origen === 'punto') router.push(`/punto/${zona.id}`);
  else router.push('/alertas');
}
