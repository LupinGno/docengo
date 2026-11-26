// RF-29: editar un lugar destacado, solo si eres su autor. Responsable: Alexis.
// firestore.rules también lo exige y no permite cambiar autorId.
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { actualizar, escucharDoc } from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import type { Lugar } from '../../../types/modelos';
import { estilos } from '../../../constants/tema';
import { puedeEditar } from '../../../lib/valoraciones';
import FormularioLugar, { type DatosLugar } from '../../../components/FormularioLugar';

export default function EditarLugar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario } = useAuth();
  const [lugar, setLugar] = useState<Lugar | null | undefined>(undefined); // undefined = cargando

  useEffect(() => escucharDoc<Lugar>('lugares', id, setLugar), [id]);

  async function guardar(datos: DatosLugar) {
    await actualizar('lugares', id, datos);
    router.back();
  }

  let contenido;
  if (lugar === undefined) {
    contenido = <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  } else if (!lugar || !puedeEditar(lugar.autorId, usuario?.uid)) {
    contenido = (
      <View style={estilos.centrado}>
        <Text style={estilos.subtitulo}>Solo el autor puede editar este lugar.</Text>
      </View>
    );
  } else {
    contenido = (
      <FormularioLugar
        inicial={{ ...lugar, ubicacion: { latitud: lugar.latitud, longitud: lugar.longitud } }}
        textoBoton="Guardar cambios"
        onGuardar={guardar}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Editar lugar' }} />
      {contenido}
    </>
  );
}
