// Pantalla temporal para módulos que aún no se programan.
import { View, Text } from 'react-native';
import { estilos } from '../constants/tema';

type Props = {
  titulo: string;
  responsable: string;
  requisitos: string;
};

export default function EnConstruccion({ titulo, responsable, requisitos }: Props) {
  return (
    <View style={estilos.centrado}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.subtitulo}>Módulo en construcción</Text>
      <Text>Responsable: {responsable}</Text>
      <Text>Requisitos: {requisitos}</Text>
    </View>
  );
}
