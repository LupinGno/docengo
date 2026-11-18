// RF-35 a RF-38: hospedaje. Responsable: Carlos.
// Guía: lista con escuchar<Hospedaje>('hospedajes', ...), filtros por localidad/tipo/precio,
// y botón de contacto con Linking.openURL(`tel:${contacto}`) o `https://wa.me/52${contacto}`.
import { Stack } from 'expo-router';
import EnConstruccion from '../components/EnConstruccion';

export default function Hospedaje() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Hospedaje' }} />
      <EnConstruccion titulo="Hospedaje" responsable="Carlos" requisitos="RF-35 a RF-38" />
    </>
  );
}
