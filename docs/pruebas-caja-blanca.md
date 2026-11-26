# Pruebas de caja blanca — DocenGo

Cada función con lógica tiene sus caminos independientes calculados con la
complejidad ciclomática **V(G) = decisiones + 1**. Cada camino tiene al menos
una prueba automática (Jest) con un identificador `CB-XXX-n`.

- Las pruebas viven en `__tests__/`.
- La lógica de `src/lib/` debe tener **100 % de ramas cubiertas** (`npm run test:cobertura`).
- ESLint rechaza funciones con V(G) mayor que 10.
- Cada Pull Request que agregue lógica agrega aquí su sección.

---

## 1. Validación del registro (RF-05) — `src/lib/validacion.ts`

**`validarRegistro(nombre, correo, contrasena)`** — 3 decisiones → **V(G) = 4**

| Caso | Camino | Resultado esperado |
|---|---|---|
| CB-VAL-1 | Nombre vacío | "Escribe tu nombre." |
| CB-VAL-2 | Correo inválido | "Escribe un correo válido." |
| CB-VAL-3 | Contraseña de menos de 8 caracteres | "La contraseña debe tener al menos 8 caracteres." |
| CB-VAL-4 | Todo correcto | `null` |

**`correoValido(correo)`** — se prueban ambos resultados de la expresión regular.

| Caso | Entrada | Resultado |
|---|---|---|
| CB-VAL-5 | Correo correcto con espacios alrededor | `true` |
| CB-VAL-6 | Sin dominio, o con espacio en medio | `false` |

## 2. Contador de intentos (RF-06) — `src/lib/intentos.ts`

| Caso | Función | Qué se comprueba |
|---|---|---|
| CB-INT-1 | `registrarFallo` | 1.º y 2.º fallo no bloquean (`fallidos >= 3` falso) |
| CB-INT-2 | `registrarFallo` | El 3.er fallo bloquea (`fallidos >= 3` verdadero) |
| CB-INT-3 | `registrarFallo` | No modifica el estado original |
| CB-INT-4 | `intentosRestantes` | Quedan intentos (gana `3 - fallidos`) |
| CB-INT-5 | `intentosRestantes` | Nunca negativo (gana `0` en `Math.max`) |
| CB-INT-6 | `registrarExito` | Reinicia el contador |

## 3. Mensajes de error (RNF de usabilidad) — `src/lib/errores.ts`

**`mensajeDeError(codigo)`** — 2 decisiones (`codigo &&`, `||`) → **V(G) = 3**

| Caso | Entrada | Resultado |
|---|---|---|
| CB-ERR-1 | Código conocido | Su mensaje en español |
| CB-ERR-2 | Código desconocido | "Ocurrió un error. Intenta de nuevo." |
| CB-ERR-3 | Sin código | "Ocurrió un error. Intenta de nuevo." |

## 4. Distancias (RF-14, RF-17, RF-19) — `src/lib/geo.ts`

| Caso | Función | Qué se comprueba |
|---|---|---|
| CB-GEO-1 | `distanciaKm` (V(G) = 1) | Mismo punto da 0 |
| CB-GEO-2 | `distanciaKm` | Yuriria–Moroleón entre 8 y 14 km, y es simétrica |
| CB-GEO-3 | `filtrarPorDistancia` | Lista vacía: el ciclo no se ejecuta |
| CB-GEO-4 | `filtrarPorDistancia` | Un elemento dentro y otro fuera |
| CB-GEO-5 | `filtrarPorDistancia` | Valor límite: exactamente a `maxKm` sí entra |
| CB-GEO-6 | `ordenarPorCercania` | Ordena del más cercano al más lejano |
| CB-GEO-7 | `ordenarPorCercania` | No modifica el arreglo original |
| CB-GEO-8 | `formatearDistancia` (V(G) = 2) | Menos de 1 km → metros |
| CB-GEO-9 | `formatearDistancia` | 1 km o más → km |
| CB-GEO-10 | `formatearDistancia` | Valor límite: exactamente 1 km |

## 5. Banderas de función — `src/lib/flags.ts`

**`opcionesVisibles(opciones, flags)`** — 1 decisión compuesta (`!o.flag || flags[o.flag]`) → **V(G) = 2**,
con cobertura de condiciones múltiples = 3 casos.

| Caso | Entrada | Resultado |
|---|---|---|
| CB-FLG-1 | Opción sin flag | Se muestra |
| CB-FLG-2 | Opción con flag encendida | Se muestra |
| CB-FLG-3 | Opción con flag apagada | Se oculta |

## 6. Pantalla de inicio de sesión (RF-06) — `src/app/(auth)/login.tsx`

**`entrar()`** — **V(G) = 7** (pruebas en `__tests__/pantallas/login.test.tsx`)

| Caso | Camino |
|---|---|
| CB-LOG-1 | Cuenta bloqueada: un cuarto intento no llega a Firebase |
| CB-LOG-2 | Correo vacío: no llama a Firebase |
| CB-LOG-3 | Correo lleno y contraseña vacía: no llama a Firebase |
| CB-LOG-4 | Credenciales correctas: inicia sesión sin errores |
| CB-LOG-5 | Fallo: avisa los intentos restantes |
| CB-LOG-6 | Tercer fallo: bloquea la cuenta |
| CB-LOG-7 | Un inicio exitoso reinicia el contador |
| CB-LOG-8 | Error sin código: mensaje genérico |
| CB-LOG-9 | Mientras Firebase responde: indicador en lugar de "Entrar" |

## 7. Alertas (RF-30) — `src/lib/alertas.ts`

**`validarAlerta(borrador)`** — 5 decisiones → **V(G) = 6**

```
if (!tipo)                → 1
if (!nivel)               → 2
if (!localidad)           → 3
if (texto.length < 10)    → 4
if (texto.length > 280)   → 5
                    V(G) = 5 + 1 = 6
```

| Caso | Camino | Resultado esperado |
|---|---|---|
| CB-ALE-1 | Sin tipo | "Elige el tipo de alerta." |
| CB-ALE-2 | Sin nivel | "Elige el nivel de riesgo." |
| CB-ALE-3 | Sin localidad | "Elige la localidad." |
| CB-ALE-4 | Descripción de menos de 10 caracteres (los espacios no cuentan) | "Describe lo que pasó (mínimo 10 caracteres)." |
| CB-ALE-5 | Descripción de 281 caracteres | "La descripción no puede pasar de 280 caracteres." |
| CB-ALE-6 | Todo correcto, incluido el límite exacto de 280 | `null` |

**`armarAlerta(datos, coordenada, autorId, fecha)`** — sin decisiones → **V(G) = 1**

| Caso | Qué se comprueba |
|---|---|
| CB-ALE-7 | El documento lleva `autorId`, contadores en 0 y la descripción sin espacios sobrantes |

**Prueba manual (criterio del SRS):** registrar una alerta de cada nivel (alto, medio y bajo)
con una cuenta y verlas desde otra cuenta.

## 8. Confirmar y desmentir alertas (RF-34) — `src/lib/votos.ts`

Cada voto se guarda en `alertas/{alertaId}/votos/{uid}`. Como el id del documento es el uid,
cada docente tiene **un solo voto por alerta**: cambiar de opinión lo reemplaza y no lo duplica.
Las reglas de Firestore impiden que el autor vote su propia alerta y que alguien vote a nombre de otro.

**`contarVotos(votos)`** — 2 decisiones (`for`, `if`) → **V(G) = 3**

| Caso | Camino | Resultado esperado |
|---|---|---|
| CB-VOT-1 | Lista vacía: el ciclo no se ejecuta | 0 confirmaciones, 0 desmentidos |
| CB-VOT-2 | Votos mezclados: entra a ambos lados del `if` | 2 confirmaciones, 1 desmentido |

**`estadoAlerta(conteo)`** — 2 decisiones → **V(G) = 3**

| Caso | Camino | Resultado esperado |
|---|---|---|
| CB-VOT-3 | Nadie ha votado | Sin verificar |
| CB-VOT-4 | Más confirmaciones que desmentidos | Confirmada |
| CB-VOT-5 | Empate o más desmentidos | En duda |

**`puedeVotar(autorId, uid)`** — 1 decisión compuesta (`&&`) → **V(G) = 2**; condiciones múltiples = 3 casos

| Caso | Entrada | Resultado |
|---|---|---|
| CB-VOT-6 | Sin sesión / el autor / otro docente | `false` / `false` / `true` |

**`siguienteVoto(actual, elegido)`** — 1 decisión → **V(G) = 2**

| Caso | Entrada | Resultado |
|---|---|---|
| CB-VOT-7 | Mismo voto que ya tenía / el otro voto / sin voto previo | Se quita / se cambia / se guarda |

**Prueba manual (criterio del SRS):** con 3 cuentas, A crea una alerta, B confirma y C desmiente.
Después B cambia su voto: el conteo cambia sin que se dupliquen los votos. A no ve los botones en su alerta.

---

## 9. Salas del chat — `src/lib/salas.ts` (T-04, RF-21)

**Responsable:** Alexis Rodríguez Martínez
**Pruebas:** `__tests__/lib/salas.test.ts`

Una sala del chat comunitario es la combinación de una región piloto
(`Yuriria`, `Uriangato`, `Moroleón`) y un tema (`General`, `Escuela`,
`Ambiente laboral`, `Servicios básicos`, `Institucional`). Los mensajes se guardan
en la colección `mensajes` con el campo `sala = idSala(region, tema)`, y la pantalla
filtra con un solo `where('sala', '==', …)`, por lo que no requiere índice compuesto.

### Funciones

| Función | Decisiones | V(G) | Caminos independientes |
|---|---|---|---|
| `normalizar(texto)` (interna) | 0 | 1 | 1: quita acentos, pasa a minúsculas, recorta y cambia espacios por `-` |
| `idSala(region, tema)` | 0 | 1 | 1: `normalizar(region) + "__" + normalizar(tema)` |
| `tituloSala(region, tema)` | 0 | 1 | 1: `` `${region} · ${tema}` `` |

Ninguna función tiene `if`, `? :`, `&&` ni `||`; el único camino de cada una se cubre
con un caso. Se agregan casos extra para comprobar la propiedad que exige RF-21:
el mismo tema en regiones distintas debe ser una sala distinta.

### Casos de prueba

| ID | Función | Entrada | Resultado esperado | Camino |
|---|---|---|---|---|
| CB-SAL-1 | `idSala` (y `normalizar`) | `('Moroleón', 'Servicios básicos')` | `"moroleon__servicios-basicos"` | Único camino; acentos, mayúsculas y espacios normalizados |
| CB-SAL-2 | `idSala` | `('Uriangato', 'Escuela')` y `('Yuriria', 'Escuela')` | `"uriangato__escuela"`, distinto de `"yuriria__escuela"` | Único camino; aislamiento de salas por región |
| CB-SAL-3 | `tituloSala` | `('Moroleón', 'Escuela')` | `"Moroleón · Escuela"` | Único camino |

### Prueba manual (criterio del SRS, RF-21)

Con dos cuentas (A y B): A escribe en **Uriangato · Escuela**; B lo ve en
**Uriangato · Escuela** y **no** lo ve en **Yuriria · Escuela**.

### Hallazgos

Ninguno. Nota: los mensajes creados antes de T-04 tienen `sala` igual al nombre del
tema (p. ej. `"Escuela"`) y ya no aparecen en ninguna sala.

---

## 10. Respuestas del chat — `src/lib/respuestas.ts` (T-07, RF-22)

**Responsable:** Alexis Rodríguez Martínez
**Pruebas:** `__tests__/lib/respuestas.test.ts`

Al mantener presionado un mensaje y elegir **Responder**, el mensaje nuevo guarda en
`respuestaA` una copia breve (cita) del original: `{ id, autorNombre, texto }`. Así la
burbuja muestra la cita sin otra lectura a Firestore y la conserva aunque el original
se borre. El campo solo se agrega cuando se está respondiendo, porque Firestore
rechaza los campos `undefined`.

### Funciones

| Función | Decisiones | V(G) | Caminos independientes |
|---|---|---|---|
| `citaDe(mensaje)` | 1 (`texto.length > MAX_CITA`) | 2 | 1: texto de hasta 80 caracteres, se copia completo · 2: texto de más de 80 caracteres, se recorta y termina en `…` |

### Casos de prueba

| ID | Función | Entrada | Resultado esperado | Camino |
|---|---|---|---|---|
| CB-RES-1 | `citaDe` | `{ id: 'm1', autorNombre: 'Ana', texto: '  ¿Hay internet en la escuela?  ' }` | `{ id: 'm1', autorNombre: 'Ana', texto: '¿Hay internet en la escuela?' }` | 1 (condición falsa) |
| CB-RES-2 | `citaDe` | texto de 100 caracteres `a` | texto de 80 `a` + `…`; `id` y `autorNombre` sin cambios | 2 (condición verdadera) |

### Prueba manual (criterio del SRS, RF-22)

Con dos cuentas (A y B) en la misma sala: A publica una duda; B la mantiene presionada,
elige **Responder** y escribe la respuesta. Ambas cuentas ven la respuesta con la cita
de la duda de A. Al cambiar de sala con una respuesta en curso, la franja
"Respondiendo a…" desaparece.

### Hallazgos

Ninguno.

---

## 11. Reportes del chat — `src/lib/reportes.ts` (T-07, RF-25)

**Responsable:** Alexis Rodríguez Martínez
**Pruebas:** `__tests__/lib/reportes.test.ts`

Al mantener presionado un mensaje **ajeno** y elegir **Reportar**, se abre el formulario
`src/components/ReportarMensaje.tsx` con el motivo (uno de `MOTIVOS`: Spam, Ofensivo o
acoso, Información falsa, Datos personales, Otro) y un detalle opcional de máximo 300
caracteres. El reporte se guarda en la colección `reportes` con estado `pendiente`
(entidad *ReporteContenido* del SRS 6.1).

**Un reporte por persona por mensaje:** el id del documento es
`idReporte(idMensaje, uid)` = `"<idMensaje>_<uid>"`. La app revisa primero si ya existe
(muestra "Ya reportaste este mensaje"), y además `firestore.rules` exige ese id al crear
y no permite que quien reporta lo actualice. Por lo tanto, un segundo reporte nunca crea
otro documento ni sobrescribe el primero (RNF-03).

### Funciones

| Función | Decisiones | V(G) | Caminos independientes |
|---|---|---|---|
| `idReporte(mensajeId, uid)` | 0 | 1 | 1: `` `${mensajeId}_${uid}` `` |
| `validarReporte(motivo, detalle)` | 2 (`!MOTIVOS.includes(motivo)`, `detalle.trim().length > MAX_DETALLE`) | 3 | 1: motivo fuera de la lista → `"Elige un motivo."` · 2: motivo válido y detalle largo → mensaje de máximo 300 · 3: motivo válido y detalle correcto → `null` |

### Casos de prueba

| ID | Función | Entrada | Resultado esperado | Camino |
|---|---|---|---|---|
| CB-REP-1 | `validarReporte` | `('', '')` y `('Me cae mal', '')` | `"Elige un motivo."` | 1 |
| CB-REP-2 | `validarReporte` | `('Spam', 301 caracteres)` | `"El detalle debe tener máximo 300 caracteres."` | 2 |
| CB-REP-3 | `validarReporte` | `('Otro', '')` y `('Información falsa', 300 caracteres)` | `null` (detalle opcional; valor límite aceptado) | 3 |
| CB-REP-4 | `idReporte` | `('msg1', 'uidA')` dos veces y `('msg1', 'uidB')` | `"msg1_uidA"`, igual en ambas llamadas y distinto del de `uidB` | Único camino; un id por persona y mensaje |

### Reglas de Firestore (`firestore.rules`, bloque `reportes`)

| Operación | Quién | Condición |
|---|---|---|
| `get` | quien reportó o admin | `resource == null` (para saber si ya reportó) o `autorId == uid` |
| `list` | solo admin | — |
| `create` | cualquier docente | `autorId == uid`, id = `contenidoId + '_' + uid`, `estado == 'pendiente'`, `motivo` en la lista, `detalle.size() <= 300` |
| `update`, `delete` | solo admin | moderación (RF-45) |

La regla genérica `/{coleccion}/{id}` excluye `reportes` (`coleccion != 'reportes'`),
porque Firestore combina las reglas con OR y, sin la exclusión, cualquier docente podría
leer todos los reportes.

### Prueba manual (criterio del SRS, RF-25)

1. B mantiene presionado un mensaje de A, elige **Reportar**, escoge un motivo y envía.
   En Firebase Console aparece `reportes/<idMensaje>_<uidB>` con `estado: "pendiente"`.
2. B reporta el mismo mensaje otra vez: la app muestra "Ya reportaste este mensaje" y en
   `reportes` sigue habiendo **un solo** documento.
3. En un mensaje propio no aparece la opción **Reportar**.
4. Sin conexión, el envío muestra el error y conserva motivo y detalle para reintentar (RNF-20).

### Hallazgos

- El camino 2 de `validarReporte` no se alcanza desde la pantalla, porque el `TextInput`
  tiene `maxLength={300}`. Se conserva como validación de respaldo (RNF-04), y la regla
  de Firestore repite el límite del lado del servidor.
- La regla `get` con `resource == null` permite a un docente saber si **no** existe un
  reporte con un id dado. Para eso tendría que conocer el uid de otra persona; el riesgo
  se considera aceptable.
- La lista de motivos está repetida en `src/lib/reportes.ts` y en `firestore.rules`. Si
  cambia una, hay que cambiar la otra.
