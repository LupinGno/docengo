import { StyleSheet } from 'react-native';
import type { CategoriaPunto, NivelRiesgo } from '../types/modelos';

export const colores = {
  primario: '#1F4E79',
  fondo: '#FFFFFF',
  texto: '#1A1A1A',
  textoSuave: '#666666',
  borde: '#DDDDDD',
  error: '#C62828',
};

// color de cada categoría de punto de interés, riesgo o referencia
export const colorCategoria: Record<CategoriaPunto, string> = {
  interes: '#1565C0',
  riesgo: '#C62828',
  referencia: '#2E7D32',
};

export const etiquetaCategoria: Record<CategoriaPunto, string> = {
  interes: 'Interés',
  riesgo: 'Riesgo',
  referencia: 'Referencia',
};

// color por nivel de riesgo
export const colorNivel: Record<NivelRiesgo, string> = {
  alto: '#C62828',
  medio: '#EF6C00',
  bajo: '#F9A825',
};

// Región piloto
export const REGION_PILOTO = {
  latitude: 20.17,
  longitude: -101.16,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

// Caja que cubre Yuriria
export const REGION_LIMITES = { latMin: 19.95, latMax: 20.4, lonMin: -101.4, lonMax: -100.95 };

export const estilos = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, backgroundColor: colores.fondo },
  centrado: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colores.fondo },
  titulo: { fontSize: 26, fontWeight: 'bold', color: colores.primario, marginBottom: 24 },
  subtitulo: { fontSize: 18, fontWeight: '600', color: colores.texto, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  boton: {
    backgroundColor: colores.primario,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  botonDeshabilitado: { opacity: 0.5 },
  textoBoton: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  enlace: { color: colores.primario, textAlign: 'center', marginTop: 16 },
  error: { color: colores.error, marginBottom: 12 },
  tarjeta: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colores.borde,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  chipActivo: { backgroundColor: colores.primario, borderColor: colores.primario },
  textoChip: { color: colores.texto },
  textoChipActivo: { color: '#FFFFFF' },
});
