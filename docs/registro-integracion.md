# Registro de pruebas de integración — DocenGo (T-27)

Registro de ejecución de los flujos de integración asignados a Alexis en el plan de trabajo:
**F1 (cuenta)**, **F6 (hospedaje)**, **F9 (perfil)** y **F10 (administración)**. Son
pruebas cruzadas: cada flujo prueba el módulo de otra persona con los criterios del SRS.

> **Fuente de los pasos:** el plan de trabajo solo nombra los flujos. Los pasos y los resultados
> esperados se tomaron de los casos de uso (SRS 8) y de los criterios de aceptación de los
> requisitos (SRS 4 y 5). Si el Anexo B del equipo define otros pasos, se ajusta este registro.

## Cómo se usa

1. Antes de empezar, llena **Datos de la corrida** y revisa las **Precondiciones**.
2. Ejecuta los pasos en el teléfono, en orden, y marca la columna **Resultado**.
3. Por cada ❌ abre un issue en GitHub con el formato de la sección **Issues** y escribe su
   número en la columna **Issue**.
4. Al terminar, llena el **Resumen** y pasa el resultado de cada requisito a la columna
   ✅/❌ de [`matriz-pruebas.md`](matriz-pruebas.md) (ver **Paso a la matriz**).
5. Si un paso bloqueado se desbloquea, cambia su columna **Disponible** y ejecútalo en una
   corrida nueva.

| Símbolo | Columna **Disponible** | Columna **Resultado** |
|---|---|---|
| ✅ | Se puede ejecutar hoy | Pasa |
| ◐ | Solo una parte se puede ejecutar | — |
| 🚫 | Bloqueado: falta una pantalla (se indica de quién) | No se ejecutó por bloqueo |
| ❌ | — | Falla: abrir issue |
| ⬜ | — | Sin ejecutar |

**Estado al 26 de noviembre de 2026** (rama `feat/t16-notificaciones` actualizada con `main`):
`hospedaje.tsx` y `perfil.tsx` muestran "En construcción", no hay pantalla de
administración y el login no tiene enlace para restablecer la contraseña.

---

## Datos de la corrida

| Dato | Valor |
|---|---|
| Fecha | |
| Rama y commit probados (`git log --oneline -1`) | |
| Teléfono (modelo y versión de Android/iOS) | |
| Versión de Expo Go | |
| Cuentas usadas | A: · B: · Admin: *(solo el correo de prueba, **nunca** la contraseña)* |
| Probó | Alexis |

## Precondiciones

- [ ] Se probó la rama integrada (idealmente `main` con todas las ramas fusionadas).
- [ ] `firestore.rules` de esa rama está publicado en Firebase Console → Firestore → Reglas.
- [ ] Hay acceso a Firebase Console (Authentication y Firestore) para revisar los datos.
- [ ] Correos de prueba para las cuentas **A** y **B**. Para F1 la cuenta A se crea durante el flujo.
- [ ] Para F9 paso 4: con la cuenta A ya hay un mensaje en el chat y un lugar publicado.

---

## F1 · Cuenta — CU-01 (RF-05 a RF-09) · Responsable del módulo: Carlos

**Disponible hoy:** ◐ 7 de 9 pasos.

| # | Paso | Resultado esperado | Requisito | Disponible | Resultado | Issue | Observaciones |
|---|---|---|---|---|---|---|---|
| 1.1 | En Registro, intentar crear la cuenta con nombre vacío, luego con correo inválido (`ana@`) y luego con contraseña de 7 caracteres | Un mensaje claro por cada caso; no se crea ninguna cuenta | RF-05, RNF-04 | ✅ | ⬜ | | |
| 1.2 | Registrar la cuenta A con datos válidos | Entra al mapa. En Console aparece en **Authentication** y en `usuarios/{uid}` con `rol: "docente"`; ningún campo guarda la contraseña | RF-05, RNF-01 | ✅ | ⬜ | | Firebase guarda un hash (scrypt), no AES-256: anotar como observación para T-28 |
| 1.3 | Más → **Cerrar sesión**; luego el botón atrás del teléfono | Regresa al login y el botón atrás no vuelve a pantallas protegidas | RF-08 | ✅ | ⬜ | | |
| 1.4 | Iniciar sesión con la cuenta A y datos correctos | Entra al mapa | RF-06 | ✅ | ⬜ | | |
| 1.5 | Cerrar sesión e intentar entrar 2 veces con contraseña incorrecta | Mensaje con la causa y "Intentos restantes: 2", luego "1" | RF-06, RNF-14 | ✅ | ⬜ | | |
| 1.6 | Tercer intento con contraseña incorrecta | "Cuenta bloqueada tras 3 intentos. Contacta a soporte…" y el botón **Entrar** se deshabilita | RF-06 | ✅ | ⬜ | | |
| 1.7 | Cerrar la app por completo (quitarla de recientes), reabrirla e intentar entrar con la contraseña **correcta** | La cuenta **sigue bloqueada** (SRS: el desbloqueo es por soporte) | RF-06 | ✅ | ⬜ | | Si entra, marcar ❌ y abrir issue para Carlos: el contador vive solo en la app (`src/lib/intentos.ts`) |
| 1.8 | En el login, usar "¿Olvidaste tu contraseña?", recibir el correo y cambiar la contraseña | Llega el correo; con la contraseña nueva se entra y con la anterior no | RF-07 | 🚫 Carlos (no hay enlace en el login) | ⬜ | | |
| 1.9 | En Mi perfil, editar un dato de la cuenta; luego eliminar una cuenta de prueba confirmando la acción | El dato cambia y persiste; la cuenta eliminada ya no puede iniciar sesión | RF-09 | 🚫 Carlos (perfil) | ⬜ | | |

---

## F6 · Hospedaje — CU-08 (RF-35 a RF-38) · Responsable del módulo: Carlos

**Disponible hoy:** 🚫 todo el flujo. `src/app/hospedaje.tsx` muestra "En construcción".
El paso 6.1 depende además de la carga de datos reales (T-29).

| # | Paso | Resultado esperado | Requisito | Disponible | Resultado | Issue | Observaciones |
|---|---|---|---|---|---|---|---|
| 6.1 | Más → **Hospedaje** y revisar la lista | Al menos **3 opciones por localidad** (Yuriria, Uriangato, Moroleón), cada una con contacto | RF-35, A-8 | 🚫 Carlos + T-29 | ⬜ | | |
| 6.2 | Con la cuenta A, publicar una opción con descripción, tipo, precio de referencia y contacto | Se publica y aparece en la lista | RF-36 | 🚫 Carlos | ⬜ | | |
| 6.3 | Con la cuenta B, abrir Hospedaje | Ve la opción de A con todos sus datos | RF-36 | 🚫 Carlos | ⬜ | | |
| 6.4 | Aplicar cada filtro por separado (localidad, tipo, rango de precio) y luego combinados | Solo aparecen opciones que cumplen el filtro | RF-37 | 🚫 Carlos | ⬜ | | |
| 6.5 | Desde la ficha, tocar el contacto | Se abre la app del teléfono o WhatsApp con el número correcto | RF-38 | 🚫 Carlos | ⬜ | | |
| 6.6 | Quitar la red y publicar una opción | Muestra un error comprensible y conserva lo escrito para reintentar | RNF-20 | 🚫 Carlos | ⬜ | | |
| 6.7 | Revisar la ficha desde la cuenta B | No se muestra el correo de quien publicó; solo el contacto que capturó | RNF-05 | 🚫 Carlos | ⬜ | | |

---

## F9 · Perfil — CU-02 (RF-01 a RF-04) · Responsable del módulo: Carlos (RF-03 sin responsable)

**Disponible hoy:** ◐ 2 de 6 pasos. `src/app/perfil.tsx` muestra "En construcción".

| # | Paso | Resultado esperado | Requisito | Disponible | Resultado | Issue | Observaciones |
|---|---|---|---|---|---|---|---|
| 9.1 | Después de registrar la cuenta A, abrir **Más** | Muestra "Hola, {nombre con el que se registró}" | RF-01 (parcial) | ✅ | ⬜ | | |
| 9.2 | Cerrar sesión, volver a entrar y abrir **Más** | El nombre se conserva | RF-01 (parcial) | ✅ | ⬜ | | |
| 9.3 | En Mi perfil, capturar institución, niveles y áreas de enseñanza; cerrar sesión y volver a entrar | Los datos se conservan | RF-01 | 🚫 Carlos (perfil) | ⬜ | | |
| 9.4 | Cambiar una preferencia del perfil y revisar el mensaje y el lugar publicados antes por A | Conservan su contenido y su autor | RF-02 | 🚫 Carlos (perfil) | ⬜ | | El mensaje y el lugar se preparan antes con los módulos de chat y lugares |
| 9.5 | Cambiar el idioma de la interfaz | Las etiquetas cambian sin perder datos | RF-03 | 🚫 sin responsable | ⬜ | | Prioridad Baja: si se descarta del MVP, marcar N/A en la matriz |
| 9.6 | Configurar las categorías visibles del mapa, cerrar sesión y volver a entrar | El mapa respeta la configuración en la siguiente sesión | RF-04 | 🚫 Carlos (perfil) y José (mapa) | ⬜ | | |

---

## F10 · Administración — CU-10 (RF-43 a RF-45) · Responsable del módulo: por asignar

**Disponible hoy:** 🚫 todo el flujo. No hay pantalla de administración en la app.

Las pruebas de permisos con **Rules Playground** (que un docente no pueda darse el rol de
admin, que solo el admin liste `reportes` y borre contenido ajeno) se hacen en **T-28
(Seguridad)**, no aquí.

| # | Paso | Resultado esperado | Requisito | Disponible | Resultado | Issue | Observaciones |
|---|---|---|---|---|---|---|---|
| 10.1 | Con la cuenta Admin, cambiar desde la app el rol de un usuario de prueba | El usuario obtiene o pierde los permisos de su nuevo rol | RF-43 | 🚫 falta pantalla de administración | ⬜ | | |
| 10.2 | Con la cuenta Admin, cargar un lote de servicios de prueba | Los servicios aparecen en la pestaña Servicios | RF-44 | 🚫 falta pantalla de administración | ⬜ | | Revisar si el script de T-29 lo cubre |
| 10.3 | B reporta un mensaje de A; Admin revisa el reporte y oculta o elimina el mensaje desde la app | El reporte se ve en la app del admin; el mensaje deja de verse para A y B | RF-45 | 🚫 falta pantalla de administración | ⬜ | | El reporte ya se puede crear (T-07); falta la parte del admin |

---

## Resumen

| Flujo | Pasos | ✅ | ❌ | 🚫 | Issues |
|---|---|---|---|---|---|
| F1 · Cuenta | 9 | | | | |
| F6 · Hospedaje | 7 | | | | |
| F9 · Perfil | 6 | | | | |
| F10 · Administración | 3 | | | | |
| **Total** | **25** | | | | |

## Issues

Un issue por cada ❌, en GitHub, asignado a quien es responsable del módulo:

- **Título:** `[T-27][F1][RF-06] El bloqueo no persiste al reabrir la app`
- **Cuerpo:** pasos para reproducirlo, resultado esperado, resultado obtenido, teléfono y
  commit probados, y una captura de pantalla.

| Issue | Flujo y paso | Requisito | Responsable | Estado |
|---|---|---|---|---|
| | | | | |

## Paso a la matriz

En [`matriz-pruebas.md`](matriz-pruebas.md), columna ✅/❌ de cada requisito:

- **✅** si **todos** sus pasos pasaron.
- **❌** si **al menos uno** falló (con su issue).
- **⬜** si algún paso quedó bloqueado y ninguno falló.

| Requisito | Pasos |
|---|---|
| RF-01 | 9.1, 9.2, 9.3 |
| RF-02 | 9.4 |
| RF-03 | 9.5 |
| RF-04 | 9.6 |
| RF-05 | 1.1, 1.2 |
| RF-06 | 1.4, 1.5, 1.6, 1.7 |
| RF-07 | 1.8 |
| RF-08 | 1.3 |
| RF-09 | 1.9 |
| RF-35 | 6.1 |
| RF-36 | 6.2, 6.3 |
| RF-37 | 6.4 |
| RF-38 | 6.5 |
| RF-43 | 10.1 |
| RF-44 | 10.2 |
| RF-45 | 10.3 |
| RNF-01 | 1.2 (junto con la inspección de T-28) |
| RNF-04 | 1.1 |
| RNF-05 | 6.7 |
| RNF-14 | 1.5 |
| RNF-20 | 6.6 |
