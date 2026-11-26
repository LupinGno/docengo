// T-06 / RF-34: confirmar y desmentir alertas. Responsable: Carlos.
// Lógica pura: no depende de React ni de Firebase, por eso es fácil de probar.
//
// Cada voto vive en alertas/{alertaId}/votos/{uid}: el id del documento es el uid
// del docente, así cada persona tiene como máximo un voto por alerta y cambiar
// de opinión reemplaza su voto en lugar de duplicarlo.

export type TipoVoto = 'confirma' | 'desmiente';

export type Voto = {
  id: string; // uid de quien votó
  voto: TipoVoto;
  fecha: number;
};

export type EstadoAlerta = 'sin_verificar' | 'en_duda' | 'confirmada';

export const NOMBRE_ESTADO: Record<EstadoAlerta, string> = {
  sin_verificar: 'Sin verificar',
  en_duda: 'En duda',
  confirmada: 'Confirmada',
};

export type Conteo = { confirmaciones: number; desmentidos: number };

/**
 * Cuenta confirmaciones y desmentidos.
 * Caja blanca: 2 decisiones (for, if) → V(G) = 3.
 */
export function contarVotos(votos: Voto[]): Conteo {
  let confirmaciones = 0;
  let desmentidos = 0;
  for (const v of votos) {
    if (v.voto === 'confirma') confirmaciones++;
    else desmentidos++;
  }
  return { confirmaciones, desmentidos };
}

/**
 * Estado de la alerta según sus votos.
 * - Nadie ha votado → sin verificar.
 * - Más confirmaciones que desmentidos → confirmada.
 * - Empate o más desmentidos → en duda.
 * Caja blanca: 2 decisiones → V(G) = 3.
 */
export function estadoAlerta({ confirmaciones, desmentidos }: Conteo): EstadoAlerta {
  if (confirmaciones + desmentidos === 0) return 'sin_verificar';
  if (confirmaciones > desmentidos) return 'confirmada';
  return 'en_duda';
}

/**
 * El autor no vota su propia alerta y sin sesión no se vota.
 * Caja blanca: 1 decisión compuesta (&&) → V(G) = 2; condiciones múltiples = 3 casos.
 */
export function puedeVotar(autorId: string, uid: string | null): boolean {
  return uid !== null && uid !== autorId;
}

/**
 * Qué pasa al tocar un botón:
 * - Tocar el mismo voto que ya tenías lo quita (null).
 * - Tocar el otro lo cambia.
 * Caja blanca: 1 decisión → V(G) = 2.
 */
export function siguienteVoto(actual: TipoVoto | null, elegido: TipoVoto): TipoVoto | null {
  return actual === elegido ? null : elegido;
}
