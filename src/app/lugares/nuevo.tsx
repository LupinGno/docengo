// RF-26: formulario para publicar un lugar destacado. Responsable: Alexis.
// Nombre, categoría, localidad, descripción y ubicación (minimapa o GPS).
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { crear } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import type { Coordenada } from '../../types/modelos';
import { colores, estilos } from '../../constants/tema';
import { CATEGORIAS_LUGAR, MAX_DESCRIPCION, MAX_NOMBRE, validarLugar } from '../../lib/lugares';
import { REGIONES } from '../../lib/salas';
import SelectorUbicacion from '../../components/SelectorUbicacion';

/** Fila de chips para elegir una sola opción (categoría o localidad). */
function Opciones({ opciones, valor, onElegir }: { opciones: string[]; valor: string; onElegir: (o: string) => void }) {
  return (
    <View style={styles.opciones}>
      {opciones.map((o) => (
        <Pressable key={o} onPress={() => onElegir(o)} style={[estilos.chip, styles.chip, valor === o && estilos.chipActivo]}>
          <Text style={valor === o ? estilos.textoChipActivo : estilos.textoChip}>{o}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function NuevoLugar() {
  const { usuario } = useAuth();
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState<Coordenada | null>(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function publicar() {
    if (!usuario) return;
    const problema = validarLugar({ nombre, categoria, localidad, descripcion, ubicacion });
    // !ubicacion ya lo revisa validarLugar; se repite para que TypeScript sepa que no es null
    if (problema || !ubicacion) {
      setError(problema ?? '');
      return;
    }
    setError('');
    setCargando(true);
    try {
      await crear('lugares', {
        nombre: nombre.trim(),
        categoria,
        localidad,
        descripcion: descripcion.trim(),
        latitud: ubicacion.latitud,
        longitud: ubicacion.longitud,
        autorId: usuario.uid,
        autorNombre: usuario.displayName ?? 'Docente',
        fecha: Date.now(),
      });
      router.back();
    } catch {
      // RNF-20: se conservan los datos para reintentar sin volver a llenar
      setError('No se pudo publicar el lugar. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: colores.fondo }} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ headerShown: true, title: 'Publicar lugar' }} />

      <Text style={styles.etiqueta}>Nombre</Text>
      <TextInput
        style={estilos.input}
        placeholder="Ej. Café La Plaza"
        maxLength={MAX_NOMBRE}
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.etiqueta}>Categoría</Text>
      <Opciones opciones={CATEGORIAS_LUGAR} valor={categoria} onElegir={setCategoria} />

      <Text style={styles.etiqueta}>Localidad</Text>
      <Opciones opciones={REGIONES} valor={localidad} onElegir={setLocalidad} />

      <Text style={styles.etiqueta}>Descripción</Text>
      <TextInput
        style={[estilos.input, styles.descripcion]}
        placeholder="¿Por qué lo recomiendas a otros docentes?"
        multiline
        maxLength={MAX_DESCRIPCION}
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <Text style={styles.contador}>
        {descripcion.length}/{MAX_DESCRIPCION}
      </Text>

      <Text style={styles.etiqueta}>Ubicación</Text>
      <SelectorUbicacion valor={ubicacion} onCambiar={setUbicacion} />

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      <Pressable style={[estilos.boton, cargando && estilos.botonDeshabilitado]} onPress={publicar} disabled={cargando}>
        {cargando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.textoBoton}>Publicar</Text>}
      </Pressable>
      <Pressable onPress={() => router.back()}>
        <Text style={estilos.enlace}>Cancelar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  etiqueta: { fontWeight: '600', color: colores.textoSuave, marginBottom: 4 },
  opciones: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  chip: { marginBottom: 8 },
  descripcion: { minHeight: 80, textAlignVertical: 'top', marginBottom: 4 },
  contador: { alignSelf: 'flex-end', color: colores.textoSuave, marginBottom: 12 },
});
