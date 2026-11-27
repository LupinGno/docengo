// Modelos de datos de DocenGo

export type Coordenada = {
  latitud: number;
  longitud: number;
};

export type Localidad = 'Yuriria' | 'Uriangato' | 'Moroleón';

// Colección: "usuarios" 
export type Usuario = {
  id: string;
  nombre: string;
  correo: string;
  rol: 'docente' | 'admin';
  institucion: string;
  creado: number;
};

//Colección: "avisos" (id = uid). Separada de "usuarios" para no exponer el correo 
export type RegistroAvisos = {
  id: string;
  salas?: string[]; // idSala donde ha escrito
  pushToken?: string; // token de Expo 
};

// Colección: "usuarios" 
export type Rol = 'docente' | 'admin';

export type Perfil = {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  institucion?: string;
  preferencias?: Record<string, unknown>;
};

/** Lo mínimo para decidir permisos: quién es y qué rol tiene. */
export type Actor = { uid: string; rol: Rol };

//tres categorías de puntos en el mapa. Colección: "puntos"
export type CategoriaPunto = 'interes' | 'riesgo' | 'referencia';

export type Punto = Coordenada & {
  id: string;
  nombre: string;
  categoria: CategoriaPunto;
  descripcion?: string;
  contacto?: string;
  autorId: string;
};

//Colección: "servicios"
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

// copia breve del mensaje al que se responde, ver src/lib/respuestas.ts
export type Cita = {
  id: string;
  autorNombre: string;
  texto: string;
};

// Colección: "mensajes"
export type Mensaje = {
  id: string;
  texto: string;
  sala: string; // idSala(region, tema)
  region: Localidad;
  tema: string;
  autorId: string;
  autorNombre: string;
  fecha: number; // Date.now()
  respuestaA?: Cita; 
};

//  Colección: "reportes"
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
  resueltoPor?: string; // uid del administrador 
};

// "alertas"
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

//  "hospedajes"
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

// Colección: "lugares"
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

//  Subcolección: "lugares/{lugarId}/valoraciones".
export type Valoracion = {
  id: string; // = autorId
  estrellas: number; // entero del 1 al 5
  comentario: string; // opcional
  autorId: string;
  autorNombre: string;
  fecha: number;
};

//  Colección: "paradas"
export type Parada = Coordenada & {
  id: string;
  nombre: string;
  localidad: Localidad;
  rutas: string[];
  horarios: string[]; // ej. ["07:00", "07:30"]
  autorId: string;
};
