// Lista de servicios cercanos: se puede buscar por tipo y ordenar por cercanía. Responsable: José.
// Al tocar un servicio se abre su ficha.
import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { escuchar } from '../../services/db';
import { useUbicacion } from '../../hooks/useUbicacion';
import { distanciaKm, formatearDistancia } from '../../lib/geo';
import { estaAbierto, listaServicios, textoEstado } from '../../lib/servicios';
import type { Coordenada, Servicio, TipoServicio } from '../../types/modelos';
import { estilos } from '../../constants/tema';

const TIPOS: { clave: TipoServicio | 'todos'; etiqueta: string }[] = [
  { clave: 'todos', etiqueta: 'Todos' },
  { clave: 'farmacia', etiqueta: 'Farmacias' },
  { clave: 'papeleria', etiqueta: 'Papelerías' },
  { clave: 'supermercado', etiqueta: 'Supermercados' },
  { clave: 'parada', etiqueta: 'Paradas' },
];

export default function Servicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [tipo, setTipo] = useState<TipoServicio | 'todos'>('todos');
  const { ubicacion } = useUbicacion();

  useEffect(() => escuchar<Servicio>('servicios', setServicios), []);

  const lista = listaServicios(servicios, tipo, ubicacion);

  return (
    <View style={estilos.contenedor}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 12 }}>
        {TIPOS.map(({ clave, etiqueta }) => (
          <Pressable
            key={clave}
            onPress={() => setTipo(clave)}
            accessibilityRole="button"
            accessibilityState={{ selected: tipo === clave }}
            style={[estilos.chip, tipo === clave && estilos.chipActivo]}
          >
            <Text style={tipo === clave ? estilos.textoChipActivo : estilos.textoChip}>{etiqueta}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {!ubicacion && <Text style={{ marginBottom: 8 }}>Sin ubicación: se muestran todos sin ordenar.</Text>}

      <FlatList
        data={lista}
        keyExtractor={(s) => s.id}
        ListEmptyComponent={<Text>No hay servicios registrados.</Text>}
        renderItem={({ item }) => <TarjetaServicio servicio={item} ubicacion={ubicacion} />}
      />
    </View>
  );
}

function TarjetaServicio({ servicio, ubicacion }: { servicio: Servicio; ubicacion: Coordenada | null }) {
  return (
    <Pressable style={estilos.tarjeta} onPress={() => router.push(`/servicio/${servicio.id}`)}>
      <Text style={estilos.subtitulo}>{servicio.nombre}</Text>
      <Text>{servicio.direccion ?? 'Sin dirección'}</Text>
      <Text>{textoEstado(estaAbierto(servicio.horario, new Date()))}</Text>
      {ubicacion ? <Text>A {formatearDistancia(distanciaKm(ubicacion, servicio))}</Text> : null}
    </Pressable>
  );
}
