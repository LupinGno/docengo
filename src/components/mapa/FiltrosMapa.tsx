// Chips de filtros del mapa: capas (RF-11, RF-14, RF-39) y distancia (RF-14).
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { alternar, etiquetaRadio, RADIOS_KM, type CapaMapa } from '../../lib/mapa';
import { colorCategoria, colores, estilos } from '../../constants/tema';
import { COLOR_TRANSPORTE } from '../../lib/transporte';

const CAPAS: { clave: CapaMapa; etiqueta: string; color: string }[] = [
  { clave: 'interes', etiqueta: 'Interés', color: colorCategoria.interes },
  { clave: 'riesgo', etiqueta: 'Riesgo', color: colorCategoria.riesgo },
  { clave: 'referencia', etiqueta: 'Referencia', color: colorCategoria.referencia },
  { clave: 'transporte', etiqueta: 'Transporte', color: COLOR_TRANSPORTE },
];

type Props = {
  categorias: CapaMapa[];
  radioKm: number;
  onCategorias: (c: CapaMapa[]) => void;
  onRadio: (km: number) => void;
};

export default function FiltrosMapa({ categorias, radioKm, onCategorias, onRadio }: Props) {
  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fila}>
        {CAPAS.map(({ clave, etiqueta, color }) => (
          <Chip
            key={clave}
            texto={etiqueta}
            activo={categorias.includes(clave)}
            color={color}
            onPress={() => onCategorias(alternar(categorias, clave))}
          />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fila}>
        {RADIOS_KM.map((km) => (
          <Chip
            key={km}
            texto={etiquetaRadio(km)}
            activo={radioKm === km}
            color={colores.primario}
            onPress={() => onRadio(km)}
          />
        ))}
      </ScrollView>
    </>
  );
}

function Chip(p: { texto: string; activo: boolean; color: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={p.onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: p.activo }}
      style={[estilos.chip, p.activo && { backgroundColor: p.color, borderColor: p.color }]}
    >
      <Text style={p.activo ? estilos.textoChipActivo : estilos.textoChip}>{p.texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: { flexGrow: 0, marginBottom: 6 },
});
