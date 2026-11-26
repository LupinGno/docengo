// RF-28 y RF-29: ficha de un lugar destacado. Responsable: Alexis.
// Muestra el promedio de estrellas y los comentarios en tiempo real.
// Si eres el autor: Editar y Eliminar. Si no: dar o cambiar tu valoración (una por persona).
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { eliminar, escuchar, escucharDoc } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import type { Lugar, Valoracion } from '../../types/modelos';
import { colores, estilos } from '../../constants/tema';
import { promedioEstrellas, puedeEditar, textoPromedio } from '../../lib/valoraciones';
import ValorarLugar from '../../components/ValorarLugar';

export default function FichaLugar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario } = useAuth();
  const [lugar, setLugar] = useState<Lugar | null | undefined>(undefined); // undefined = cargando
  const [valoraciones, setValoraciones] = useState<Valoracion[]>([]);

  useEffect(() => escucharDoc<Lugar>('lugares', id, setLugar), [id]);
  // Se ordena en la app (más reciente primero) para no requerir un índice en Firestore
  useEffect(
    () => escuchar<Valoracion>(`lugares/${id}/valoraciones`, (v) => setValoraciones(v.sort((a, b) => b.fecha - a.fecha))),
    [id],
  );

  const promedio = useMemo(() => promedioEstrellas(valoraciones), [valoraciones]);
  const mia = valoraciones.find((v) => v.id === usuario?.uid);

  function confirmarEliminar() {
    Alert.alert('Eliminar lugar', '¿Seguro que quieres eliminarlo? No se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminar('lugares', id);
            router.back();
          } catch {
            Alert.alert('No se pudo eliminar', 'Revisa tu conexión e intenta de nuevo.');
          }
        },
      },
    ]);
  }

  if (lugar === undefined) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (lugar === null) {
    return (
      <View style={estilos.centrado}>
        <Stack.Screen options={{ headerShown: true, title: 'Lugar' }} />
        <Text style={estilos.subtitulo}>Este lugar ya no existe.</Text>
      </View>
    );
  }

  const esAutor = puedeEditar(lugar.autorId, usuario?.uid);
  const pin = { latitude: lugar.latitud, longitude: lugar.longitud };

  return (
    <ScrollView style={{ backgroundColor: colores.fondo }} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ headerShown: true, title: lugar.nombre }} />

      <Text style={estilos.subtitulo}>{lugar.nombre}</Text>
      <Text style={styles.categoria}>
        {lugar.categoria} · {lugar.localidad}
      </Text>
      <Text style={styles.promedio}>{textoPromedio(promedio, valoraciones.length)}</Text>
      <Text style={{ marginBottom: 8 }}>{lugar.descripcion}</Text>
      <Text style={styles.suave}>Recomendado por {lugar.autorNombre}</Text>

      <View style={styles.mapa} pointerEvents="none">
        <MapView style={StyleSheet.absoluteFill} initialRegion={{ ...pin, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
          <Marker coordinate={pin} />
        </MapView>
      </View>

      {esAutor ? (
        <>
          <Pressable style={estilos.boton} onPress={() => router.push({ pathname: '/lugares/editar/[id]', params: { id } })}>
            <Text style={estilos.textoBoton}>Editar</Text>
          </Pressable>
          <Pressable onPress={confirmarEliminar}>
            <Text style={[estilos.enlace, { color: colores.error, marginBottom: 16 }]}>Eliminar lugar</Text>
          </Pressable>
        </>
      ) : (
        // key: al llegar mi valoración guardada, el formulario se vuelve a crear con sus datos
        <ValorarLugar key={mia?.id ?? 'nueva'} lugarId={id} actual={mia} />
      )}

      <Text style={[estilos.subtitulo, { marginTop: 8 }]}>Comentarios</Text>
      {valoraciones.length === 0 ? <Text style={styles.suave}>Nadie ha valorado este lugar todavía.</Text> : null}
      {valoraciones.map((v) => (
        <View key={v.id} style={estilos.tarjeta}>
          <Text style={styles.autor}>
            {v.autorNombre} · {'★'.repeat(v.estrellas)}
          </Text>
          {v.comentario ? <Text>{v.comentario}</Text> : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoria: { color: colores.primario, marginBottom: 4 },
  promedio: { fontSize: 16, fontWeight: '600', color: colores.texto, marginBottom: 8 },
  suave: { color: colores.textoSuave, marginBottom: 12 },
  mapa: { height: 160, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colores.borde, marginBottom: 16 },
  autor: { fontWeight: '600', color: colores.textoSuave, marginBottom: 2 },
});
