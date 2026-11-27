// RF-10, RF-11, RF-14, RF-15: mapa con puntos de interés, riesgo y referencia.
// Responsable: José. Al tocar el globo de un punto se abre su ficha (RF-12).
// Mantener presionado el mapa abre el formulario de punto nuevo (RF-13).
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { escuchar } from '../../services/db';
import type { CategoriaPunto, Punto } from '../../types/modelos';
import { colorCategoria, estilos, REGION_PILOTO } from '../../constants/tema';

const CATEGORIAS: { clave: CategoriaPunto; etiqueta: string }[] = [
  { clave: 'interes', etiqueta: 'Interés' },
  { clave: 'riesgo', etiqueta: 'Riesgo' },
  { clave: 'referencia', etiqueta: 'Referencia' },
];

export default function Mapa() {
  const [puntos, setPuntos] = useState<Punto[]>([]);
  const [visibles, setVisibles] = useState<CategoriaPunto[]>(['interes', 'riesgo', 'referencia']);
  const [conUbicacion, setConUbicacion] = useState(false);

  // Escucha la colección "puntos" en tiempo real
  useEffect(() => escuchar<Punto>('puntos', setPuntos), []);

  // RF-15: la ubicación es opcional; si se niega, el mapa sigue funcionando
  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }) => setConUbicacion(status === 'granted'));
  }, []);

  const alternar = (c: CategoriaPunto) =>
    setVisibles((v) => (v.includes(c) ? v.filter((x) => x !== c) : [...v, c]));

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={REGION_PILOTO}
        showsUserLocation={conUbicacion}
        onLongPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          router.push({ pathname: '/punto/nuevo', params: { lat: String(latitude), lon: String(longitude) } });
        }}
      >
        {puntos
          .filter((p) => visibles.includes(p.categoria))
          .map((p) => (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.latitud, longitude: p.longitud }}
              title={p.nombre}
              description={p.descripcion}
              pinColor={colorCategoria[p.categoria]}
              onCalloutPress={() => router.push(`/punto/${p.id}`)}
            />
          ))}
      </MapView>

      <View style={styles.filtros}>
        {CATEGORIAS.map(({ clave, etiqueta }) => {
          const activo = visibles.includes(clave);
          return (
            <Pressable
              key={clave}
              onPress={() => alternar(clave)}
              style={[estilos.chip, activo && { backgroundColor: colorCategoria[clave], borderColor: colorCategoria[clave] }]}
            >
              <Text style={activo ? estilos.textoChipActivo : estilos.textoChip}>{etiqueta}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.aviso}>
        {conUbicacion
          ? 'Mantén presionado el mapa para agregar un punto.'
          : 'Activa la ubicación para ver tu posición (opcional). Mantén presionado el mapa para agregar un punto.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  filtros: { position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row' },
  aviso: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: '#FFFFFFEE',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
});
