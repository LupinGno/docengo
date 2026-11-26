// T-29: carga los lugares destacados reales de la región piloto (RF-26).
// Responsable: Alexis. Datos: scripts/datos/lugares-piloto.json. Ver docs/datos-piloto.md.
//
// Uso:
//   npm run cargar:lugares -- --simular   muestra lo que se cargaría, sin iniciar sesión ni escribir
//   npm run cargar:lugares                carga solo los lugares con "verificado": true
//   npm run cargar:lugares -- --todos     carga también los que faltan por verificar
//
// Inicia sesión con la cuenta docente "Equipo DocenGo" (no con una llave de administrador),
// así que firestore.rules valida cada lugar igual que si se publicara desde la app.
// Las llaves y la cuenta se leen de .env.local (ver .env.example), que no se sube a GitHub.
// Cada lugar tiene un id fijo: correr el script otra vez actualiza en lugar de duplicar.
import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';

const CAMPOS = ['nombre', 'categoria', 'localidad', 'descripcion', 'latitud', 'longitud'];
const VARIABLES = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
  'CARGA_CORREO',
  'CARGA_CONTRASENA',
];

const opciones = new Set(process.argv.slice(2));
const simular = opciones.has('--simular');
const todos = opciones.has('--todos');

const datos = JSON.parse(readFileSync(new URL('./datos/lugares-piloto.json', import.meta.url), 'utf8'));
const elegidos = datos.lugares.filter((l) => todos || l.verificado);
const pendientes = datos.lugares.length - datos.lugares.filter((l) => l.verificado).length;

/** Solo los campos del modelo Lugar; "fuente" y "verificado" se quedan en el JSON. */
function soloCampos(lugar) {
  return Object.fromEntries(CAMPOS.map((c) => [c, lugar[c]]));
}

/** Cuenta los elementos por una propiedad: { Yuriria: 4, ... }. */
function contarPor(lista, propiedad) {
  const conteo = {};
  for (const x of lista) conteo[x[propiedad]] = (conteo[x[propiedad]] ?? 0) + 1;
  return conteo;
}

function terminar(mensaje, codigo) {
  console.log(mensaje);
  process.exit(codigo);
}

console.log(`Lugares en el archivo: ${datos.lugares.length} · sin verificar: ${pendientes}`);
console.log(`Se cargarían: ${elegidos.length}${todos ? ' (incluye los no verificados)' : ' (solo verificados)'}`);
console.table(elegidos.map((l) => ({ id: l.id, localidad: l.localidad, categoria: l.categoria })));

if (simular) terminar('Simulación: no se escribió nada.', 0);
if (elegidos.length === 0) {
  terminar('No hay lugares verificados. Verifícalos en el JSON o usa --todos (ver docs/datos-piloto.md).', 1);
}

const faltantes = VARIABLES.filter((v) => !process.env[v]);
if (faltantes.length > 0) terminar(`Faltan en .env.local: ${faltantes.join(', ')}`, 1);

const app = initializeApp({
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
});
const auth = getAuth(app);
const db = getFirestore(app);

const { user } = await signInWithEmailAndPassword(auth, process.env.CARGA_CORREO, process.env.CARGA_CONTRASENA);
const autorNombre = user.displayName ?? 'Equipo DocenGo';
console.log(`Sesión iniciada como "${autorNombre}".`);

let errores = 0;
for (const lugar of elegidos) {
  try {
    await setDoc(doc(db, 'lugares', lugar.id), {
      ...soloCampos(lugar),
      autorId: user.uid,
      autorNombre,
      fecha: Date.now(),
    });
    console.log(`  ✓ ${lugar.id}`);
  } catch (e) {
    // Por ejemplo, permiso denegado si el id ya existe con otro autor o si falla lugarValido()
    errores++;
    console.log(`  ✗ ${lugar.id}: ${e.message}`);
  }
}

// Confirmación: se cuenta lo que hay en Firestore, no lo que se intentó escribir
const enFirestore = (await getDocs(collection(db, 'lugares'))).docs.map((d) => d.data());
console.log(`\nLugares en Firestore: ${enFirestore.length} (mínimo del SRS: 5)`);
console.log('Por localidad:', contarPor(enFirestore, 'localidad'));
console.log('Por categoría:', contarPor(enFirestore, 'categoria'));

await signOut(auth);
terminar(errores === 0 ? 'Carga terminada sin errores.' : `Carga terminada con ${errores} error(es).`, errores ? 1 : 0);
