// T-06 / RF-34: tarjeta de una alerta con su estado y los botones Confirmo / Desmiento.
// Responsable: Carlos. La lógica está en src/lib/votos.ts (con pruebas).
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { eliminar, escuchar, guardar } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { NOMBRE_TIPO } from '../lib/alertas';
import {
  contarVotos,
  estadoAlerta,
  NOMBRE_ESTADO,
  puedeVotar,
  siguienteVoto,
  type EstadoAlerta,
  type TipoVoto,
  type Voto,
} from '../lib/votos';
import type { Alerta } from '../types/modelos';
import { colores, colorNivel, estilos } from '../constants/tema';

const COLOR_ESTADO: Record<EstadoAlerta, string> = {
  sin_verificar: colores.textoSuave,
  en_duda: '#EF6C00',
  confirmada: '#2E7D32',
};

function BotonVoto(props: { texto: string; activo: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={props.onPress}
      style={[estilos.chip, props.activo && estilos.chipActivo, { flex: 1, alignItems: 'center' }]}
    >
      <Text style={props.activo ? estilos.textoChipActivo : estilos.textoChip}>{props.texto}</Text>
    </Pressable>
  );
}

export default function TarjetaAlerta({ alerta }: { alerta: Alerta }) {
  const { usuario } = useAuth();
  const uid = usuario?.uid ?? null;
  const [votos, setVotos] = useState<Voto[]>([]);
  const [error, setError] = useState('');

  // Votos de esta alerta en tiempo real
  useEffect(() => escuchar<Voto>(`alertas/${alerta.id}/votos`, setVotos), [alerta.id]);

  const conteo = contarVotos(votos);
  const estado = estadoAlerta(conteo);
  const miVoto = votos.find((v) => v.id === uid)?.voto ?? null;
  const rutaVotos = `alertas/${alerta.id}/votos`;

  async function votar(elegido: TipoVoto) {
    if (!uid) return;
    setError('');
    const nuevo = siguienteVoto(miVoto, elegido);
    try {
      if (nuevo) await guardar(rutaVotos, uid, { voto: nuevo, fecha: Date.now() });
      else await eliminar(rutaVotos, uid);
    } catch {
      setError('No se pudo guardar tu voto. Revisa tu conexión.');
    }
  }

  return (
    <View style={[estilos.tarjeta, { borderLeftWidth: 6, borderLeftColor: colorNivel[alerta.nivel] }]}>
      <Text style={estilos.subtitulo}>
        {NOMBRE_TIPO[alerta.tipo]} · riesgo {alerta.nivel}
      </Text>
      <Text>{alerta.descripcion}</Text>
      <Text style={{ marginTop: 6 }}>
        {alerta.localidad} · {new Date(alerta.fecha).toLocaleDateString('es-MX')}
      </Text>
      <Text style={{ marginTop: 6, fontWeight: '600', color: COLOR_ESTADO[estado] }}>
        {NOMBRE_ESTADO[estado]} · {conteo.confirmaciones} confirman · {conteo.desmentidos} desmienten
      </Text>

      {puedeVotar(alerta.autorId, uid) ? (
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <BotonVoto texto="Confirmo" activo={miVoto === 'confirma'} onPress={() => votar('confirma')} />
          <BotonVoto texto="Desmiento" activo={miVoto === 'desmiente'} onPress={() => votar('desmiente')} />
        </View>
      ) : (
        <Text style={{ marginTop: 8, color: colores.textoSuave }}>Publicaste esta alerta: no puedes votarla.</Text>
      )}

      {error ? <Text style={[estilos.error, { marginTop: 8 }]}>{error}</Text> : null}
    </View>
  );
}
