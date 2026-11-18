// RF-01, RF-02, RF-04, RF-09: perfil y cuenta. Responsable: Carlos.
// Guía: leer y editar el documento usuarios/{uid} con actualizar('usuarios', uid, {...}).
import { Stack } from 'expo-router';
import EnConstruccion from '../components/EnConstruccion';

export default function Perfil() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Mi perfil' }} />
      <EnConstruccion titulo="Mi perfil" responsable="Carlos" requisitos="RF-01, RF-02, RF-04, RF-09" />
    </>
  );
}
