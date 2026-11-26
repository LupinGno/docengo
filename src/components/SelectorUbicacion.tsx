// RF-26: minimapa para marcar dónde está un lugar.
// Tocar el mapa coloca el pin; "Usar mi ubicación" lo pone en la posición del GPS.
// La ubicación es opcional para usar la app (RF-15): si se niega el permiso, se puede tocar el mapa.
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import type { Coordenada } from '../types/modelos';
import { colores, estilos, REGION_PILOTO } from '../constants/tema';

type Props = {
  valor: Coordenada | null;
  onCambiar: (c: Coordenada) => void;
};

export default function SelectorUbicacion({ valor, onCambiar }: Props) {
  const [buscando, setBuscando] = useState(false);
  const [aviso, setAviso] = useState('');
  const mapa = useRef<MapView>(null);

  async function usarMiUbicacion() {
    setAviso('');
    setBuscando(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAviso('Sin permiso de ubicación. Toca el mapa para marcar el lugar.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = pos.coords;
      onCambiar({ latitud: latitude, longitud: longitude });
      // Se acerca el mapa al pin; si el usuario lo arrastra después, no se regresa
      mapa.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 });
    } catch {
      setAviso('No se pudo obtener tu ubicación. Toca el mapa para marcar el lugar.');
    } finally {
      setBuscando(false);
    }
  }

  const pin = valor ? { latitude: valor.latitud, longitude: valor.longitud } : null;

  return (
    <View style={{ marginBottom: 12 }}>
      <View style={styles.marco}>
        <MapView
          ref={mapa}
          style={StyleSheet.absoluteFill}
          initialRegion={REGION_PILOTO}
          onPress={(e) =>
            onCambiar({ latitud: e.nativeEvent.coordinate.latitude, longitud: e.nativeEvent.coordinate.longitude })
          }
        >
          {pin && <Marker coordinate={pin} />}
        </MapView>
      </View>
      <Text style={styles.ayuda}>{valor ? 'Ubicación marcada. Toca el mapa para moverla.' : 'Toca el mapa para marcar el lugar.'}</Text>
      {aviso ? <Text style={estilos.error}>{aviso}</Text> : null}
      <Pressable onPress={usarMiUbicacion} disabled={buscando}>
        {buscando ? (
          <ActivityIndicator color={colores.primario} style={{ marginTop: 8 }} />
        ) : (
          <Text style={[estilos.enlace, { marginTop: 8 }]}>Usar mi ubicación</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  marco: { height: 200, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colores.borde },
  ayuda: { color: colores.textoSuave, fontSize: 12, marginTop: 4 },
});
