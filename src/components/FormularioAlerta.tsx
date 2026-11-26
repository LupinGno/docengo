// T-03 / RF-30: formulario para registrar una alerta de inseguridad. Responsable: Carlos.
// La validación y el armado del documento están en src/lib/alertas.ts (con pruebas).
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import * as Location from 'expo-location';
import { crear } from '../services/db';
import { useAuth } from '../context/AuthContext';
import {
  armarAlerta,
  borradorVacio,
  CENTRO_LOCALIDAD,
  LOCALIDADES,
  MAX_DESCRIPCION,
  NOMBRE_NIVEL,
  NOMBRE_TIPO,
  validarAlerta,
  type BorradorAlerta,
  type DatosAlerta,
} from '../lib/alertas';
import type { Coordenada, Localidad, NivelRiesgo, TipoAlerta } from '../types/modelos';
import { colorNivel, estilos } from '../constants/tema';

type Props = {
  alTerminar: () => void;
};

const TIPOS = Object.keys(NOMBRE_TIPO) as TipoAlerta[];
const NIVELES = Object.keys(NOMBRE_NIVEL) as NivelRiesgo[];

/** Usa la ubicación del celular si hay permiso; si no, el centro de la localidad. */
async function obtenerCoordenada(localidad: Localidad): Promise<Coordenada> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return CENTRO_LOCALIDAD[localidad];
    const pos = await Location.getCurrentPositionAsync({});
    return { latitud: pos.coords.latitude, longitud: pos.coords.longitude };
  } catch {
    return CENTRO_LOCALIDAD[localidad];
  }
}

/** Fila de opciones tipo "chip". Se usa para tipo, nivel y localidad. */
function Opciones<T extends string>(props: {
  titulo: string;
  opciones: T[];
  etiqueta: (o: T) => string;
  elegida: T | null;
  alElegir: (o: T) => void;
  color?: (o: T) => string;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={estilos.subtitulo}>{props.titulo}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {props.opciones.map((o) => {
          const activa = props.elegida === o;
          const fondo = props.color?.(o);
          return (
            <Pressable
              key={o}
              onPress={() => props.alElegir(o)}
              style={[
                estilos.chip,
                activa && estilos.chipActivo,
                activa && fondo ? { backgroundColor: fondo, borderColor: fondo } : null,
              ]}
            >
              <Text style={activa ? estilos.textoChipActivo : estilos.textoChip}>{props.etiqueta(o)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function FormularioAlerta({ alTerminar }: Props) {
  const { usuario } = useAuth();
  const [borrador, setBorrador] = useState<BorradorAlerta>(borradorVacio);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cambiar = (cambios: Partial<BorradorAlerta>) => setBorrador((b) => ({ ...b, ...cambios }));

  async function guardar() {
    const problema = validarAlerta(borrador);
    if (problema) {
      setError(problema);
      return;
    }
    if (!usuario) {
      setError('Tu sesión expiró. Vuelve a iniciar sesión.');
      return;
    }
    // validarAlerta ya revisó que no hay campos vacíos
    const datos = borrador as DatosAlerta;
    setGuardando(true);
    setError('');
    try {
      const coordenada = await obtenerCoordenada(datos.localidad);
      await crear('alertas', armarAlerta(datos, coordenada, usuario.uid, Date.now()));
      setBorrador(borradorVacio);
      alTerminar();
    } catch {
      setError('No se pudo guardar la alerta. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <View style={[estilos.tarjeta, { marginBottom: 16 }]}>
      <Text style={[estilos.error, { fontWeight: '600' }]}>
        Este reporte no sustituye a las autoridades. En una emergencia llama al 911.
      </Text>
      <Opciones
        titulo="Tipo de alerta"
        opciones={TIPOS}
        etiqueta={(t) => NOMBRE_TIPO[t]}
        elegida={borrador.tipo}
        alElegir={(tipo) => cambiar({ tipo })}
      />
      <Opciones
        titulo="Nivel de riesgo"
        opciones={NIVELES}
        etiqueta={(n) => NOMBRE_NIVEL[n]}
        elegida={borrador.nivel}
        alElegir={(nivel) => cambiar({ nivel })}
        color={(n) => colorNivel[n]}
      />
      <Opciones
        titulo="Localidad"
        opciones={LOCALIDADES}
        etiqueta={(l) => l}
        elegida={borrador.localidad}
        alElegir={(localidad) => cambiar({ localidad })}
      />

      <Text style={estilos.subtitulo}>¿Qué pasó?</Text>
      <TextInput
        style={[estilos.input, { minHeight: 80, textAlignVertical: 'top' }]}
        placeholder="Describe la situación sin dar datos personales de nadie."
        multiline
        maxLength={MAX_DESCRIPCION}
        value={borrador.descripcion}
        onChangeText={(descripcion) => cambiar({ descripcion })}
      />
      <Text style={{ textAlign: 'right', marginTop: -8, marginBottom: 8 }}>
        {borrador.descripcion.length}/{MAX_DESCRIPCION}
      </Text>

      <Text style={{ marginBottom: 12 }}>
        Ubicación: se usa la de tu celular. Si no das permiso, se usa el centro de la localidad.
      </Text>

      {error ? <Text style={estilos.error}>{error}</Text> : null}

      <Pressable
        style={[estilos.boton, guardando && estilos.botonDeshabilitado]}
        onPress={guardar}
        disabled={guardando}
      >
        {guardando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.textoBoton}>Publicar alerta</Text>}
      </Pressable>
    </View>
  );
}
