// RF-28: dar o cambiar mi valoración de un lugar (estrellas y comentario opcional).
// Se guarda en lugares/{lugarId}/valoraciones/{uid}: valorar otra vez reemplaza la anterior.
// No se muestra al autor del lugar; firestore.rules tampoco le permite valorarlo.
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { crearConId } from '../services/db';
import { useAuth } from '../context/AuthContext';
import type { Valoracion } from '../types/modelos';
import { colores, estilos } from '../constants/tema';
import { MAX_COMENTARIO, validarEstrellas } from '../lib/valoraciones';

type Props = {
  lugarId: string;
  actual?: Valoracion; // mi valoración anterior, si existe
};

const SIN_VALORACION = { estrellas: 0, comentario: '' };

/** Cinco estrellas tocables; se iluminan de la 1 a la elegida. */
function Estrellas({ valor, onElegir }: { valor: number; onElegir: (n: number) => void }) {
  return (
    <View style={styles.estrellas}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onElegir(n)} hitSlop={6} accessibilityLabel={`${n} de 5 estrellas`}>
          <Text style={[styles.estrella, n <= valor && styles.estrellaActiva]}>★</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function ValorarLugar({ lugarId, actual }: Props) {
  const { usuario } = useAuth();
  const inicial = actual ?? SIN_VALORACION;
  const [estrellas, setEstrellas] = useState(inicial.estrellas);
  const [comentario, setComentario] = useState(inicial.comentario);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(false);

  async function guardar() {
    if (!usuario) return;
    const problema = validarEstrellas(estrellas);
    if (problema) {
      setError(problema);
      return;
    }
    setError('');
    setAviso('');
    setCargando(true);
    try {
      await crearConId(`lugares/${lugarId}/valoraciones`, usuario.uid, {
        estrellas,
        comentario: comentario.trim(),
        autorId: usuario.uid,
        autorNombre: usuario.displayName ?? 'Docente',
        fecha: Date.now(),
      });
      setAviso('Valoración guardada.');
    } catch {
      // RNF-20: se conservan estrellas y comentario para reintentar
      setError('No se pudo guardar tu valoración. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.subtitulo}>{actual ? 'Tu valoración' : 'Valora este lugar'}</Text>
      <Estrellas valor={estrellas} onElegir={setEstrellas} />
      <TextInput
        style={[estilos.input, styles.comentario]}
        placeholder="Comentario (opcional)"
        multiline
        maxLength={MAX_COMENTARIO}
        value={comentario}
        onChangeText={setComentario}
      />
      <Text style={styles.contador}>
        {comentario.length}/{MAX_COMENTARIO}
      </Text>

      {error ? <Text style={estilos.error}>{error}</Text> : null}
      {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}

      <Pressable style={[estilos.boton, cargando && estilos.botonDeshabilitado]} onPress={guardar} disabled={cargando}>
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.textoBoton}>{actual ? 'Actualizar valoración' : 'Guardar valoración'}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  estrellas: { flexDirection: 'row', marginBottom: 8 },
  estrella: { fontSize: 32, color: colores.borde, marginRight: 6 },
  estrellaActiva: { color: colores.primario },
  comentario: { minHeight: 60, textAlignVertical: 'top', marginBottom: 4 },
  contador: { alignSelf: 'flex-end', color: colores.textoSuave, marginBottom: 12 },
  aviso: { color: colores.primario, marginBottom: 12 },
});
