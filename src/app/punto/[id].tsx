// Ficha de un punto del mapa con todos sus datos. Responsable: José.
// Muestra nombre, categoría, descripción y contacto (solo si existe).
// Solo quien lo creó o un admin ven el botón "Editar punto".
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { escucharUno } from '../../services/db';
import { contactoComoEnlace } from '../../lib/contacto';
import { puedeEditar } from '../../lib/permisos';
import { useAuth } from '../../context/AuthContext';
import type { Punto } from '../../types/modelos';
import { colorCategoria, estilos, etiquetaCategoria } from '../../constants/tema';

export default function FichaPunto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { actor } = useAuth();
  // undefined = cargando · null = no existe · Punto = listo
  const [punto, setPunto] = useState<Punto | null | undefined>(undefined);

  useEffect(() => escucharUno<Punto>('puntos', id, setPunto), [id]);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Detalle del punto' }} />
      <Contenido
        punto={punto}
        editable={!!punto && puedeEditar(punto.autorId, actor)}
        onEditar={() => router.push(`/punto/editar/${id}`)}
      />
    </>
  );
}

type PropsContenido = { punto: Punto | null | undefined; editable: boolean; onEditar: () => void };

function Contenido({ punto, editable, onEditar }: PropsContenido) {
  if (punto === undefined) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (punto === null) {
    return (
      <View style={estilos.centrado}>
        <Text style={estilos.subtitulo}>Este punto ya no está disponible.</Text>
      </View>
    );
  }

  const enlace = contactoComoEnlace(punto.contacto);
  const color = colorCategoria[punto.categoria];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={[estilos.titulo, { marginBottom: 8 }]}>{punto.nombre}</Text>

      <View style={[estilos.chip, { alignSelf: 'flex-start', backgroundColor: color, borderColor: color }]}>
        <Text style={estilos.textoChipActivo}>{etiquetaCategoria[punto.categoria]}</Text>
      </View>

      <Text style={[estilos.subtitulo, { marginTop: 20 }]}>Descripción</Text>
      <Text>{punto.descripcion || 'Sin descripción.'}</Text>

      {punto.contacto ? (
        <>
          <Text style={[estilos.subtitulo, { marginTop: 20 }]}>Contacto</Text>
          <Text>{punto.contacto}</Text>
        </>
      ) : null}

      {enlace ? (
        <Pressable style={[estilos.boton, { marginTop: 16 }]} onPress={() => Linking.openURL(enlace)}>
          <Text style={estilos.textoBoton}>{enlace.startsWith('tel:') ? 'Llamar' : 'Escribir correo'}</Text>
        </Pressable>
      ) : null}

      {editable ? (
        <Pressable onPress={onEditar}>
          <Text style={estilos.enlace}>Editar punto</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}
