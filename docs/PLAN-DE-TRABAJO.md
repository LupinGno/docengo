# Plan de trabajo detallado DocenGo (22 nov – 5 dic 2026)

Para cada tarea: **qué hacer**, **qué lógica va en `src/lib/`**, **qué pruebas hacer** (caja blanca automáticas y manuales con el criterio del SRS) y **qué documentar**.

Equipo: **José** (técnico) · **Carlos** (líder) · **Alexis** (pruebas)

---

## Índice

1. [Correcciones al calendario anterior](#1-correcciones-al-calendario-anterior)
2. [Receta común para cada tarea](#2-receta-común-para-cada-tarea)
3. [Dónde se documenta cada cosa](#3-dónde-se-documenta-cada-cosa)
4. [Calendario resumido](#4-calendario-resumido)
5. [Tareas día por día](#5-tareas-día-por-día)
6. [Anexo A: reglas de Firestore finales](#anexo-a-reglas-de-firestore-finales)
7. [Anexo B: plantilla de la matriz de pruebas](#anexo-b-plantilla-de-la-matriz-de-pruebas)
8. [Anexo C: plantilla de reporte de bug](#anexo-c-plantilla-de-reporte-de-bug)
9. [Anexo D: prefijos de IDs de prueba](#anexo-d-prefijos-de-ids-de-prueba)

---

## 1. Correcciones al calendario anterior

| Qué cambia | Antes | Ahora (según el SRS) |
|---|---|---|
| Transporte jueves 26 | RF-39, 40 | **RF-39** (paradas en el mapa) + **RF-41** (horarios) |
| Transporte viernes 27 | RF-41, 42 | **RF-40** (alerta de medio alternativo) + **RF-42** (la comunidad registra paradas y horarios) |
| Requisitos sin dueño | — | RF-04 y RF-14 → José (lun 23) · RF-22 → Alexis (lun 23) · RF-43 → Carlos (vie 27) · RF-44 → Carlos (sáb 28) |
| Fuera de alcance | — | RF-03 (idioma) y RF-23 (imágenes en el chat) son prioridad **Baja**: no se hacen y se documentan en la sección 11 del SRS |
| Reglas de Firestore | Las del zip | Tienen un hueco de seguridad (T-00). Usar las del [Anexo A](#anexo-a-reglas-de-firestore-finales) |

---

## 2. Receta común para cada tarea

Esto se repite en **todas** las tareas. Cada tarea de la sección 5 solo dice lo que es propio de ella.

### 2.1 Antes de programar

```bash
git switch main
git pull
git switch -c nombre/tarea        # ej. jose/ficha-punto (el nombre de rama viene en cada tarea)
```

- Mover el issue a **En curso** en el tablero de GitHub.
- Si la pantalla no va a quedar terminada hoy, déjenla escondida con su flag en `src/constants/flags.ts` (valor `__DEV__`).

### 2.2 Mientras programan

1. **Primero la lógica, después la pantalla.** Toda decisión (`if`, filtros, validaciones, cálculos) va en una función de `src/lib/` sin React ni Firebase. La pantalla solo la llama.
2. **Primero la prueba, después la función** (cuando se pueda): escriban la tabla de casos de la tarea como `test(...)` y luego la función hasta que pasen.
3. Las pantallas leen y escriben con `src/services/db.ts` (`escuchar`, `escucharUno`, `crear`, `guardar`, `actualizar`, `eliminar`). Nunca importen `firebase/firestore` en una pantalla.
4. Todo documento que se cree lleva `autorId: usuario.uid` (si no, las reglas lo rechazan).
5. Commits pequeños: `git add -A && git commit -m "feat: ... (RF-XX)"`.

### 2.3 Antes de abrir el PR

```bash
git pull --rebase origin main
npm run revisar                                  # tipos + lint (V(G) ≤ 10) + pruebas con umbrales
npx eslint --rule 'complexity: [warn, 0]' src/lib/archivo-nuevo.ts   # V(G) real de cada función nueva
npx expo start                                   # probar en el celular con Expo Go
```

### 2.4 Abrir el PR

```bash
git push -u origin nombre/tarea
gh pr create --fill
```

En la descripción: llenar la plantilla, poner `Cierra #N` (número del issue) y adjuntar la captura de pantalla de la prueba manual.

### 2.5 Definición de "Hecho"

Una tarea está hecha solo si se cumple **todo**:

- [ ] Funciones nuevas de `src/lib/` con **100 %** de ramas cubiertas
- [ ] Una prueba por camino, con su ID (`CB-XXX-n`)
- [ ] Sección nueva en `docs/pruebas-caja-blanca.md` (V(G), grafo o código marcado, tabla de caminos)
- [ ] Prueba manual del criterio del SRS hecha en el celular y anotada en `docs/matriz-pruebas.md`
- [ ] Captura en `docs/evidencias/RF-XX_descripcion.png`
- [ ] Si cambió algún modelo: actualizado `src/types/modelos.ts`
- [ ] Si se tomó una decisión de diseño: anotada en `docs/decisiones.md`
- [ ] PR aprobado por el revisor de la rotación, CI en verde, squash merge
- [ ] Issue en **Hecho**

**Rotación de revisión (de código):** José revisa a Carlos · Carlos revisa a Alexis · Alexis revisa a José.
**Rotación de pruebas cruzadas (de funcionamiento):** José prueba lo de Alexis · Carlos prueba lo de José · Alexis prueba lo de Carlos.

---

## 3. Dónde se documenta cada cosa

| Documento | Qué lleva | Quién lo mantiene | Cuándo |
|---|---|---|---|
| `docs/pruebas-caja-blanca.md` | V(G), caminos y casos de cada función de `src/lib/` | Cada autor, en su PR | En cada tarea |
| `docs/matriz-pruebas.md` | Una fila por RF: criterio del SRS, pruebas, quién probó, resultado, evidencia ([Anexo B](#anexo-b-plantilla-de-la-matriz-de-pruebas)) | Cada autor llena su fila; Alexis la revisa | En cada tarea y en pruebas cruzadas |
| `docs/evidencias/` | Capturas `RF-XX_descripcion.png` | Cada autor | En cada tarea |
| `docs/decisiones.md` | Tabla: fecha · decisión · motivo · RF afectado | Quien toma la decisión | Cuando haya una |
| Issues de GitHub (etiqueta `bug`) | Bugs encontrados ([Anexo C](#anexo-c-plantilla-de-reporte-de-bug)) | Quien lo encuentra | Pruebas cruzadas e integración |
| SRS sección 6.1 | Entidades (colecciones de Firestore y sus campos) | José | 3 dic |
| SRS secciones 9 y 10 | Matriz de trazabilidad y estrategia de verificación | Alexis | 30 nov |
| SRS secciones 11 y 12 | Fuera de alcance; riesgos y asuntos abiertos | Carlos | 2 dic |
| SRS control del documento | Versión 1.0 validada con el piloto | Carlos | 5 dic |
| DDA (puntos 6 a 10) | Actualizar la arquitectura a Expo + Firebase si dice Node.js + MySQL | José | 3 dic |

Crear hoy los archivos vacíos que faltan:

```bash
mkdir -p docs/evidencias
touch docs/evidencias/.gitkeep docs/decisiones.md docs/matriz-pruebas.md
```

`docs/decisiones.md` empieza así:

```markdown
# Registro de decisiones

| Fecha | Decisión | Motivo | RF |
|---|---|---|---|
| 17/11/2026 | Firebase en lugar de Node.js + MySQL | Auth y tiempo real sin servidor propio; plazo de 3 semanas | RF-05, RF-20 |
```

---

## 4. Calendario resumido

| Fecha | José | Carlos | Alexis |
|---|---|---|---|
| Dom 22 | T-00 base compartida · T-01 ficha de punto · T-02 alta de puntos | T-03 registrar alertas · publicar reglas | T-04 chat por región |
| Lun 23 | T-05 filtro por distancia + preferencias · etiqueta `v0.2.0` | T-06 confirmar/desmentir · llave de Google Maps | T-07 reportar + responder dudas + matriz |
| Mar 24 | T-08 ficha de servicio | T-09 hospedaje: lista y filtros | T-10 publicar lugares |
| Mié 25 | T-11 alertas en el mapa | T-12 publicar y contactar hospedaje | T-13 filtrar, valorar, editar lugares |
| Jue 26 | T-14 paradas y horarios | T-15 perfil, cuenta y contraseña | T-16 notificación de mensajes |
| Vie 27 | T-17 medio alternativo + registrar paradas | T-18 moderación y roles | T-19 notificación de alertas cercanas |
| Vie 27 tarde | T-20 pruebas cruzadas (todos) | | |
| Sáb 28 | T-21 corregir bugs · T-23 APK de prueba | T-21 corregir bugs · T-22 carga por lote | T-21 corregir bugs |
| Dom 29 | T-24 cerrar PRs abiertos (todos, día ligero) | | |
| Lun 30 | T-25 congelamiento · T-26 plantillas de datos | T-25 · T-26 consentimientos | T-25 · SRS 9 y 10 |
| Mar 1 | T-27 pruebas de integración (todos) | | |
| Mié 2 | Corregir bugs de T-27 | T-28 seguridad · SRS 11 y 12 | T-28 seguridad |
| Jue 3 | T-29 datos reales · T-30 APK `v1.0.0` · SRS 6.1 y DDA | T-29 datos reales | T-29 datos reales |
| Vie 4 | T-31 ensayo (todos) | | |
| Sáb 5 | T-32 prueba piloto (todos) | | |

---

## 5. Tareas día por día

---

### Domingo 22 de noviembre

---

#### T-00 · Base compartida y corrección de seguridad

**Responsable:** José (código) y Carlos (publicar reglas) · **Rama:** `jose/base-compartida` · **Tiempo:** 1.5 h
**Hazla antes que T-01 y T-02:** todas las tareas de la semana usan estas piezas.

**Qué hacer**

1. **Agregar dos funciones a `src/services/db.ts`:**

   ```ts
   import { doc, onSnapshot, setDoc } from 'firebase/firestore';

   /** Escucha UN documento. Devuelve null si no existe. */
   export function escucharUno<T>(nombre: string, id: string, alCambiar: (dato: T | null) => void) {
     return onSnapshot(
       doc(db, nombre, id),
       (d) => alCambiar(d.exists() ? ({ id: d.id, ...d.data() } as unknown as T) : null),
       (error) => console.warn(`[Firestore:${nombre}/${id}]`, error.message),
     );
   }

   /** Crea o actualiza un documento con un id elegido (ej. un voto por usuario: id = uid). */
   export function guardar(nombre: string, id: string, datos: object) {
     return setDoc(doc(db, nombre, id), datos as DocumentData, { merge: true });
   }
   ```

   `nombre` también acepta subcolecciones: `escuchar('alertas/ID/votos', ...)`, `guardar('alertas/ID/votos', uid, {...})`.

2. **Agregar el perfil al contexto de sesión** (`src/context/AuthContext.tsx`): además de `usuario`, exponer `perfil` (el documento `usuarios/{uid}`) para saber el `rol` y las preferencias.

   ```ts
   // preferencias se tipa mejor en T-05 (PreferenciasMapa)
   type Perfil = { nombre: string; rol: 'docente' | 'admin'; preferencias?: Record<string, unknown> } & Record<string, unknown>;
   // dentro de AuthProvider:
   const [perfil, setPerfil] = useState<Perfil | null>(null);
   useEffect(() => (usuario ? escucharUno<Perfil>('usuarios', usuario.uid, setPerfil) : setPerfil(null)), [usuario]);
   // value={{ usuario, perfil, cargando }}
   ```

3. **Límites de la región piloto** en `src/constants/tema.ts`:

   ```ts
   // Caja generosa que cubre Yuriria, Uriangato, Moroleón y sus comunidades
   export const REGION_LIMITES = { latMin: 19.95, latMax: 20.4, lonMin: -101.4, lonMax: -100.95 };
   ```

4. **Crear `src/lib/permisos.ts`** con `puedeEditar` (la usan puntos, lugares, hospedaje, paradas y moderación).

5. **Reemplazar `firestore.rules`** con el [Anexo A](#anexo-a-reglas-de-firestore-finales). Incluye de una vez las reglas de toda la semana (votos, valoraciones, reportes, paradas), para que nadie más tenga que tocar ese archivo.

6. **Carlos:** después del merge, pegar `firestore.rules` en Firebase Console → Firestore → **Reglas** → **Publicar**.

**El hueco de seguridad que se corrige:** la regla general `match /{coleccion}/{id}` también aplicaba a `usuarios`. Un usuario podía crear su documento con `{ rol: 'admin', autorId: <su uid> }` y la regla general lo aceptaba. Las reglas del Anexo A excluyen `usuarios` y `reportes` de la regla general.

**Lógica en `src/lib/permisos.ts`**

```ts
export function puedeEditar(autorId: string, usuario: { uid: string; rol: string } | null): boolean {
  if (!usuario) return false;
  return usuario.uid === autorId || usuario.rol === 'admin';
}
```

V(G) = 1 + `if` + `||` = **3**

**Pruebas de caja blanca** (`__tests__/lib/permisos.test.ts`)

| ID | Entrada | Esperado |
|---|---|---|
| CB-PRM-1 | usuario `null` | `false` |
| CB-PRM-2 | uid igual al autor, rol docente | `true` |
| CB-PRM-3 | uid distinto, rol admin | `true` |
| CB-PRM-4 | uid distinto, rol docente | `false` |

**Pruebas manuales (seguridad)**

- [ ] En Firebase Console → Firestore → **Reglas** → **Área de pruebas de reglas** (Rules Playground): simular `create` en `usuarios/UID_PRUEBA` con usuario autenticado `UID_PRUEBA` y datos `{"rol": "admin", "autorId": "UID_PRUEBA"}` → debe salir **Denegado**.
- [ ] Simular el mismo `create` con `{"rol": "docente"}` → **Permitido**.

**Qué documentar**

- [ ] `docs/pruebas-caja-blanca.md`: sección `puedeEditar`
- [ ] `docs/pruebas-caja-blanca.md`, tabla **Hallazgos**: agregar **H2** "Escalamiento a admin por la regla general de Firestore" → Decisión: corregido en T-00
- [ ] `docs/decisiones.md`: "Todas las reglas de Firestore se centralizan en T-00 para evitar conflictos"

---

#### T-01 · Ficha de detalle de un punto (RF-12)

**Responsable:** José · **Rama:** `jose/ficha-punto` · **Tiempo:** 2 h
**Criterio del SRS:** *Seleccionar un punto y comprobar que muestra su ficha de detalle (nombre, categoría, descripción y datos de contacto cuando existan).*
Si ya la terminaste la semana pasada, solo completa las pruebas y la documentación que falten.

**Qué hacer**

1. Crear `src/app/punto/[id].tsx`: lee el punto con `escucharUno<Punto>('puntos', id, setPunto)`.
2. Mostrar: nombre (título), categoría con su color (`colorCategoria`), descripción, y el contacto **solo si existe**.
3. Si el contacto es teléfono, botón **Llamar** (`Linking.openURL('tel:...')`); si es correo, botón **Escribir** (`mailto:`).
4. Botón **Editar** visible solo si `puedeEditar(punto.autorId, { uid, rol: perfil.rol })` → lleva a `/punto/editar/[id]` (lo hace T-02).
5. En `src/app/(tabs)/index.tsx`, en cada `Marker` agregar `onCalloutPress={() => router.push(`/punto/${p.id}`)}`.
6. Mientras carga, `ActivityIndicator` (RNF de indicadores de progreso). Si el punto no existe: "Este punto ya no está disponible".

**Lógica en `src/lib/contacto.ts`**

```ts
export function contactoComoEnlace(contacto?: string): string | null {
  if (!contacto) return null;
  const digitos = contacto.replace(/\D/g, '');
  if (digitos.length === 10) return `tel:${digitos}`;
  if (contacto.includes('@')) return `mailto:${contacto.trim()}`;
  return null;
}
```

V(G) = 1 + 3 `if` = **4**

**Pruebas de caja blanca** (`__tests__/lib/contacto.test.ts`)

| ID | Entrada | Esperado |
|---|---|---|
| CB-CON-1 | `undefined` | `null` |
| CB-CON-2 | `'445-123-4567'` | `'tel:4451234567'` |
| CB-CON-3 | `'renta@correo.com'` | `'mailto:renta@correo.com'` |
| CB-CON-4 | `'Preguntar en la tienda'` | `null` |

**Prueba de componente** (`__tests__/pantallas/punto.test.tsx`, simulando `escucharUno` con `jest.mock('../../src/services/db')`)

| ID | Caso | Esperado |
|---|---|---|
| CB-FPT-1 | Punto con contacto telefónico | Se ve el nombre, la categoría, la descripción y el botón **Llamar** |
| CB-FPT-2 | Punto sin contacto | No aparece ningún botón de contacto |
| CB-FPT-3 | `escucharUno` devuelve `null` | "Este punto ya no está disponible" |

**Pruebas manuales**

- [ ] Tocar un punto de cada categoría (interés, riesgo, referencia) → se abre su ficha con los 4 datos.
- [ ] Punto con teléfono → **Llamar** abre el marcador del celular con el número.
- [ ] Punto ajeno → no aparece **Editar**.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: sección `contactoComoEnlace`
- [ ] `matriz-pruebas.md`: fila RF-12
- [ ] `evidencias/RF-12_ficha.png`

---

#### T-02 · Registrar y editar puntos (RF-13)

**Responsable:** José · **Rama:** `jose/alta-puntos` · **Tiempo:** 3 h
**Criterio del SRS:** *Registrar un punto nuevo y verificar que aparece en el mapa para otros usuarios.*

**Qué hacer**

1. En el mapa: `onLongPress={(e) => router.push({ pathname: '/punto/nuevo', params: e.nativeEvent.coordinate })}`.
2. Mostrar una vez el aviso "Mantén presionado el mapa para agregar un punto".
3. Crear `src/app/punto/nuevo.tsx`: formulario con nombre, categoría (3 chips), descripción y contacto (opcional). Las coordenadas llegan por parámetros.
4. Al guardar: `validarPunto(...)`; si hay error, mostrarlo; si no, `crear('puntos', { ...datos, autorId: usuario.uid })` y `router.back()`.
5. Crear `src/app/punto/editar/[id].tsx`: mismo formulario precargado; guarda con `actualizar('puntos', id, cambios)`. Si `!puedeEditar(...)`, regresar.
6. Botón **Eliminar** en la edición, con `Alert.alert` de confirmación → `eliminar('puntos', id)`.

**Lógica en `src/lib/puntos.ts`**

```ts
export function dentroDeRegion(c: Coordenada): boolean {
  return c.latitud >= REGION_LIMITES.latMin && c.latitud <= REGION_LIMITES.latMax
    && c.longitud >= REGION_LIMITES.lonMin && c.longitud <= REGION_LIMITES.lonMax;
}

export function validarPunto(p: { nombre: string; categoria: string; descripcion: string } & Coordenada): string | null {
  if (!p.nombre.trim()) return 'Escribe el nombre del punto.';
  if (!['interes', 'riesgo', 'referencia'].includes(p.categoria)) return 'Elige una categoría.';
  if (p.categoria === 'riesgo' && !p.descripcion.trim()) return 'Describe por qué es una zona de riesgo.';
  if (!dentroDeRegion(p)) return 'El punto está fuera de la región piloto.';
  return null;
}
```

- `dentroDeRegion`: V(G) = 1 + 3 `&&` = **4**
- `validarPunto`: V(G) = 1 + 4 `if` + 1 `&&` = **6**

La regla "riesgo exige descripción" sirve también para RF-31: toda zona de riesgo tendrá su descripción.

**Pruebas de caja blanca** (`__tests__/lib/puntos.test.ts`)

| ID | Entrada | Esperado |
|---|---|---|
| CB-PTO-1 | nombre `'  '` | error de nombre |
| CB-PTO-2 | categoría `'tienda'` | error de categoría |
| CB-PTO-3 | riesgo sin descripción | error de descripción |
| CB-PTO-4 | interés sin descripción, dentro de la región | `null` (lado falso del `&&`) |
| CB-PTO-5 | riesgo con descripción, lat 21.0 | error de región |
| CB-PTO-6 | datos válidos | `null` |
| CB-PTO-7 | `dentroDeRegion` en el borde exacto `latMin` / `lonMax` | `true` (valor límite) |
| CB-PTO-8 | `dentroDeRegion` con lat `latMin - 0.0001` | `false` |
| CB-PTO-9 | `dentroDeRegion` con lon fuera por arriba | `false` |
| CB-PTO-10 | `dentroDeRegion` con lat fuera por arriba | `false` |

**Pruebas manuales** (2 celulares, 2 cuentas)

- [ ] Celular A: mantener presionado → crear punto de interés → aparece en A.
- [ ] Celular B (otra cuenta): el punto aparece **sin recargar** en menos de 5 s.
- [ ] B abre el punto de A → no ve **Editar** ni **Eliminar**.
- [ ] A edita el nombre → B ve el cambio.
- [ ] A intenta guardar un punto de riesgo sin descripción → mensaje de error, no se guarda.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `dentroDeRegion` y `validarPunto`
- [ ] `matriz-pruebas.md`: fila RF-13
- [ ] `evidencias/RF-13_dos_dispositivos.png` (captura de ambos celulares)
- [ ] `decisiones.md`: "Los puntos de riesgo exigen descripción (apoya RF-31)" y "Coordenadas limitadas a la caja de la región piloto"

---

#### T-03 · Registrar alertas de inseguridad (RF-30)

**Responsable:** Carlos · **Rama:** `carlos/registrar-alertas` · **Tiempo:** 3 h
**Criterio del SRS:** *Registrar una alerta con descripción y comprobar su publicación en la zona marcada.*

**Qué hacer**

1. Crear `src/app/alerta/nueva.tsx` con: tipo (3 chips: ambiente tóxico, crimen organizado, baja seguridad), nivel (alto, medio, bajo), descripción (mínimo 10 caracteres), localidad (Yuriria, Uriangato, Moroleón).
2. Ubicación: botón **Usar mi ubicación** (`Location.getCurrentPositionAsync`) o coordenadas recibidas por parámetro (desde el mapa con "Reportar alerta aquí").
3. Guardar: `crear('alertas', { ...datos, autorId: usuario.uid, fecha: Date.now() })`. **No** guardar `confirmaciones` ni `desmentidos` (T-06 los calcula con votos).
4. En `src/app/(tabs)/alertas.tsx`: botón **+ Reportar alerta** arriba de la lista.
5. Texto fijo visible en el formulario: "Este reporte es comunitario y no sustituye a las autoridades" (restricción 2.5 del SRS).

**Lógica en `src/lib/alertas.ts`**

```ts
export function validarAlerta(a: { tipo: string; nivel: string; descripcion: string; localidad: string } & Coordenada): string | null {
  if (!TIPOS_ALERTA.includes(a.tipo)) return 'Elige el tipo de alerta.';
  if (!NIVELES.includes(a.nivel)) return 'Elige el nivel de riesgo.';
  if (a.descripcion.trim().length < 10) return 'Describe la situación (mínimo 10 caracteres).';
  if (!LOCALIDADES.includes(a.localidad)) return 'Elige la localidad.';
  if (!dentroDeRegion(a)) return 'La ubicación está fuera de la región piloto.';
  return null;
}
```

V(G) = 1 + 5 `if` = **6**

**Pruebas de caja blanca** (`__tests__/lib/alertas.test.ts`)

| ID | Entrada | Esperado |
|---|---|---|
| CB-ALE-1 | tipo `'robo'` | error de tipo |
| CB-ALE-2 | nivel `'extremo'` | error de nivel |
| CB-ALE-3 | descripción de 9 caracteres | error de descripción (límite) |
| CB-ALE-4 | descripción de 10 caracteres, resto válido | `null` (límite) |
| CB-ALE-5 | localidad `'Celaya'` | error de localidad |
| CB-ALE-6 | coordenadas fuera de la región | error de región |

**Pruebas manuales**

- [ ] Registrar una alerta de cada nivel → aparecen en la pestaña Alertas con su color.
- [ ] Desde otra cuenta → se ven las mismas alertas.
- [ ] Negar el permiso de ubicación → el formulario muestra cómo elegir la ubicación sin GPS.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: sección `validarAlerta`
- [ ] `matriz-pruebas.md`: filas RF-30 y RF-32 (la clasificación por nivel ya se ve)
- [ ] `evidencias/RF-30_alerta.png`

---

#### T-04 · Chat por región y por temática (RF-21)

**Responsable:** Alexis · **Rama:** `alexis/chat-region` · **Tiempo:** 2 h
**Criterio del SRS:** *Crear una conversación temática y comprobar que otros docentes de la región pueden encontrarla.*

**Qué hacer**

1. En `src/app/(tabs)/chat.tsx`: dos filas de chips, **Región** (Yuriria, Uriangato, Moroleón) y **Tema** (Escuela, Ambiente laboral, Servicios básicos, Institucional, General).
2. La sala es `idSala(region, tema)`; los mensajes se guardan con `sala: idSala(...)` y se escuchan con `where('sala', '==', idSala(...))`.
3. Título visible: "Moroleón · Servicios básicos".
4. Los mensajes viejos con `sala: 'General'` dejan de verse; son de prueba. Anotarlo en `decisiones.md`.

**Lógica en `src/lib/chat.ts`**

```ts
const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase().replace(/\s+/g, '-');

export function idSala(region: string, tema: string): string {
  return `${normalizar(region)}-${normalizar(tema)}`;
}
```

V(G) = **1** en ambas (no hay decisiones); las pruebas verifican transformaciones.

**Pruebas de caja blanca** (`__tests__/lib/chat.test.ts`)

| ID | Entrada | Esperado |
|---|---|---|
| CB-SAL-1 | `('Moroleón', 'Servicios básicos')` | `'moroleon-servicios-basicos'` |
| CB-SAL-2 | `(' Yuriria ', 'Escuela')` | `'yuriria-escuela'` |
| CB-SAL-3 | Misma región y tema escritos distinto (`'MOROLEON'`, `'moroleón'`) | Mismo id |

**Pruebas manuales** (2 cuentas)

- [ ] A entra a Uriangato · Escuela y escribe "¿A qué hora abre la dirección?".
- [ ] B entra a Uriangato · Escuela → ve el mensaje.
- [ ] B entra a Yuriria · Escuela → **no** lo ve.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: sección `idSala`
- [ ] `matriz-pruebas.md`: filas RF-20 y RF-21
- [ ] `evidencias/RF-21_salas.png`
- [ ] `decisiones.md`: "Sala = región + tema; se descartan los mensajes de prueba anteriores"

---

### Lunes 23 de noviembre

**Standup (10 min, los tres):** qué quedó de la semana 1 · qué hace cada quien hoy · bloqueos.
**Al final del día (José):** cuando T-00 a T-04 estén en `main`:

```bash
git switch main && git pull
git tag -a v0.2.0 -m "Fin de semana 1"
git push origin v0.2.0
```

---

#### T-05 · Filtro por distancia y preferencias del mapa (RF-14, RF-04)

**Responsable:** José · **Rama:** `jose/filtros-mapa` · **Tiempo:** 3 h
**Criterios del SRS:**
- RF-14: *Aplicar cada filtro y comprobar que los puntos visibles corresponden al filtro seleccionado.*
- RF-04: *Configurar las categorías visibles y comprobar que el mapa respeta la configuración en la siguiente sesión.*

**Qué hacer**

1. En el mapa, agregar chips de distancia: **1 km · 5 km · 10 km · Todos**. "Todos" se guarda como `radioKm: 0`.
2. Reemplazar el filtro actual por `puntosVisibles(puntos, { categorias, radioKm, ubicacion })`.
3. Al abrir el mapa, leer `perfil.preferencias` con `preferenciasConDefecto(...)` y aplicar categorías, radio y zoom inicial (`latitudeDelta`/`longitudeDelta`).
4. Cada vez que cambien las categorías o el radio: `actualizar('usuarios', usuario.uid, { preferencias })`.
5. Si no hay ubicación y el radio no es "Todos", mostrar: "Activa la ubicación para filtrar por distancia".

**Lógica en `src/lib/mapa.ts`**

```ts
export type PreferenciasMapa = { categorias: CategoriaPunto[]; radioKm: number; zoomDelta: number };
const DEFECTO: PreferenciasMapa = { categorias: ['interes', 'riesgo', 'referencia'], radioKm: 0, zoomDelta: 0.18 };

export function preferenciasConDefecto(guardadas?: Partial<PreferenciasMapa>): PreferenciasMapa {
  const p = guardadas ?? {};
  return {
    categorias: p.categorias ?? DEFECTO.categorias,
    radioKm: p.radioKm ?? DEFECTO.radioKm,
    zoomDelta: p.zoomDelta ?? DEFECTO.zoomDelta,
  };
}

export function puntosVisibles<T extends Coordenada & { categoria: CategoriaPunto }>(
  puntos: T[],
  f: { categorias: CategoriaPunto[]; radioKm: number; ubicacion: Coordenada | null },
): T[] {
  return puntos.filter((p) => {
    if (!f.categorias.includes(p.categoria)) return false;
    if (f.radioKm === 0 || !f.ubicacion) return true;
    return distanciaKm(f.ubicacion, p) <= f.radioKm;
  });
}
```

- `preferenciasConDefecto`: V(G) = 1 + 4 `??` = **5**
- Función interna de `puntosVisibles`: V(G) = 1 + 2 `if` + 1 `||` = **4**

**Hallazgo de diseño:** si "Todos" se guardara como `null`, el operador `??` lo cambiaría por el valor por defecto y se perdería la preferencia. Por eso "Todos" es `0`. Anotarlo en `decisiones.md`.

**Pruebas de caja blanca** (`__tests__/lib/mapa.test.ts`)

| ID | Entrada | Esperado |
|---|---|---|
| CB-MAP-1 | `preferenciasConDefecto(undefined)` | Los 3 valores por defecto |
| CB-MAP-2 | `{ radioKm: 5 }` | `radioKm` 5, el resto por defecto |
| CB-MAP-3 | `{ radioKm: 0 }` | `radioKm` 0 (no se reemplaza) |
| CB-MAP-4 | Preferencias completas | Se devuelven igual |
| CB-MAP-5 | Punto de riesgo con categorías `['interes']` | Se oculta |
| CB-MAP-6 | `radioKm: 0` con ubicación | Se muestran todos los de la categoría |
| CB-MAP-7 | `radioKm: 5` sin ubicación | Se muestran todos (se ignora el radio) |
| CB-MAP-8 | `radioKm: 5`, punto a 3 km | Visible |
| CB-MAP-9 | `radioKm: 5`, punto a 8 km | Oculto |
| CB-MAP-10 | Punto exactamente a `radioKm` | Visible (límite `<=`) |

**Pruebas manuales**

- [ ] Quitar la categoría Riesgo → desaparecen los puntos rojos.
- [ ] Elegir 1 km estando en el centro de Yuriria → solo quedan los puntos cercanos.
- [ ] Elegir "Todos" → regresan todos.
- [ ] Dejar solo Interés y radio 5 km → cerrar la app por completo → abrirla → el mapa conserva Interés y 5 km.
- [ ] Iniciar sesión con la misma cuenta en otro celular → mismas preferencias.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `preferenciasConDefecto` y `puntosVisibles`
- [ ] `matriz-pruebas.md`: filas RF-04 y RF-14
- [ ] `evidencias/RF-14_filtros.png`, `evidencias/RF-04_preferencias.png`
- [ ] `decisiones.md`: "Radio 0 = sin límite (por el comportamiento de `??`)"

---

#### T-06 · Confirmar o desmentir alertas (RF-34) + llave de Google Maps

**Responsable:** Carlos · **Rama:** `carlos/votos-alertas` · **Tiempo:** 3 h + 30 min
**Criterio del SRS:** *Confirmar una alerta existente y comprobar la actualización de su estado.*

**Qué hacer (votos)**

1. Cada voto se guarda en `alertas/{alertaId}/votos/{uid}` con `{ voto: 'confirma' | 'desmiente', fecha }`. Como el id es el uid, **un voto por persona**; volver a votar lo cambia.
2. Quitar `confirmaciones` y `desmentidos` de `Alerta` en `src/types/modelos.ts`.
3. En cada tarjeta de `alertas.tsx`: escuchar `alertas/${id}/votos`, calcular `contarVotos` y `estadoAlerta`, y mostrar "Confirmada · 3 confirman · 1 desmiente".
4. Botones **Confirmar** y **Desmentir**: `guardar(`alertas/${id}/votos`, usuario.uid, { voto, fecha: Date.now() })`. Ocultarlos si el usuario es el autor de la alerta.
5. Resaltar el botón del voto actual del usuario.

**Lógica en `src/lib/alertas.ts`**

```ts
export function contarVotos(votos: { voto: 'confirma' | 'desmiente' }[]) {
  let confirman = 0;
  let desmienten = 0;
  for (const v of votos) {
    if (v.voto === 'confirma') confirman++;
    else desmienten++;
  }
  return { confirman, desmienten };
}

export function estadoAlerta(c: { confirman: number; desmienten: number }): 'sin verificar' | 'en duda' | 'confirmada' {
  if (c.confirman + c.desmienten === 0) return 'sin verificar';
  if (c.desmienten >= c.confirman) return 'en duda';
  return 'confirmada';
}
```

- `contarVotos`: V(G) = 1 + `for` + `if` = **3**
- `estadoAlerta`: V(G) = 1 + 2 `if` = **3**

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-VOT-1 | `contarVotos([])` | `{0, 0}` (el ciclo no se ejecuta) |
| CB-VOT-2 | 2 confirma, 1 desmiente | `{2, 1}` |
| CB-VOT-3 | `estadoAlerta({0, 0})` | `'sin verificar'` |
| CB-VOT-4 | `{1, 1}` | `'en duda'` (límite del empate) |
| CB-VOT-5 | `{2, 1}` | `'confirmada'` |
| CB-VOT-6 | `{0, 1}` | `'en duda'` |

**Pruebas manuales** (3 cuentas)

- [ ] A crea una alerta → estado "sin verificar"; A no ve los botones.
- [ ] B confirma → "confirmada · 1 confirma".
- [ ] C desmiente → "en duda · 1 confirma · 1 desmiente".
- [ ] B cambia su voto a desmentir → "en duda · 0 confirman · 2 desmienten" (no se duplica).

**Qué hacer (llave de Google Maps, 30 min)**

En Expo Go el mapa funciona sin llave, pero **el APK sí la necesita** o el mapa no carga. Se hace hoy para no descubrirlo el 3 de diciembre.

1. console.cloud.google.com → **Nuevo proyecto** `docengo`.
2. **APIs y servicios → Biblioteca** → habilitar **Maps SDK for Android**.
3. **Credenciales → Crear credenciales → Clave de API**. Copiarla.
4. Google pide una cuenta de facturación (tarjeta). El SDK de mapas de Android normalmente no genera cobro con este uso, pero revisen el aviso al activarla.
5. Pasar la llave a José por privado (la usa en T-23). La restricción por huella SHA-1 se agrega en T-23.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `contarVotos` y `estadoAlerta`
- [ ] `matriz-pruebas.md`: fila RF-34
- [ ] `evidencias/RF-34_votos.png`
- [ ] `decisiones.md`: "Votos en subcolección, un voto por usuario; empate = en duda" y "Llave de Google Maps creada para el APK"

---

#### T-07 · Reportar mensajes (RF-25), responder dudas (RF-22) y matriz de pruebas

**Responsable:** Alexis · **Rama:** `alexis/reportar-responder` · **Tiempo:** 3.5 h
**Criterios del SRS:**
- RF-25: *Reportar un mensaje y comprobar que queda registrado para revisión.*
- RF-22: *Publicar una duda y recibir una respuesta dentro de la conversación.*

**Qué hacer**

1. Mantener presionado un mensaje → menú con **Responder** y **Reportar**.
2. **Responder:** arriba del campo de texto aparece "Respondiendo a Ana: ¿A qué hora…" con una ✕ para cancelar. Al enviar, el mensaje lleva `respuestaA: { id, autorNombre, texto: resumirTexto(original, 60) }`. En la burbuja se dibuja la cita en gris arriba del texto.
3. **Reportar:** elegir motivo (Ofensivo, Spam, Información falsa, Otro) y detalle (obligatorio si es Otro). Guardar con `guardar('reportes', `${mensaje.id}_${usuario.uid}`, {...})`; el id evita que la misma persona reporte dos veces el mismo mensaje.

   ```ts
   { coleccion: 'mensajes', contenidoId, texto: mensaje.texto, motivo, detalle, autorId: usuario.uid, estado: 'pendiente', fecha: Date.now() }
   ```

4. Mostrar "Gracias, un administrador lo revisará".
5. Crear `docs/matriz-pruebas.md` con la plantilla del [Anexo B](#anexo-b-plantilla-de-la-matriz-de-pruebas) (todas las filas, aunque falten resultados).

**Lógica en `src/lib/chat.ts`**

```ts
export const MOTIVOS = ['ofensivo', 'spam', 'informacion falsa', 'otro'];

export function validarReporte(motivo: string, detalle: string): string | null {
  if (!MOTIVOS.includes(motivo)) return 'Elige un motivo.';
  if (motivo === 'otro' && !detalle.trim()) return 'Explica el motivo.';
  return null;
}

export function resumirTexto(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  return texto.slice(0, max - 1) + '…';
}
```

- `validarReporte`: V(G) = 1 + 2 `if` + `&&` = **4**
- `resumirTexto`: V(G) = **2**

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-REP-1 | motivo `'aburrido'` | error de motivo |
| CB-REP-2 | `'otro'`, detalle vacío | error de detalle |
| CB-REP-3 | `'otro'`, detalle "Comparte teléfonos" | `null` |
| CB-REP-4 | `'spam'`, detalle vacío | `null` (lado falso del `&&`) |
| CB-RES-1 | texto de 60 caracteres, max 60 | mismo texto (límite) |
| CB-RES-2 | texto de 61 caracteres | 60 caracteres terminando en `…` |

**Pruebas manuales**

- [ ] B reporta un mensaje de A por Spam → en Firebase Console aparece en `reportes` con estado `pendiente`.
- [ ] B lo reporta otra vez → sigue habiendo **un** documento (se sobrescribe).
- [ ] A publica "¿Dónde hay papelería cerca de la secundaria?" → B responde → A ve la respuesta con la cita.
- [ ] Un docente que no es admin **no** puede leer `reportes` (Rules Playground: `get` en `reportes/x` → Denegado).

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `validarReporte` y `resumirTexto`
- [ ] `matriz-pruebas.md`: creada, con filas RF-22 y RF-25 llenas
- [ ] `evidencias/RF-22_respuesta.png`, `evidencias/RF-25_reporte.png`

---

### Martes 24 de noviembre

---

#### T-08 · Ficha de servicio (RF-18) y verificación de geolocalización (RF-16)

**Responsable:** José · **Rama:** `jose/ficha-servicio` · **Tiempo:** 3.5 h
**Criterios del SRS:**
- RF-18: *Abrir la ficha de un servicio y comprobar los campos mostrados (nombre, categoría, dirección, horario y teléfono cuando estén disponibles).*
- RF-16: *Comprobar que el 100 % de los establecimientos registrados aparecen correctamente geolocalizados.*

**Qué hacer**

1. En `servicios.tsx`, cada tarjeta lleva a `/servicio/[id]`.
2. Crear `src/app/servicio/[id].tsx`: nombre, tipo, dirección, horario con el estado **Abierto ahora / Cerrado / Horario no disponible**, teléfono con botón **Llamar** (reusa `contactoComoEnlace`), distancia si hay ubicación.
3. Un `MapView` pequeño (alto 180) con el marcador del servicio: así se cumple "geolocalizado".
4. Formato de horario acordado: `"9:00 a 21:00"`. Anotarlo en `decisiones.md` para que los datos reales lo sigan.

**Lógica en `src/lib/servicios.ts`**

```ts
const HORARIO = /^([01]?\d|2[0-3]):([0-5]\d)\s*a\s*([01]?\d|2[0-3]):([0-5]\d)$/;

export function estaAbierto(horario: string | undefined, ahora: Date): boolean | null {
  if (!horario) return null;
  const m = HORARIO.exec(horario.trim());
  if (!m) return null;
  const abre = Number(m[1]) * 60 + Number(m[2]);
  const cierra = Number(m[3]) * 60 + Number(m[4]);
  const actual = ahora.getHours() * 60 + ahora.getMinutes();
  if (cierra > abre) return actual >= abre && actual < cierra;
  return actual >= abre || actual < cierra;   // cruza la medianoche (ej. 22:00 a 02:00)
}

export function sinCoordenadas<T extends { latitud: unknown; longitud: unknown }>(lista: T[]): T[] {
  return lista.filter((s) => !Number.isFinite(s.latitud) || !Number.isFinite(s.longitud));
}
```

- `estaAbierto`: V(G) = 1 + 3 `if` + `&&` + `||` = **6**
- Función interna de `sinCoordenadas`: V(G) = **2**

**Pruebas de caja blanca** (fechas con `new Date(2026, 10, 24, H, M)`)

| ID | Entrada | Esperado |
|---|---|---|
| CB-SRV-1 | horario `undefined` | `null` |
| CB-SRV-2 | `'todo el día'` | `null` (no coincide el formato) |
| CB-SRV-3 | `'25:00 a 26:00'` | `null` (horas inválidas) |
| CB-SRV-4 | `'9:00 a 21:00'` a las 10:00 | `true` |
| CB-SRV-5 | a las 8:59 | `false` (límite) |
| CB-SRV-6 | a las 9:00 | `true` (límite de apertura) |
| CB-SRV-7 | a las 21:00 | `false` (cierre exclusivo) |
| CB-SRV-8 | `'22:00 a 02:00'` a las 23:30 | `true` |
| CB-SRV-9 | `'22:00 a 02:00'` a la 01:00 | `true` |
| CB-SRV-10 | `'22:00 a 02:00'` a las 12:00 | `false` |
| CB-GEO2-1 | `sinCoordenadas` con todo válido | `[]` |
| CB-GEO2-2 | latitud faltante | lo detecta |
| CB-GEO2-3 | longitud como texto `'-101.1'` | lo detecta (error típico al capturar en la consola) |

**Pruebas manuales**

- [ ] Abrir la ficha de una farmacia → los 5 campos; el mapa pequeño muestra el marcador en el lugar correcto.
- [ ] Servicio sin teléfono → no aparece **Llamar**.
- [ ] Comparar el estado Abierto/Cerrado con la hora del celular.
- [ ] **RF-16:** comparar el número de servicios en Firestore con los que aparecen en la lista con "Todos": deben coincidir al 100 %. Anotar los números en la matriz.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `estaAbierto` (incluir el grafo: es la más compleja hasta ahora) y `sinCoordenadas`
- [ ] `matriz-pruebas.md`: filas RF-16 y RF-18
- [ ] `evidencias/RF-18_ficha_servicio.png`
- [ ] `decisiones.md`: "Formato de horario `H:MM a H:MM`"

---

#### T-09 · Hospedaje: lista y filtros (RF-35, RF-37)

**Responsable:** Carlos · **Rama:** `carlos/hospedaje-lista` · **Tiempo:** 3 h
**Criterios del SRS:**
- RF-35: *El módulo muestra al menos tres opciones de hospedaje por localidad piloto, con datos de contacto funcionales.*
- RF-37: *Aplicar cada filtro (localidad, tipo, rango de precio) y comprobar que los resultados corresponden.*

**Qué hacer**

1. Reemplazar `EnConstruccion` en `src/app/hospedaje.tsx` por la lista real con `escuchar<Hospedaje>('hospedajes', ...)`.
2. Filtros: chips de **localidad** y **tipo** (Cuarto / Casa), y precio con dos campos (mínimo y máximo, numéricos). Botón **Limpiar filtros**.
3. Tarjeta: título, tipo, localidad, precio con formato `$2,500 / mes`, inicio de la descripción.
4. Mensaje cuando no hay resultados: "No hay hospedajes con esos filtros".
5. Cargar a mano 3 hospedajes de prueba por localidad (9 en total) para probar.

**Lógica en `src/lib/hospedaje.ts`**

```ts
type Filtros = { localidad?: string; tipo?: string; precioMin?: number; precioMax?: number };

export function filtrarHospedajes<T extends { localidad: string; tipo: string; precio: number }>(lista: T[], f: Filtros): T[] {
  return lista.filter((h) => {
    if (f.localidad && h.localidad !== f.localidad) return false;
    if (f.tipo && h.tipo !== f.tipo) return false;
    if (f.precioMin !== undefined && h.precio < f.precioMin) return false;
    if (f.precioMax !== undefined && h.precio > f.precioMax) return false;
    return true;
  });
}

export const formatearPrecio = (p: number) => `$${p.toLocaleString('es-MX')} / mes`;
```

V(G) de la función interna = 1 + 4 `if` + 4 `&&` = **9**. Está cerca del límite de 10: si agregan otro filtro, divídanla.

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-HOS-1 | Sin filtros | Todos |
| CB-HOS-2 | localidad Uriangato | Solo Uriangato |
| CB-HOS-3 | tipo casa | Solo casas |
| CB-HOS-4 | precioMin 2000 | Excluye los de 1999 |
| CB-HOS-5 | precioMax 2500 | Incluye el de 2500 exacto (límite) |
| CB-HOS-6 | precioMax 2500 | Excluye el de 2501 |
| CB-HOS-7 | Moroleón + cuarto + máximo 3000 | Solo los que cumplen las 3 |
| CB-HOS-8 | precioMin 0 | No filtra de más (el `0` no se confunde con "sin filtro") |

**Pruebas manuales**

- [ ] Sin filtros se ven los 9 de prueba.
- [ ] Cada filtro por separado y combinados → contar a mano que coinciden.
- [ ] Escribir texto en el campo de precio → no se acepta (teclado numérico).

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: sección `filtrarHospedajes`, explicando por qué V(G) = 9
- [ ] `matriz-pruebas.md`: filas RF-35 (parcial: falta T-12 para el contacto) y RF-37
- [ ] `evidencias/RF-37_filtros.png`

---

#### T-10 · Publicar lugares destacados (RF-26)

**Responsable:** Alexis · **Rama:** `alexis/publicar-lugares` · **Tiempo:** 3 h
**Criterio del SRS:** *Cargar al menos cinco registros de prueba y comprobar que se publican y visualizan correctamente.*

**Qué hacer**

1. Reemplazar `EnConstruccion` en `src/app/lugares.tsx` por la lista real (`escuchar<Lugar>('lugares', ...)`): nombre, categoría, localidad, inicio de la descripción.
2. Botón **+ Recomendar lugar** → `src/app/lugar/nuevo.tsx` con nombre, categoría (Comida, Recreación, Cultura, Compras, Naturaleza), localidad, descripción y ubicación (**Usar mi ubicación**).
3. Guardar con `crear('lugares', { ...datos, autorId, autorNombre, fecha })`.
4. Publicar los 5 registros de prueba desde la app (no desde la consola), para probar el formulario.

**Lógica en `src/lib/lugares.ts`**

```ts
export const CATEGORIAS_LUGAR = ['comida', 'recreacion', 'cultura', 'compras', 'naturaleza'];

export function validarLugar(l: { nombre: string; categoria: string; localidad: string; descripcion: string } & Coordenada): string | null {
  if (!l.nombre.trim()) return 'Escribe el nombre del lugar.';
  if (!CATEGORIAS_LUGAR.includes(l.categoria)) return 'Elige una categoría.';
  if (!LOCALIDADES.includes(l.localidad)) return 'Elige la localidad.';
  if (l.descripcion.trim().length < 10) return 'Cuenta por qué lo recomiendas (mínimo 10 caracteres).';
  if (!dentroDeRegion(l)) return 'La ubicación está fuera de la región piloto.';
  return null;
}
```

V(G) = 1 + 5 `if` = **6**

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-LUG-1 | nombre vacío | error |
| CB-LUG-2 | categoría `'bar'` | error |
| CB-LUG-3 | localidad `'León'` | error |
| CB-LUG-4 | descripción de 9 caracteres | error (límite) |
| CB-LUG-5 | fuera de la región | error |
| CB-LUG-6 | todo válido, descripción de 10 caracteres | `null` (límite) |

**Pruebas manuales**

- [ ] Publicar 5 lugares (al menos uno por localidad) → aparecen en la lista.
- [ ] Otra cuenta ve los 5.
- [ ] Probar cada error del formulario.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: sección `validarLugar`
- [ ] `matriz-pruebas.md`: fila RF-26
- [ ] `evidencias/RF-26_cinco_lugares.png`

---

### Miércoles 25 de noviembre

---

#### T-11 · Alertas visibles en el mapa (RF-31, RF-32)

**Responsable:** José (con Carlos para revisar los datos de alertas) · **Rama:** `jose/alertas-mapa` · **Tiempo:** 3 h
**Criterios del SRS:**
- RF-31: *Verificar que toda zona marcada como riesgo despliega su alerta durante las pruebas* (100 %).
- RF-32: *Registrar alertas de distinto nivel y comprobar la clasificación mostrada.*

**Qué hacer**

1. En `index.tsx`, escuchar también `alertas`.
2. Unir puntos de riesgo y alertas con `zonasDeRiesgo(puntos, alertas)`.
3. Para cada zona: `<Circle center radius={300} fillColor={color + '40'} strokeColor={color} />` y un `<Marker>` cuyo globo muestre título, nivel y descripción. Color según `colorNivel`.
4. Leyenda fija abajo a la izquierda: ● alto ● medio ● bajo.
5. El chip **Riesgo** del filtro también muestra u oculta las alertas.
6. Opción en el mapa: mantener presionado → elegir **Agregar punto** o **Reportar alerta aquí** (abre T-03 con las coordenadas).

**Lógica en `src/lib/alertas.ts`**

```ts
export const DESCRIPCION_RIESGO = 'Zona de riesgo reportada por la comunidad.';

export function zonasDeRiesgo(puntos: Punto[], alertas: Alerta[]): ZonaRiesgo[] {
  const dePuntos = puntos
    .filter((p) => p.categoria === 'riesgo')
    .map((p) => ({ id: p.id, latitud: p.latitud, longitud: p.longitud, titulo: p.nombre,
                   descripcion: p.descripcion || DESCRIPCION_RIESGO, nivel: 'medio' as const }));
  const deAlertas = alertas.map((a) => ({ id: a.id, latitud: a.latitud, longitud: a.longitud,
                   titulo: NOMBRE_TIPO[a.tipo], descripcion: a.descripcion, nivel: a.nivel }));
  return [...dePuntos, ...deAlertas];
}
```

V(G): las funciones internas tienen 1 o 2 (`||`). La importancia está en verificar el **100 %** del criterio.

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-ZON-1 | 1 punto de riesgo + 1 de interés + 2 alertas | 3 zonas (el de interés no entra) |
| CB-ZON-2 | Punto de riesgo sin descripción | Usa `DESCRIPCION_RIESGO` |
| CB-ZON-3 | 10 puntos de riesgo y 10 alertas aleatorias | 20 zonas, **todas** con descripción no vacía (criterio 100 % de RF-31) |
| CB-ZON-4 | Listas vacías | `[]` |
| CB-ZON-5 | Alerta de nivel alto | La zona conserva `nivel: 'alto'` (RF-32) |

**Pruebas manuales**

- [ ] Contar en Firestore puntos de riesgo + alertas = N. Contar en el mapa los círculos = N. Anotar ambos números.
- [ ] Tocar cada círculo → su globo tiene descripción.
- [ ] Una alerta de cada nivel → colores distintos y coinciden con la leyenda.
- [ ] Quitar el chip Riesgo → desaparecen círculos y alertas.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: sección `zonasDeRiesgo`, explicando que CB-ZON-3 demuestra el 100 % de RF-31
- [ ] `matriz-pruebas.md`: filas RF-31 y RF-32 (con los números N contados)
- [ ] `evidencias/RF-31_mapa_alertas.png`

---

#### T-12 · Publicar hospedaje y contactar al arrendador (RF-36, RF-38) + inicio de perfil

**Responsable:** Carlos · **Rama:** `carlos/hospedaje-publicar` · **Tiempo:** 3.5 h
**Criterios del SRS:**
- RF-36: *Publicar una opción y comprobar que los datos de contacto funcionan.*
- RF-38: *Iniciar el contacto desde la aplicación y comprobar que se abre el medio seleccionado.*

**Qué hacer**

1. `src/app/hospedaje/nuevo.tsx`: título, tipo, localidad, precio mensual, descripción (mínimo 20 caracteres), teléfono (10 dígitos), ubicación opcional.
2. Casilla obligatoria: "El arrendador aceptó que su teléfono aparezca en DocenGo" (restricción 2.5 del SRS sobre datos de terceros).
3. `src/app/hospedaje/[id].tsx`: ficha completa con dos botones: **Llamar** y **WhatsApp** (`Linking.openURL(enlaceContacto(tel, medio))`).
4. Si `Linking.canOpenURL` falla (no hay WhatsApp): "No se encontró WhatsApp. Usa Llamar".
5. Editar/eliminar con `puedeEditar` (mismo patrón que T-02).
6. Cuando todo funcione, cambiar en `flags.ts`: `hospedaje: true`.
7. Si sobra tiempo: estructura de `src/app/perfil.tsx` (se termina en T-15).

**Lógica en `src/lib/hospedaje.ts`**

```ts
export const telefonoValido = (t: string) => t.replace(/\D/g, '').length === 10;

export function enlaceContacto(telefono: string, medio: 'llamar' | 'whatsapp'): string {
  const d = telefono.replace(/\D/g, '');
  if (medio === 'whatsapp') return `https://wa.me/52${d}`;
  return `tel:${d}`;
}

export function validarHospedaje(h: { titulo: string; tipo: string; localidad: string; precio: number; descripcion: string; contacto: string }): string | null {
  if (!h.titulo.trim()) return 'Escribe un título.';
  if (!['cuarto', 'casa'].includes(h.tipo)) return 'Elige cuarto o casa.';
  if (!LOCALIDADES.includes(h.localidad)) return 'Elige la localidad.';
  if (!(h.precio > 0)) return 'Escribe un precio mayor a 0.';
  if (h.descripcion.trim().length < 20) return 'Describe el lugar (mínimo 20 caracteres).';
  if (!telefonoValido(h.contacto)) return 'El teléfono debe tener 10 dígitos.';
  return null;
}
```

- `enlaceContacto`: V(G) = **2**
- `validarHospedaje`: V(G) = 1 + 6 `if` = **7**

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-CTO-1 | `('445 123 4567', 'whatsapp')` | `'https://wa.me/524451234567'` |
| CB-CTO-2 | `('4451234567', 'llamar')` | `'tel:4451234567'` |
| CB-HPV-1 a CB-HPV-6 | Un caso por cada `if` con error | El mensaje de ese campo |
| CB-HPV-7 | precio `NaN` (campo vacío) | Error de precio (`!(NaN > 0)` es verdadero) |
| CB-HPV-8 | Teléfono de 9 dígitos | Error (límite) |
| CB-HPV-9 | Todo válido | `null` |

**Pruebas manuales**

- [ ] Publicar un hospedaje con el teléfono de un compañero del equipo.
- [ ] **WhatsApp** → abre el chat con ese número.
- [ ] **Llamar** → abre el marcador con el número.
- [ ] Publicar sin marcar la casilla de consentimiento → no deja.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `enlaceContacto` y `validarHospedaje`
- [ ] `matriz-pruebas.md`: filas RF-35 (completa), RF-36 y RF-38
- [ ] `evidencias/RF-38_whatsapp.png`
- [ ] `decisiones.md`: "Contacto por teléfono con consentimiento del arrendador"

---

#### T-13 · Filtrar, valorar, comentar y editar lugares (RF-27, RF-28, RF-29)

**Responsable:** Alexis · **Rama:** `alexis/lugares-valorar` · **Tiempo:** 4 h
**Criterios del SRS:**
- RF-27: *Filtrar por la región piloto y comprobar los resultados obtenidos.*
- RF-28: *Valorar un lugar y comprobar que la valoración se refleja en su ficha.*
- RF-29: *Editar una publicación propia y comprobar la persistencia del cambio.*

**Qué hacer**

1. Chips de localidad y categoría en la lista → `filtrarLugares`.
2. `src/app/lugar/[id].tsx`: ficha con promedio ★ 4.3 (12), lista de comentarios y formulario de 1 a 5 estrellas + comentario.
3. Cada valoración en `lugares/{id}/valoraciones/{uid}` con `guardar(...)` (una por persona; volver a valorar la cambia).
4. Botones **Editar** y **Eliminar** solo si `puedeEditar(lugar.autorId, ...)`; eliminar con confirmación.
5. Cuando todo funcione: `lugares: true` en `flags.ts`.

**Lógica en `src/lib/lugares.ts`**

```ts
export function filtrarLugares<T extends { localidad: string; categoria: string }>(lista: T[], f: { localidad?: string; categoria?: string }): T[] {
  return lista.filter((l) => {
    if (f.localidad && l.localidad !== f.localidad) return false;
    if (f.categoria && l.categoria !== f.categoria) return false;
    return true;
  });
}

export function promedioEstrellas(vals: { estrellas: number }[]): number | null {
  if (vals.length === 0) return null;
  const suma = vals.reduce((s, v) => s + v.estrellas, 0);
  return Math.round((suma / vals.length) * 10) / 10;
}

export function validarValoracion(estrellas: number, comentario: string): string | null {
  if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) return 'Elige de 1 a 5 estrellas.';
  if (comentario.length > 300) return 'El comentario debe tener máximo 300 caracteres.';
  return null;
}
```

- Interna de `filtrarLugares`: V(G) = **5**
- `promedioEstrellas`: V(G) = **2**
- `validarValoracion`: V(G) = 1 + 2 `if` + 2 `||` = **5**

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-FLU-1 | Sin filtros | Todos |
| CB-FLU-2 | Solo localidad | Solo esa localidad |
| CB-FLU-3 | Solo categoría | Solo esa categoría |
| CB-FLU-4 | Ambos | La intersección |
| CB-VLR-1 | `promedioEstrellas([])` | `null` |
| CB-VLR-2 | 5 y 4 | `4.5` |
| CB-VLR-3 | 5, 4 y 4 | `4.3` (redondeo) |
| CB-VLR-4 | estrellas 0 | error (límite inferior) |
| CB-VLR-5 | estrellas 1 | `null` |
| CB-VLR-6 | estrellas 5 | `null` |
| CB-VLR-7 | estrellas 6 | error (límite superior) |
| CB-VLR-8 | estrellas 3.5 | error (no entero) |
| CB-VLR-9 | comentario de 301 caracteres | error |

**Pruebas manuales**

- [ ] Filtrar por cada localidad → solo lugares de esa localidad.
- [ ] Valorar con 5 desde A y con 3 desde B → la ficha muestra ★ 4.0 (2).
- [ ] A cambia su valoración a 4 → ★ 3.5 (2), no 3 valoraciones.
- [ ] El autor edita la descripción → cerrar y abrir la app → el cambio sigue.
- [ ] Otra cuenta no ve **Editar**; en Rules Playground, `delete` del lugar con otro uid → Denegado.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `filtrarLugares`, `promedioEstrellas`, `validarValoracion`
- [ ] `matriz-pruebas.md`: filas RF-27, RF-28, RF-29
- [ ] `evidencias/RF-28_valoracion.png`

---

### Jueves 26 de noviembre

---

#### T-14 · Paradas en el mapa y horarios (RF-39, RF-41)

**Responsable:** José · **Rama:** `jose/paradas-horarios` · **Tiempo:** 4 h
**Criterios del SRS:**
- RF-39: *Verificar que las paradas registradas aparecen correctamente geolocalizadas en el mapa.*
- RF-41: *Abrir la ficha de una parada y comprobar la visualización del horario* (de paso y llegada).

**Qué hacer**

1. Modelo en `modelos.ts`: `Parada` agrega `destino: string` y `duracionMin?: number` (minutos hasta el destino, para calcular la llegada).
2. Mapa: escuchar `paradas`; marcador con ícono de autobús (`<Marker>` con un `Ionicons name="bus"` como hijo) y chip **Transporte** en los filtros.
3. `src/app/parada/[id].tsx`: nombre, rutas, destino, **Próxima salida 07:30 · llega 08:15**, tabla con todos los horarios (paso → llegada).
4. Si no hay más salidas hoy: "No hay más salidas hoy. Primera de mañana: 06:00".

**Lógica en `src/lib/transporte.ts`**

```ts
export const aMinutos = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));
export const aHora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export function proximaSalida(horarios: string[], ahora: Date): string | null {
  const actual = ahora.getHours() * 60 + ahora.getMinutes();
  let mejor: number | null = null;
  for (const h of horarios) {
    const m = aMinutos(h);
    if (m >= actual && (mejor === null || m < mejor)) mejor = m;
  }
  return mejor === null ? null : aHora(mejor);
}

export function horaLlegada(paso: string, duracionMin: number): string {
  return aHora((aMinutos(paso) + duracionMin) % 1440);
}
```

- `proximaSalida`: V(G) = 1 + `for` + `if` + `&&` + `||` + `? :` = **6**
- `horaLlegada`, `aMinutos`, `aHora`: V(G) = **1**

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-TRA-1 | `proximaSalida([], 10:00)` | `null` (el ciclo no se ejecuta) |
| CB-TRA-2 | `['07:00','09:00']` a las 06:00 | `'07:00'` |
| CB-TRA-3 | a las 07:00 | `'07:00'` (límite `>=`) |
| CB-TRA-4 | a las 09:01 | `null` |
| CB-TRA-5 | `['09:00','07:30','08:00']` a las 07:10 | `'07:30'` (desordenados) |
| CB-TRA-6 | `horaLlegada('07:00', 45)` | `'07:45'` |
| CB-TRA-7 | `horaLlegada('23:50', 20)` | `'00:10'` (cruza medianoche) |
| CB-TRA-8 | `aMinutos('07:05')` y `aHora(425)` | `425` y `'07:05'` |

**Pruebas manuales**

- [ ] Registrar en la consola 3 paradas con coordenadas conocidas → en el mapa aparecen en el lugar exacto (comparar con Google Maps).
- [ ] Ficha de parada → horarios de paso y llegada correctos; la próxima salida coincide con la hora del celular.
- [ ] Contar paradas en Firestore = paradas en el mapa.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `proximaSalida` (con grafo) y `horaLlegada`
- [ ] `matriz-pruebas.md`: filas RF-39 y RF-41
- [ ] `evidencias/RF-39_paradas.png`, `evidencias/RF-41_horario.png`

---

#### T-15 · Perfil, cuenta y contraseña (RF-01, RF-02, RF-09, RF-07, soporte de RF-06)

**Responsable:** Carlos · **Rama:** `carlos/perfil-cuenta` · **Tiempo:** 4.5 h
**Criterios del SRS:**
- RF-01: *Crear un perfil, cerrar la sesión y comprobar que la información se conserva.*
- RF-02: *Cambiar una preferencia y verificar que las contribuciones anteriores mantienen su contenido y autoría.*
- RF-07: *Solicitar el restablecimiento y completar el cambio de contraseña.*
- RF-09: *Editar un dato y eliminar una cuenta de prueba confirmando previamente la acción.*
- RF-06 (parte pendiente): *Al bloquearse la cuenta se deberá mandar un mensaje a soporte.*

**Qué hacer**

1. **Perfil** (`src/app/perfil.tsx`): nombre de referencia, institución, niveles (chips de selección múltiple: Preescolar, Primaria, Secundaria, Media superior) y áreas de enseñanza (texto separado por comas). Guardar con `actualizar('usuarios', uid, {...})` y `updateProfile(usuario, { displayName })` si cambia el nombre.
2. **Eliminar cuenta:** botón rojo al final → `Alert.alert('¿Eliminar tu cuenta?', 'No se puede deshacer', [Cancelar, Eliminar])` → pedir la contraseña → `reauthenticateWithCredential(usuario, EmailAuthProvider.credential(correo, contrasena))` → `eliminar('usuarios', uid)` → `deleteUser(usuario)`. Agregar estas funciones a `src/services/auth.ts`.
3. **Recuperar contraseña:** enlace "¿Olvidaste tu contraseña?" en el login → `src/app/(auth)/recuperar.tsx` → `restablecerContrasena(correo)`. Mensaje **siempre igual** (exista o no la cuenta): "Si el correo está registrado, te llegará un enlace para cambiar tu contraseña".
4. **Soporte al bloquearse:** en el login, cuando `intentos.bloqueada`, mostrar el botón **Contactar a soporte** → `Linking.openURL(enlaceSoporte(correo))`. El equipo crea un correo de soporte (por ejemplo, una cuenta de Gmail del proyecto).
5. `perfil: true` en `flags.ts` al terminar.

**Lógica en `src/lib/perfil.ts`**

```ts
export function validarPerfil(p: { nombre: string; institucion: string; niveles: string[] }): string | null {
  if (!p.nombre.trim()) return 'Escribe tu nombre de referencia.';
  if (!p.institucion.trim()) return 'Escribe tu institución.';
  if (p.niveles.length === 0) return 'Elige al menos un nivel.';
  return null;
}

export const normalizarAreas = (texto: string) =>
  [...new Set(texto.split(',').map((a) => a.trim()).filter((a) => a.length > 0))];

export const enlaceSoporte = (correo: string) =>
  `mailto:${CORREO_SOPORTE}?subject=${encodeURIComponent('Cuenta bloqueada')}&body=${encodeURIComponent(`Mi correo es: ${correo}`)}`;
```

- `validarPerfil`: V(G) = **4**
- `normalizarAreas`, `enlaceSoporte`: V(G) = **1**

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-PER-1 a CB-PER-3 | Un campo faltante cada vez | Su error |
| CB-PER-4 | Todo válido | `null` |
| CB-PER-5 | `'Matemáticas, , Física,Matemáticas'` | `['Matemáticas', 'Física']` |
| CB-PER-6 | `enlaceSoporte('a b@x.mx')` | Contiene `a%20b%40x.mx` y `Cuenta%20bloqueada` |

**Pruebas de componente**

| ID | Caso | Esperado |
|---|---|---|
| CB-CTA-1 | Presionar **Eliminar cuenta** y elegir Cancelar (`jest.spyOn(Alert, 'alert')`) | No se llama a `deleteUser` |
| CB-CTA-2 | Elegir Eliminar y escribir la contraseña | Se llama a reautenticar y luego a eliminar |
| CB-REC-1 | Recuperar con correo inválido | Error, no se llama al servicio |
| CB-REC-2 | El servicio responde `auth/user-not-found` | Se muestra el mismo mensaje neutro |
| CB-LOG-10 | Tres fallos en el login | Aparece **Contactar a soporte** |

**Pruebas manuales**

- [ ] Llenar el perfil → cerrar sesión → iniciar sesión → los datos siguen (RF-01).
- [ ] Cambiar el nombre → los mensajes y lugares anteriores siguen con su contenido y su `autorId` (RF-02; revisar en Firestore).
- [ ] Recuperar contraseña con un correo real → llega el correo → cambiarla → entrar con la nueva (RF-07). Revisar también la carpeta de spam.
- [ ] Crear cuenta `prueba-borrar@...` → eliminarla → ya no puede iniciar sesión y su documento en `usuarios` no existe (RF-09).
- [ ] Bloquear la cuenta con 3 intentos → **Contactar a soporte** abre el correo con asunto y cuerpo.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `validarPerfil`, `normalizarAreas`, `enlaceSoporte`; actualizar la sección 6 (login) con CB-LOG-10
- [ ] `matriz-pruebas.md`: filas RF-01, RF-02, RF-06 (completa), RF-07, RF-08, RF-09
- [ ] `evidencias/RF-07_correo.png`, `evidencias/RF-09_confirmacion.png`
- [ ] `decisiones.md`: "Mensaje neutro al recuperar contraseña (no revela si existe la cuenta)" y "Al eliminar la cuenta, sus publicaciones se conservan"

---

#### T-16 · Notificación de mensajes nuevos (RF-24)

**Responsable:** Alexis · **Rama:** `alexis/notificaciones-chat` · **Tiempo:** 4 h
**Criterio del SRS:** *Recibir una notificación ante un mensaje nuevo con la aplicación en segundo plano.*

**Limitación importante:** desde Expo SDK 53, **Expo Go en Android no recibe notificaciones push remotas**. Con la app en segundo plano se necesita un *development build* (lo genera José en T-23) o el APK. Las notificaciones **locales** sí funcionan en Expo Go.

**Plan A (cumple el criterio completo)**

1. `npx expo install expo-notifications expo-device`
2. Al iniciar sesión: pedir permiso, obtener el token con `Notifications.getExpoPushTokenAsync({ projectId })` (el `projectId` lo crea `eas init` en T-23) y guardarlo en `usuarios/{uid}.pushToken`.
3. Al abrir una sala, agregarla a `usuarios/{uid}.salas` (`arrayUnion`).
4. Al enviar un mensaje: leer los usuarios con `where('salas', 'array-contains', sala)`, calcular `destinatarios(...)` y hacer `fetch('https://exp.host/--/api/v2/push/send', { method: 'POST', body: JSON.stringify(mensajes) })`.
5. Al tocar la notificación, abrir el chat en esa sala (`Notifications.addNotificationResponseReceivedListener`).

**Plan B (si el jueves en la noche el Plan A no funciona)**

- Notificación **local** (`scheduleNotificationAsync({ content, trigger: null })`) cuando llega un mensaje nuevo a una sala suscrita mientras la app está abierta en otra pestaña.
- Documentar RF-24 como **parcial** en la matriz y en la sección 11 del SRS, con el motivo.

**Lógica en `src/lib/notificaciones.ts`**

```ts
export function destinatarios(usuarios: { uid: string; pushToken?: string }[], autorId: string): string[] {
  const tokens = new Set<string>();
  for (const u of usuarios) {
    if (u.uid !== autorId && u.pushToken) tokens.add(u.pushToken);
  }
  return [...tokens];
}

export function mensajePush(token: string, m: { autorNombre: string; texto: string; sala: string }) {
  return { to: token, title: m.autorNombre, body: resumirTexto(m.texto, 100), data: { sala: m.sala } };
}
```

- `destinatarios`: V(G) = 1 + `for` + `if` + `&&` = **4**
- `mensajePush`: V(G) = **1**

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-NOT-1 | Lista vacía | `[]` |
| CB-NOT-2 | Incluye al autor con token | El autor no está en el resultado |
| CB-NOT-3 | Usuario sin token | Se omite |
| CB-NOT-4 | Dos usuarios con el mismo token | Un solo token |
| CB-NOT-5 | `mensajePush` con texto de 150 caracteres | `body` de 100 terminando en `…` y `data.sala` correcto |

**Pruebas manuales** (2 celulares con el development build o APK)

- [ ] B entra a una sala y luego sale al inicio del celular (app en segundo plano).
- [ ] A escribe en esa sala → a B le llega la notificación en menos de 10 s.
- [ ] B toca la notificación → se abre el chat en esa sala.
- [ ] A no recibe notificación de su propio mensaje.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `destinatarios` y `mensajePush`
- [ ] `matriz-pruebas.md`: fila RF-24 (cumplido o parcial)
- [ ] `evidencias/RF-24_notificacion.png`
- [ ] `decisiones.md`: Plan A o B y por qué; riesgo "los tokens son legibles por usuarios autenticados (aceptable en prototipo)"

---

### Viernes 27 de noviembre

---

#### T-17 · Alerta de medio alternativo (RF-40) y registrar paradas (RF-42)

**Responsable:** José · **Rama:** `jose/transporte-alternativo` · **Tiempo:** 4 h
**Criterios del SRS:**
- RF-40: *Consultar una zona sin transporte registrado y comprobar el despliegue de la alerta correspondiente.*
- RF-42: *Actualizar un horario y comprobar su publicación en la ficha de la parada.*

**Qué hacer**

1. `src/app/transporte.tsx` (reemplaza `EnConstruccion`): selector de zona **Yuriria · Uriangato · Moroleón · Mi ubicación** y lista de paradas de esa zona con su próxima salida.
2. Si la zona no tiene paradas, tarjeta naranja: **"Sin transporte público registrado en esta zona.** Opciones: taxi o mototaxi local, aventón con colegas o caminar. Pregunta en el chat de tu región."
3. Botón **+ Registrar parada** → `src/app/parada/nueva.tsx`: nombre, localidad, rutas, destino, duración, horarios como texto (`07:00, 07:30, 08:00`) y ubicación.
4. En la ficha de parada: **Actualizar horarios** para **cualquier** docente (RF-42 dice "la comunidad"). Guardar solo `horarios`, `duracionMin`, `actualizadoPor` y `actualizado` (las reglas del Anexo A solo permiten esos campos a quien no es autor).
5. Mostrar "Actualizado por Ana el 27/11".
6. `transporte: true` en `flags.ts` al terminar.
7. Para la demostración: registrar una comunidad **sin** paradas (por ejemplo, un rancho de Yuriria) y probar ahí "Mi ubicación".

**Lógica en `src/lib/transporte.ts`**

```ts
type Zona = { tipo: 'localidad'; localidad: string } | { tipo: 'ubicacion'; coord: Coordenada; radioKm: number };

export function paradasDeZona<T extends Coordenada & { localidad: string }>(paradas: T[], zona: Zona): T[] {
  if (zona.tipo === 'localidad') return paradas.filter((p) => p.localidad === zona.localidad);
  return filtrarPorDistancia(paradas, zona.coord, zona.radioKm);
}

export const necesitaMedioAlternativo = (paradasZona: unknown[]) => paradasZona.length === 0;

export function parsearHorarios(texto: string): { horarios: string[]; invalidos: string[] } {
  const validos = new Set<string>();
  const invalidos: string[] = [];
  for (const parte of texto.split(',')) {
    const t = parte.trim();
    if (!t) continue;
    const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(t);
    if (m) validos.add(`${m[1].padStart(2, '0')}:${m[2]}`);
    else invalidos.push(t);
  }
  return { horarios: [...validos].sort(), invalidos };
}
```

- `paradasDeZona`: V(G) = **2**
- `parsearHorarios`: V(G) = 1 + `for` + 2 `if` = **4**

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-COB-1 | Localidad con 2 paradas | 2 paradas |
| CB-COB-2 | Localidad sin paradas | `[]` → `necesitaMedioAlternativo` = `true` |
| CB-COB-3 | Ubicación con una parada a 0.9 km, radio 1 | 1 parada → `false` |
| CB-COB-4 | Ubicación con la parada más cercana a 3 km | `[]` → `true` |
| CB-HOR-1 | `''` | `{ horarios: [], invalidos: [] }` |
| CB-HOR-2 | `'07:00, 7:30'` | `['07:00', '07:30']` (normaliza) |
| CB-HOR-3 | `'25:00, 07:00'` | horarios `['07:00']`, inválidos `['25:00']` |
| CB-HOR-4 | `'08:00,07:00,08:00'` | `['07:00', '08:00']` (sin duplicados, ordenado) |
| CB-HOR-5 | `' , 07:00 , '` | `['07:00']` (ignora vacíos) |

**Pruebas manuales**

- [ ] Elegir una zona sin paradas → aparece la alerta naranja.
- [ ] Elegir Moroleón (con paradas) → no aparece.
- [ ] Usuario B (no autor) cambia los horarios de una parada de A → la ficha muestra los nuevos horarios y "Actualizado por B".
- [ ] Usuario B intenta cambiar el **nombre** de la parada de A (Rules Playground) → Denegado.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `paradasDeZona` y `parsearHorarios`
- [ ] `matriz-pruebas.md`: filas RF-40 y RF-42
- [ ] `evidencias/RF-40_sin_cobertura.png`, `evidencias/RF-42_horario_actualizado.png`
- [ ] `decisiones.md`: "Zona sin cobertura = sin paradas en la localidad o a menos de 1 km" y "Cualquier docente puede actualizar horarios"

---

#### T-18 · Moderación (RF-45) y roles (RF-43)

**Responsable:** Carlos · **Rama:** `carlos/moderacion-roles` · **Tiempo:** 4 h
**Criterios del SRS:**
- RF-45: *Ocultar un contenido reportado y comprobar que deja de ser visible para los usuarios.*
- RF-43: *Cambiar el rol de un usuario de prueba y comprobar los permisos resultantes.*

**Qué hacer**

1. `src/app/admin/index.tsx`: si `perfil.rol !== 'admin'`, mostrar "No tienes permiso" y nada más.
2. Pestaña **Reportes**: lista de `reportes` con `estado == 'pendiente'` (texto, motivo, quién reportó). Botones:
   - **Ocultar:** `actualizar(coleccion, contenidoId, { oculto: true })` + reporte `estado: 'resuelto'`.
   - **Descartar:** reporte `estado: 'descartado'`.
3. Pestaña **Usuarios**: lista de `usuarios` con su rol y un botón **Hacer admin / Quitar admin** (solo si `puedeCambiarRol`).
4. Aplicar `soloVisibles(...)` en **todas** las listas: chat, lugares, hospedaje, alertas, puntos y paradas.
5. En el menú **Más**, la opción **Administración** solo si `puedeModerar(perfil?.rol)`.
6. Hacer admin a Carlos desde la consola (`usuarios/<uid>.rol = "admin"`): es el primer administrador.

**Lógica en `src/lib/moderacion.ts`**

```ts
export const puedeModerar = (rol?: string) => rol === 'admin';

export const soloVisibles = <T extends { oculto?: boolean }>(lista: T[]) => lista.filter((x) => !x.oculto);

export function puedeCambiarRol(actor: { uid: string; rol: string }, objetivoUid: string): boolean {
  if (actor.rol !== 'admin') return false;
  return actor.uid !== objetivoUid;   // un admin no se quita el rol a sí mismo
}
```

- `puedeCambiarRol`: V(G) = **2**
- Las otras: V(G) = **1**

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-MOD-1 | `soloVisibles` con elementos sin campo `oculto` | Todos visibles |
| CB-MOD-2 | `oculto: false` | Visible |
| CB-MOD-3 | `oculto: true` | Oculto |
| CB-MOD-4 | `puedeModerar('docente')` y `puedeModerar(undefined)` | `false` |
| CB-ROL-1 | Actor docente | `false` |
| CB-ROL-2 | Actor admin sobre sí mismo | `false` |
| CB-ROL-3 | Actor admin sobre otro | `true` |

**Pruebas manuales** (3 cuentas: Carlos admin, A y B docentes)

- [ ] B reporta un mensaje de A → Carlos lo ve en Reportes → **Ocultar** → A y B ya no lo ven en el chat.
- [ ] Repetir con un lugar.
- [ ] Carlos hace admin a A → A ve **Administración** en el menú y puede ocultar.
- [ ] Carlos le quita el rol a A → la opción desaparece.
- [ ] B (docente) abre `/admin` escribiendo la ruta → "No tienes permiso".

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `soloVisibles`, `puedeModerar`, `puedeCambiarRol`
- [ ] `matriz-pruebas.md`: filas RF-43 y RF-45
- [ ] `evidencias/RF-45_antes_despues.png`, `evidencias/RF-43_rol.png`
- [ ] `decisiones.md`: "Ocultar en lugar de borrar: el contenido queda para revisión"

---

#### T-19 · Notificación de alertas cercanas (RF-33)

**Responsable:** Alexis · **Rama:** `alexis/alertas-cercanas` · **Tiempo:** 3.5 h
**Criterio del SRS:** *Simular cercanía a una zona con alerta y comprobar la notificación recibida.*

**Qué hacer**

1. En `src/app/(tabs)/_layout.tsx`: con permiso de ubicación, `Location.watchPositionAsync({ distanceInterval: 100 }, alMoverse)` mientras la app está abierta.
2. En cada posición: `alertasPorNotificar(alertas, ubicacion, 1, yaNotificadas)` → por cada una, notificación local: título "Alerta cercana", cuerpo "Baja seguridad · riesgo medio · a 600 m".
3. Guardar los ids notificados en un `Set` y en `AsyncStorage` con la fecha de hoy (no repetir la misma alerta el mismo día).
4. **Simulación para pruebas:** en Perfil, botón **Simular ubicación** visible solo con `__DEV__`, que manda las coordenadas de una alerta a `alMoverse`.
5. La notificación local funciona en Expo Go; no depende de T-23.

**Lógica en `src/lib/notificaciones.ts`**

```ts
export function alertasPorNotificar<T extends Coordenada & { id: string }>(
  alertas: T[], ubicacion: Coordenada, radioKm: number, yaNotificadas: Set<string>,
): T[] {
  return alertas.filter((a) => !yaNotificadas.has(a.id) && distanciaKm(ubicacion, a) <= radioKm);
}
```

V(G) de la función interna = **2**

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-CER-1 | Alerta a 0.5 km, no notificada, radio 1 | Se notifica |
| CB-CER-2 | Alerta a 0.5 km, ya notificada | No se notifica |
| CB-CER-3 | Alerta a 3 km | No se notifica |
| CB-CER-4 | Alerta exactamente a 1 km | Se notifica (límite) |

**Pruebas manuales**

- [ ] **Simular ubicación** sobre una alerta → llega la notificación.
- [ ] Simular de nuevo → no se repite.
- [ ] Simular lejos de toda alerta → nada.
- [ ] Si se puede, prueba real: caminar hacia la zona de una alerta de prueba creada cerca de casa.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: sección `alertasPorNotificar`
- [ ] `matriz-pruebas.md`: fila RF-33 (indicar "simulada con botón de desarrollo")
- [ ] `evidencias/RF-33_notificacion.png`
- [ ] `decisiones.md`: "Radio de 1 km; una notificación por alerta por día; solo con la app abierta"

---

#### T-20 · Pruebas cruzadas, ronda 1 (viernes en la tarde)

**Responsables:** los tres · **Tiempo:** 2 h

| Quién prueba | Módulos que prueba |
|---|---|
| José | Lo de Alexis: chat, salas, respuestas, reportes, lugares, notificaciones |
| Carlos | Lo de José: mapa, filtros, preferencias, fichas, servicios, paradas, transporte |
| Alexis | Lo de Carlos: registro, login, alertas, votos, hospedaje, perfil, moderación |

**Cómo se prueba**

1. Abrir `docs/matriz-pruebas.md` y tomar las filas de los módulos asignados.
2. Ejecutar **literalmente** el criterio del SRS de cada fila (no lo que uno cree que debería hacer).
3. Probar también lo "raro": campos vacíos, textos muy largos, sin internet (modo avión), sin permiso de ubicación, tocar dos veces seguidas el botón.
4. Por cada falla: issue con la [plantilla del Anexo C](#anexo-c-plantilla-de-reporte-de-bug), etiqueta `bug`, asignado al autor del módulo.
5. Llenar en la matriz: columnas **Probó**, **Fecha**, **Resultado** (✅ pasa / ❌ falla #issue).

**Qué documentar**

- [ ] Matriz con las columnas de la ronda 1 llenas
- [ ] Un issue por bug, con su severidad

---

### Sábado 28 de noviembre

---

#### T-21 · Corregir bugs de la ronda 1

**Responsables:** cada quien los suyos · **Tiempo:** según bugs

1. Orden: **Bloqueante → Alta → Media → Baja**.
2. Por cada bug: rama `nombre/fix-NN`, una prueba que **reproduzca el bug primero** (debe fallar), la corrección, la prueba ya pasa, PR con `Cierra #NN`.
3. Quien reportó el bug lo vuelve a probar y actualiza la matriz.

**Qué documentar**

- [ ] Cada bug corregido tiene su prueba automática (si era de lógica)
- [ ] Si un bug revela un camino nuevo, actualizar su tabla en `pruebas-caja-blanca.md`

---

#### T-22 · Carga de datos por lote (RF-44)

**Responsable:** Carlos · **Rama:** `carlos/carga-lote` · **Tiempo:** 3 h
**Criterio del SRS:** *Cargar un lote de servicios de prueba y comprobar su disponibilidad en la aplicación.*
Este script es el que se usa el 3 de diciembre para cargar todos los datos reales.

**Qué hacer**

1. `npm install --save-dev tsx`
2. Carpeta `datos/` con un JSON por colección (`servicios.json`, `paradas.json`, `hospedajes.json`, `lugares.json`, `puntos.json`). Cada elemento sin `autorId`; con `id` si es para actualizar uno existente.
3. `scripts/cargar-lote.ts`:
   - Inicia Firebase con las mismas variables `EXPO_PUBLIC_*`.
   - Inicia sesión con `ADMIN_EMAIL` y `ADMIN_PASSWORD` (en `.env.local`, nunca en el repo).
   - Lee el JSON, valida **todas** las filas con el validador de esa colección (`validarHospedaje`, `validarLugar`, etc.).
   - Si hay **un solo** error, no sube nada y muestra la lista: "Fila 4: El teléfono debe tener 10 dígitos".
   - Si todo es válido, sube con `writeBatch`: `set` (con `merge`) si la fila trae `id`, `add` si no. Agrega `autorId` del admin y `fecha`.
4. Uso: `npx tsx --env-file=.env.local scripts/cargar-lote.ts servicios datos/servicios.json`
5. Agregar a `package.json`: `"cargar": "tsx --env-file=.env.local scripts/cargar-lote.ts"`.

**Lógica en `src/lib/lote.ts`**

```ts
export function validarLote<T>(filas: T[], validar: (f: T) => string | null) {
  const validas: T[] = [];
  const errores: { fila: number; mensaje: string }[] = [];
  filas.forEach((f, i) => {
    const error = validar(f);
    if (error) errores.push({ fila: i + 1, mensaje: error });
    else validas.push(f);
  });
  return { validas, errores };
}

export const operacionDeFila = (f: { id?: string }) => (f.id ? 'actualizar' : 'crear');
```

- Interna de `validarLote`: V(G) = **2**
- `operacionDeFila`: V(G) = **2**

**Pruebas de caja blanca**

| ID | Entrada | Esperado |
|---|---|---|
| CB-LOT-1 | Lista vacía | Sin válidas ni errores |
| CB-LOT-2 | 3 filas válidas | 3 válidas, 0 errores |
| CB-LOT-3 | Fila 2 inválida | Error con `fila: 2` (numerado desde 1) |
| CB-LOT-4 | Fila con `id` | `'actualizar'` |
| CB-LOT-5 | Fila sin `id` | `'crear'` |

**Pruebas manuales**

- [ ] Lote de 10 servicios válidos → aparecen los 10 en la app.
- [ ] Lote con un teléfono malo → no se sube nada y se ve el error con su número de fila.
- [ ] Volver a cargar el mismo lote **con id** → siguen siendo 10, no 20.

**Qué documentar**

- [ ] `pruebas-caja-blanca.md`: secciones `validarLote` y `operacionDeFila`
- [ ] `matriz-pruebas.md`: fila RF-44
- [ ] `docs/GUIA-EQUIPO.md`: nueva sección "Cargar datos por lote" con el comando y el formato de cada JSON
- [ ] `decisiones.md`: "Carga todo o nada para no dejar datos a medias"

---

#### T-23 · APK de prueba ("build de humo")

**Responsable:** José · **Rama:** `jose/configurar-eas` · **Tiempo:** 2 h + espera de la compilación
**Por qué hoy:** si la compilación falla, hay una semana para arreglarlo y no el día antes del piloto.

**Qué hacer**

1. Crear cuenta en expo.dev.
2. ```bash
   npm install -g eas-cli
   eas login
   eas init                 # agrega extra.eas.projectId en app.json (sí se sube)
   eas build:configure      # crea eas.json
   ```
3. Convertir la configuración a `app.config.js` para leer la llave de mapas de una variable:

   ```js
   module.exports = ({ config }) => ({
     ...config,
     android: {
       ...config.android,
       package: 'com.docengo.app',
       config: { googleMaps: { apiKey: process.env.GOOGLE_MAPS_ANDROID_KEY } },
     },
   });
   ```

4. En `eas.json`:

   ```json
   {
     "build": {
       "development": { "developmentClient": true, "distribution": "internal", "environment": "development" },
       "preview": { "distribution": "internal", "android": { "buildType": "apk" }, "environment": "preview" }
     }
   }
   ```

5. **Variables en EAS** (`.env.local` no se sube a EAS porque está en `.gitignore`; sin esto el APK da el mismo error `auth/invalid-api-key`). En expo.dev → proyecto → **Environment variables**, crear las 6 `EXPO_PUBLIC_FIREBASE_*` y `GOOGLE_MAPS_ANDROID_KEY` para los entornos `preview` y `development`. También se puede con `eas env:create` desde la terminal.
6. `eas build --profile preview --platform android`. En el plan gratuito la cola puede tardar; mientras tanto sigan con bugs.
7. Descargar el APK desde el enlace, instalarlo (permitir "orígenes desconocidos") y probar: login, mapa con mapa base visible, chat.
8. `eas credentials` → copiar la huella **SHA-1** → en Google Cloud, restringir la llave a la app Android `com.docengo.app` con esa SHA-1.
9. Si Alexis va con el Plan A de T-16: `eas build --profile development --platform android` para el development build.

**Pruebas manuales**

- [ ] El APK se instala en Android 10 o superior (requisito 2.4 del SRS).
- [ ] El mapa base carga (si sale gris o se cierra: revisar la llave de Google Maps).
- [ ] Iniciar sesión funciona (si sale `invalid-api-key`: faltan las variables en EAS).

**Qué documentar**

- [ ] `docs/GUIA-EQUIPO.md`: nueva sección "Generar el APK" con estos pasos
- [ ] `decisiones.md`: "APK con EAS, perfil preview; variables en EAS, no en el repo"
- [ ] El plan gratuito de EAS tiene un límite mensual de compilaciones: no generen un APK por cada cambio

---

### Domingo 29 de noviembre

#### T-24 · Cerrar PRs abiertos (día ligero)

**Responsables:** los tres · **Tiempo:** 1–2 h

- [ ] Revisar todos los PR abiertos de la rotación y hacer merge de los que estén listos.
- [ ] Nadie empieza funciones nuevas.
- [ ] Alexis: `npm run test:cobertura` en `main` y revisar que `src/lib/` siga al 100 %.

---

### Lunes 30 de noviembre

#### T-25 · Congelamiento de funciones

**Responsables:** los tres · **Tiempo:** 3 h

**Qué hacer**

1. Último merge de funciones a las **14:00**. Después, solo correcciones.
2. PR "feat: activar módulos terminados": cambiar a `true` los flags de los módulos completos. Un módulo incompleto se queda en `__DEV__` y se documenta como fuera de alcance.
3. José, en `main`:
   ```bash
   git tag -a v0.3.0 -m "Congelamiento de funciones"
   git push origin v0.3.0
   ```
4. **Alexis:**
   - Revisar que **cada** función de `src/lib/` tenga su sección en `pruebas-caja-blanca.md` (comparar con `ls src/lib` y la lista de funciones exportadas).
   - Actualizar la tabla **Resumen de cobertura** con el reporte nuevo.
   - Llenar en el SRS la **sección 9 (Matriz de trazabilidad)**: RF → pantalla/archivo → pruebas automáticas → prueba manual → estado. Se copia de `matriz-pruebas.md`.
   - Llenar la **sección 10 (Estrategia de verificación)**: 10.1 métodos (caja blanca con camino básico y cobertura de ramas; pruebas de componente; pruebas manuales del criterio del SRS; pruebas cruzadas; integración; piloto) y 10.2 criterios del MVP (todos los RF Alta cumplidos, 100 % de ramas en `src/lib`, CI en verde, ≥ 80 % de satisfacción en el piloto).

#### T-26 · Preparar los datos reales

**Responsables:** José (servicios, paradas, puntos) · Carlos (hospedajes, alertas) · Alexis (lugares) · **Tiempo:** 2 h hoy + recolección hasta el jueves

**Mínimos (de los criterios del SRS)**

| Colección | Mínimo | Criterio |
|---|---|---|
| hospedajes | 3 por localidad (9) | RF-35 |
| lugares | 5 (al menos 1 por localidad) | RF-26 |
| servicios | Farmacia, papelería y supermercado en cada localidad (9+) | RF-16 |
| paradas | 2 por localidad con horarios, y 1 zona sin paradas | RF-39, RF-40 |
| puntos | Los 3 tipos en cada localidad | RF-11 |
| alertas | Una de cada nivel | RF-32 |

**Qué hacer**

1. Llenar los JSON de `datos/` con el formato de T-22. Coordenadas: en Google Maps, clic derecho sobre el lugar → copiar coordenadas.
2. Horarios en formato `9:00 a 21:00`; teléfonos de 10 dígitos.
3. **Carlos:** pedir permiso a cada arrendador antes de publicar su teléfono (WhatsApp o en persona) y guardar la captura del sí en una carpeta privada (no en el repo).

**Qué documentar**

- [ ] `decisiones.md`: fuentes de los datos (visitas, docentes conocidos, Google Maps)
- [ ] Lista privada de consentimientos de arrendadores

---

### Martes 1 de diciembre

#### T-27 · Pruebas de integración (flujos completos)

**Responsables:** los tres · **Tiempo:** día completo

Cada flujo lo ejecuta alguien que **no** programó esos módulos, en el celular y con 2 cuentas cuando haga falta.

| Flujo | Quién | Pasos | Resultado esperado | RF |
|---|---|---|---|---|
| F1 Cuenta | Alexis | Registrarse → cerrar sesión → 2 contraseñas malas → entrar bien → cerrar sesión | Contador se reinicia al entrar; al cerrar sesión pide login | 05, 06, 08 |
| F2 Mapa | Carlos | Abrir mapa → ver 3 categorías → filtro 5 km → ficha de un punto → crear punto → verlo en otro celular | Todo visible y en tiempo real | 10–15 |
| F3 Servicios | Carlos | Buscar farmacias → ordenar por cercanía → abrir la más cercana → ¿abierta? → Llamar | Solo farmacias, ordenadas; estado correcto | 16–19 |
| F4 Chat | José | Sala Moroleón · Escuela → duda → respuesta desde otro celular → reportar → admin oculta | Mensajes en tiempo real; el oculto desaparece | 20–22, 24, 25, 45 |
| F5 Alertas | José | Registrar alerta → verla en el mapa → otro la confirma → simular cercanía | Círculo con su color; estado "confirmada"; notificación | 30–34 |
| F6 Hospedaje | Alexis | Filtrar Uriangato ≤ $2,500 → abrir → WhatsApp → publicar uno nuevo | Filtros correctos; abre WhatsApp | 35–38 |
| F7 Transporte | Carlos | Paradas en el mapa → ficha → próxima salida → zona sin paradas → actualizar horario | Alerta de medio alternativo; horario nuevo visible | 39–42 |
| F8 Lugares | José | Filtrar por localidad → valorar → comentar → editar uno propio → eliminarlo | Promedio correcto; cambios persisten | 26–29 |
| F9 Perfil | Alexis | Editar perfil → preferencias del mapa → cerrar app → abrir → eliminar cuenta de prueba | Todo se conserva; cuenta eliminada | 01, 02, 04, 09 |
| F10 Admin | Alexis | Cambiar rol de una cuenta de prueba → cargar un lote de 5 servicios | Permisos cambian; servicios visibles | 43, 44 |
| F11 Sin internet | Carlos | Modo avión → abrir mapa, chat → escribir mensaje → quitar modo avión | La app no se cierra; mensaje de error comprensible; nada se pierde de lo capturado | RNF 2.4 |

**Por cada flujo:** marcar ✅/❌ en la matriz (columna "Integración"); cada ❌ es un issue. Los bugs se corrigen el mismo día o el miércoles.

---

### Miércoles 2 de diciembre

#### T-28 · Revisión de seguridad

**Responsables:** Carlos y Alexis · José corrige los bugs de T-27 · **Tiempo:** 4 h

| # | Revisión | Cómo | Esperado |
|---|---|---|---|
| S1 | Nadie se hace admin | Rules Playground: `create usuarios/X` con `rol: 'admin'` | Denegado |
| S2 | No se edita contenido ajeno | Rules Playground: `update puntos/ID` con otro uid | Denegado |
| S3 | No se lee `reportes` sin ser admin | `get reportes/ID` como docente | Denegado |
| S4 | Un voto por persona | `create alertas/A/votos/OTRO_UID` con mi uid | Denegado |
| S5 | Sin sesión no se lee nada | `get puntos/ID` sin autenticación | Denegado |
| S6 | Bloqueo a los 3 intentos | Login con 3 contraseñas malas | Bloqueo + soporte |
| S7 | Llaves fuera del repo | `git grep -n "AIza"` y `git log -p \| grep -c "AIza"` | 0 resultados |
| S8 | `.env.local` nunca se subió | `git log --all -- .env.local` | Vacío |
| S9 | Dependencias | `npm audit --omit=dev` | Anotar las altas y críticas y si afectan |
| S10 | Datos de terceros | Revisar que cada hospedaje tenga consentimiento | 100 % |
| S11 | Comunicación cifrada | Firebase usa HTTPS/TLS siempre | Documentar (RF del 3.4) |

**Carlos además** llena en el SRS:

- **Sección 11 (Fuera de alcance de la v1.0):** RF-03 (idioma), RF-23 (imágenes en el chat), acceso desde navegador, RF-24 si quedó parcial, y cualquier módulo que haya quedado en `__DEV__`.
- **Sección 12 (Riesgos, supuestos y asuntos abiertos):**
  - A-01 **AES-256 (RF-05):** Firebase Auth guarda las contraseñas con *scrypt*, que es un hash (más adecuado que un cifrado reversible). Proponer cambiar el requisito a "almacenamiento con hash seguro".
  - A-02 **Backend Node.js:** reemplazado por Firebase en el prototipo.
  - A-03 **Bloqueo de cuenta:** vive en la app; un bloqueo del servidor requeriría Cloud Functions (plan de pago Blaze).
  - R-01 Datos aportados por la comunidad pueden ser falsos → mitigado con votos y moderación.
  - R-02 Tokens de notificación legibles por usuarios autenticados (si se usó el Plan A).

**Qué documentar**

- [ ] Tabla S1–S11 con resultados en `docs/seguridad.md`
- [ ] `pruebas-caja-blanca.md`, **Hallazgos**: los que salgan
- [ ] SRS secciones 11 y 12

---

### Jueves 3 de diciembre

#### T-29 · Cargar los datos reales

**Responsables:** los tres · **Tiempo:** 3 h

1. Cada quien corre el script de T-22 con sus JSON: `npm run cargar -- servicios datos/servicios.json`.
2. Verificar en la app los mínimos de la tabla de T-26 (contar en pantalla, no solo en la consola).
3. Verificar RF-16: ningún servicio sin coordenadas (`sinCoordenadas` = `[]`).
4. Verificar RF-31: puntos de riesgo + alertas = círculos en el mapa.
5. Borrar los datos de prueba con nombres como "prueba", "asdf", etc.

#### T-30 · APK `v1.0.0`

**Responsable:** José · **Tiempo:** 1 h + espera

1. `version: "1.0.0"` en `app.json`.
2. `npm run revisar` en `main` → todo en verde.
3. ```bash
   git tag -a v1.0.0 -m "Versión para la prueba piloto"
   git push origin v1.0.0
   eas build --profile preview --platform android
   ```
4. Instalar en los 3 celulares del equipo + 1 celular de respaldo.
5. Guardar el enlace de descarga (o un código QR) para que los docentes del piloto lo instalen.

**José además:**

- SRS **sección 6.1 (Entidades):** una tabla por colección (`usuarios`, `puntos`, `servicios`, `mensajes`, `reportes`, `alertas` + `votos`, `hospedajes`, `lugares` + `valoraciones`, `paradas`) con sus campos y tipos. Copiar de `src/types/modelos.ts`.
- **DDA, tus puntos 6 a 10:** si dicen Node.js + MySQL, actualizar a Expo (React Native) + Firebase Authentication + Cloud Firestore, con el diagrama de componentes: app → `services/` → Firebase; `lib/` sin dependencias.

---

### Viernes 4 de diciembre

#### T-31 · Ensayo del piloto y encuesta

**Responsables:** los tres · **Tiempo:** 3 h

**Con 2 o 3 personas ajenas al equipo:**

1. Instalar el APK en su celular desde el enlace.
2. Que hagan solas las 6 tareas del piloto (abajo) mientras ustedes **solo observan** y anotan: ¿la completó?, tiempo, ¿pidió ayuda?, ¿dónde se confundió?
3. Corregir lo que salga. Si hay que recompilar: `v1.0.1`.

**Las 6 tareas del piloto**

1. Crea tu cuenta e inicia sesión.
2. Encuentra la farmacia más cercana y dime si está abierta.
3. Busca en el mapa una zona de riesgo y lee su alerta.
4. Encuentra un cuarto en Uriangato de máximo $2,500 y abre el contacto por WhatsApp.
5. ¿A qué hora sale el próximo transporte en Moroleón?
6. Publica una duda en el chat de tu región.

**Encuesta (Google Forms)**

Escala de 1 (totalmente en desacuerdo) a 5 (totalmente de acuerdo):

1. Fue fácil crear mi cuenta e iniciar sesión.
2. El mapa me ayudó a conocer la zona.
3. Encontré los servicios que necesitaría.
4. Las alertas de inseguridad me parecen útiles.
5. La información de hospedaje me ayudaría a encontrar dónde vivir.
6. La información de transporte me sería útil.
7. El chat me permitiría resolver dudas con otros docentes.
8. Recomendaría DocenGo a un docente reubicado.
9. En general, estoy satisfecho con DocenGo.

Preguntas abiertas: ¿Qué fue lo más útil? ¿Qué cambiarías o agregarías?
Al inicio: consentimiento ("Acepto participar; mis respuestas son anónimas y se usan solo para este proyecto escolar").

**Cálculo de la meta:** satisfacción = % de participantes con respuesta 4 o 5 en la pregunta 9. Meta: **≥ 80 %** (12 de 15).

**Checklist de logística**

- [ ] APK v1.0.x instalado y probado en el celular de respaldo
- [ ] Enlace o QR del APK impreso
- [ ] Datos reales cargados (T-29)
- [ ] Encuesta probada (llenarla una vez y borrar la respuesta)
- [ ] Hoja de observación impresa (una por participante: tarea · completó · tiempo · ayuda · notas)
- [ ] Celulares cargados, cargador portátil, datos móviles por si no hay Wi-Fi
- [ ] Carlos como admin, por si hay que moderar algo en vivo

---

### Sábado 5 de diciembre

#### T-32 · Prueba piloto

**Roles**

- **Carlos:** presenta DocenGo, explica el consentimiento y guía la sesión.
- **José:** soporte técnico (instalación, cuentas, fallas).
- **Alexis:** observa y llena las hojas de observación; aplica la encuesta.

**Agenda (≈ 60 min)**

| Minuto | Actividad |
|---|---|
| 0–10 | Presentación y consentimiento |
| 10–20 | Instalar el APK y crear cuenta (tarea 1) |
| 20–45 | Tareas 2 a 6, cada quien a su ritmo |
| 45–55 | Encuesta |
| 55–60 | Comentarios abiertos y agradecimiento |

**Evidencias a guardar:** respuestas de la encuesta (exportar a hoja de cálculo), hojas de observación, fotos de la sesión **solo con permiso**, bitácora de fallas (qué pasó, a quién, cómo se resolvió).

**Después del piloto (ese mismo fin de semana)**

- [ ] Alexis: calcular la satisfacción y el % de tareas completadas por tarea.
- [ ] Alexis: matriz final con la columna "Piloto".
- [ ] Carlos: SRS, **Control del documento** → versión 1.0 "Validada con la prueba piloto en la región Yuriria, Uriangato y Moroleón" con fecha 05/12/2026.
- [ ] Los tres: issues con lo que pidieron los docentes, etiqueta `trabajo-futuro`.
- [ ] José: etiqueta final si hubo correcciones (`v1.0.1`).

---

## Anexo A: reglas de Firestore finales

Reemplazan por completo a `firestore.rules`. Se suben en T-00 y Carlos las publica en la consola.

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function autenticado() {
      return request.auth != null;
    }
    function esAdmin() {
      return autenticado()
        && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'admin';
    }
    function esAutor() {
      return autenticado() && resource.data.autorId == request.auth.uid;
    }
    function creaASuNombre() {
      return autenticado() && request.resource.data.autorId == request.auth.uid;
    }
    function soloCambia(campos) {
      return request.resource.data.diff(resource.data).affectedKeys().hasOnly(campos);
    }

    // Perfiles: nadie puede darse el rol de admin a sí mismo (RF-43)
    match /usuarios/{uid} {
      allow read: if autenticado();
      allow create: if autenticado() && request.auth.uid == uid
                    && request.resource.data.rol == 'docente';
      allow update: if (autenticado() && request.auth.uid == uid
                        && request.resource.data.rol == resource.data.rol)
                    || esAdmin();
      allow delete: if (autenticado() && request.auth.uid == uid) || esAdmin();
    }

    // Reportes: cualquiera reporta; solo admin los lee y resuelve (RF-25, RF-45)
    match /reportes/{id} {
      allow create: if creaASuNombre();
      allow read, update, delete: if esAdmin();
    }

    // Paradas: la comunidad puede actualizar solo los horarios (RF-42)
    match /paradas/{id} {
      allow update: if autenticado()
        && soloCambia(['horarios', 'duracionMin', 'actualizadoPor', 'actualizado']);
    }

    // Votos de alertas: uno por usuario, el id es su uid (RF-34)
    match /alertas/{alertaId}/votos/{uid} {
      allow read: if autenticado();
      allow create, update: if autenticado() && request.auth.uid == uid
        && request.resource.data.voto in ['confirma', 'desmiente'];
      allow delete: if autenticado() && request.auth.uid == uid;
    }

    // Valoraciones de lugares: una por usuario, de 1 a 5 (RF-28)
    match /lugares/{lugarId}/valoraciones/{uid} {
      allow read: if autenticado();
      allow create, update: if autenticado() && request.auth.uid == uid
        && request.resource.data.estrellas is int
        && request.resource.data.estrellas >= 1
        && request.resource.data.estrellas <= 5;
      allow delete: if (autenticado() && request.auth.uid == uid) || esAdmin();
    }

    // Resto de colecciones: puntos, servicios, mensajes, alertas, hospedajes, lugares, paradas.
    // Se excluyen usuarios y reportes: tienen sus propias reglas arriba.
    match /{coleccion}/{id} {
      allow read: if autenticado() && coleccion != 'usuarios' && coleccion != 'reportes';
      allow create: if creaASuNombre() && coleccion != 'usuarios' && coleccion != 'reportes';
      allow update, delete: if (esAutor() || esAdmin())
                            && coleccion != 'usuarios' && coleccion != 'reportes';
    }
  }
}
```

---

## Anexo B: plantilla de la matriz de pruebas

Contenido inicial de `docs/matriz-pruebas.md` (lo crea Alexis en T-07). Columnas a llenar: **Probó**, **Fecha**, **Resultado**, **Integración**, **Piloto**, **Evidencia**.

```markdown
# Matriz de pruebas DocenGo

Resultado: ✅ pasa · ❌ falla (#issue) · ◐ parcial · — fuera de alcance

| RF | Prioridad | Criterio del SRS (resumen) | Pruebas automáticas | Tarea | Autor | Probó | Fecha | Resultado | Integración | Piloto | Evidencia |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RF-01 | Media | Perfil se conserva al cerrar sesión | CB-PER-1..5 | T-15 | Carlos | | | | F9 | | |
| RF-02 | Media | Contribuciones conservan contenido y autoría | — | T-15 | Carlos | | | | F9 | | |
| RF-03 | Baja | Idioma | — | — | — | | | — | — | — | Fuera de alcance |
| RF-04 | Media | Preferencias del mapa en la siguiente sesión | CB-MAP-1..4 | T-05 | José | | | | F9 | | |
| RF-05 | Alta | Registro con correo y contraseña | CB-VAL-1..6 | Base | Carlos | | | | F1 | T1 | |
| RF-06 | Alta | 3 intentos y bloqueo con soporte | CB-INT-1..6, CB-LOG-1..10 | Base, T-15 | Carlos | | | | F1 | | |
| RF-07 | Media | Restablecer contraseña | CB-REC-1..2 | T-15 | Carlos | | | | | | |
| RF-08 | Media | Cerrar sesión pide autenticación | — | Base | Carlos | | | | F1 | | |
| RF-09 | Media | Editar y eliminar cuenta con confirmación | CB-CTA-1..2 | T-15 | Carlos | | | | F9 | | |
| RF-10 | Alta | Mapa de la región piloto | — | Base | José | | | | F2 | T3 | |
| RF-11 | Alta | 3 categorías de puntos | — | Base | José | | | | F2 | | |
| RF-12 | Media | Ficha de detalle del punto | CB-CON-1..4, CB-FPT-1..3 | T-01 | José | | | | F2 | | |
| RF-13 | Media | Registrar punto visible para otros | CB-PTO-1..10 | T-02 | José | | | | F2 | | |
| RF-14 | Media | Filtro por categoría y distancia | CB-MAP-5..10 | T-05 | José | | | | F2 | | |
| RF-15 | Media | Ubicación con y sin permiso | — | Base | José | | | | F2 | | |
| RF-16 | Alta | 100 % de servicios geolocalizados | CB-GEO2-1..3 | T-08 | José | | | | F3 | T2 | |
| RF-17 | Alta | Buscar por tipo y distancia | CB-GEO-3..5 | Base | José | | | | F3 | T2 | |
| RF-18 | Media | Ficha de servicio | CB-SRV-1..10 | T-08 | José | | | | F3 | T2 | |
| RF-19 | Media | Ordenar por cercanía | CB-GEO-6..7 | Base | José | | | | F3 | T2 | |
| RF-20 | Alta | Mensajes en tiempo real en 2 dispositivos | — | Base | Alexis | | | | F4 | T6 | |
| RF-21 | Media | Conversaciones por región y tema | CB-SAL-1..3 | T-04 | Alexis | | | | F4 | T6 | |
| RF-22 | Alta | Publicar dudas y responder | CB-RES-1..2 | T-07 | Alexis | | | | F4 | T6 | |
| RF-23 | Baja | Imágenes en mensajes | — | — | — | | | — | — | — | Fuera de alcance |
| RF-24 | Media | Notificación de mensajes en segundo plano | CB-NOT-1..5 | T-16 | Alexis | | | | F4 | | |
| RF-25 | Media | Reportar mensajes | CB-REP-1..4 | T-07 | Alexis | | | | F4 | | |
| RF-26 | Alta | Publicar 5 lugares | CB-LUG-1..6 | T-10 | Alexis | | | | F8 | | |
| RF-27 | Alta | Filtrar lugares por región y categoría | CB-FLU-1..4 | T-13 | Alexis | | | | F8 | | |
| RF-28 | Media | Valorar y comentar | CB-VLR-1..9 | T-13 | Alexis | | | | F8 | | |
| RF-29 | Media | Editar y eliminar propias | CB-PRM-1..4 | T-13 | Alexis | | | | F8 | | |
| RF-30 | Alta | Registrar alerta en una zona | CB-ALE-1..6 | T-03 | Carlos | | | | F5 | | |
| RF-31 | Alta | 100 % de zonas de riesgo con alerta | CB-ZON-1..4 | T-11 | José | | | | F5 | T3 | |
| RF-32 | Media | Clasificación alto/medio/bajo | CB-ZON-5 | T-03, T-11 | Carlos, José | | | | F5 | T3 | |
| RF-33 | Media | Notificación de alertas cercanas | CB-CER-1..4 | T-19 | Alexis | | | | F5 | | |
| RF-34 | Media | Confirmar o desmentir | CB-VOT-1..6 | T-06 | Carlos | | | | F5 | | |
| RF-35 | Alta | 3 hospedajes por localidad con contacto | CB-HOS-1..8 | T-09, T-12 | Carlos | | | | F6 | T4 | |
| RF-36 | Media | Publicar hospedaje | CB-HPV-1..9 | T-12 | Carlos | | | | F6 | | |
| RF-37 | Media | Filtrar por localidad, tipo y precio | CB-HOS-1..8 | T-09 | Carlos | | | | F6 | T4 | |
| RF-38 | Media | Contactar al arrendador | CB-CTO-1..2 | T-12 | Carlos | | | | F6 | T4 | |
| RF-39 | Alta | Paradas geolocalizadas en el mapa | — | T-14 | José | | | | F7 | T5 | |
| RF-40 | Alta | Alerta de medio alternativo | CB-COB-1..4 | T-17 | José | | | | F7 | | |
| RF-41 | Media | Horario de paso y llegada | CB-TRA-1..8 | T-14 | José | | | | F7 | T5 | |
| RF-42 | Media | Comunidad actualiza horarios | CB-HOR-1..5 | T-17 | José | | | | F7 | | |
| RF-43 | Media | Gestionar roles | CB-ROL-1..3 | T-18 | Carlos | | | | F10 | | |
| RF-44 | Media | Carga por lote | CB-LOT-1..5 | T-22 | Carlos | | | | F10 | | |
| RF-45 | Media | Ocultar contenido reportado | CB-MOD-1..4 | T-18 | Carlos | | | | F4 | | |
```

La columna **Piloto** indica qué tarea del piloto (T1 a T6 de T-31) cubre ese requisito.

---

## Anexo C: plantilla de reporte de bug

Crear en GitHub: **Settings → General → Features → Issues → Set up templates → Bug report**, o el archivo `.github/ISSUE_TEMPLATE/bug.md`:

```markdown
---
name: Bug
about: Reportar una falla encontrada en pruebas
labels: bug
---

**Requisito:** RF-
**Severidad:** Bloqueante / Alta / Media / Baja
**Dispositivo:** (modelo, Android X, Expo Go o APK vX.Y.Z)

**Pasos para reproducir**
1.
2.
3.

**Resultado esperado** (según el criterio del SRS)

**Resultado obtenido**

**Evidencia** (captura o video)
```

**Severidad**

| Nivel | Significado | Plazo |
|---|---|---|
| Bloqueante | La app se cierra o no deja seguir un flujo principal | El mismo día |
| Alta | Un RF de prioridad Alta no cumple su criterio | 24 h |
| Media | Un RF Media falla o hay un dato incorrecto | Antes del congelamiento o del 2 dic |
| Baja | Estético o de texto | Si hay tiempo |

---

## Anexo D: prefijos de IDs de prueba

| Prefijo | Archivo de `src/lib/` | Tarea |
|---|---|---|
| CB-VAL, CB-INT, CB-ERR, CB-GEO, CB-FLG, CB-LOG | Base (ya existen) | — |
| CB-PRM | `permisos.ts` | T-00 |
| CB-CON, CB-FPT | `contacto.ts`, pantalla de punto | T-01 |
| CB-PTO | `puntos.ts` | T-02 |
| CB-ALE, CB-VOT, CB-ZON | `alertas.ts` | T-03, T-06, T-11 |
| CB-SAL, CB-REP, CB-RES | `chat.ts` | T-04, T-07 |
| CB-MAP | `mapa.ts` | T-05 |
| CB-SRV, CB-GEO2 | `servicios.ts` | T-08 |
| CB-HOS, CB-CTO, CB-HPV | `hospedaje.ts` | T-09, T-12 |
| CB-LUG, CB-FLU, CB-VLR | `lugares.ts` | T-10, T-13 |
| CB-TRA, CB-COB, CB-HOR | `transporte.ts` | T-14, T-17 |
| CB-PER, CB-CTA, CB-REC | `perfil.ts`, pantallas de cuenta | T-15 |
| CB-NOT, CB-CER | `notificaciones.ts` | T-16, T-19 |
| CB-MOD, CB-ROL | `moderacion.ts` | T-18 |
| CB-LOT | `lote.ts` | T-22 |

Para correr solo las pruebas de un módulo: `npx jest -t CB-HOS`.
