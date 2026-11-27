// RF-24: notificaciones de mensajes nuevos. Envuelve expo-notifications y la API de push de Expo.
//
//   Plan A (development build): token push en avisos/{uid}.pushToken; quien envía un mensaje
//          manda el aviso a https://exp.host/--/api/v2/push/send. Llega aunque la app esté cerrada.
//   Plan B (Expo Go): en Android, Expo Go no tiene push remoto desde el SDK 53. La app escucha los
//          mensajes nuevos y muestra una notificación local. Solo funciona mientras la app sigue viva.
//
// El modo se elige solo en src/components/Notificaciones.tsx: si hay token → A, si no → B.
import { AppState, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { actualizarOCrear, arrayUnion, consultar, where } from './db';
import type { Mensaje, RegistroAvisos } from '../types/modelos';
import { type Aviso, avisoDe, CANAL, destinatarios, salaDeNotificacion } from '../lib/notificaciones';
import { idSala } from '../lib/salas';

const API_PUSH_EXPO = 'https://exp.host/--/api/v2/push/send';

// Sala abierta en el chat (la marca chat.tsx); de esa sala no se avisa
let salaVisible: string | null = null;

export function marcarSalaVisible(sala: string | null) {
  salaVisible = sala;
}

/** Sala que el usuario está viendo en este momento; null si la app no está en primer plano. */
export function salaEnPantalla(): string | null {
  return AppState.currentState === 'active' ? salaVisible : null;
}

/** Con la app en primer plano se muestra el aviso, salvo que sea de la sala abierta. */
export function configurarPresentacion() {
  Notifications.setNotificationHandler({
    handleNotification: async (n) => {
      const sala = salaDeNotificacion(n.request.content.data);
      const mostrar = !sala || idSala(sala.region, sala.tema) !== salaEnPantalla();
      return { shouldShowBanner: mostrar, shouldShowList: mostrar, shouldPlaySound: mostrar, shouldSetBadge: false };
    },
  });
}

/** Crea el canal de Android (antes de pedir permiso, Android 13+) y pide permiso. true si se puede avisar. */
export async function pedirPermiso(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: 'Mensajes del chat',
      importance: AndroidImportance.HIGH,
    });
  }
  if ((await Notifications.getPermissionsAsync()).granted) return true;
  return (await Notifications.requestPermissionsAsync()).granted;
}

/**
 * Plan A: token push de Expo. Devuelve null (→ Plan B) si no hay projectId de EAS en app.json
 * o si Expo no da token (Expo Go en Android lanza un error, igual que un emulador sin servicios).
 */
export async function obtenerTokenPush(): Promise<string | null> {
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return null;
  try {
    return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (e) {
    console.warn('[Notificaciones] Sin push remoto, se usa el Plan B (local):', (e as Error).message);
    return null;
  }
}

/** Plan A: envía el aviso a la API de Expo (máximo 100 por petición; en el piloto no se llega). */
async function enviarPush(tokens: string[], aviso: Aviso) {
  if (tokens.length === 0) return;
  const respuesta = await fetch(API_PUSH_EXPO, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(tokens.map((to) => ({ to, sound: 'default', channelId: CANAL, ...aviso }))),
  });
  if (!respuesta.ok) console.warn('[Notificaciones] La API de Expo respondió', respuesta.status);
}

/**
 * Después de guardar un mensaje: suma la sala a las salas de quien escribe y avisa por push
 * a los demás participantes. Si algo falla solo se registra: el mensaje ya quedó guardado.
 */
export async function avisarParticipantes(m: Pick<Mensaje, 'sala' | 'region' | 'tema' | 'autorNombre' | 'texto'>, uid: string) {
  try {
    await actualizarOCrear('avisos', uid, { salas: arrayUnion(m.sala) });
  } catch (e) {
    console.warn('[Notificaciones] No se pudo registrar la sala del usuario:', (e as Error).message);
  }
  try {
    const participantes = await consultar<RegistroAvisos>('avisos', where('salas', 'array-contains', m.sala));
    await enviarPush(destinatarios(participantes, uid), avisoDe(m));
  } catch (e) {
    console.warn('[Notificaciones] No se pudo enviar el push:', (e as Error).message);
  }
}

/** Plan B: notificación local inmediata en el canal de mensajes. */
export function notificarLocal(aviso: Aviso) {
  return Notifications.scheduleNotificationAsync({
    content: { ...aviso, sound: 'default' },
    trigger: Platform.OS === 'android' ? { channelId: CANAL } : null,
  });
}
