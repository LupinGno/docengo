// RF-26 a RF-29: lugares destacados. Responsable: Alexis.
// Lista en tiempo real (RF-26) con filtros por localidad y categoría (RF-27).
// Tocar un lugar abre su ficha con valoraciones (RF-28) y, si eres el autor, Editar/Eliminar (RF-29).
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { escuchar } from '../../services/db';
import type { Lugar } from '../../types/modelos';
import { colores, estilos } from '../../constants/tema';
import { CATEGORIAS_LUGAR, filtrarLugares, TODAS } from '../../lib/lugares';
import { REGIONES } from '../../lib/salas';

/** Fila horizontal de chips con "Todas" al inicio. */
function Filtro({ titulo, opciones, valor, onElegir }: { titulo: string; opciones: string[]; valor: string; onElegir: (o: string) => void }) {
  return (
    <>
      <Text style={styles.etiqueta}>{titulo}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fila}>
        {[TODAS, ...opciones].map((o) => (
          <Pressable key={o} onPress={() => onElegir(o)} style={[estilos.chip, valor === o && estilos.chipActivo]}>
            <Text style={valor === o ? estilos.textoChipActivo : estilos.textoChip}>{o}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

export default function Lugares() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [localidad, setLocalidad] = useState(TODAS);
  const [categoria, setCategoria] = useState(TODAS);

  // Se ordena en la app (más reciente primero) para no requerir un índice en Firestore
  useEffect(() => escuchar<Lugar>('lugares', (l) => setLugares(l.sort((a, b) => b.fecha - a.fecha))), []);

  const lista = useMemo(() => filtrarLugares(lugares, localidad, categoria), [lugares, localidad, categoria]);
  const filtrando = localidad !== TODAS || categoria !== TODAS;

  return (
    <View style={estilos.contenedor}>
      <Stack.Screen options={{ headerShown: true, title: 'Lugares destacados' }} />

      <Pressable style={[estilos.boton, { marginBottom: 12 }]} onPress={() => router.push('/lugares/nuevo')}>
        <Text style={estilos.textoBoton}>Publicar lugar</Text>
      </Pressable>

      <Filtro titulo="Localidad" opciones={REGIONES} valor={localidad} onElegir={setLocalidad} />
      <Filtro titulo="Categoría" opciones={CATEGORIAS_LUGAR} valor={categoria} onElegir={setCategoria} />

      <FlatList
        data={lista}
        keyExtractor={(l) => l.id}
        ListEmptyComponent={
          <Text>{filtrando ? 'No hay lugares con esos filtros.' : 'Aún no hay lugares. ¡Recomienda el primero!'}</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={estilos.tarjeta}
            onPress={() => router.push({ pathname: '/lugares/[id]', params: { id: item.id } })}
          >
            <Text style={estilos.subtitulo}>{item.nombre}</Text>
            <Text style={{ color: colores.primario, marginBottom: 4 }}>
              {item.categoria} · {item.localidad}
            </Text>
            <Text numberOfLines={3}>{item.descripcion}</Text>
            <Text style={{ color: colores.textoSuave, marginTop: 6 }}>Recomendado por {item.autorNombre}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  etiqueta: { fontWeight: '600', color: colores.textoSuave, marginBottom: 4 },
  fila: { flexGrow: 0, marginBottom: 8 },
});
