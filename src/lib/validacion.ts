// Validación de formularios (SRS 3.1: campos obligatorios y mensajes comprensibles).

export function correoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

/** Devuelve el mensaje de error o null si todo está bien. */
export function validarRegistro(nombre: string, correo: string, contrasena: string): string | null {
  if (!nombre.trim()) return 'Escribe tu nombre.';
  if (!correoValido(correo)) return 'Escribe un correo válido.';
  if (contrasena.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  return null;
}
