// Layout raíz: envuelve la app con la sesión y redirige según si hay usuario.
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Notificaciones from '../components/Notificaciones';

function Guardia() {
  const { usuario, cargando } = useAuth();
  const segmentos = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (cargando) return;
    const enPantallasDeAcceso = segmentos[0] === '(auth)';
    if (!usuario && !enPantallasDeAcceso) router.replace('/login');
    else if (usuario && enPantallasDeAcceso) router.replace('/');
  }, [usuario, cargando, segmentos, router]);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Guardia />
      {/* RF-24: avisos de mensajes nuevos (Alexis) */}
      <Notificaciones />
    </AuthProvider>
  );
}
