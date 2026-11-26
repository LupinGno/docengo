// RF-24: notificaciones de mensajes nuevos del chat.
// Lógica pura: no depende de React, Expo ni Firebase, por eso es fácil de probar.
// Se avisa solo a los participantes de la sala (usuarios con la sala en `salas`), nunca a quien envía.
import type { Localidad, Mensaje, Usuario } from '../types/modelos';
import { REGIONES, TEMAS, tituloSala } from './salas';

export const MAX_CUERPO = 100;
export const CANAL = 'mensajes'; // canal de Android

/** Contenido de una notificación; `data` permite abrir la sala al tocarla. */
export type Aviso = {
  title: string;
  body: string;
  data: { region: string; tema: string };
};

/** Formato de los tokens de Expo: "ExponentPushToken[…]" o "ExpoPushToken[…]". */
export function tokenValido(token: unknown): token is string {
  return typeof token === 'string' && /^Expo(nent)?PushToken\[.+\]$/.test(token);
}

/** Tokens a los que se envía el push: sin quien envía, sin tokens inválidos y sin repetidos. */
export function destinatarios(usuarios: Pick<Usuario, 'id' | 'pushToken'>[], remitenteUid: string): string[] {
  const tokens = new Set<string>();
  for (const u of usuarios) {
    if (u.id !== remitenteUid && tokenValido(u.pushToken)) tokens.add(u.pushToken);
  }
  return [...tokens];
}

/** Título "Moroleón · Escuela" y cuerpo "Autor: texto", recortado a MAX_CUERPO caracteres. */
export function avisoDe(m: Pick<Mensaje, 'region' | 'tema' | 'autorNombre' | 'texto'>): Aviso {
  let body = `${m.autorNombre}: ${m.texto.trim()}`;
  if (body.length > MAX_CUERPO) body = `${body.slice(0, MAX_CUERPO).trimEnd()}…`;
  return { title: tituloSala(m.region, m.tema), body, data: { region: m.region, tema: m.tema } };
}

/**
 * Sala que se abre al tocar una notificación (o desde los parámetros del chat).
 * Devuelve null si los datos no corresponden a una sala real.
 */
export function salaDeNotificacion(data: unknown): { region: Localidad; tema: string } | null {
  if (typeof data !== 'object' || data === null) return null;
  const { region, tema } = data as Record<string, unknown>;
  if (!REGIONES.includes(region as Localidad) || !TEMAS.includes(tema as string)) return null;
  return { region: region as Localidad, tema: tema as string };
}

/**
 * Plan B: si este dispositivo debe mostrar un aviso local de un mensaje nuevo.
 * No se avisa de mensajes propios, de la sala que se está viendo ni de salas ajenas.
 */
export function debeAvisar(
  m: Pick<Mensaje, 'autorId' | 'sala'>,
  uid: string,
  salaVisible: string | null,
  misSalas: string[],
): boolean {
  if (m.autorId === uid) return false;
  if (m.sala === salaVisible) return false;
  return misSalas.includes(m.sala);
}
