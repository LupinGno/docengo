// Leyenda con los colores de cada nivel de riesgo.
import { StyleSheet, Text, View } from 'react-native';
import { colorNivel } from '../../constants/tema';
import type { NivelRiesgo } from '../../types/modelos';

const NIVELES: { nivel: NivelRiesgo; texto: string }[] = [
  { nivel: 'alto', texto: 'Alto' },
  { nivel: 'medio', texto: 'Medio' },
  { nivel: 'bajo', texto: 'Bajo' },
];

export default function Leyenda() {
  return (
    <View style={styles.caja} accessibilityLabel="Leyenda de niveles de riesgo">
      <Text style={styles.titulo}>Riesgo</Text>
      {NIVELES.map(({ nivel, texto }) => (
        <View key={nivel} style={styles.fila}>
          <View style={[styles.punto, { backgroundColor: colorNivel[nivel] }]} />
          <Text>{texto}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  caja: { backgroundColor: '#FFFFFFEE', borderRadius: 8, padding: 8 },
  titulo: { fontWeight: '600', marginBottom: 4 },
  fila: { flexDirection: 'row', alignItems: 'center', marginVertical: 1 },
  punto: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
});
