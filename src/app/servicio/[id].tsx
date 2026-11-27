// RF-18: ficha de un servicio (nombre, categoría, dirección, horario y teléfono cuando existan).
// RF-16: un mapa pequeño muestra dónde está (geolocalizado). Responsable: José.
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { escucharUno } from '../../services/db';
import { useUbicacion } from '../../hooks/useUbicacion';
import { contactoComoEnlace } from '../../lib/contacto';
import { distanciaKm, formatearDistancia } from '../../lib/geo';
import { ETIQUETA_TIPO, estaAbierto, textoEstado } from '../../lib/servicios';
import type { Coordenada, Servicio } from '../../types/modelos';
import { colores, estilos } from '../../constants/tema';

export default function FichaServicio() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ubicacion } = useUbicacion();
  // undefined = cargando · null = no existe · Servicio = listo
  const [servicio, setServicio] = useState<Servicio | null | undefined>(undefined);

  useEffect(() => escucharUno<Servicio>('servicios', id, setServicio), [id]);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Servicio' }} />
      {servicio === undefined && (
        <View style={estilos.centrado}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {servicio === null && (
        <View style={estilos.centrado}>
          <Text style={estilos.subtitulo}>Este servicio ya no está disponible.</Text>
        </View>
      )}
      {servicio && <Detalle servicio={servicio} ubicacion={ubicacion} />}
    </>
  );
}

function Detalle({ servicio, ubicacion }: { servicio: Servicio; ubicacion: Coordenada | null }) {
  const abierto = estaAbierto(servicio.horario, new Date());
  const enlace = contactoComoEnlace(servicio.telefono);
  const colorEstado = abierto ? '#2E7D32' : colores.textoSuave;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={[estilos.titulo, { marginBottom: 4 }]}>{servicio.nombre}</Text>
      <Text style={{ color: colores.textoSuave, marginBottom: 16 }}>{ETIQUETA_TIPO[servicio.tipo]}</Text>

      <Campo titulo="Dirección" valor={servicio.direccion} />
      <Campo titulo="Horario" valor={servicio.horario} />
      <Text style={{ color: colorEstado, fontWeight: '600', marginBottom: 12 }}>{textoEstado(abierto)}</Text>
      <Campo titulo="Teléfono" valor={servicio.telefono} />
      {ubicacion ? <Text style={{ marginBottom: 12 }}>A {formatearDistancia(distanciaKm(ubicacion, servicio))}</Text> : null}

      {enlace ? (
        <Pressable style={[estilos.boton, { marginBottom: 16 }]} onPress={() => Linking.openURL(enlace)}>
          <Text style={estilos.textoBoton}>Llamar</Text>
        </Pressable>
      ) : null}

      <MapView
        style={styles.mapa}
        scrollEnabled={false}
        zoomEnabled={false}
        initialRegion={{ latitude: servicio.latitud, longitude: servicio.longitud, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
      >
        <Marker coordinate={{ latitude: servicio.latitud, longitude: servicio.longitud }} title={servicio.nombre} />
      </MapView>
    </ScrollView>
  );
}

/** Un dato de la ficha; si no existe, dice "No disponible". */
function Campo({ titulo, valor }: { titulo: string; valor?: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontWeight: '600' }}>{titulo}</Text>
      <Text>{valor || 'No disponible'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mapa: { height: 180, borderRadius: 10 },
});
