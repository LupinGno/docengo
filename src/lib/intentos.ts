// RF-06: máximo 3 intentos de inicio de sesión.
// Este contador vive en la app (por sesión). Para un bloqueo real del lado del
// servidor se necesitaría una Cloud Function; documentarlo en el SRS si no se hace.

export const MAX_INTENTOS = 3;

export type EstadoIntentos = {
  fallidos: number;
  bloqueada: boolean;
};

export const estadoInicial: EstadoIntentos = { fallidos: 0, bloqueada: false };

export function registrarFallo(estado: EstadoIntentos): EstadoIntentos {
  const fallidos = estado.fallidos + 1;
  return { fallidos, bloqueada: fallidos >= MAX_INTENTOS };
}

export function registrarExito(): EstadoIntentos {
  return { ...estadoInicial };
}

export function intentosRestantes(estado: EstadoIntentos): number {
  return Math.max(0, MAX_INTENTOS - estado.fallidos);
}
