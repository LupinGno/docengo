// Convierte el contacto escrito por la comunidad en un enlace que el celular sabe abrir (RF-12).
// 10 dígitos (con o sin espacios o guiones) → llamada; con @ → correo; otra cosa → no hay botón.

export function contactoComoEnlace(contacto?: string): string | null {
  if (!contacto) return null;
  const digitos = contacto.replace(/\D/g, '');
  if (digitos.length === 10) return `tel:${digitos}`;
  if (contacto.includes('@')) return `mailto:${contacto.trim()}`;
  return null;
}
