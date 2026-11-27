// Modelos de datos de DocenGo (SRS, sección 6.1).
// Cada tipo corresponde a una colección de Firestore con el mismo nombre en plural.

export type Coordenada = {
  latitud: number;
  longitud: number;
};

export type Localidad = 'Yuriria' | 'Uriangato' | 'Moroleón';

// RF-01, RF-04, RF-43. Colección: "usuarios" (el id del documento es el uid)
export type Rol = 'docente' | 'admin';

export type Perfil = {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  institucion?: string;
  preferencias?: Record<string, unknown>; // se define mejor en T-05
};

/** Lo mínimo para decidir permisos: quién es y qué rol tiene. */
export type Actor = { uid: string; rol: Rol };

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

// RF-20 a RF-22. Colección: "mensajes"
export type Mensaje = {
  id: string;
  texto: string;
  sala: string;
  autorId: string;
  autorNombre: string;
  fecha: number; // Date.now()
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
  categoria: string;
  localidad: Localidad;
  descripcion: string;
  autorId: string;
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
