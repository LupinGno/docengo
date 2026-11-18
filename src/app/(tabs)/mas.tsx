// Menú con los módulos que no caben en la barra inferior.
// Cada opción depende de su feature flag (src/constants/flags.ts).
import { Pressable, Text, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { cerrarSesion } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { FLAGS, type Flag } from '../../constants/flags';
import { opcionesVisibles } from '../../lib/flags';
import { colores, estilos } from '../../constants/tema';

const OPCIONES: { titulo: string; ruta: Href; flag?: Flag }[] = [
  { titulo: 'Lugares destacados', ruta: '/lugares', flag: 'lugares' },
  { titulo: 'Hospedaje', ruta: '/hospedaje', flag: 'hospedaje' },
  { titulo: 'Transporte', ruta: '/transporte', flag: 'transporte' },
  { titulo: 'Mi perfil', ruta: '/perfil', flag: 'perfil' },
];

export default function Mas() {
  const { usuario } = useAuth();

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.subtitulo}>Hola, {usuario?.displayName ?? 'docente'}</Text>

      {opcionesVisibles(OPCIONES, FLAGS).map((o) => (
        <Pressable key={o.titulo} style={estilos.tarjeta} onPress={() => router.push(o.ruta)}>
          <Text style={{ fontSize: 16 }}>{o.titulo}</Text>
        </Pressable>
      ))}

      <Pressable onPress={cerrarSesion}>
        <Text style={[estilos.enlace, { color: colores.error }]}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}
