// Feature flags (trunk-based development).
// Un módulo sin terminar se puede subir a main si queda escondido detrás de su flag.
//
//   __DEV__  → visible al programar con Expo Go, oculto en el APK del piloto.
//   true     → módulo terminado y probado: visible para todos.
//
// Cuando un módulo lleve una semana en true sin problemas, borren su flag.

export const FLAGS = {
  lugares: __DEV__,
  hospedaje: __DEV__,
  transporte: __DEV__,
  perfil: __DEV__,
};

export type Flag = keyof typeof FLAGS;
