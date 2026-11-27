// Sesion de toda la app: usuario, perfil y rol
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

  // Perfil en tiempo real
  useEffect(() => {
    if (!usuario) return;
    return escucharUno<Perfil>('usuarios', usuario.uid, setPerfil);
  }, [usuario]);

  // Solo se usa el perfil si es del usuario actual 
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
