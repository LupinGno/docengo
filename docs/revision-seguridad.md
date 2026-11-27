# Revisión de seguridad de DocenGo (T-28)

Aquí revisamos qué tan segura es la app y si cuida la privacidad de los docentes. Son 11
revisiones (S1 a S11). Por cada una anotamos lo que encontramos, lo que ya se corrigió y lo que
falta acordar con Carlos.

| Dato | Valor |
|---|---|
| Responsables | Alexis y Carlos (José agregó el hallazgo H11) |
| Rama revisada | `feat/t28-seguridad` (incluye `main` y las ramas T-04 a T-27) |
| De dónde salen | SRS v1.0: 5.1 (RNF-01 a RNF-06), 6.2 (cuánto tiempo se guardan los datos) y 7 (RN-01 a RN-08) |
| Tipos de prueba (SRS 10.1) | **IN** inspección (revisar sin correr la app) y **PS** prueba de seguridad |

Armamos las revisiones S1 a S11 con los requisitos del SRS porque no tenemos el Anexo B del plan
de trabajo. Si el Anexo B las pide de otra forma, cambiamos este documento.

| Valor | Qué quiere decir |
|---|---|
| Cumple | Salió bien |
| No cumple | Salió mal; hay que corregirlo o abrir un issue |
| Pendiente | Todavía no se revisa |
| Con limitación | Cumple, pero tiene un límite que ya está anotado |

---

## 1. Lo que encontramos

Esto salió de leer el código. Las revisiones S1 a S11 de la sección 3 sirven para confirmar cada
punto en la consola de Firebase y en el celular.

| # | Gravedad | Qué pasa | Requisito | Revisión | Estado | Responsable |
|---|---|---|---|---|---|---|
| H1 | **Alta** | Cualquiera con sesión podía leer `usuarios`, donde está el **correo** de cada docente | RNF-05 | S8 | **Corregido (A)** | Alexis |
| H2 | **Alta** | Cualquiera con sesión puede leer `alertas.autorId` y `alertas/{id}/votos/{uid}`, así que se sabe quién reportó y quién votó. Además la alerta guarda la **posición GPS de quien la hizo** | RN-04, RNF-06 | S9, S10 | Pendiente (E) | Carlos |
| H3 | Media | Con la regla genérica, el autor puede cambiar `autorId` al editar, y no se revisan los campos. En `mensajes` el texto no tenía límite | RNF-03, RNF-04 | S6 | `mensajes`: **corregido (B)**. Lo demás: pendiente (C) | Alexis y Carlos |
| H4 | Media | El bloqueo por 3 intentos solo existe dentro de la app: si la cierras y la vuelves a abrir, puedes intentar otra vez | RF-06, RN-06 | S4 | Pendiente (E) | Carlos |
| H5 | Media | `signOut` no cancela el token de la sesión: Firebase lo sigue aceptando hasta que vence (1 hora) | RNF-02 | S3 | Anotarlo en el SRS | Equipo |
| H6 | Media | Firebase Auth guarda las contraseñas con hash (scrypt), no con AES-256 como dice el SRS. Además `.gitignore` no ignora `.env` | RNF-01 | S1, S2 | SRS: anotarlo. `.gitignore`: pendiente (D) | Equipo y Carlos |
| H7 | Media | Cualquiera con sesión puede leer los tokens de notificaciones, y la API de Expo no pide cuenta: alguien podría mandar avisos falsos | RNF-05 | S8 | Lo aceptamos para el piloto | Alexis |
| H8 | Baja | Al borrar una cuenta, `autorNombre` se queda con el nombre real (el SRS pide "Docente anónimo"). Las valoraciones de un lugar borrado se quedan sueltas. El respaldo diario necesita el plan Blaze | SRS 6.2 | S11 | Pendiente (E) | Carlos y Alexis |
| H9 | Baja | En `reportes`, la regla `get` con `resource == null` deja saber si un reporte **no** existe | RNF-05 | S8 | Aceptado (T-07) | Alexis |
| H10 | Info | La API key de Firebase es pública a propósito (`EXPO_PUBLIC_*` va dentro de la app). Lo que de verdad protege los datos son las reglas | RNF-01 | S1 | Recomendación | Equipo |
| H11 | **Alta** | La regla genérica `match /{coleccion}/{id}` también se aplicaba a `usuarios`. Como Firestore junta las reglas con OR, un docente podía crear su perfil con `{ rol: "admin", autorId: <su uid> }` y la genérica lo dejaba pasar aunque el bloque de `usuarios` lo negara | RF-43, RNF-03 | S5 | **Corregido (T-00)**: `usuarios` se agregó a `tieneBloquePropio` | José |

---

## 2. Correcciones

### Ya corregido en esta rama (partes de Alexis)

**A. Datos personales en `usuarios` (H1)**

- `firestore.rules`: `usuarios/{uid}` solo lo puede leer su dueño o un admin (`get`), y solo el
  admin puede ver la lista completa (`list`).
- Las salas y el token de notificaciones de RF-24 se pasaron a una colección nueva,
  **`avisos/{uid}`** (`salas`, `pushToken`). Quien manda un mensaje necesita leer los de los
  demás, pero ya no ve el correo de nadie.
  - Cualquiera con sesión puede leer `avisos`.
  - Solo el dueño lo escribe, y solo con esos dos campos.
  - `salas` acepta máximo 15 elementos y `pushToken` máximo 200 caracteres.
- Código que cambió: `src/services/notificaciones.ts`, `src/components/Notificaciones.tsx`,
  `src/lib/notificaciones.ts` y `src/types/modelos.ts` (tipo `RegistroAvisos`).
- `src/services/db.ts`: función nueva `actualizarOCrear` (`setDoc` con `merge`), para poder
  escribir en `avisos` aunque el documento todavía no exista.

**B. Reglas propias para `mensajes` (H3, la parte del chat)**

`mensajes` ya no usa la regla genérica, tiene su propio bloque:

| Operación | Quién | Condición |
|---|---|---|
| `read` | cualquier docente | con sesión |
| `create` | cualquier docente | `autorId` propio y `mensajeValido()` |
| `update` | solo admin | los mensajes no se editan |
| `delete` | el autor o un admin | — |

`mensajeValido()` pide:
- solo los campos del modelo;
- texto de 1 a 1000 caracteres (`MAX_MENSAJE` en `src/lib/salas.ts`; la caja de texto del chat
  también lo limita con `maxLength`);
- región y tema que estén en la lista;
- `sala` y `autorNombre` de máximo 60 caracteres, y `fecha` como número.

**Límite:** `autorNombre` lo escribe la app y la regla no puede revisar que sea el nombre real de
la cuenta. Alguien que use la API directo podría poner otro nombre. `autorId` sí se revisa, así
que el admin siempre puede saber quién lo escribió.

### Falta acordarlo con Carlos (no tocamos sus archivos)

**C. Regla genérica: que `autorId` no cambie al editar (H3).** Le toca a puntos, servicios,
alertas, hospedajes y paradas. Lo que proponemos para `firestore.rules`:

```
allow update: if !tieneBloquePropio(coleccion)
              && ((esAutor() && request.resource.data.autorId == resource.data.autorId) || esAdmin());
allow delete: if !tieneBloquePropio(coleccion) && (esAutor() || esAdmin());
```

Lo mejor sería que cada colección tuviera también su propia revisión de campos, como ya la tienen
`lugares` y `mensajes`.

**D. `.gitignore` (H6).** Agregar la línea `.env`. `src/services/firebase.ts` dice que las llaves
van en `.env`, pero hoy solo se ignora `.env*.local`.

**E. Issues para Carlos:**

| Issue | Hallazgo | Qué proponemos |
|---|---|---|
| Que no se sepa quién hizo una alerta ni quién votó | H2 | Guardar el autor en una colección que solo lea el admin (por ejemplo `autoresAlertas/{alertaId}`). Dejar leer solo tu propio voto y mostrar cuántos votos hay con un conteo (`getCountFromServer`) en lugar de listar los votos |
| Ubicación de quien hace la alerta | H2 | Guardar la coordenada redondeada (por ejemplo a 3 decimales, unos 100 m) o el centro de la localidad, no la posición exacta del GPS |
| Bloqueo desde el servidor | H4 | Necesita una Cloud Function (plan Blaze). Si no se hace, anotar el límite en el SRS. Es lo mismo que el paso 1.7 de T-27 |
| Dejar anónimo al borrar la cuenta | H8 | Al borrar la cuenta (RF-09), cambiar `autorNombre` a "Docente anónimo" en mensajes, lugares y valoraciones de esa persona, y borrar su `avisos/{uid}` |

---

## 3. Revisiones S1 a S11

### S1. Llaves y secretos en el repositorio (RNF-01, IN). Responsable: Alexis

| Paso | Qué debe pasar | Resultado |
|---|---|---|
| `git grep -n -I -E "AIza[0-9A-Za-z_-]{20,}\|private_key\|BEGIN (RSA\|PRIVATE)"` | Nada encontrado | Cumple (26 nov: 0 resultados) |
| `git log --all -p -S "AIza" --oneline` (todo el historial) | Nada encontrado | Cumple (26 nov: 0 resultados) |
| `git ls-files \| grep -i "env\|google-services\|credential"` | Solo `.env.example`, sin valores | Cumple (26 nov) |
| Revisar `.gitignore` | Ignora `.env`, `*.p8`, `*.p12`, `*.key` y `*.jks` | No cumple: falta `.env` (D) |
| Google Cloud Console > APIs > Credenciales: la API key de Firebase | Limitada a la app (Android/iOS) y a las APIs de Firebase | Pendiente |

### S2. Cómo se guardan las contraseñas (RNF-01, RF-05, IN). Responsable: Carlos

| Paso | Qué debe pasar | Resultado |
|---|---|---|
| Consola de Firebase > Firestore: revisar `usuarios` y las demás colecciones | Ningún campo guarda la contraseña | Pendiente |
| Consola de Firebase > Authentication | La contraseña no se puede ver | Pendiente |
| Comparar con el SRS | El SRS pide AES-256 y Firebase usa hash scrypt (que es mejor para contraseñas). **Hay que anotar la diferencia en el SRS** | Con limitación |

### S3. Sesiones y tokens (RNF-02, RF-08, PS). Responsable: Alexis

| Paso | Qué debe pasar | Resultado |
|---|---|---|
| Cerrar sesión y darle al botón de atrás | Regresa al login y no deja entrar a pantallas protegidas | Pendiente |
| Cerrar sesión, cerrar la app y volver a abrirla | Pide iniciar sesión | Pendiente |
| Revisar qué pasa con el token | El token sigue sirviendo hasta 1 hora después de `signOut`. **Anotarlo** en el SRS; para cancelarlo se necesita el Admin SDK | Con limitación |

### S4. Bloqueo de cuenta (RF-06, RN-06, PS). Responsable: Carlos

| Paso | Qué debe pasar | Resultado |
|---|---|---|
| Poner 3 veces la contraseña mal | Sale "Cuenta bloqueada… Contacta a soporte" | Pendiente |
| Cerrar la app por completo, abrirla y entrar con la contraseña correcta | Sigue bloqueada | Pendiente (por el código creemos que no va a cumplir, H4) |

### S5. Permisos por rol (Área de pruebas de reglas) (RNF-03, RN-03, RN-08, PS). Responsable: Alexis

Ver la sección 4, casos 1 a 10, 12 y 21.

### S6. Que nadie cambie el autor ni meta campos de más (RNF-03, RNF-04, PS). Responsable: Alexis

Ver la sección 4, casos 11 y 15 a 19.

### S7. Textos con trampa (RNF-04, PS). Responsable: Alexis

Pegar cada texto en el **chat**, en **Publicar lugar** (nombre y descripción), en el **comentario
de una valoración**, en el **detalle de un reporte** y en la **descripción de una alerta**:

| Texto | Qué debe pasar | Resultado |
|---|---|---|
| `<script>alert(1)</script>` | Se ve como texto normal y no se ejecuta nada | Pendiente |
| `<b>negritas</b> <img src=x onerror=alert(1)>` | Se ve como texto normal | Pendiente |
| `{"$gt": ""}` y `'; DROP TABLE usuarios; --` | Se ve como texto normal; ninguna consulta se arma con lo que escribe el usuario | Pendiente |
| Acentos y un emoji desde el teclado del celular (por ejemplo `¡Qué buen café!` más el emoji de una taza) | Se ven bien | Pendiente |
| Un texto de más de 1000 caracteres en el chat | La caja de texto ya no deja escribir al llegar a 1000 | Pendiente |
| Solo espacios | No se publica | Pendiente |

React Native muestra el texto con `<Text>`, que no lee HTML, y la app no arma consultas con lo que
escribe el usuario. Esperamos que todos cumplan.

### S8. Datos personales (RNF-05, IN y PS). Responsable: Alexis

| Paso | Qué debe pasar | Resultado |
|---|---|---|
| Con la cuenta B, revisar el chat, los lugares, las valoraciones y la pantalla Más | No sale el correo ni el teléfono de A | Pendiente |
| Área de pruebas de reglas: casos 13 y 14 (sección 4) | B no puede leer `usuarios/{uidA}` | Pendiente (corregido en A) |
| Consola de Firebase: revisar qué guarda `avisos/{uid}` | Solo `salas` y `pushToken` (H7 aceptado) | Pendiente |
| Revisar qué dice la notificación | El nombre de la sala y "Autor: texto" (hasta 100 caracteres). Pasa por los servidores de Expo | Con limitación (anotado) |

### S9. Que no se sepa quién hizo una alerta ni quién votó (RN-04, IN y PS). Responsable: Carlos

| Paso | Qué debe pasar (SRS) | Resultado |
|---|---|---|
| Con la cuenta B, ver una alerta de A en la app | No sale quién la hizo | Pendiente |
| Área de pruebas de reglas: B hace `get` de `/alertas/{id}` | El documento **no** debe decir quién la hizo | Pendiente (por el código creemos que no va a cumplir, H2) |
| Área de pruebas de reglas: caso 20 (sección 4) | B no debe poder ver la lista de quién votó | Pendiente (por el código creemos que no va a cumplir, H2) |

### S10. Ubicación (RNF-06, IN). Responsable: Alexis

| Colección | ¿Guarda coordenadas? | De dónde salen | ¿Es la ubicación del docente? |
|---|---|---|---|
| `lugares` | Sí | Del pin en el mapa o de "Usar mi ubicación" (el docente la escoge y la ve antes de publicar) | No, es la ubicación del lugar |
| `alertas` | Sí | Del GPS del celular al crear la alerta | **Sí** (H2, E) |
| `puntos`, `servicios`, `paradas` | Sí | Datos del lugar | No |
| `usuarios`, `avisos`, `mensajes`, `reportes`, `valoraciones` | No | — | — |

| Paso | Qué debe pasar | Resultado |
|---|---|---|
| Revisar la tabla de arriba | Ninguna colección guarda un historial de dónde ha estado el docente | Pendiente |
| Usar Servicios y Mapa con el permiso de ubicación activado y revisar Firestore | No se guarda ningún documento con la posición del usuario | Pendiente |
| Negar el permiso de ubicación | Mapa, Servicios y Lugares siguen funcionando | Pendiente |

### S11. Cuánto se guardan los datos, respaldos y registros (SRS 6.2, RNF-24, IN). Responsables: Alexis y Carlos

| Paso | Qué debe pasar | Resultado |
|---|---|---|
| Borrar una cuenta de prueba (cuando exista RF-09) | Se borran sus datos personales y sus publicaciones quedan como "Docente anónimo" | Pendiente (H8) |
| Borrar un lugar que tenga valoraciones | Las valoraciones ya no se ven (se quedan sueltas, H8 aceptado en T-13) | Pendiente |
| Revisar los respaldos de Firestore | Un respaldo diario durante el piloto | Pendiente (necesita el plan Blaze o exportar a mano) |
| Revisar los `console.warn` del código | Solo mensajes de error, sin correos, tokens ni textos de mensajes | Cumple (26 nov, revisando el código) |

---

## 4. Casos del Área de pruebas de reglas (S5, S6, S8 y S9)

El Área de pruebas de reglas (Rules Playground) está en la consola de Firebase, en Firestore >
Reglas.

**Antes de empezar:**

1. Consola de Firebase > Firestore > **Reglas**: pegar el `firestore.rules` de esta rama. El área
   de pruebas usa lo que está en el editor aunque no lo hayas publicado.
2. Tener en Firestore:
   - `usuarios/UID_A` y `usuarios/UID_B` con `rol: "docente"`;
   - `usuarios/UID_ADMIN` con `rol: "admin"` (puesto a mano);
   - un lugar, un mensaje y una alerta hechos por A.

   Las funciones `esAdmin()` y los `get()` de las reglas leen esos datos reales.
3. En el área de pruebas escoger el tipo de operación y la ruta. Activar **Authenticated** y
   escribir el UID. Para `create` y `update`, escribir los datos en formato JSON.

| # | Quién (UID) | Operación | Ruta | Datos | Debe salir | Resultado |
|---|---|---|---|---|---|---|
| 1 | UID_A | update | `/usuarios/UID_A` | `{"rol": "admin", ...}` | Denegado | Pendiente |
| 2 | UID_A | list | `/reportes` | — | Denegado | Pendiente |
| 3 | UID_ADMIN | list | `/reportes` | — | Permitido | Pendiente |
| 4 | UID_B | delete | `/lugares/ID_LUGAR_A` | — | Denegado | Pendiente |
| 5 | UID_ADMIN | delete | `/lugares/ID_LUGAR_A` | — | Permitido | Pendiente |
| 6 | UID_B | update | `/alertas/ID_ALERTA_A` | `{"descripcion": "otra"}` | Denegado | Pendiente |
| 7 | UID_A | create | `/lugares/ID_LUGAR_A/valoraciones/UID_A` | `{"estrellas": 5, "comentario": "", "autorId": "UID_A", ...}` | Denegado (no puede calificar su propio lugar) | Pendiente |
| 8 | UID_A | create | `/alertas/ID_ALERTA_A/votos/UID_A` | `{"voto": "confirma", "fecha": 1}` | Denegado (no puede votar su propia alerta) | Pendiente |
| 9 | UID_B | create | `/lugares/ID_LUGAR_A/valoraciones/UID_B` | `{"estrellas": 6, ...}` | Denegado | Pendiente |
| 10 | UID_B | create | `/lugares/NUEVO` | `{"categoria": "Antro", "autorId": "UID_B", ...}` | Denegado | Pendiente |
| 11 | UID_A | update | `/mensajes/ID_MENSAJE_A` | `{"autorId": "UID_B", ...}` | Denegado (corregido en B) | Pendiente |
| 12 | sin sesión | get | `/mensajes/ID_MENSAJE_A` | — | Denegado | Pendiente |
| 13 | UID_B | get | `/usuarios/UID_A` | — | Denegado (corregido en A) | Pendiente |
| 14 | UID_A | get | `/usuarios/UID_A` | — | Permitido | Pendiente |
| 15 | UID_B | create | `/mensajes/NUEVO` | texto de 1001 caracteres | Denegado (B) | Pendiente |
| 16 | UID_B | create | `/mensajes/NUEVO` | mensaje válido con un campo de más `{"rol": "admin"}` | Denegado (B) | Pendiente |
| 17 | UID_B | create | `/mensajes/NUEVO` | mensaje válido con `autorId: "UID_A"` | Denegado | Pendiente |
| 18 | UID_B | update | `/avisos/UID_A` | `{"pushToken": "ExponentPushToken[x]"}` | Denegado (A) | Pendiente |
| 19 | UID_B | update | `/puntos/ID_PUNTO_B` | `{"autorId": "UID_A", ...}` | Denegado cuando se aplique C. **Hoy sí lo deja** | Pendiente |
| 20 | UID_B | list | `/alertas/ID_ALERTA_A/votos` | — | Denegado según RN-04. **Hoy sí lo deja** (H2) | Pendiente |
| 21 | UID_A | create | `/usuarios/UID_A` | `{"rol": "admin", "autorId": "UID_A"}` | Denegado (corregido en T-00, H11) | Pendiente |

Si algún resultado no es el que debe salir, abrir un issue con el título
`[T-28][S#][caso #] qué pasó` y anotarlo en la sección 6.

---

## 5. Antes de probar en el celular

- [ ] Publicar en la consola de Firebase el `firestore.rules` de esta rama.
- [ ] Los campos `salas` y `pushToken` que ya había en `usuarios` ya no se usan. Para volver a
      recibir avisos, cada quien tiene que **escribir otra vez** en la sala (eso crea su
      `avisos/{uid}`). Los campos viejos de `usuarios` se pueden borrar a mano en la consola.
- [ ] Repetir la prueba manual de RF-24 (sección 15 de `pruebas-caja-blanca.md`).

## 6. Issues abiertos

| Issue | Revisión y caso | Hallazgo | Responsable | Estado |
|---|---|---|---|---|
| | | | | |

## 7. Cómo pasar esto a la matriz

En [`matriz-pruebas.md`](matriz-pruebas.md), columna Resultado:

| Requisito | Revisiones |
|---|---|
| RNF-01 | S1, S2 |
| RNF-02 | S3 |
| RNF-03 | S5, S6 |
| RNF-04 | S6, S7 |
| RNF-05 | S8, S9 |
| RNF-06 | S10 |
| RF-06 (RN-06) | S4 |
| RNF-24 | S11 |
