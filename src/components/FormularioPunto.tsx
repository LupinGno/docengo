// Formulario de punto. Lo usan las pantallas "nuevo" y "editar".
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { formularioInicial, validarPunto, type CamposPunto } from '../lib/puntos';
import { mensajeDeError } from '../lib/errores';
import type { CategoriaPunto, Coordenada } from '../types/modelos';
import { colorCategoria, estilos, etiquetaCategoria } from '../constants/tema';

export type DatosPunto = Coordenada & {
  nombre: string;
  categoria: CategoriaPunto;
  descripcion: string;
  contacto: string;
};

type Props = {
  coordenada: Coordenada;
  inicial?: Partial<CamposPunto>;
  textoBoton: string;
  onGuardar: (datos: DatosPunto) => Promise<void>;
};

const CATEGORIAS: CategoriaPunto[] = ['interes', 'riesgo', 'referencia'];

export default function FormularioPunto({ coordenada, inicial, textoBoton, onGuardar }: Props) {
  // Los valores iniciales salen de src/lib/puntos.ts para que este componente no sea tan complejo
  const [valores] = useState(() => formularioInicial(inicial));
  const [nombre, setNombre] = useState(valores.nombre);
  const [categoria, setCategoria] = useState(valores.categoria);
  const [descripcion, setDescripcion] = useState(valores.descripcion);
  const [contacto, setContacto] = useState(valores.contacto);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Solo latitud y longitud: así ningún otro campo de `coordenada` pisa lo que se escribió
  const { latitud, longitud } = coordenada;

  async function guardar() {
    const problema = validarPunto({ nombre, categoria, descripcion, latitud, longitud });
    if (problema) {
      setError(problema);
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await onGuardar({
        nombre: nombre.trim(),
        categoria: categoria as CategoriaPunto,
        descripcion: descripcion.trim(),
        contacto: contacto.trim(),
        latitud,
        longitud,
      });
    } catch (err: any) {
      setError(mensajeDeError(err?.code));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={estilos.subtitulo}>Nombre</Text>
      <TextInput style={estilos.input} placeholder="Ej. Plaza principal" value={nombre} onChangeText={setNombre} />

      <Text style={estilos.subtitulo}>Categoría</Text>
      <SelectorCategoria valor={categoria} onCambiar={setCategoria} />

      <Text style={estilos.subtitulo}>Descripción {categoria === 'riesgo' ? '(obligatoria)' : '(opcional)'}</Text>
      <TextInput
        style={[estilos.input, { minHeight: 80, textAlignVertical: 'top' }]}
        placeholder="¿Qué hay aquí? ¿Por qué es importante?"
        multiline
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Text style={estilos.subtitulo}>Contacto (opcional)</Text>
      <TextInput
        style={estilos.input}
        placeholder="Teléfono de 10 dígitos o correo"
        autoCapitalize="none"
        value={contacto}
        onChangeText={setContacto}
      />

      <Text style={{ marginBottom: 12, color: '#666' }}>
        Ubicación: {latitud.toFixed(5)}, {longitud.toFixed(5)}
      </Text>

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      <Pressable style={[estilos.boton, guardando && estilos.botonDeshabilitado]} onPress={guardar} disabled={guardando}>
        {guardando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.textoBoton}>{textoBoton}</Text>}
      </Pressable>
    </ScrollView>
  );
}

/** Botones de categoría. Van aparte para que el formulario no pase de complejidad 10. */
function SelectorCategoria({ valor, onCambiar }: { valor: string; onCambiar: (c: CategoriaPunto) => void }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
      {CATEGORIAS.map((c) => {
        const activo = valor === c;
        return (
          <Pressable
            key={c}
            onPress={() => onCambiar(c)}
            style={[estilos.chip, activo && { backgroundColor: colorCategoria[c], borderColor: colorCategoria[c] }]}
          >
            <Text style={activo ? estilos.textoChipActivo : estilos.textoChip}>{etiquetaCategoria[c]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
