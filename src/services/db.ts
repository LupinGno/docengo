// Funciones genéricas para leer y escribir en Firestore.
// Úsalas en todos los módulos para no repetir código.
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
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
 * Escucha UN documento en tiempo real. Si no existe, entrega null.
 *   useEffect(() => escucharUno<Punto>('puntos', id, setPunto), [id]);
 */
export function escucharUno<T>(nombre: string, id: string, alCambiar: (dato: T | null) => void) {
  return onSnapshot(
    doc(db, nombre, id),
    (d) => alCambiar(d.exists() ? ({ id: d.id, ...d.data() } as unknown as T) : null),
    (error) => console.warn(`[Firestore:${nombre}/${id}]`, error.message),
  );
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

export function actualizar(nombre: string, id: string, cambios: object) {
  return updateDoc(doc(db, nombre, id), cambios as DocumentData);
}

export function eliminar(nombre: string, id: string) {
  return deleteDoc(doc(db, nombre, id));
}

// Reexportados para no importar de dos lugares
export { where, orderBy, limit } from 'firebase/firestore';
