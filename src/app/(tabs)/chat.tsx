// RF-20, RF-21, RF-22: chat en tiempo real por sala temática.
// Responsable: Alexis. Siguiente paso: salas por región, reportar mensaje (RF-25), notificaciones (RF-24).
import { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { crear, escuchar, where } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import type { Mensaje } from '../../types/modelos';
import { colores, estilos } from '../../constants/tema';

const SALAS = ['General', 'Escuela', 'Ambiente laboral', 'Servicios básicos', 'Institucional'];

export default function Chat() {
  const { usuario } = useAuth();
  const [sala, setSala] = useState(SALAS[0]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');

  // Se ordena en la app para no requerir un índice compuesto en Firestore
  useEffect(
    () => escuchar<Mensaje>('mensajes', (m) => setMensajes(m.sort((a, b) => b.fecha - a.fecha)), where('sala', '==', sala)),
    [sala],
  );

  async function enviar() {
    const limpio = texto.trim();
    if (!limpio || !usuario) return;
    setTexto('');
    await crear('mensajes', {
      texto: limpio,
      sala,
      autorId: usuario.uid,
      autorNombre: usuario.displayName ?? 'Docente',
      fecha: Date.now(),
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.salas}>
        {SALAS.map((s) => (
          <Pressable key={s} onPress={() => setSala(s)} style={[estilos.chip, sala === s && estilos.chipActivo]}>
            <Text style={sala === s ? estilos.textoChipActivo : estilos.textoChip}>{s}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        inverted
        data={mensajes}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const propio = item.autorId === usuario?.uid;
          return (
            <View style={[styles.burbuja, propio ? styles.propia : styles.ajena]}>
              {!propio && <Text style={styles.autor}>{item.autorNombre}</Text>}
              <Text style={propio ? { color: '#fff' } : undefined}>{item.texto}</Text>
            </View>
          );
        }}
      />

      <View style={styles.barra}>
        <TextInput
          style={[estilos.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Escribe tu duda o recomendación"
          value={texto}
          onChangeText={setTexto}
        />
        <Pressable style={[estilos.boton, styles.enviar]} onPress={enviar}>
          <Text style={estilos.textoBoton}>Enviar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  salas: { flexGrow: 0, padding: 12, borderBottomWidth: 1, borderColor: colores.borde },
  burbuja: { maxWidth: '80%', padding: 10, borderRadius: 12, marginVertical: 4 },
  propia: { alignSelf: 'flex-end', backgroundColor: colores.primario },
  ajena: { alignSelf: 'flex-start', backgroundColor: '#EEEEEE' },
  autor: { fontWeight: '600', marginBottom: 2, color: colores.textoSuave },
  barra: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: colores.borde, alignItems: 'center' },
  enviar: { marginTop: 0, marginLeft: 8 },
});
