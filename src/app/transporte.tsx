// RF-39 a RF-42: paradas, horarios y alerta de medio alternativo. Responsable: José.
// Guía: escuchar<Parada>('paradas', ...); si una localidad no tiene paradas,
// mostrar la alerta "Sin transporte público: solo acceso caminando u otro medio terrestre" (RF-40).
import { Stack } from 'expo-router';
import EnConstruccion from '../components/EnConstruccion';

export default function Transporte() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Transporte' }} />
      <EnConstruccion titulo="Transporte" responsable="José" requisitos="RF-39 a RF-42" />
    </>
  );
}
