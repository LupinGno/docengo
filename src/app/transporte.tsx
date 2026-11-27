// RF-40: transporte por zona y alerta de medio alternativo cuando no hay paradas.
// RF-42: botón para que la comunidad registre paradas. Responsable: José.
import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { escuchar } from '../services/db';
import { useUbicacion } from '../hooks/useUbicacion';
import {
  LOCALIDADES,
  necesitaMedioAlternativo,
  paradasDeZona,
  textoProximaSalida,
  zonaElegida,
} from '../lib/transporte';
import type { Parada } from '../types/modelos';
import { estilos } from '../constants/tema';

const OPCIONES = [...LOCALIDADES.map((l) => ({ clave: l, texto: l })), { clave: 'ubicacion', texto: 'Mi ubicación' }];

export default function Transporte() {
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [eleccion, setEleccion] = useState('Yuriria');
  const { ubicacion } = useUbicacion();

  useEffect(() => escuchar<Parada>('paradas', setParadas), []);

  const zona = zonaElegida(eleccion, ubicacion);
  const lista = zona ? paradasDeZona(paradas, zona) : [];

  return (
    <View style={estilos.contenedor}>
      <Stack.Screen options={{ headerShown: true, title: 'Transporte' }} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 12 }}>
        {OPCIONES.map(({ clave, texto }) => (
          <Pressable
            key={clave}
            onPress={() => setEleccion(clave)}
            accessibilityRole="button"
            accessibilityState={{ selected: eleccion === clave }}
            style={[estilos.chip, eleccion === clave && estilos.chipActivo]}
          >
            <Text style={eleccion === clave ? estilos.textoChipActivo : estilos.textoChip}>{texto}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {!zona && <Text style={{ marginBottom: 12 }}>Activa la ubicación para consultar el transporte cerca de ti.</Text>}
      {zona && necesitaMedioAlternativo(lista) && <AlertaSinTransporte />}

      <FlatList
        data={lista}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <Pressable style={estilos.tarjeta} onPress={() => router.push(`/parada/${item.id}`)}>
            <Text style={estilos.subtitulo}>{item.nombre}</Text>
            <Text>{textoProximaSalida(item.horarios, new Date(), item.duracionMin)}</Text>
          </Pressable>
        )}
      />

      <Pressable style={estilos.boton} onPress={() => router.push('/parada/nueva')}>
        <Text style={estilos.textoBoton}>+ Registrar parada</Text>
      </Pressable>
    </View>
  );
}

/** RF-40: alerta de medio alternativo. */
function AlertaSinTransporte() {
  return (
    <View style={[estilos.tarjeta, { backgroundColor: '#FFF3E0', borderColor: '#EF6C00' }]} accessibilityRole="alert">
      <Text style={{ fontWeight: '700', color: '#E65100', marginBottom: 4 }}>
        Sin transporte público registrado en esta zona.
      </Text>
      <Text>
        Opciones: taxi o mototaxi local, aventón con colegas o caminar. Pregunta en el chat de tu región cómo llegan
        otros docentes.
      </Text>
    </View>
  );
}
