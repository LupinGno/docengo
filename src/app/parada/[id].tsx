// RF-41: ficha de una parada con la próxima salida y la tabla de horarios (paso → llegada).
// RF-42: cualquier docente puede actualizar los horarios; se muestra quién y cuándo.
// Responsable: José.
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { escucharUno } from '../../services/db';
import { fechaCorta, horaLlegada, textoProximaSalida } from '../../lib/transporte';
import type { Parada } from '../../types/modelos';
import { colores, estilos } from '../../constants/tema';

export default function FichaParada() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // undefined = cargando · null = no existe · Parada = lista
  const [parada, setParada] = useState<Parada | null | undefined>(undefined);

  useEffect(() => escucharUno<Parada>('paradas', id, setParada), [id]);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Parada' }} />
      {parada === undefined && (
        <View style={estilos.centrado}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {parada === null && (
        <View style={estilos.centrado}>
          <Text style={estilos.subtitulo}>Esta parada ya no está disponible.</Text>
        </View>
      )}
      {parada && <Detalle parada={parada} />}
    </>
  );
}

function Detalle({ parada }: { parada: Parada }) {
  const horarios = [...parada.horarios].sort();

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={[estilos.titulo, { marginBottom: 4 }]}>{parada.nombre}</Text>
      <Text style={{ color: colores.textoSuave, marginBottom: 16 }}>{parada.localidad}</Text>

      <Text style={{ fontWeight: '600' }}>Rutas</Text>
      <Text style={{ marginBottom: 12 }}>{parada.rutas.length ? parada.rutas.join(', ') : 'Sin rutas registradas'}</Text>

      <Text style={{ fontWeight: '600' }}>Destino</Text>
      <Text style={{ marginBottom: 12 }}>{parada.destino || 'No registrado'}</Text>

      <View style={[estilos.tarjeta, { backgroundColor: '#F3E5F5', borderColor: '#CE93D8' }]}>
        <Text style={{ fontWeight: '600' }}>{textoProximaSalida(horarios, new Date(), parada.duracionMin)}</Text>
      </View>

      <TablaHorarios horarios={horarios} duracionMin={parada.duracionMin} />

      {parada.actualizado ? (
        <Text style={{ marginTop: 12, color: colores.textoSuave }}>
          Actualizado por {parada.actualizadoPor || 'un docente'} el {fechaCorta(parada.actualizado)}
        </Text>
      ) : null}

      <Pressable onPress={() => router.push(`/parada/horarios/${parada.id}`)}>
        <Text style={estilos.enlace}>Actualizar horarios</Text>
      </Pressable>
    </ScrollView>
  );
}

function TablaHorarios({ horarios, duracionMin }: { horarios: string[]; duracionMin?: number }) {
  if (horarios.length === 0) return null;
  return (
    <View style={{ marginTop: 8 }}>
      <View style={styles.fila}>
        <Text style={styles.encabezado}>Pasa</Text>
        {duracionMin ? <Text style={styles.encabezado}>Llega</Text> : null}
      </View>
      {horarios.map((h) => (
        <View key={h} style={styles.fila}>
          <Text style={styles.celda}>{h}</Text>
          {duracionMin ? <Text style={styles.celda}>{horaLlegada(h, duracionMin)}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colores.borde, paddingVertical: 6 },
  encabezado: { flex: 1, fontWeight: '600' },
  celda: { flex: 1 },
});
