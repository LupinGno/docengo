// RF-24: registra las notificaciones de mensajes nuevos y abre la sala al tocar una.
// No dibuja nada; se monta una vez en src/app/_layout.tsx dentro de AuthProvider.
// Elige el modo solo: con token push → Plan A (push remoto); sin token (Expo Go) → Plan B (local).
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { actualizarOCrear, escuchar, escucharDoc, where } from '../services/db';
import {
  configurarPresentacion,
  notificarLocal,
  obtenerTokenPush,
  pedirPermiso,
  salaEnPantalla,
} from '../services/notificaciones';
import { useAuth } from '../context/AuthContext';
import type { Mensaje, RegistroAvisos } from '../types/modelos';
import { avisoDe, debeAvisar, salaDeNotificacion } from '../lib/notificaciones';

type Modo = 'push' | 'local';

/** Abre el chat en la sala de la notificación; `t` hace que se abra aunque los parámetros se repitan. */
function abrirSala(data: unknown) {
  const sala = salaDeNotificacion(data);
  if (sala) router.push({ pathname: '/chat', params: { ...sala, t: String(Date.now()) } });
}

export default function Notificaciones() {
  const { usuario } = useAuth();
  const uid = usuario?.uid;
  // El modo se guarda junto con el uid: al cerrar sesión o cambiar de cuenta deja de valer
  const [registro, setRegistro] = useState<{ uid: string; modo: Modo } | null>(null);
  const modo = registro && registro.uid === uid ? registro.modo : null;
  const misSalas = useRef<string[]>([]);
  const avisados = useRef(new Set<string>());
  const ultimaAbierta = useRef<string | null>(null);
  const respuesta = Notifications.useLastNotificationResponse();

  useEffect(configurarPresentacion, []);

  // Tocar una notificación (con la app abierta, en segundo plano o cerrada) abre su sala.
  // Se espera a la sesión para que la navegación ya exista.
  useEffect(() => {
    if (!uid || !respuesta) return;
    const id = respuesta.notification.request.identifier;
    if (ultimaAbierta.current === id) return;
    ultimaAbierta.current = id;
    abrirSala(respuesta.notification.request.content.data);
  }, [uid, respuesta]);

  // Permiso y modo. En Plan A se guarda el token para que los demás puedan avisarle.
  useEffect(() => {
    if (!uid) return;
    let vigente = true;
    (async () => {
      if (!(await pedirPermiso())) return; // sin permiso no hay avisos; el chat funciona igual
      const token = await obtenerTokenPush();
      if (token) {
        await actualizarOCrear('avisos', uid, { pushToken: token }).catch((e: Error) =>
          console.warn('[Notificaciones] No se pudo guardar el token:', e.message),
        );
      }
      if (vigente) setRegistro({ uid, modo: token ? 'push' : 'local' });
    })();
    return () => {
      vigente = false;
    };
  }, [uid]);

  // Salas donde he escrito (avisos/{uid}.salas): de ellas recibo avisos
  useEffect(() => {
    if (!uid) return;
    return escucharDoc<RegistroAvisos>('avisos', uid, (u) => {
      misSalas.current = u?.salas ?? [];
    });
  }, [uid]);

  // Plan B: escuchar los mensajes que lleguen desde ahora y avisar con una notificación local
  useEffect(() => {
    if (modo !== 'local' || !uid) return;
    const inicio = Date.now();
    return escuchar<Mensaje>(
      'mensajes',
      (mensajes) => {
        for (const m of mensajes) {
          if (avisados.current.has(m.id)) continue;
          avisados.current.add(m.id);
          if (debeAvisar(m, uid, salaEnPantalla(), misSalas.current)) notificarLocal(avisoDe(m));
        }
      },
      where('fecha', '>', inicio),
    );
  }, [modo, uid]);

  return null;
}
