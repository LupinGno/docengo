// Dibuja cada zona de riesgo: un círculo de su color y un marcador con su descripción (RF-31, RF-32).
import { Circle, Marker } from 'react-native-maps';
import { RADIO_ZONA_M, textoZona, type ZonaRiesgo } from '../../lib/zonas';
import { colorNivel } from '../../constants/tema';

type Props = { zonas: ZonaRiesgo[]; onAbrir: (zona: ZonaRiesgo) => void };

export default function CapaRiesgo({ zonas, onAbrir }: Props) {
  return (
    <>
      {zonas.map((z) => {
        const color = colorNivel[z.nivel];
        const centro = { latitude: z.latitud, longitude: z.longitud };
        return [
          <Circle
            key={`c-${z.origen}-${z.id}`}
            center={centro}
            radius={RADIO_ZONA_M}
            fillColor={`${color}40`}
            strokeColor={color}
          />,
          <Marker
            key={`m-${z.origen}-${z.id}`}
            coordinate={centro}
            title={z.titulo}
            description={textoZona(z)}
            pinColor={color}
            onCalloutPress={() => onAbrir(z)}
          />,
        ];
      })}
    </>
  );
}
