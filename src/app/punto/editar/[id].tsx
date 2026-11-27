// RF-13: editar o eliminar un punto propio (o cualquiera, si eres admin). Responsable: José.
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import FormularioPunto, { type DatosPunto } from '../../../components/FormularioPunto';
import { actualizar, eliminar, escucharUno } from '../../../services/db';
import { puedeEditar } from '../../../lib/permisos';
import { useAuth } from '../../../context/AuthContext';
import type { Punto } from '../../../types/modelos';
import { colores, estilos } from '../../../constants/tema';

export default function EditarPunto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { actor } = useAuth();
  const [punto, setPunto] = useState<Punto | null | undefined>(undefined);

  useEffect(() => escucharUno<Punto>('puntos', id, setPunto), [id]);

  async function guardar(datos: DatosPunto) {
    // Las coordenadas no se cambian al editar; solo los datos del formulario
    const { latitud: _lat, longitud: _lon, ...cambios } = datos;
    await actualizar('puntos', id, cambios);
    router.back();
  }

  function confirmarEliminar() {
    Alert.alert('Eliminar punto', '¿Seguro? Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await eliminar('puntos', id);
          router.replace('/');
        },
      },
    ]);
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Editar punto' }} />
      {punto === undefined && (
        <View style={estilos.centrado}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {punto === null && (
        <View style={estilos.centrado}>
          <Text style={estilos.subtitulo}>Este punto ya no está disponible.</Text>
        </View>
      )}
      {punto && !puedeEditar(punto.autorId, actor) && (
        <View style={estilos.centrado}>
          <Text style={estilos.subtitulo}>Solo el autor o un administrador puede editar este punto.</Text>
        </View>
      )}
      {punto && puedeEditar(punto.autorId, actor) && (
        <View style={{ flex: 1 }}>
          <FormularioPunto
            key={punto.id}
            coordenada={{ latitud: punto.latitud, longitud: punto.longitud }}
            inicial={{
              nombre: punto.nombre,
              categoria: punto.categoria,
              descripcion: punto.descripcion ?? '',
              contacto: punto.contacto ?? '',
            }}
            textoBoton="Guardar cambios"
            onGuardar={guardar}
          />
          <Pressable onPress={confirmarEliminar} style={{ padding: 20 }}>
            <Text style={[estilos.enlace, { color: colores.error, marginTop: 0 }]}>Eliminar punto</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}
