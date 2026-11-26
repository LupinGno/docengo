// RF-30 a RF-34: alertas de inseguridad. Responsable: Carlos.
// Hecho: lista de alertas y formulario para registrar (RF-30).
// Falta: confirmar/desmentir (RF-34), mostrarlas en el mapa (RF-31) junto con José
// y notificar cercanía (RF-33).
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { escuchar } from '../../services/db';
import type { Alerta } from '../../types/modelos';
import { NOMBRE_TIPO } from '../../lib/alertas';
import FormularioAlerta from '../../components/FormularioAlerta';
import { colorNivel, estilos } from '../../constants/tema';

export default function Alertas() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  useEffect(() => escuchar<Alerta>('alertas', (a) => setAlertas(a.sort((x, y) => y.fecha - x.fecha))), []);

  return (
    <View style={estilos.contenedor}>
      <FlatList
        data={alertas}
        keyExtractor={(a) => a.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <Text style={{ marginBottom: 12 }}>
              Reportes de la comunidad docente. No sustituyen a las autoridades.
            </Text>
            <Pressable style={[estilos.boton, { marginBottom: 12 }]} onPress={() => setFormularioAbierto((a) => !a)}>
              <Text style={estilos.textoBoton}>{formularioAbierto ? 'Cancelar' : 'Registrar alerta'}</Text>
            </Pressable>
            {formularioAbierto && <FormularioAlerta alTerminar={() => setFormularioAbierto(false)} />}
          </>
        }
        ListEmptyComponent={<Text>No hay alertas registradas.</Text>}
        renderItem={({ item }) => (
          <View style={[estilos.tarjeta, { borderLeftWidth: 6, borderLeftColor: colorNivel[item.nivel] }]}>
            <Text style={estilos.subtitulo}>
              {NOMBRE_TIPO[item.tipo]} · riesgo {item.nivel}
            </Text>
            <Text>{item.descripcion}</Text>
            <Text style={{ marginTop: 6 }}>
              {item.localidad} · {item.confirmaciones} confirman · {item.desmentidos} desmienten
            </Text>
          </View>
        )}
      />
    </View>
  );
}
