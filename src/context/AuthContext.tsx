// Comparte el usuario con sesión iniciada con toda la app.
// En cualquier pantalla: const { usuario } = useAuth();
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../services/firebase';

type ContextoAuth = {
  usuario: User | null;
  cargando: boolean;
};

const AuthContext = createContext<ContextoAuth>({ usuario: null, cargando: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const dejarDeEscuchar = onAuthStateChanged(auth, (u) => {
      setUsuario(u);
      setCargando(false);
    });
    return dejarDeEscuchar;
  }, []);

  return <AuthContext.Provider value={{ usuario, cargando }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
