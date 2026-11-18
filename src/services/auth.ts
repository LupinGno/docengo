// Registro, inicio y cierre de sesión (RF-05, RF-06, RF-08).
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export async function registrar(nombre: string, correo: string, contrasena: string) {
  const cred = await createUserWithEmailAndPassword(auth, correo.trim(), contrasena);
  await updateProfile(cred.user, { displayName: nombre.trim() });
  // Perfil del docente (RF-01). El rol "admin" solo se asigna a mano en la consola.
  await setDoc(doc(db, 'usuarios', cred.user.uid), {
    nombre: nombre.trim(),
    correo: correo.trim(),
    rol: 'docente',
    institucion: '',
    creado: Date.now(),
  });
  return cred.user;
}

export function iniciarSesion(correo: string, contrasena: string) {
  return signInWithEmailAndPassword(auth, correo.trim(), contrasena);
}

// RF-07
export function restablecerContrasena(correo: string) {
  return sendPasswordResetEmail(auth, correo.trim());
}

export function cerrarSesion() {
  return signOut(auth);
}
