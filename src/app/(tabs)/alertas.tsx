// RF-30 a RF-34: alertas de inseguridad. Responsable: Carlos.
// Ya lista las alertas. Falta: formulario para registrar (RF-30), confirmar/desmentir (RF-34),
// mostrarlas en el mapa (RF-31) junto con José y notificar cercanía (RF-33).
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { escuchar } from '../../services/db';
import type { Alerta, TipoAlerta } from '../../types/modelos';
import { colorNivel, estilos } from '../../constants/tema';

const NOMBRE_TIPO: Record<TipoAlerta, string> = {
  ambiente_toxico: 'Ambiente tóxico',
  crimen_organizado: 'Crimen organizado',
  baja_seguridad: 'Baja seguridad',
};

export default function Alertas() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  useEffect(() => escuchar<Alerta>('alertas', (a) => setAlertas(a.sort((x, y) => y.fecha - x.fecha))), []);

  return (
    <View style={estilos.contenedor}>
      <Text style={{ marginBottom: 12 }}>
        Reportes de la comunidad docente. No sustituyen las alertas oficiales.
      </Text>
      <FlatList
        data={alertas}
        keyExtractor={(a) => a.id}
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
