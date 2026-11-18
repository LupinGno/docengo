// Barra inferior de pestañas. Pantalla principal del SRS (3.1).
import type { ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colores } from '../../constants/tema';

type NombreIcono = keyof typeof Ionicons.glyphMap;

const icono = (nombre: NombreIcono) =>
  function Icono({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={nombre} color={color as string} size={size} />;
  };

export default function LayoutPestanas() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colores.primario }}>
      <Tabs.Screen name="index" options={{ title: 'Mapa', tabBarIcon: icono('map') }} />
      <Tabs.Screen name="servicios" options={{ title: 'Servicios', tabBarIcon: icono('storefront') }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarIcon: icono('chatbubbles') }} />
      <Tabs.Screen name="alertas" options={{ title: 'Alertas', tabBarIcon: icono('warning') }} />
      <Tabs.Screen name="mas" options={{ title: 'Más', tabBarIcon: icono('menu') }} />
    </Tabs>
  );
}
