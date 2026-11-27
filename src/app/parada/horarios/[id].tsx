// RF-42: cualquier docente puede actualizar los horarios de una parada.
// Las reglas de Firestore solo le permiten cambiar horarios, duración y quién/cuándo actualizó.
// Responsable: José.
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { actualizar, escucharUno } from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { cambiosDeHorarios, validarHorarios } from '../../../lib/transporte';
import { mensajeDeError } from '../../../lib/errores';
import CamposHorarios from '../../../components/CamposHorarios';
import type { Parada } from '../../../types/modelos';
import { estilos } from '../../../constants/tema';

export default function ActualizarHorarios() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [parada, setParada] = useState<Parada | null | undefined>(undefined);

  useEffect(() => escucharUno<Parada>('paradas', id, setParada), [id]);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Actualizar horarios' }} />
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
      {parada && <Formulario key={parada.id} parada={parada} />}
    </>
  );
}

function Formulario({ parada }: { parada: Parada }) {
  const { usuario } = useAuth();
  const [horarios, setHorarios] = useState(parada.horarios.join(', '));
  const [duracion, setDuracion] = useState(parada.duracionMin ? String(parada.duracionMin) : '');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    const problema = validarHorarios(horarios, duracion);
    if (problema) {
      setError(problema);
      return;
    }
    setGuardando(true);
    setError('');
    try {
      const quien = usuario?.displayName || 'Docente';
      await actualizar('paradas', parada.id, cambiosDeHorarios(horarios, duracion, quien, Date.now()));
      router.back();
    } catch (err: any) {
      setError(mensajeDeError(err?.code));
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={[estilos.titulo, { marginBottom: 16 }]}>{parada.nombre}</Text>
      <CamposHorarios horarios={horarios} duracion={duracion} onHorarios={setHorarios} onDuracion={setDuracion} />
      {error ? <Text style={estilos.error}>{error}</Text> : null}
      <Pressable style={[estilos.boton, guardando && estilos.botonDeshabilitado]} onPress={guardar} disabled={guardando}>
        {guardando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.textoBoton}>Guardar horarios</Text>}
      </Pressable>
    </ScrollView>
  );
}
