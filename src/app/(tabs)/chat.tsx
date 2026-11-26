// RF-20, RF-21, RF-22, RF-25: chat en tiempo real por sala (región + tema).
// Mantener presionado un mensaje permite Responder (con cita) o Reportar.
// Responsable: Alexis. Siguiente paso: notificaciones (RF-24).
import { useEffect, useState } from 'react';
import {
  Alert,
  type AlertButton,
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
import type { Localidad, Mensaje } from '../../types/modelos';
import { colores, estilos } from '../../constants/tema';
import { idSala, REGIONES, TEMAS, tituloSala } from '../../lib/salas';
import { citaDe } from '../../lib/respuestas';
import ReportarMensaje from '../../components/ReportarMensaje';

export default function Chat() {
  const { usuario } = useAuth();
  const [region, setRegion] = useState<Localidad>(REGIONES[0]);
  const [tema, setTema] = useState(TEMAS[0]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');
  const [respondiendo, setRespondiendo] = useState<Mensaje | null>(null);
  const [reportando, setReportando] = useState<Mensaje | null>(null);
  const sala = idSala(region, tema);

  // Se ordena en la app para no requerir un índice compuesto en Firestore
  useEffect(
    () => escuchar<Mensaje>('mensajes', (m) => setMensajes(m.sort((a, b) => b.fecha - a.fecha)), where('sala', '==', sala)),
    [sala],
  );

  // Al cambiar de sala se descarta la respuesta en curso: la cita pertenece a la sala anterior
  function cambiarRegion(r: Localidad) {
    setRegion(r);
    setRespondiendo(null);
  }

  function cambiarTema(t: string) {
    setTema(t);
    setRespondiendo(null);
  }

  // RF-22 y RF-25: no se puede reportar un mensaje propio
  function mostrarOpciones(m: Mensaje) {
    const botones: AlertButton[] = [{ text: 'Responder', onPress: () => setRespondiendo(m) }];
    if (m.autorId !== usuario?.uid) botones.push({ text: 'Reportar', onPress: () => setReportando(m) });
    botones.push({ text: 'Cancelar', style: 'cancel' });
    Alert.alert(m.autorNombre, m.texto, botones);
  }

  async function enviar() {
    const limpio = texto.trim();
    if (!limpio || !usuario) return;
    setTexto('');
    setRespondiendo(null);
    await crear('mensajes', {
      texto: limpio,
      sala,
      region,
      tema,
      autorId: usuario.uid,
      autorNombre: usuario.displayName ?? 'Docente',
      fecha: Date.now(),
      // Firestore no acepta campos undefined: respuestaA solo se agrega si se está respondiendo
      ...(respondiendo && { respuestaA: citaDe(respondiendo) }),
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={styles.salas}>
        <Text style={styles.etiqueta}>Región</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fila}>
          {REGIONES.map((r) => (
            <Pressable key={r} onPress={() => cambiarRegion(r)} style={[estilos.chip, region === r && estilos.chipActivo]}>
              <Text style={region === r ? estilos.textoChipActivo : estilos.textoChip}>{r}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.etiqueta}>Tema</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fila}>
          {TEMAS.map((t) => (
            <Pressable key={t} onPress={() => cambiarTema(t)} style={[estilos.chip, tema === t && estilos.chipActivo]}>
              <Text style={tema === t ? estilos.textoChipActivo : estilos.textoChip}>{t}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={[estilos.subtitulo, styles.tituloSala]}>{tituloSala(region, tema)}</Text>
        <Text style={styles.ayuda}>Mantén presionado un mensaje para responder o reportar.</Text>
      </View>

      <FlatList
        inverted
        data={mensajes}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const propio = item.autorId === usuario?.uid;
          return (
            <Pressable
              onLongPress={() => mostrarOpciones(item)}
              accessibilityHint="Mantén presionado para responder o reportar"
              style={[styles.burbuja, propio ? styles.propia : styles.ajena]}
            >
              {!propio && <Text style={styles.autor}>{item.autorNombre}</Text>}
              {item.respuestaA && (
                <View style={[styles.cita, propio && styles.citaPropia]}>
                  <Text style={[styles.autor, propio && styles.textoPropio]}>{item.respuestaA.autorNombre}</Text>
                  <Text style={propio ? styles.textoPropio : styles.textoCita} numberOfLines={2}>
                    {item.respuestaA.texto}
                  </Text>
                </View>
              )}
              <Text style={propio ? { color: '#fff' } : undefined}>{item.texto}</Text>
            </Pressable>
          );
        }}
      />

      {respondiendo && (
        <View style={styles.respondiendo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.autor}>Respondiendo a {respondiendo.autorNombre}</Text>
            <Text style={styles.textoCita} numberOfLines={1}>
              {respondiendo.texto}
            </Text>
          </View>
          <Pressable onPress={() => setRespondiendo(null)} hitSlop={12} accessibilityLabel="Cancelar respuesta">
            <Text style={styles.cerrar}>✕</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.barra}>
        <TextInput
          style={[estilos.input, { flex: 1, marginBottom: 0 }]}
          placeholder={respondiendo ? 'Escribe tu respuesta' : 'Escribe tu duda o recomendación'}
          value={texto}
          onChangeText={setTexto}
        />
        <Pressable style={[estilos.boton, styles.enviar]} onPress={enviar}>
          <Text style={estilos.textoBoton}>Enviar</Text>
        </Pressable>
      </View>

      <ReportarMensaje mensaje={reportando} onCerrar={() => setReportando(null)} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  salas: { padding: 12, borderBottomWidth: 1, borderColor: colores.borde },
  fila: { flexGrow: 0, marginBottom: 8 },
  etiqueta: { fontWeight: '600', color: colores.textoSuave, marginBottom: 4 },
  tituloSala: { marginBottom: 0 },
  ayuda: { color: colores.textoSuave, fontSize: 12, marginTop: 2 },
  burbuja: { maxWidth: '80%', padding: 10, borderRadius: 12, marginVertical: 4 },
  propia: { alignSelf: 'flex-end', backgroundColor: colores.primario },
  ajena: { alignSelf: 'flex-start', backgroundColor: '#EEEEEE' },
  autor: { fontWeight: '600', marginBottom: 2, color: colores.textoSuave },
  cita: { borderLeftWidth: 3, borderLeftColor: colores.primario, paddingLeft: 8, marginBottom: 6 },
  citaPropia: { borderLeftColor: '#FFFFFF' },
  textoCita: { color: colores.textoSuave },
  textoPropio: { color: '#FFFFFF', opacity: 0.85 },
  respondiendo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderLeftWidth: 3,
    borderColor: colores.borde,
    borderLeftColor: colores.primario,
  },
  cerrar: { fontSize: 18, color: colores.textoSuave, paddingHorizontal: 4 },
  barra: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: colores.borde, alignItems: 'center' },
  enviar: { marginTop: 0, marginLeft: 8 },
});
