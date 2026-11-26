// RF-26 a RF-29: lugares destacados. Responsable: Alexis.
// Lista en tiempo real de los lugares que recomienda la comunidad (RF-26).
// Siguiente paso (T-13): filtros por localidad y categoría (RF-27), ficha con
// valoraciones (RF-28) y editar/eliminar solo por el autor (RF-29).
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { escuchar } from '../../services/db';
import type { Lugar } from '../../types/modelos';
import { colores, estilos } from '../../constants/tema';

export default function Lugares() {
  const [lugares, setLugares] = useState<Lugar[]>([]);

  // Se ordena en la app (más reciente primero) para no requerir un índice en Firestore
  useEffect(() => escuchar<Lugar>('lugares', (l) => setLugares(l.sort((a, b) => b.fecha - a.fecha))), []);

  return (
    <View style={estilos.contenedor}>
      <Stack.Screen options={{ headerShown: true, title: 'Lugares destacados' }} />

      <Pressable style={[estilos.boton, { marginBottom: 16 }]} onPress={() => router.push('/lugares/nuevo')}>
        <Text style={estilos.textoBoton}>Publicar lugar</Text>
      </Pressable>

      <FlatList
        data={lugares}
        keyExtractor={(l) => l.id}
        ListEmptyComponent={<Text>Aún no hay lugares. ¡Recomienda el primero!</Text>}
        renderItem={({ item }) => (
          <View style={estilos.tarjeta}>
            <Text style={estilos.subtitulo}>{item.nombre}</Text>
            <Text style={{ color: colores.primario, marginBottom: 4 }}>
              {item.categoria} · {item.localidad}
            </Text>
            <Text numberOfLines={3}>{item.descripcion}</Text>
            <Text style={{ color: colores.textoSuave, marginTop: 6 }}>Recomendado por {item.autorNombre}</Text>
          </View>
        )}
      />
    </View>
  );
}
