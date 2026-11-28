// Mapa interactivo. Responsable: José.
// Muestra los puntos de interés, de riesgo y de referencia.
// Al tocar el globo de un punto se abre su ficha.
// Si mantienes presionado el mapa puedes agregar un punto o reportar una alerta.
// Tiene filtros por categoría y distancia, y se guardan para la próxima vez.
// La ubicación es opcional.
// Los puntos de riesgo y las alertas se dibujan como zonas con su color y descripción.
// Muestra las paradas de transporte con su próxima salida; el botón "Transporte" las prende o apaga.
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { router } from 'expo-router';
import { escuchar } from '../../services/db';
import { useUbicacion } from '../../hooks/useUbicacion';
import { usePreferenciasMapa } from '../../hooks/usePreferenciasMapa';
import { avisoMapa, puntosVisibles, zoomCambio } from '../../lib/mapa';
import { puntosSinRiesgo, zonasDeRiesgo } from '../../lib/zonas';
import { comoCapa } from '../../lib/transporte';
import FiltrosMapa from '../../components/mapa/FiltrosMapa';
import CapaRiesgo from '../../components/mapa/CapaRiesgo';
import CapaParadas from '../../components/mapa/CapaParadas';
import Leyenda from '../../components/mapa/Leyenda';
import { abrirZona, alMantenerPresionado } from '../../components/mapa/acciones';
import type { Alerta, Parada, Punto } from '../../types/modelos';
import { colorCategoria, REGION_PILOTO } from '../../constants/tema';

export default function Mapa() {
  const [puntos, setPuntos] = useState<Punto[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [paradas, setParadas] = useState<Parada[]>([]);
  const { permitida, ubicacion } = useUbicacion();
  const { prefs, cambiar, cargadas } = usePreferenciasMapa();
  const mapa = useRef<MapView>(null);
  const zoomAplicado = useRef(false);

  // Escucha puntos y alertas en tiempo real
  useEffect(() => escuchar<Punto>('puntos', setPuntos), []);
  useEffect(() => escuchar<Alerta>('alertas', setAlertas), []);
  useEffect(() => escuchar<Parada>('paradas', setParadas), []);

  // Cuando llegan las preferencias, se aplica una sola vez el zoom guardado
  useEffect(() => {
    if (!cargadas || zoomAplicado.current) return;
    zoomAplicado.current = true;
    mapa.current?.animateToRegion(
      { ...REGION_PILOTO, latitudeDelta: prefs.zoomDelta, longitudeDelta: prefs.zoomDelta },
      300,
    );
  }, [cargadas, prefs.zoomDelta]);

  const filtro = { ...prefs, ubicacion };
  const visibles = puntosVisibles(puntosSinRiesgo(puntos), filtro);
  const zonas = puntosVisibles(zonasDeRiesgo(puntos, alertas), filtro);
  const paradasVisibles = puntosVisibles(comoCapa(paradas), filtro);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapa}
        style={StyleSheet.absoluteFill}
        initialRegion={REGION_PILOTO}
        showsUserLocation={permitida}
        onRegionChangeComplete={(r) => {
          // Antes de aplicar el zoom guardado, el mapa avisa su región inicial: esa no se guarda.
          if (zoomAplicado.current && zoomCambio(prefs.zoomDelta, r.latitudeDelta)) {
            cambiar({ zoomDelta: r.latitudeDelta });
          }
        }}
        onLongPress={(e) => alMantenerPresionado(e.nativeEvent.coordinate)}
      >
        {visibles.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitud, longitude: p.longitud }}
            title={p.nombre}
            description={p.descripcion}
            pinColor={colorCategoria[p.categoria]}
            onCalloutPress={() => router.push(`/punto/${p.id}`)}
          />
        ))}
        <CapaRiesgo zonas={zonas} onAbrir={abrirZona} />
        <CapaParadas paradas={paradasVisibles} ahora={new Date()} onAbrir={(id) => router.push(`/parada/${id}`)} />
      </MapView>

      <View style={styles.filtros}>
        <FiltrosMapa
          categorias={prefs.categorias}
          radioKm={prefs.radioKm}
          onCategorias={(categorias) => cambiar({ categorias })}
          onRadio={(radioKm) => cambiar({ radioKm })}
        />
      </View>

      {zonas.length > 0 && (
        <View style={styles.leyenda}>
          <Leyenda />
        </View>
      )}

      <Text style={styles.aviso}>{avisoMapa(permitida, prefs.radioKm, ubicacion)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  filtros: { position: 'absolute', top: 12, left: 12, right: 12 },
  leyenda: { position: 'absolute', bottom: 70, left: 12 },
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
