// Comparte la sesión con toda la app.
// En cualquier pantalla: const { usuario, perfil, actor } = useAuth();
//   usuario → cuenta de Firebase Auth (uid, correo, nombre)
//   perfil  → documento usuarios/{uid} (rol, institución, preferencias)
//   actor   → { uid, rol } listo para puedeEditar(...)
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { escucharUno } from '../services/db';
import type { Actor, Perfil } from '../types/modelos';

type ContextoAuth = {
  usuario: User | null;
  perfil: Perfil | null;
  actor: Actor | null;
  cargando: boolean;
};

const AuthContext = createContext<ContextoAuth>({
  usuario: null,
  perfil: null,
  actor: null,
  cargando: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const dejarDeEscuchar = onAuthStateChanged(auth, (u) => {
      setUsuario(u);
      setCargando(false);
    });
    return dejarDeEscuchar;
  }, []);

  // Perfil en tiempo real: si un admin cambia tu rol, la app se entera sola
  useEffect(() => {
    if (!usuario) return;
    return escucharUno<Perfil>('usuarios', usuario.uid, setPerfil);
  }, [usuario]);

  // Solo se usa el perfil si es del usuario actual (al cerrar sesión deja de valer)
  const perfilActual = usuario && perfil?.id === usuario.uid ? perfil : null;

  // Mientras carga el perfil, se asume el rol más bajo
  const actor: Actor | null = usuario ? { uid: usuario.uid, rol: perfilActual?.rol ?? 'docente' } : null;

  return (
    <AuthContext.Provider value={{ usuario, perfil: perfilActual, actor, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
