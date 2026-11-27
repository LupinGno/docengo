// RF-13: registrar un punto. Se llega manteniendo presionado el mapa. Responsable: José.
import { Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import FormularioPunto, { type DatosPunto } from '../../components/FormularioPunto';
import { crear } from '../../services/db';
import { coordenadaDeParametros } from '../../lib/puntos';
import { useAuth } from '../../context/AuthContext';
import { estilos } from '../../constants/tema';

export default function NuevoPunto() {
  const { lat, lon } = useLocalSearchParams<{ lat: string; lon: string }>();
  const { usuario } = useAuth();
  const coordenada = coordenadaDeParametros(lat, lon);

  async function guardar(datos: DatosPunto) {
    await crear('puntos', { ...datos, autorId: usuario?.uid });
    router.back();
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Nuevo punto' }} />
      {coordenada ? (
        <FormularioPunto coordenada={coordenada} textoBoton="Guardar punto" onGuardar={guardar} />
      ) : (
        <View style={estilos.centrado}>
          <Text style={estilos.subtitulo}>Ubicación no válida. Regresa al mapa y mantén presionado el lugar.</Text>
        </View>
      )}
    </>
  );
}
