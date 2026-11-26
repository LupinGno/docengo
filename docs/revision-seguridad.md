# Revisión de seguridad — DocenGo (T-28)

Auditoría de seguridad y privacidad del prototipo: revisiones **S1 a S11**, hallazgos,
correcciones aplicadas y correcciones pendientes de acordar con Carlos.

| Dato | Valor |
|---|---|
| Responsables | Alexis y Carlos |
| Rama revisada | `feat/t28-seguridad` (incluye `main` y las ramas T-04 a T-27) |
| Fuentes | SRS v1.0: 5.1 (RNF-01 a RNF-06), 6.2 (retención), 7 (RN-01 a RN-08) |
| Métodos (SRS 10.1) | **IN** inspección · **PS** prueba de seguridad |

> Las revisiones S1–S11 se definieron con los requisitos del SRS porque el Anexo B del plan de
> trabajo no está disponible. Si el Anexo B las define distinto, se ajusta este documento.

| Símbolo | Significado |
|---|---|
| ✅ | Cumple |
| ❌ | No cumple (abrir issue o corregir) |
| ⬜ | Sin ejecutar |
| ⚠️ | Cumple con una limitación documentada |

---

## 1. Resumen de hallazgos

La revisión del código (inspección) encontró lo siguiente. Las revisiones S1–S11 de la
sección 3 confirman cada hallazgo en la consola y en el teléfono.

| # | Severidad | Hallazgo | Requisito | Revisión | Estado | Responsable |
|---|---|---|---|---|---|---|
| H1 | **Alta** | Cualquiera con sesión podía leer `usuarios`, que incluye el **correo** de cada docente | RNF-05 | S8 | **Corregido (A)** | Alexis |
| H2 | **Alta** | Cualquiera con sesión puede leer `alertas.autorId` y `alertas/{id}/votos/{uid}`: se sabe quién reportó y quién votó. La alerta guarda además la **posición GPS del autor** | RN-04, RNF-06 | S9, S10 | Pendiente (E) | Carlos |
| H3 | Media | Con la regla genérica, el autor puede cambiar `autorId` al editar, y no se validan los campos. En `mensajes` el texto no tenía límite | RNF-03, RNF-04 | S6 | `mensajes`: **corregido (B)** · resto: pendiente (C) | Alexis · Carlos |
| H4 | Media | El bloqueo por 3 intentos vive solo en la app: al reabrirla se puede volver a intentar | RF-06, RN-06 | S4 | Pendiente (E) | Carlos |
| H5 | Media | `signOut` no invalida el token de sesión: Firebase lo acepta hasta que expira (1 h) | RNF-02 | S3 | Documentar en el SRS | Equipo |
| H6 | Media | Firebase Auth guarda las contraseñas con hash (scrypt), no con AES-256 como dice el SRS. `.gitignore` no ignora `.env` | RNF-01 | S1, S2 | SRS: documentar · `.gitignore`: pendiente (D) | Equipo · Carlos |
| H7 | Media | Cualquiera con sesión puede leer los tokens push, y la API de Expo no pide autenticación: alguien podría mandar avisos falsos | RNF-05 | S8 | Aceptado para el piloto | Alexis |
| H8 | Baja | Al eliminar una cuenta, `autorNombre` conserva el nombre real (el SRS pide "Docente anónimo"). Las valoraciones de un lugar eliminado quedan huérfanas. El respaldo diario requiere el plan Blaze | SRS 6.2 | S11 | Pendiente (E) | Carlos · Alexis |
| H9 | Baja | `reportes`: la regla `get` con `resource == null` deja saber si un reporte **no** existe | RNF-05 | S8 | Aceptado (T-07) | Alexis |
| H10 | Info | La API key de Firebase es pública por diseño (`EXPO_PUBLIC_*` se incluye en la app); lo que protege los datos son las reglas | RNF-01 | S1 | Recomendación | Equipo |

---

## 2. Correcciones

### Aplicadas en esta rama (módulos de Alexis)

**A · Datos personales en `usuarios` (H1).**

- `firestore.rules`: `usuarios/{uid}` solo lo lee su dueño o un admin (`get`); solo el admin
  lo lista (`list`).
- Las salas y el token push de RF-24 se movieron a una colección nueva, **`avisos/{uid}`**
  (`salas`, `pushToken`). Quien envía un mensaje necesita leer los de los demás participantes,
  pero ya no ve el correo de nadie.
  - Cualquiera con sesión puede leer `avisos`.
  - Solo su dueño lo escribe, con esos dos campos.
  - `salas` acepta como máximo 15 elementos y `pushToken` como máximo 200 caracteres.
- Código: `src/services/notificaciones.ts`, `src/components/Notificaciones.tsx`,
  `src/lib/notificaciones.ts` y `src/types/modelos.ts` (tipo `RegistroAvisos`).
- `src/services/db.ts`: nueva función `actualizarOCrear` (`setDoc` con `merge`), para escribir
  en `avisos` aunque el documento no exista todavía.

**B · Reglas propias para `mensajes` (H3, parte del chat).**

`mensajes` sale de la regla genérica y tiene su propio bloque:

| Operación | Quién | Condición |
|---|---|---|
| `read` | cualquier docente | con sesión |
| `create` | cualquier docente | `autorId` propio y `mensajeValido()` |
| `update` | solo admin | los mensajes no se editan |
| `delete` | autor o admin | — |

`mensajeValido()` exige:
- solo los campos del modelo;
- texto de 1 a 1000 caracteres (`MAX_MENSAJE` en `src/lib/salas.ts`, que la caja de texto del
  chat también aplica con `maxLength`);
- región y tema de la lista;
- `sala` y `autorNombre` de máximo 60 caracteres, y `fecha` numérica.

**Limitación:** `autorNombre` lo escribe la app y la regla no puede comprobar que sea el nombre
real de la cuenta. Alguien que use la API directamente podría poner otro nombre. `autorId` sí se
valida, así que el admin puede saber quién lo escribió.

### Pendientes de acordar con Carlos (no se tocaron sus archivos)

**C · Regla genérica: `autorId` no cambia al editar (H3).** Afecta puntos, servicios, alertas,
hospedajes y paradas. Cambio propuesto en `firestore.rules`:

```
allow update: if !tieneBloquePropio(coleccion)
              && ((esAutor() && request.resource.data.autorId == resource.data.autorId) || esAdmin());
allow delete: if !tieneBloquePropio(coleccion) && (esAutor() || esAdmin());
```

Lo ideal es que cada colección tenga además su propia validación de campos, como `lugares` y
`mensajes`.

**D · `.gitignore` (H6).** Agregar la línea `.env`. `src/services/firebase.ts` dice que las
llaves van en `.env`, pero hoy solo se ignora `.env*.local`.

**E · Issues para Carlos:**

| Issue | Hallazgo | Propuesta |
|---|---|---|
| Anonimato de alertas y votos | H2 | Guardar el autor en una colección que solo lea el admin (p. ej. `autoresAlertas/{alertaId}`). Permitir leer solo el voto propio y mostrar los conteos con una agregación (`getCountFromServer`) en lugar de listar los votos |
| Ubicación del autor en la alerta | H2 | Guardar la coordenada redondeada (p. ej. 3 decimales, unos 100 m) o el centro de la localidad, no la posición exacta del GPS |
| Bloqueo del lado del servidor | H4 | Requiere una Cloud Function (plan Blaze). Si no se hace, documentar la limitación en el SRS. Es el mismo caso que el paso 1.7 de T-27 |
| Anonimizar al eliminar la cuenta | H8 | Al eliminar la cuenta (RF-09), cambiar `autorNombre` a "Docente anónimo" en mensajes, lugares y valoraciones del usuario, y borrar su `avisos/{uid}` |

---

## 3. Revisiones S1–S11

### S1 · Llaves y secretos en el repositorio — RNF-01 · IN · Responsable: Alexis

| Paso | Resultado esperado | Resultado |
|---|---|---|
| `git grep -n -I -E "AIza[0-9A-Za-z_-]{20,}\|private_key\|BEGIN (RSA\|PRIVATE)"` | Sin coincidencias | ✅ 26 nov: 0 coincidencias |
| `git log --all -p -S "AIza" --oneline` (todo el historial) | Sin coincidencias | ✅ 26 nov: 0 coincidencias |
| `git ls-files \| grep -i "env\|google-services\|credential"` | Solo `.env.example`, sin valores | ✅ 26 nov |
| Revisar `.gitignore` | Ignora `.env`, `*.p8`, `*.p12`, `*.key`, `*.jks` | ❌ falta `.env` (D) |
| Google Cloud Console → APIs → Credenciales: la API key de Firebase | Restringida a la app (Android/iOS) y a las APIs de Firebase | ⬜ |

### S2 · Almacenamiento de contraseñas — RNF-01, RF-05 · IN · Responsable: Carlos

| Paso | Resultado esperado | Resultado |
|---|---|---|
| Firebase Console → Firestore: revisar `usuarios` y las demás colecciones | Ningún campo guarda la contraseña | ⬜ |
| Firebase Console → Authentication | La contraseña no se puede ver | ⬜ |
| Comparar con el SRS | El SRS pide AES-256; Firebase usa hash scrypt (más adecuado para contraseñas). **Documentar la diferencia en el SRS** | ⚠️ |

### S3 · Sesiones y tokens — RNF-02, RF-08 · PS · Responsable: Alexis

| Paso | Resultado esperado | Resultado |
|---|---|---|
| Cerrar sesión y usar el botón atrás | Regresa al login; no vuelve a pantallas protegidas | ⬜ |
| Cerrar sesión, cerrar la app y reabrirla | Pide iniciar sesión | ⬜ |
| Revisar el comportamiento del token | El token sigue siendo válido hasta 1 h después de `signOut`. **Documentar** en el SRS; revocarlo requiere el Admin SDK | ⚠️ |

### S4 · Bloqueo de cuenta — RF-06, RN-06 · PS · Responsable: Carlos

| Paso | Resultado esperado | Resultado |
|---|---|---|
| 3 intentos con contraseña incorrecta | "Cuenta bloqueada… Contacta a soporte" | ⬜ |
| Cerrar la app por completo, reabrirla y entrar con la contraseña correcta | Sigue bloqueada | ⬜ (por el código se espera ❌, H4) |

### S5 · Autorización por rol (Rules Playground) — RNF-03, RN-03, RN-08 · PS · Responsable: Alexis

Ver la sección 4. Casos 1 a 10 y 12.

### S6 · Integridad de autoría y campos — RNF-03, RNF-04 · PS · Responsable: Alexis

Ver la sección 4. Casos 11 y 15 a 19.

### S7 · Entradas maliciosas — RNF-04 · PS · Responsable: Alexis

Pegar cada carga en el **chat**, en **Publicar lugar** (nombre y descripción), en el
**comentario de una valoración**, en el **detalle de un reporte** y en la **descripción de
una alerta**:

| Carga | Resultado esperado | Resultado |
|---|---|---|
| `<script>alert(1)</script>` | Se ve como texto plano; no se ejecuta nada | ⬜ |
| `<b>negritas</b> <img src=x onerror=alert(1)>` | Se ve como texto plano | ⬜ |
| `{"$gt": ""}` y `'; DROP TABLE usuarios; --` | Se ve como texto plano; no hay consultas construidas con texto | ⬜ |
| Emojis y acentos (`¡Qué buen café! ☕`) | Se ven bien | ⬜ |
| Texto de más de 1000 caracteres en el chat | La caja de texto deja de aceptar letras al llegar a 1000 | ⬜ |
| Solo espacios | No se publica | ⬜ |

React Native muestra el texto con `<Text>`, que no interpreta HTML, y la app no arma consultas
a partir del texto escrito. Se espera ✅ en todos.

### S8 · Datos personales — RNF-05 · IN, PS · Responsable: Alexis

| Paso | Resultado esperado | Resultado |
|---|---|---|
| Con la cuenta B, revisar el chat, los lugares, las valoraciones y la pantalla Más | No aparece el correo ni el teléfono de A | ⬜ |
| Rules Playground: casos 13 y 14 (sección 4) | B no puede leer `usuarios/{uidA}` | ⬜ (corregido en A) |
| Firebase Console: revisar qué guarda `avisos/{uid}` | Solo `salas` y `pushToken` (H7 aceptado) | ⬜ |
| Revisar el contenido del aviso push | Título de la sala y "Autor: texto" (hasta 100 caracteres). Se envía a los servidores de Expo | ⚠️ documentado |

### S9 · Anonimato de alertas y votos — RN-04 · IN, PS · Responsable: Carlos

| Paso | Resultado esperado (SRS) | Resultado |
|---|---|---|
| Con la cuenta B, revisar una alerta de A en la app | No se muestra quién la creó | ⬜ |
| Rules Playground: B hace `get` de `/alertas/{id}` | El documento **no** debe revelar al autor | ⬜ (por el código se espera ❌, H2) |
| Rules Playground: caso 20 (sección 4) | B no debe poder listar quién votó | ⬜ (por el código se espera ❌, H2) |

### S10 · Ubicación — RNF-06 · IN · Responsable: Alexis

| Colección | Guarda coordenadas | De dónde salen | ¿Es ubicación del docente? |
|---|---|---|---|
| `lugares` | Sí | Pin en el mapa o "Usar mi ubicación" (el docente lo elige y lo ve antes de publicar) | No; es la ubicación del lugar |
| `alertas` | Sí | GPS del teléfono al crear la alerta | **Sí** (H2, E) |
| `puntos`, `servicios`, `paradas` | Sí | Datos del lugar | No |
| `usuarios`, `avisos`, `mensajes`, `reportes`, `valoraciones` | No | — | — |

| Paso | Resultado esperado | Resultado |
|---|---|---|
| Revisar el esquema (tabla anterior) | Ninguna colección guarda un historial de ubicaciones del docente | ⬜ |
| Usar Servicios y Mapa con el permiso concedido y revisar Firestore | No se escribe ningún documento con la posición del usuario | ⬜ |
| Negar el permiso de ubicación | Mapa, Servicios y Lugares siguen funcionando | ⬜ |

### S11 · Retención, respaldo y registros — SRS 6.2, RNF-24 · IN · Responsable: Alexis y Carlos

| Paso | Resultado esperado | Resultado |
|---|---|---|
| Eliminar una cuenta de prueba (cuando exista RF-09) | Sus datos personales se borran; sus publicaciones quedan como "Docente anónimo" | ⬜ (H8) |
| Eliminar un lugar con valoraciones | Las valoraciones dejan de verse (quedan huérfanas, H8 aceptado en T-13) | ⬜ |
| Revisar los respaldos de Firestore | Respaldo diario durante el piloto | ⬜ (requiere plan Blaze o exportación manual) |
| Revisar los `console.warn` del código | Solo mensajes de error; sin correos, tokens ni texto de mensajes | ✅ 26 nov (revisión del código) |

---

## 4. Casos de Rules Playground (S5, S6, S8, S9)

**Preparación:**

1. Firebase Console → Firestore → **Reglas**: pegar el `firestore.rules` de esta rama
   (Rules Playground usa las reglas del editor, aunque no estén publicadas).
2. Tener en Firestore:
   - `usuarios/UID_A` y `usuarios/UID_B` con `rol: "docente"`;
   - `usuarios/UID_ADMIN` con `rol: "admin"` (puesto a mano);
   - un lugar, un mensaje y una alerta de A.

   Las funciones `esAdmin()` y los `get()` de las reglas leen esos datos reales.
3. En **Rules Playground** elegir el tipo de operación y la ruta. Marcar **Authenticated** y
   escribir el UID. Para `create` y `update`, escribir los datos en formato JSON.

| # | Quién (UID) | Operación | Ruta | Datos | Esperado | Resultado |
|---|---|---|---|---|---|---|
| 1 | UID_A | update | `/usuarios/UID_A` | `{"rol": "admin", ...}` | Denegado | ⬜ |
| 2 | UID_A | list | `/reportes` | — | Denegado | ⬜ |
| 3 | UID_ADMIN | list | `/reportes` | — | Permitido | ⬜ |
| 4 | UID_B | delete | `/lugares/ID_LUGAR_A` | — | Denegado | ⬜ |
| 5 | UID_ADMIN | delete | `/lugares/ID_LUGAR_A` | — | Permitido | ⬜ |
| 6 | UID_B | update | `/alertas/ID_ALERTA_A` | `{"descripcion": "otra"}` | Denegado | ⬜ |
| 7 | UID_A | create | `/lugares/ID_LUGAR_A/valoraciones/UID_A` | `{"estrellas": 5, "comentario": "", "autorId": "UID_A", ...}` | Denegado (autor de su lugar) | ⬜ |
| 8 | UID_A | create | `/alertas/ID_ALERTA_A/votos/UID_A` | `{"voto": "confirma", "fecha": 1}` | Denegado (autor de su alerta) | ⬜ |
| 9 | UID_B | create | `/lugares/ID_LUGAR_A/valoraciones/UID_B` | `{"estrellas": 6, ...}` | Denegado | ⬜ |
| 10 | UID_B | create | `/lugares/NUEVO` | `{"categoria": "Antro", "autorId": "UID_B", ...}` | Denegado | ⬜ |
| 11 | UID_A | update | `/mensajes/ID_MENSAJE_A` | `{"autorId": "UID_B", ...}` | Denegado (corregido en B) | ⬜ |
| 12 | sin sesión | get | `/mensajes/ID_MENSAJE_A` | — | Denegado | ⬜ |
| 13 | UID_B | get | `/usuarios/UID_A` | — | Denegado (corregido en A) | ⬜ |
| 14 | UID_A | get | `/usuarios/UID_A` | — | Permitido | ⬜ |
| 15 | UID_B | create | `/mensajes/NUEVO` | texto de 1001 caracteres | Denegado (B) | ⬜ |
| 16 | UID_B | create | `/mensajes/NUEVO` | mensaje válido con un campo extra `{"rol": "admin"}` | Denegado (B) | ⬜ |
| 17 | UID_B | create | `/mensajes/NUEVO` | mensaje válido con `autorId: "UID_A"` | Denegado | ⬜ |
| 18 | UID_B | update | `/avisos/UID_A` | `{"pushToken": "ExponentPushToken[x]"}` | Denegado (A) | ⬜ |
| 19 | UID_B | update | `/puntos/ID_PUNTO_B` | `{"autorId": "UID_A", ...}` | Denegado tras aplicar C · **hoy permitido** | ⬜ |
| 20 | UID_B | list | `/alertas/ID_ALERTA_A/votos` | — | Denegado según RN-04 · **hoy permitido** (H2) | ⬜ |

Por cada resultado distinto del esperado, abrir un issue
`[T-28][S#][caso #] descripción` y anotarlo en la sección 6.

---

## 5. Antes de probar en el teléfono

- [ ] Publicar en Firebase Console el `firestore.rules` de esta rama.
- [ ] Los campos `salas` y `pushToken` que ya existían en `usuarios` dejan de usarse. Para
      volver a recibir avisos, cada participante tiene que **escribir de nuevo** en la sala
      (eso crea su `avisos/{uid}`). Los campos viejos de `usuarios` se pueden borrar a mano
      en la consola.
- [ ] Repetir la prueba manual de RF-24 (sección 15 de `pruebas-caja-blanca.md`).

## 6. Issues abiertos

| Issue | Revisión y caso | Hallazgo | Responsable | Estado |
|---|---|---|---|---|
| | | | | |

## 7. Paso a la matriz

En [`matriz-pruebas.md`](matriz-pruebas.md), columna ✅/❌:

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
