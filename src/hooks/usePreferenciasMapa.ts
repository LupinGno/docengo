// Guarda y lee las preferencias del mapa del usuario (en usuarios/{uid}.preferencias).
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
  console.log('PREFS', usuario?.email, JSON.stringify(guardadas), JSON.stringify(local));

  function cambiar(cambios: Partial<PreferenciasMapa>) {
    // En pantalla solo se guarda lo que cambió, para no tapar lo guardado en el perfil.
    setLocal((antes) => ({ ...antes, ...cambios }));
    // Sin sesión, o si el perfil todavía no llega, no se guarda en Firestore:
    // se borrarían las preferencias guardadas con las de por defecto.
    if (!usuario || !perfil) return;
    actualizar('usuarios', usuario.uid, { preferencias: { ...prefs, ...cambios } }).catch((e) =>
      console.warn('[preferencias del mapa]', e.message),
    );
  }

  return { prefs, cambiar, cargadas: perfil !== null };
}
