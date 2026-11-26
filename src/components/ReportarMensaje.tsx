// RF-25: formulario para reportar un mensaje del chat (motivo y detalle opcional).
// Un reporte por persona por mensaje: el id del documento es idReporte(mensaje, uid)
// y firestore.rules rechaza un segundo reporte con el mismo id.
import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { crearConId, existe } from '../services/db';
import { useAuth } from '../context/AuthContext';
import type { Mensaje } from '../types/modelos';
import { colores, estilos } from '../constants/tema';
import { idReporte, MAX_DETALLE, MOTIVOS, validarReporte } from '../lib/reportes';

type Props = {
  mensaje: Mensaje | null; // null = formulario cerrado
  onCerrar: () => void;
};

export default function ReportarMensaje({ mensaje, onCerrar }: Props) {
  const { usuario } = useAuth();
  const [motivo, setMotivo] = useState('');
  const [detalle, setDetalle] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  function cerrar() {
    setMotivo('');
    setDetalle('');
    setError('');
    onCerrar();
  }

  async function enviar() {
    if (!mensaje || !usuario) return;
    const problema = validarReporte(motivo, detalle);
    if (problema) {
      setError(problema);
      return;
    }
    setError('');
    setCargando(true);
    const id = idReporte(mensaje.id, usuario.uid);
    try {
      if (await existe('reportes', id)) {
        cerrar();
        Alert.alert('Ya reportaste este mensaje', 'Solo se guarda un reporte por persona.');
        return;
      }
      await crearConId('reportes', id, {
        tipo: 'mensaje',
        contenidoId: mensaje.id,
        sala: mensaje.sala,
        textoReportado: mensaje.texto,
        autorMensajeId: mensaje.autorId,
        motivo,
        detalle: detalle.trim(),
        autorId: usuario.uid,
        estado: 'pendiente',
        fecha: Date.now(),
      });
      cerrar();
      Alert.alert('Reporte enviado', 'Un administrador lo revisará.');
    } catch {
      // RNF-20: se conservan motivo y detalle para reintentar sin volver a llenar
      setError('No se pudo enviar el reporte. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <Modal visible={mensaje !== null} transparent animationType="slide" onRequestClose={cerrar}>
      <View style={styles.fondo}>
        <View style={styles.hoja}>
          <Text style={estilos.subtitulo}>Reportar mensaje</Text>
          <Text style={styles.cita} numberOfLines={2}>
            {mensaje?.autorNombre}: {mensaje?.texto}
          </Text>

          <Text style={styles.etiqueta}>Motivo</Text>
          <View style={styles.motivos}>
            {MOTIVOS.map((m) => (
              <Pressable
                key={m}
                onPress={() => setMotivo(m)}
                style={[estilos.chip, styles.chip, motivo === m && estilos.chipActivo]}
              >
                <Text style={motivo === m ? estilos.textoChipActivo : estilos.textoChip}>{m}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.etiqueta}>Detalle (opcional)</Text>
          <TextInput
            style={[estilos.input, styles.detalle]}
            placeholder="Cuéntanos qué tiene de inapropiado"
            multiline
            maxLength={MAX_DETALLE}
            value={detalle}
            onChangeText={setDetalle}
          />
          <Text style={styles.contador}>
            {detalle.length}/{MAX_DETALLE}
          </Text>

          {error ? <Text style={estilos.error}>{error}</Text> : null}

          <Pressable
            style={[estilos.boton, cargando && estilos.botonDeshabilitado]}
            onPress={enviar}
            disabled={cargando}
          >
            {cargando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.textoBoton}>Enviar reporte</Text>}
          </Pressable>
          <Pressable onPress={cerrar}>
            <Text style={estilos.enlace}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  hoja: { backgroundColor: colores.fondo, padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  cita: { color: colores.textoSuave, marginBottom: 12 },
  etiqueta: { fontWeight: '600', color: colores.textoSuave, marginBottom: 4 },
  motivos: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  chip: { marginBottom: 8 },
  detalle: { minHeight: 80, textAlignVertical: 'top', marginBottom: 4 },
  contador: { alignSelf: 'flex-end', color: colores.textoSuave, marginBottom: 12 },
});
