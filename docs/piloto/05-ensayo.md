# Checklist del ensayo — Viernes 4 de diciembre de 2026 (T-31)

El ensayo recorre el piloto completo **un día antes**, con 1 o 2 personas que no sean del equipo
de desarrollo, o con un compañero del equipo si no hay nadie más. Sirve para:

- encontrar fallas;
- medir tiempos;
- comprobar los datos y el formulario.

En el ensayo se usan las tarjetas **E01 y E02**, no las del piloto.

**Fecha:** ______ · **Rama o commit:** ______ · **Responsable:** Alexis

## 1. Datos y reglas (antes del ensayo)

| # | Qué revisar | Cómo | ✅/❌ |
|---|---|---|---|
| D1 | Las reglas de `firestore.rules` de la rama están publicadas | Firebase Console → Firestore → Reglas: fecha de publicación | ⬜ |
| D2 | Hay lugares cargados en cada localidad | Conteo de [datos-piloto.md](../datos-piloto.md), sección 1 | ⬜ |
| D3 | Cada localidad tiene **al menos una farmacia** en Servicios | Pestaña Servicios → Farmacias | ⬜ |
| D4 | Cada localidad tiene **al menos una alerta** | Pestaña Alertas | ⬜ |
| D5 | Las salas "*[localidad]* · Escuela" funcionan | Enviar un mensaje de prueba y borrarlo | ⬜ |
| D6 | Las tareas no dependen de módulos en construcción | Hospedaje, Transporte y Perfil quedan fuera de las tareas (excepciones E1 a E3) | ⬜ |

Si falta D3 o D4, avisar a su responsable: **José** para servicios y **Carlos** para alertas.

## 2. Teléfonos (cada uno)

| # | Qué revisar | Tel. 1 | Tel. 2 | Tel. 3 | Tel. 4 |
|---|---|---|---|---|---|
| T1 | Expo Go instalado y actualizado | ⬜ | ⬜ | ⬜ | ⬜ |
| T2 | Abre el proyecto con el QR de `npx expo start` | ⬜ | ⬜ | ⬜ | ⬜ |
| T3 | Batería al 100 % y cargador listo | ⬜ | ⬜ | ⬜ | ⬜ |
| T4 | Sin sesión iniciada: queda en la pantalla de inicio de sesión | ⬜ | ⬜ | ⬜ | ⬜ |
| T5 | Ubicación del teléfono activada | ⬜ | ⬜ | ⬜ | ⬜ |
| T6 | Notificaciones del teléfono silenciadas, salvo las de Expo Go | ⬜ | ⬜ | ⬜ | ⬜ |
| T7 | Funciona con el punto de acceso de respaldo | ⬜ | ⬜ | ⬜ | ⬜ |

## 3. Materiales impresos

| # | Material | Cantidad | ✅ |
|---|---|---|---|
| M1 | [Consentimiento](02-consentimiento.md), con la sede y el contacto llenos | 20 | ⬜ |
| M2 | [Hoja de observación](04-hoja-observacion.md) | 22 (20 del piloto y 2 del ensayo) | ⬜ |
| M3 | Tarjetas de cuenta P01 a P20 y E01 a E02 | 22 | ⬜ |
| M4 | Código QR de la encuesta | 3 o más | ⬜ |
| M5 | Encuesta impresa de respaldo | 5 | ⬜ |
| M6 | Este protocolo, con la agenda y el guion de inducción | 1 por persona del equipo | ⬜ |

## 4. Prueba del formulario

Es la prueba del plan de trabajo: **llenar la encuesta una vez y borrar la respuesta.** Los pasos
están en [03-encuesta.md](03-encuesta.md#prueba-del-formulario-t-31).

| # | Qué revisar | ✅/❌ |
|---|---|---|
| F1 | "No acepto" termina el formulario | ⬜ |
| F2 | No pide iniciar sesión con Google ni correo | ⬜ |
| F3 | El código con un formato incorrecto muestra el mensaje de validación | ⬜ |
| F4 | Las columnas de la hoja vinculada coinciden con la tabla (A a P); F a N son números | ⬜ |
| F5 | **La respuesta de prueba se borró en Forms y en la hoja** (0 respuestas) | ⬜ |

## 5. Ensayo del piloto completo

Se sigue la agenda del [protocolo](01-protocolo.md) con E01 y E02.

| # | Qué revisar | Resultado |
|---|---|---|
| R1 | Duración real de la inducción (meta: 10 minutos o menos) | ______ min |
| R2 | Duración de un turno de T1 a T5 (meta: 8 minutos o menos) | E01: ______ · E02: ______ |
| R3 | Las instrucciones de las tareas se entienden sin explicar más | ⬜ |
| R4 | El criterio de éxito de cada tarea se puede ver en pantalla | ⬜ |
| R5 | Cerrar sesión y pasar al siguiente participante toma 1 minuto o menos | ⬜ |
| R6 | La encuesta se contesta en 5 minutos o menos | ⬜ |
| R7 | Errores de la app encontrados (anotar y abrir un issue por cada uno) | |

## 6. Después del ensayo

| # | Acción | ✅ |
|---|---|---|
| L1 | Borrar las cuentas E01 y E02 en Firebase Authentication, y sus documentos en `usuarios` y `avisos` | ⬜ |
| L2 | Borrar los mensajes y las valoraciones de E01 y E02 | ⬜ |
| L3 | Borrar las respuestas de E01 y E02 del formulario y de la hoja | ⬜ |
| L4 | Ajustar la agenda (rondas y teléfonos) si R2 pasó de 8 minutos | ⬜ |
| L5 | **No cambiar la rama ni el commit** después del ensayo, salvo para corregir un error que impida el piloto | ⬜ |

## Decisión

☐ **Listo para el piloto** · ☐ **Listo con ajustes:** ______________ · ☐ **No listo:**
______________

Si el piloto no puede hacerse el 5 de diciembre, se anota como excepción en el
[informe final](07-informe-final.md), por el criterio A-12.
