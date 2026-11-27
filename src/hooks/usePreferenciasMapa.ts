// Preferencias del mapa guardadas en usuarios/{uid}.preferencias (RF-04).
// Se aplican al instante (estado local) y se guardan en Firestore para la siguiente sesión.
import { useState } from 'react';
import { actualizar } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { preferenciasConDefecto, type PreferenciasMapa } from '../lib/mapa';

export function usePreferenciasMapa() {
  const { usuario, perfil } = useAuth();
  const [local, setLocal] = useState<Partial<PreferenciasMapa>>({});

  const guardadas = perfil?.preferencias as Partial<PreferenciasMapa> | undefined;
  const prefs = preferenciasConDefecto({ ...guardadas, ...local });

  function cambiar(cambios: Partial<PreferenciasMapa>) {
    const nuevas = { ...prefs, ...cambios };
    setLocal(nuevas);
    if (!usuario) return;
    actualizar('usuarios', usuario.uid, { preferencias: nuevas }).catch((e) =>
      console.warn('[preferencias del mapa]', e.message),
    );
  }

  return { prefs, cambiar, cargadas: perfil !== null };
}
