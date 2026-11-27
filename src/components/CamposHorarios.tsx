// Campos de horarios y duración, compartidos por "registrar parada" y "actualizar horarios" (RF-42).
import { Text, TextInput } from 'react-native';
import { estilos } from '../constants/tema';

type Props = {
  horarios: string;
  duracion: string;
  onHorarios: (t: string) => void;
  onDuracion: (t: string) => void;
};

export default function CamposHorarios({ horarios, duracion, onHorarios, onDuracion }: Props) {
  return (
    <>
      <Text style={estilos.subtitulo}>Horarios de paso</Text>
      <TextInput
        style={estilos.input}
        placeholder="Ej. 06:30, 07:00, 7:30"
        value={horarios}
        onChangeText={onHorarios}
      />
      <Text style={{ marginTop: -8, marginBottom: 12, color: '#666' }}>Separados por comas, en formato de 24 horas.</Text>

      <Text style={estilos.subtitulo}>Minutos hasta el destino (opcional)</Text>
      <TextInput
        style={estilos.input}
        placeholder="Ej. 25"
        keyboardType="number-pad"
        value={duracion}
        onChangeText={onDuracion}
      />
    </>
  );
}
