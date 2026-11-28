// Pantalla para registrar una parada nueva. Usa el lugar donde presionaste el mapa o tu ubicación.
// Responsable: José.
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { crear } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { useUbicacion } from '../../hooks/useUbicacion';
import { coordenadaDeParametros } from '../../lib/puntos';
import { armarParada, LOCALIDADES, validarParada } from '../../lib/transporte';
import { mensajeDeError } from '../../lib/errores';
import CamposHorarios from '../../components/CamposHorarios';
import type { Coordenada } from '../../types/modelos';
import { estilos } from '../../constants/tema';

export default function NuevaParada() {
  const { lat, lon } = useLocalSearchParams<{ lat?: string; lon?: string }>();
  const { ubicacion } = useUbicacion();
  // Primero la ubicación del mapa (mantener presionado); si no hay, la del docente
  const coordenada = coordenadaDeParametros(lat, lon) ?? ubicacion;

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Nueva parada' }} />
      {coordenada ? (
        <Formulario coordenada={coordenada} />
      ) : (
        <View style={estilos.centrado}>
          <Text style={estilos.subtitulo}>
            {'Activa tu ubicación o mantén presionado el mapa en el lugar de la parada y elige "Registrar parada aquí".'}
          </Text>
        </View>
      )}
    </>
  );
}

function Formulario({ coordenada }: { coordenada: Coordenada }) {
  const { usuario } = useAuth();
  const [nombre, setNombre] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [rutas, setRutas] = useState('');
  const [destino, setDestino] = useState('');
  const [horarios, setHorarios] = useState('');
  const [duracion, setDuracion] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    if (!usuario) return; // la app no deja llegar aquí sin sesión; protege por si acaso
    const form = { nombre, localidad, rutasTexto: rutas, destino, horariosTexto: horarios, duracionTexto: duracion };
    const problema = validarParada({ ...form, ...coordenada });
    if (problema) {
      setError(problema);
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await crear('paradas', armarParada(form, coordenada, usuario.uid));
      router.back();
    } catch (err: any) {
      setError(mensajeDeError(err?.code));
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={estilos.subtitulo}>Nombre</Text>
      <TextInput style={estilos.input} placeholder="Ej. Parada Jardín Principal" value={nombre} onChangeText={setNombre} />

      <Text style={estilos.subtitulo}>Localidad</Text>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        {LOCALIDADES.map((l) => (
          <Pressable key={l} onPress={() => setLocalidad(l)} style={[estilos.chip, localidad === l && estilos.chipActivo]}>
            <Text style={localidad === l ? estilos.textoChipActivo : estilos.textoChip}>{l}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={estilos.subtitulo}>Rutas (opcional)</Text>
      <TextInput style={estilos.input} placeholder="Ej. Ruta 1, Ruta 3" value={rutas} onChangeText={setRutas} />

      <Text style={estilos.subtitulo}>Destino (opcional)</Text>
      <TextInput style={estilos.input} placeholder="Ej. Uriangato centro" value={destino} onChangeText={setDestino} />

      <CamposHorarios horarios={horarios} duracion={duracion} onHorarios={setHorarios} onDuracion={setDuracion} />

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      <Pressable style={[estilos.boton, guardando && estilos.botonDeshabilitado]} onPress={guardar} disabled={guardando}>
        {guardando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.textoBoton}>Guardar parada</Text>}
      </Pressable>
    </ScrollView>
  );
}
