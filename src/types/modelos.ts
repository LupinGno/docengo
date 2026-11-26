// Modelos de datos de DocenGo (SRS, sección 6.1).
// Cada tipo corresponde a una colección de Firestore con el mismo nombre en plural.

export type Coordenada = {
  latitud: number;
  longitud: number;
};

export type Localidad = 'Yuriria' | 'Uriangato' | 'Moroleón';

// RF-01 y RF-24. Colección: "usuarios" (id = uid). Se crea en src/services/auth.ts.
export type Usuario = {
  id: string;
  nombre: string;
  correo: string;
  rol: 'docente' | 'admin';
  institucion: string;
  creado: number;
  pushToken?: string; // token de Expo (Plan A de RF-24); no existe en Expo Go
  salas?: string[]; // idSala donde ha escrito: recibe avisos de esas salas (RF-24)
};

// RF-11: tres categorías de puntos en el mapa. Colección: "puntos"
export type CategoriaPunto = 'interes' | 'riesgo' | 'referencia';

export type Punto = Coordenada & {
  id: string;
  nombre: string;
  categoria: CategoriaPunto;
  descripcion?: string;
  contacto?: string;
  autorId: string;
};

// RF-16 a RF-19. Colección: "servicios"
export type TipoServicio = 'farmacia' | 'papeleria' | 'supermercado' | 'parada';

export type Servicio = Coordenada & {
  id: string;
  nombre: string;
  tipo: TipoServicio;
  direccion?: string;
  horario?: string;
  telefono?: string;
  autorId: string;
};

// RF-22: copia breve del mensaje al que se responde, ver src/lib/respuestas.ts
export type Cita = {
  id: string;
  autorNombre: string;
  texto: string;
};

// RF-20 a RF-22. Colección: "mensajes"
export type Mensaje = {
  id: string;
  texto: string;
  sala: string; // idSala(region, tema), ver src/lib/salas.ts (RF-21)
  region: Localidad;
  tema: string;
  autorId: string;
  autorNombre: string;
  fecha: number; // Date.now()
  respuestaA?: Cita; // solo si el mensaje responde a otro (RF-22)
};

// RF-25 (SRS 6.1, ReporteContenido). Colección: "reportes"
// Id del documento = idReporte(contenidoId, autorId): un reporte por persona por mensaje.
export type EstadoReporte = 'pendiente' | 'resuelto';

export type Reporte = {
  id: string;
  tipo: 'mensaje';
  contenidoId: string; // id del mensaje reportado
  sala: string;
  textoReportado: string; // copia del mensaje por si su autor lo borra
  autorMensajeId: string;
  motivo: string; // uno de MOTIVOS, ver src/lib/reportes.ts
  detalle: string;
  autorId: string; // quien reporta
  estado: EstadoReporte;
  fecha: number;
  resueltoPor?: string; // uid del administrador (RF-45)
};

// RF-30 a RF-34. Colección: "alertas"
export type TipoAlerta = 'ambiente_toxico' | 'crimen_organizado' | 'baja_seguridad';
export type NivelRiesgo = 'alto' | 'medio' | 'bajo';

export type Alerta = Coordenada & {
  id: string;
  tipo: TipoAlerta;
  nivel: NivelRiesgo;
  descripcion: string;
  localidad: Localidad;
  confirmaciones: number;
  desmentidos: number;
  autorId: string;
  fecha: number;
};

// RF-35 a RF-38. Colección: "hospedajes"
export type Hospedaje = Coordenada & {
  id: string;
  titulo: string;
  tipo: 'cuarto' | 'casa';
  localidad: Localidad;
  precio: number; // precio de referencia mensual en MXN
  descripcion: string;
  contacto: string; // teléfono o WhatsApp
  autorId: string;
};

// RF-26 a RF-29. Colección: "lugares"
export type Lugar = Coordenada & {
  id: string;
  nombre: string;
  categoria: string; // una de CATEGORIAS_LUGAR, ver src/lib/lugares.ts
  localidad: Localidad;
  descripcion: string;
  autorId: string;
  autorNombre: string;
  fecha: number; // Date.now()
};

// RF-28. Subcolección: "lugares/{lugarId}/valoraciones"
// Id del documento = uid de quien valora: una valoración por persona por lugar.
export type Valoracion = {
  id: string; // = autorId
  estrellas: number; // entero del 1 al 5
  comentario: string; // opcional: puede ir vacío
  autorId: string;
  autorNombre: string;
  fecha: number;
};

// RF-39 a RF-42. Colección: "paradas"
export type Parada = Coordenada & {
  id: string;
  nombre: string;
  localidad: Localidad;
  rutas: string[];
  horarios: string[]; // ej. ["07:00", "07:30"]
  autorId: string;
};
