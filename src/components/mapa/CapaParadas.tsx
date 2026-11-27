// Paradas de transporte en el mapa (RF-39): marcador con ícono de autobús y su próxima salida.
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { COLOR_TRANSPORTE, textoProximaSalida } from '../../lib/transporte';
import type { Parada } from '../../types/modelos';

type Props = { paradas: Parada[]; ahora: Date; onAbrir: (id: string) => void };

export default function CapaParadas({ paradas, ahora, onAbrir }: Props) {
  return (
    <>
      {paradas.map((p) => (
        <Marker
          key={`parada-${p.id}`}
          coordinate={{ latitude: p.latitud, longitude: p.longitud }}
          title={p.nombre}
          description={textoProximaSalida(p.horarios, ahora, p.duracionMin)}
          onCalloutPress={() => onAbrir(p.id)}
        >
          <View style={styles.icono}>
            <Ionicons name="bus" size={16} color="#FFFFFF" />
          </View>
        </Marker>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  icono: { backgroundColor: COLOR_TRANSPORTE, borderRadius: 14, padding: 5, borderWidth: 2, borderColor: '#FFFFFF' },
});
