// Funciones genéricas para leer y escribir en Firestore.
// Úsalas en todos los módulos para no repetir código.
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Escucha una colección en tiempo real. Devuelve la función para dejar de escuchar,
 * así que se puede usar directo en useEffect:
 *   useEffect(() => escuchar<Punto>('puntos', setPuntos), []);
 */
export function escuchar<T>(
  nombre: string,
  alCambiar: (datos: T[]) => void,
  ...restricciones: QueryConstraint[]
) {
  const q = query(collection(db, nombre), ...restricciones);
  return onSnapshot(
    q,
    (snap) => alCambiar(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as T)),
    (error) => console.warn(`[Firestore:${nombre}]`, error.message),
  );
}

/**
 * Escucha un solo documento en tiempo real. Llama a alCambiar(null) si no existe o si se borró.
 *   useEffect(() => escucharDoc<Lugar>('lugares', id, setLugar), [id]);
 */
export function escucharDoc<T>(nombre: string, id: string, alCambiar: (dato: T | null) => void) {
  return onSnapshot(
    doc(db, nombre, id),
    (snap) => alCambiar(snap.exists() ? ({ id: snap.id, ...snap.data() } as unknown as T) : null),
    (error) => console.warn(`[Firestore:${nombre}/${id}]`, error.message),
  );
}

/** Lee una sola vez los documentos que cumplen las restricciones (sin escuchar cambios). */
export async function consultar<T>(nombre: string, ...restricciones: QueryConstraint[]): Promise<T[]> {
  const snap = await getDocs(query(collection(db, nombre), ...restricciones));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as T);
}

/** Crea un documento y devuelve su id. No incluyas el campo `id` en `datos`. */
export async function crear(nombre: string, datos: object): Promise<string> {
  const ref = await addDoc(collection(db, nombre), datos as DocumentData);
  return ref.id;
}

/** Crea o reemplaza un documento con un id que tú eliges (por ejemplo, el uid del docente). */
export function guardar(nombre: string, id: string, datos: object) {
  return setDoc(doc(db, nombre, id), datos as DocumentData);
}

/**
 * Crea un documento con un id elegido por la app (ej. un reporte por persona por mensaje).
 * Si el documento ya existe, Firestore lo trata como actualización y aplica la regla de update.
 */
export function crearConId(nombre: string, id: string, datos: object) {
  return setDoc(doc(db, nombre, id), datos as DocumentData);
}

/** true si el documento existe. */
export async function existe(nombre: string, id: string): Promise<boolean> {
  return (await getDoc(doc(db, nombre, id))).exists();
}

export function actualizar(nombre: string, id: string, cambios: object) {
  return updateDoc(doc(db, nombre, id), cambios as DocumentData);
}

export function eliminar(nombre: string, id: string) {
  return deleteDoc(doc(db, nombre, id));
}

// Reexportados para no importar de dos lugares
export { where, orderBy, limit, arrayUnion } from 'firebase/firestore';
