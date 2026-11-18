// Traduce los códigos de error de Firebase a mensajes claros en español (RNF de usabilidad).

const MENSAJES: Record<string, string> = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'El correo no tiene un formato válido.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/weak-password': 'La contraseña es demasiado débil.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e intenta de nuevo.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet e intenta de nuevo.',
};

export function mensajeDeError(codigo?: string): string {
  return (codigo && MENSAJES[codigo]) || 'Ocurrió un error. Intenta de nuevo.';
}
