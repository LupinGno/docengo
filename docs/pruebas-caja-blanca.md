# Pruebas de caja blanca — DocenGo

Cada función nueva de `src/lib/` se documenta aquí con su complejidad ciclomática
V(G) = decisiones + 1, sus caminos independientes y los casos de prueba que los cubren.
Los casos se identifican como `CB-XXX-n` y viven en `__tests__/lib/`.

> Pendiente: las secciones de `intentos.ts` (CB-INT) y `flags.ts` (CB-FLG), que ya
> citan este documento desde sus pruebas, deben agregarlas sus autores.

---

## Salas del chat — `src/lib/salas.ts` (T-04, RF-21)

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

## Respuestas del chat — `src/lib/respuestas.ts` (T-07, RF-22)

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

## Reportes del chat — `src/lib/reportes.ts` (T-07, RF-25)

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

---

## Lugares destacados — `src/lib/lugares.ts` (T-10, RF-26)

**Responsable:** Alexis Rodríguez Martínez
**Pruebas:** `__tests__/lib/lugares.test.ts`

Desde **Más → Lugares destacados** (`src/app/lugares/index.tsx`) se ve en tiempo real la
lista de lugares que recomienda la comunidad, del más reciente al más antiguo. El botón
**Publicar lugar** abre `src/app/lugares/nuevo.tsx`, que pide:

- **Nombre** (máximo 60 caracteres).
- **Categoría**, una de `CATEGORIAS_LUGAR`: Comida, Cafetería, Parque o recreación,
  Cultura, Compras, Otro.
- **Localidad**, una de `REGIONES` (`src/lib/salas.ts`): Yuriria, Uriangato, Moroleón.
- **Descripción** (máximo 300 caracteres).
- **Ubicación**: se toca el minimapa para colocar el pin, o se usa el botón
  "Usar mi ubicación" (`src/components/SelectorUbicacion.tsx`). Sin permiso de ubicación
  se puede seguir tocando el mapa (RF-15).

El lugar se guarda en la colección `lugares` con `autorId`, `autorNombre` y `fecha`.
Desde T-13, el formulario vive en `src/components/FormularioLugar.tsx` (lo comparten
Publicar y Editar) y `lugares` tiene su propio bloque en `firestore.rules`.

### Funciones

| Función | Decisiones | V(G) | Caminos independientes |
|---|---|---|---|
| `validarLugar(borrador)` | 5 (`!nombre.trim()`, `!CATEGORIAS_LUGAR.includes(categoria)`, `!REGIONES.includes(localidad)`, `!descripcion.trim()`, `!ubicacion`) | 6 | 1: nombre vacío · 2: categoría inválida · 3: localidad inválida · 4: descripción vacía · 5: sin ubicación · 6: todo correcto → `null` |

### Casos de prueba

Cada caso parte de un borrador válido y cambia solo el campo que prueba.

| ID | Entrada | Resultado esperado | Camino |
|---|---|---|---|
| CB-LUG-1 | `nombre: ''` y `nombre: '   '` | `"Escribe el nombre del lugar."` | 1 |
| CB-LUG-2 | `categoria: ''` y `categoria: 'Antro'` | `"Elige una categoría."` | 2 |
| CB-LUG-3 | `localidad: ''` y `localidad: 'Celaya'` | `"Elige una localidad."` | 3 |
| CB-LUG-4 | `descripcion: ''` y `descripcion: '  \n '` | `"Escribe una descripción."` | 4 |
| CB-LUG-5 | `ubicacion: null` | `"Marca la ubicación en el mapa."` | 5 |
| CB-LUG-6 | Borrador válido, y con `categoria: 'Otro'`, `localidad: 'Yuriria'` | `null` | 6 |

### Prueba manual (criterio del SRS, RF-26)

1. A publica al menos 5 lugares (uno o más por localidad, con categorías distintas).
   Uno con el minimapa y otro con "Usar mi ubicación".
2. B, con otra cuenta, abre **Lugares destacados** y ve los 5 lugares sin recargar.
   En Firebase Console cada documento de `lugares` tiene `latitud`, `longitud`,
   `autorId` y `autorNombre`.
3. Si A intenta publicar sin llenar un campo, aparece el mensaje de ese campo y no se guarda nada.
4. Sin conexión, publicar muestra el error y conserva los datos para reintentar (RNF-20).
5. Negando el permiso de ubicación, "Usar mi ubicación" muestra el aviso y el mapa se puede seguir tocando.

### Hallazgos

- Los máximos de nombre (60) y descripción (300) se aplican con `maxLength` en el
  formulario, no en `validarLugar`. Así no queda un camino inalcanzable como el camino 2
  de `validarReporte`. Desde T-13, `firestore.rules` repite estos límites y las listas
  del lado del servidor (función `lugarValido()`, ver la sección "Valoraciones de lugares").
- La pantalla repite `!ubicacion` después de `validarLugar` solo para que TypeScript sepa
  que la ubicación no es `null`. No cambia el comportamiento.
- No se revisa que el pin quede dentro de la región piloto. La localidad elegida sirve
  para filtrar (RF-27), pero un pin mal colocado no se detecta.

---

## Filtros de lugares — `filtrarLugares` en `src/lib/lugares.ts` (T-13, RF-27)

**Responsable:** Alexis Rodríguez Martínez
**Pruebas:** `__tests__/lib/filtros-lugares.test.ts`

La lista `src/app/lugares/index.tsx` tiene dos filas de chips:

- **Localidad**: Todas, Yuriria, Uriangato y Moroleón.
- **Categoría**: Todas y las 6 de `CATEGORIAS_LUGAR`.

El filtro se aplica en la app sobre la lista que ya llega en tiempo real, así que no
requiere índices compuestos en Firestore. Si no hay resultados se muestra
"No hay lugares con esos filtros.".

### Funciones

| Función | Decisiones | V(G) | Caminos independientes |
|---|---|---|---|
| `filtrarLugares(lugares, localidad, categoria)` | 2 (`localidad !== TODAS`, `categoria !== TODAS`) | 3 | 1: ningún filtro · 2: solo localidad · 3: solo categoría |

Hay un cuarto caso con **ambos** filtros (los dos `if` verdaderos). Es el uso real en la
pantalla y además prueba el resultado vacío.

### Casos de prueba

Los casos usan 4 lugares de prueba:

1. Moroleón, Cafetería
2. Moroleón, Comida
3. Yuriria, Cafetería
4. Uriangato, Cultura

| ID | Entrada | Resultado esperado | Camino |
|---|---|---|---|
| CB-FLU-1 | `(Todas, Todas)` | Los 4 lugares, sin cambios | 1 |
| CB-FLU-2 | `('Moroleón', Todas)` | Lugares 1 y 2 | 2 |
| CB-FLU-3 | `(Todas, 'Cafetería')` | Lugares 1 y 3 | 3 |
| CB-FLU-4 | `('Yuriria', 'Cafetería')` y `('Uriangato', 'Compras')` | Lugar 3, y `[]` | 2 + 3 (ambos filtros) |

### Prueba manual (criterio del SRS, RF-27)

1. Con al menos 5 lugares de prueba en varias localidades y categorías, elegir cada
   localidad y comprobar que solo aparecen los lugares de esa localidad.
2. Elegir una categoría y combinarla con una localidad. Al volver a **Todas** aparece la
   lista completa.
3. Una combinación sin lugares muestra "No hay lugares con esos filtros.".

### Hallazgos

- Ninguno.

---

## Valoraciones de lugares — `src/lib/valoraciones.ts` (T-13, RF-28 y RF-29)

**Responsable:** Alexis Rodríguez Martínez
**Pruebas:** `__tests__/lib/valoraciones.test.ts`

Al tocar un lugar se abre su ficha, `src/app/lugares/[id].tsx`. La ficha muestra la
descripción, un minimapa con el pin, el promedio (`textoPromedio`) y los comentarios en
tiempo real. Lo que se puede hacer depende de quién la abra:

- **Si no eres el autor**, ves el formulario `src/components/ValorarLugar.tsx`: de 1 a 5
  estrellas y un comentario opcional de máximo 300 caracteres.
  - La valoración se guarda en `lugares/{lugarId}/valoraciones/{uid}`.
  - Como el id del documento es tu uid, **si vuelves a valorar se reemplaza tu valoración
    anterior**. Hay una sola por persona por lugar.
- **Si eres el autor** (`puedeEditar`), no ves el formulario de valoración. En su lugar ves:
  - **Editar**, que abre `src/app/lugares/editar/[id].tsx` con el mismo formulario de Publicar.
  - **Eliminar**, que pide confirmación.

El promedio se calcula en la app a partir de la subcolección. No se guarda en el documento
del lugar porque quien valora no es el autor y la regla no le permite modificarlo.

### Funciones

| Función | Decisiones | V(G) | Caminos independientes |
|---|---|---|---|
| `promedioEstrellas(valoraciones)` | 1 (`length === 0`) | 2 | 1: sin valoraciones → `null` · 2: promedio redondeado a 1 decimal |
| `textoPromedio(promedio, total)` | 2 (`promedio === null`, `total === 1`) | 3 | 1: "Sin valoraciones" · 2: singular · 3: plural |
| `validarEstrellas(estrellas)` | 1 (`!entero \|\| < 1 \|\| > 5`) | 2 | 1: inválidas → mensaje · 2: válidas → `null` |
| `puedeEditar(autorId, uid)` | 0 | 1 | 1: `uid !== undefined && autorId === uid` |

`validarEstrellas` tiene una sola decisión con tres condiciones. CB-VLR-7 prueba cada
condición por separado (0, 6 y 3.5) para tener cobertura de condiciones múltiples.

### Casos de prueba

| ID | Función | Entrada | Resultado esperado | Camino |
|---|---|---|---|---|
| CB-VLR-1 | `promedioEstrellas` | `[]` | `null` | 1 |
| CB-VLR-2 | `promedioEstrellas` | A da 5, B da 3 | `4` (★ 4.0) | 2 |
| CB-VLR-3 | `promedioEstrellas` | A cambia a 4: `[4, 3]`; y `[5, 4, 4]` | `3.5` (siguen siendo 2 votos); `4.3` | 2 (redondeo) |
| CB-VLR-4 | `textoPromedio` | `(null, 0)` | `"Sin valoraciones"` | 1 |
| CB-VLR-5 | `textoPromedio` | `(5, 1)` | `"★ 5.0 · 1 valoración"` | 2 |
| CB-VLR-6 | `textoPromedio` | `(3.5, 2)` | `"★ 3.5 · 2 valoraciones"` | 3 |
| CB-VLR-7 | `validarEstrellas` | `0`, `6` y `3.5` | `"Elige de 1 a 5 estrellas."` | 1 |
| CB-VLR-8 | `validarEstrellas` | `1` y `5` | `null` (valores límite) | 2 |
| CB-VLR-9 | `puedeEditar` | `('uidA','uidA')`, `('uidA','uidB')`, `('uidA', undefined)` | `true`, `false`, `false` | Único camino |

### Reglas de Firestore (`firestore.rules`, bloque `lugares`)

La regla genérica `/{coleccion}/{id}` excluye `reportes` y `lugares`. Firestore combina
las reglas con OR, así que sin esa exclusión la regla genérica permitiría editar un lugar
sin validar sus campos.

| Ruta | Operación | Quién | Condición |
|---|---|---|---|
| `lugares/{id}` | `read` | cualquier docente | con sesión |
| `lugares/{id}` | `create` | cualquier docente | `autorId == uid` y `lugarValido()` |
| `lugares/{id}` | `update` | autor o admin | autor: `lugarValido()` y `autorId` sin cambios · admin: moderación (RF-45) |
| `lugares/{id}` | `delete` | autor o admin | — |
| `…/valoraciones/{uid}` | `read` | cualquier docente | con sesión |
| `…/valoraciones/{uid}` | `create`, `update` | quien valora | id = su uid, `autorId == uid`, `estrellas` entero de 1 a 5, `comentario.size() <= 300` y **no es el autor del lugar** (`get()` del lugar) |
| `…/valoraciones/{uid}` | `delete` | quien valoró o admin | — |

`lugarValido()` revisa los campos así:

| Campo | Condición |
|---|---|
| `nombre` | no vacío, máximo 60 caracteres |
| `categoria` | una de `CATEGORIAS_LUGAR` |
| `localidad` | una de la región piloto |
| `descripcion` | no vacía, máximo 300 caracteres |
| `latitud`, `longitud` | numéricas |

### Prueba manual (criterio del SRS, RF-28 y RF-29)

Se necesitan tres cuentas: A, B y C.

1. A publica un lugar. B le da 5 estrellas y C le da 3. La ficha muestra
   **★ 4.0 · 2 valoraciones**.
2. B cambia su valoración a 4. La ficha muestra **★ 3.5 · 2 valoraciones**, no 3 votos.
   En Firebase Console sigue habiendo un solo documento `valoraciones/<uidB>`.
3. En la ficha de su propio lugar, A no ve "Valora este lugar"; ve **Editar** y **Eliminar**.
4. A edita la descripción. B ve el cambio en la ficha y en la lista sin recargar.
5. B no ve Editar ni Eliminar en el lugar de A. Si abre `/lugares/editar/<id>` ve
   "Solo el autor puede editar este lugar.", y aunque intentara guardar, la regla
   rechazaría la escritura.
6. A elimina el lugar, confirma en el aviso, y el lugar desaparece de la lista de B.
7. Sin conexión, guardar una valoración o una edición muestra el error y conserva los
   datos escritos (RNF-20).

### Hallazgos

- **Valoraciones huérfanas:** Firestore no borra las subcolecciones al eliminar un
  documento. Cuando se elimina un lugar, sus valoraciones se quedan en
  `lugares/{id}/valoraciones`. La app ya no las muestra, pero cualquier persona con sesión
  que conozca la ruta todavía puede leerlas. Se acepta para el piloto y su limpieza queda
  para la moderación (RF-45).
- Las listas de categorías y localidades y los límites de largo están escritos dos veces:
  en `src/lib/lugares.ts` y en `firestore.rules`, igual que los motivos de reportes. Si se
  cambia uno, hay que cambiar el otro.
- El admin puede editar un lugar sin pasar por `lugarValido()`. Es intencional, para
  moderar, y se revisará en T-28 (seguridad).
- La regla de valoraciones hace un `get()` del lugar en cada escritura, lo que suma una
  lectura facturable. Si el lugar ya fue eliminado, la escritura se rechaza.
