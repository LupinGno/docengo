// RF-16 a RF-19: servicios cercanos por tipo, distancia y cercanía.
// Responsable: José. Siguiente paso: ficha de detalle (RF-18) y selector de distancia.
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { escuchar } from '../../services/db';
import { distanciaKm, filtrarPorDistancia, formatearDistancia, ordenarPorCercania } from '../../lib/geo';
import type { Coordenada, Servicio, TipoServicio } from '../../types/modelos';
import { estilos } from '../../constants/tema';

const TIPOS: { clave: TipoServicio | 'todos'; etiqueta: string }[] = [
  { clave: 'todos', etiqueta: 'Todos' },
  { clave: 'farmacia', etiqueta: 'Farmacias' },
  { clave: 'papeleria', etiqueta: 'Papelerías' },
  { clave: 'supermercado', etiqueta: 'Supermercados' },
  { clave: 'parada', etiqueta: 'Paradas' },
];

const DISTANCIA_MAX_KM = 10;

export default function Servicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [tipo, setTipo] = useState<TipoServicio | 'todos'>('todos');
  const [ubicacion, setUbicacion] = useState<Coordenada | null>(null);

  useEffect(() => escuchar<Servicio>('servicios', setServicios), []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({});
      setUbicacion({ latitud: pos.coords.latitude, longitud: pos.coords.longitude });
    })();
  }, []);

  const lista = useMemo(() => {
    let r = tipo === 'todos' ? servicios : servicios.filter((s) => s.tipo === tipo);
    if (ubicacion) r = ordenarPorCercania(filtrarPorDistancia(r, ubicacion, DISTANCIA_MAX_KM), ubicacion);
    return r;
  }, [servicios, tipo, ubicacion]);

  return (
    <View style={estilos.contenedor}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 12 }}>
        {TIPOS.map(({ clave, etiqueta }) => (
          <Pressable key={clave} onPress={() => setTipo(clave)} style={[estilos.chip, tipo === clave && estilos.chipActivo]}>
            <Text style={tipo === clave ? estilos.textoChipActivo : estilos.textoChip}>{etiqueta}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {!ubicacion && <Text style={{ marginBottom: 8 }}>Sin ubicación: se muestran todos sin ordenar.</Text>}

      <FlatList
        data={lista}
        keyExtractor={(s) => s.id}
        ListEmptyComponent={<Text>No hay servicios registrados.</Text>}
        renderItem={({ item }) => (
          <View style={estilos.tarjeta}>
            <Text style={estilos.subtitulo}>{item.nombre}</Text>
            <Text>{item.direccion ?? 'Sin dirección'}</Text>
            {item.horario ? <Text>Horario: {item.horario}</Text> : null}
            {ubicacion ? <Text>A {formatearDistancia(distanciaKm(ubicacion, item))}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}
