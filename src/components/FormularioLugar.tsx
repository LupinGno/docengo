// RF-26 y RF-29: formulario de un lugar destacado, compartido por "Publicar" y "Editar".
// Nombre, categoría, localidad, descripción y ubicación (minimapa o GPS).
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import type { Coordenada } from '../types/modelos';
import { colores, estilos } from '../constants/tema';
import { type BorradorLugar, CATEGORIAS_LUGAR, MAX_DESCRIPCION, MAX_NOMBRE, validarLugar } from '../lib/lugares';
import { REGIONES } from '../lib/salas';
import SelectorUbicacion from './SelectorUbicacion';

/** Lo que se guarda en Firestore (sin autorId, autorNombre ni fecha, que agrega cada pantalla). */
export type DatosLugar = Omit<BorradorLugar, 'ubicacion'> & Coordenada;

type Props = {
  inicial?: BorradorLugar; // al editar
  textoBoton: string;
  onGuardar: (datos: DatosLugar) => Promise<void>;
};

const VACIO: BorradorLugar = { nombre: '', categoria: '', localidad: '', descripcion: '', ubicacion: null };

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

export default function FormularioLugar({ inicial = VACIO, textoBoton, onGuardar }: Props) {
  const [nombre, setNombre] = useState(inicial.nombre);
  const [categoria, setCategoria] = useState(inicial.categoria);
  const [localidad, setLocalidad] = useState(inicial.localidad);
  const [descripcion, setDescripcion] = useState(inicial.descripcion);
  const [ubicacion, setUbicacion] = useState<Coordenada | null>(inicial.ubicacion);
  const [enMapa, setEnMapa] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function guardar() {
    const problema = validarLugar({ nombre, categoria, localidad, descripcion, ubicacion });
    // !ubicacion ya lo revisa validarLugar; se repite para que TypeScript sepa que no es null
    if (problema || !ubicacion) {
      setError(problema ?? '');
      return;
    }
    setError('');
    setCargando(true);
    try {
      await onGuardar({
        nombre: nombre.trim(),
        categoria,
        localidad,
        descripcion: descripcion.trim(),
        latitud: ubicacion.latitud,
        longitud: ubicacion.longitud,
      });
    } catch {
      // RNF-20: se conservan los datos para reintentar sin volver a llenar
      setError('No se pudo guardar el lugar. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <ScrollView
      style={{ backgroundColor: colores.fondo }}
      contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled"
      // Android: que arrastrar el minimapa mueva el mapa y no toda la pantalla
      nestedScrollEnabled
      scrollEnabled={!enMapa}
    >
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
      <SelectorUbicacion valor={ubicacion} onCambiar={setUbicacion} onTocando={setEnMapa} />

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      <Pressable style={[estilos.boton, cargando && estilos.botonDeshabilitado]} onPress={guardar} disabled={cargando}>
        {cargando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.textoBoton}>{textoBoton}</Text>}
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
