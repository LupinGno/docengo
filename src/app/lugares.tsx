// RF-26 a RF-29: lugares destacados. Responsable: Alexis.
// Guía: copia el patrón de app/(tabs)/servicios.tsx (escuchar + FlatList + chips de filtro)
// y agrega un formulario que use crear('lugares', {...}).
import { Stack } from 'expo-router';
import EnConstruccion from '../components/EnConstruccion';

export default function Lugares() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Lugares destacados' }} />
      <EnConstruccion titulo="Lugares destacados" responsable="Alexis" requisitos="RF-26 a RF-29" />
    </>
  );
}
