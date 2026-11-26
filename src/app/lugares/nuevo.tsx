// RF-26: publicar un lugar destacado. Responsable: Alexis.
// El formulario está en src/components/FormularioLugar.tsx (lo comparte con "Editar").
import { router, Stack } from 'expo-router';
import { crear } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import FormularioLugar, { type DatosLugar } from '../../components/FormularioLugar';

export default function NuevoLugar() {
  const { usuario } = useAuth();

  async function publicar(datos: DatosLugar) {
    if (!usuario) return;
    await crear('lugares', {
      ...datos,
      autorId: usuario.uid,
      autorNombre: usuario.displayName ?? 'Docente',
      fecha: Date.now(),
    });
    router.back();
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Publicar lugar' }} />
      <FormularioLugar textoBoton="Publicar" onGuardar={publicar} />
    </>
  );
}
