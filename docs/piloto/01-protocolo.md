# Protocolo de la prueba piloto — DocenGo (T-31 y T-32)

Guía para el ensayo (T-31) y el piloto con docentes (T-32). Aquí está **qué se hace, quién lo
hace y en qué orden**. Los demás documentos de esta carpeta son los materiales de cada paso.

| Dato | Valor |
|---|---|
| Responsable | Alexis |
| Ensayo (T-31) | Viernes 4 de diciembre de 2026, 3 h |
| Piloto (T-32) | Sábado 5 de diciembre de 2026, 1 h, y después el análisis |
| Región | Yuriria, Uriangato y Moroleón |
| Participantes | **15 docentes o más** (análisis de requerimientos, 2.2) |
| Dispositivos | Teléfonos del equipo con **Expo Go**, por turnos |
| Sede | *(por definir)* |
| Rama o commit que se usa | *(anotar el día del ensayo y no cambiarlo hasta el piloto)* |

## Documentos del piloto

| # | Documento | Cuándo se usa |
|---|---|---|
| 1 | Este protocolo | Ensayo y piloto |
| 2 | [Consentimiento informado](02-consentimiento.md) | Al empezar, antes de cualquier tarea |
| 3 | [Encuesta de satisfacción](03-encuesta.md) | Se transcribe a Google Forms; se contesta al terminar el turno |
| 4 | [Hoja de observación](04-hoja-observacion.md) | Una impresa por participante, durante las tareas |
| 5 | [Checklist del ensayo](05-ensayo.md) | Viernes 4 de diciembre |
| 6 | [Plantilla de resultados](06-plantilla-resultados.md) | Después del piloto |
| 7 | [Informe final y excepciones](07-informe-final.md) | Cierre de T-32 |

## Qué se mide

| Meta | Requisito | Cómo se mide | Documento |
|---|---|---|---|
| El flujo "registrarse → servicio cercano → alerta" se completa **sin ayuda** en **el 70 % de los casos o más**, después de una inducción de **10 minutos o menos** | RNF-12, A-2 | Tareas T1 a T3 de la hoja de observación | 4 y 6 |
| **80 % de satisfacción o más** | RNF-13 | Porcentaje de respuestas con 4 o 5 en las 9 preguntas | 3 y 6 |
| Buen nivel de satisfacción y de finalización, o excepciones documentadas | A-11 | Resultados y tabla de excepciones | 7 |
| Prototipo validado antes de terminar la primera semana de diciembre | A-12 | Fecha del piloto y del informe | 7 |

Además se registra el **% de tareas completadas** de las 5 tareas, como pide el plan de trabajo
para T-32.

## Roles

| Rol | Persona | Qué hace |
|---|---|---|
| Facilitador | Alexis | Da la bienvenida, lee el consentimiento, da la inducción y lleva el tiempo general |
| Observadores | Uno por teléfono: Alexis, Carlos y José Guadalupe *(por confirmar)* | Entrega el teléfono, lee cada tarea, cronometra y llena la hoja de observación. **No ayuda** salvo en los casos de abajo |
| Apoyo técnico | El observador que tenga la laptop | Mantiene corriendo `npx expo start` y la red |

Si hay un cuarto teléfono y un cuarto observador, se reduce el número de rondas.

## Agenda del piloto (1 h, 3 teléfonos)

| Hora | Duración | Actividad | Quién |
|---|---|---|---|
| 0:00 | 5 min | Bienvenida y lectura del consentimiento (todos juntos). Se reparten las tarjetas de cuenta | Facilitador |
| 0:05 | 10 min o menos | **Inducción grupal**, cronometrada (guion abajo) | Facilitador |
| 0:15 | 40 min | **Tareas por turnos**: 3 teléfonos × 5 rondas × 8 min = 15 participantes | Observadores |
| — | 5 min por persona | Al terminar su turno, cada docente contesta la encuesta en su propio teléfono (código QR) | Cada participante |
| 0:55 | 5 min | Cierre: se recogen las tarjetas y se agradece | Facilitador |

Con 4 teléfonos alcanzan 4 rondas, y quedan 8 minutos de margen.

## Cuentas de prueba por código de participante

Cada participante recibe un **código** (P01, P02…) y una **tarjeta de cuenta** impresa. Así no
se usan sus correos ni sus nombres reales, y la app nunca guarda datos que lo identifiquen.

| Campo de la tarjeta | Valor |
|---|---|
| Código | `P01` |
| Nombre para registrarse | `Docente P01` |
| Correo | `piloto.p01@example.com` (dominio reservado; no recibe correos) |
| Contraseña | Generada para cada tarjeta, de 8 caracteres o más |

- **La cuenta la crea el participante en la tarea T1.** Las tarjetas solo traen los datos, porque
  RNF-12 mide el registro. Si T1 falla, el observador crea la cuenta con los datos de la
  tarjeta, marca T1 como "con ayuda" y el participante sigue con T2.
- Se imprimen **20 tarjetas (P01 a P20)**. Las de sobra sirven si alguien bloquea su cuenta al
  tercer intento fallido (RF-06): se le da otra tarjeta y se anota en la hoja.
- Las contraseñas **solo existen en las tarjetas impresas** y en una hoja privada del
  responsable. **Nunca se escriben en el repositorio ni en este documento.**
- La tarjeta lleva el código impreso. El participante lo escribe en la encuesta para unir su
  encuesta con su hoja de observación.
- **No hay ninguna lista que relacione nombres con códigos.** El consentimiento no pide nombre
  ni firma (ver el documento 2).

## Guion de la inducción (10 minutos o menos)

El facilitador muestra la app en un teléfono, o proyectada, y **cronometra**. La inducción
explica la app, pero **no hace las tareas de la hoja de observación**: no se registra, no abre
Servicios → Farmacias y no busca la alerta de una localidad.

1. **Qué es DocenGo (1 min).** Es una app para docentes reubicados en Yuriria, Uriangato y
   Moroleón: muestra la zona, servicios, alertas de la comunidad, chat y lugares recomendados.
   Es un prototipo.
2. **Cuenta (1 min).** Se entra con correo y contraseña. Hoy cada quien usa la de su tarjeta, no
   la suya.
3. **Pestañas (4 min).** Se recorre la barra inferior:
   - **Mapa:** la región y sus puntos.
   - **Servicios:** comercios por tipo y por cercanía.
   - **Chat:** salas por región y tema.
   - **Alertas:** reportes de seguridad hechos por docentes. **No son alertas oficiales** ni
     sustituyen a las autoridades (RN-02).
   - **Más:** lugares destacados y cerrar sesión.
4. **Qué esperamos de ustedes (2 min).** Les daremos tareas cortas. **Evaluamos la app, no a
   ustedes.** Si algo no se entiende, es un problema de la app y nos sirve saberlo. Durante la
   tarea no podemos ayudar; si se atoran, díganlo y lo anotamos.
5. **Preguntas (2 min o menos).**

**Tiempo real de la inducción:** ______ min. Si pasa de 10 minutos, se anota en el informe,
porque RNF-12 pide 10 minutos o menos.

## Reglas para los observadores

- Lee la tarea **tal como está escrita** en la hoja de observación, sin señalar la pantalla.
- **No ayudes durante la tarea.** Solo puedes ayudar si:
  - el participante lo pide o dice que se rinde, o
  - se pasa del tiempo máximo de la tarea.

  En los dos casos marca **A (con ayuda)** y anota qué ayuda diste.
- Si la app falla (error, pantalla en blanco, se cierra), marca la tarea **N (no completada)**,
  anota el error tal cual y sigue con la siguiente tarea.
- Anota lo que el participante dice en voz alta, pero **sin nombres ni datos personales**.
- **No tomes fotos ni videos** de los participantes. Las capturas de pantalla solo pueden
  mostrar la app.
- **Entre un participante y otro:**
  1. Abre Más → **Cerrar sesión**.
  2. Comprueba que el teléfono quedó en la pantalla de inicio de sesión.
  3. Cierra el teclado.

## Qué hacer si algo falla

| Problema | Qué hacer |
|---|---|
| La red de la sede no sirve | Usar el punto de acceso de un teléfono del equipo. El servidor de Expo puede correr con `npx expo start --tunnel` |
| Expo Go pierde la conexión con la laptop | La app sigue funcionando mientras no se recargue. Si se cierra, volver a escanear el QR. Lo que se tarde no cuenta como tiempo de la tarea |
| La cuenta se bloquea al tercer intento | Dar una tarjeta de sobra (P16 a P20) y anotarlo en la hoja |
| No hay farmacias o alertas en la localidad del participante | Pedir la tarea con otra localidad y anotarlo. Antes del piloto se cuentan los datos con el [conteo de T-29](../datos-piloto.md) |
| El participante no tiene teléfono para la encuesta | Prestarle un teléfono del equipo con el formulario abierto o darle la encuesta impresa. Se transcribe después |
| Se acaba el tiempo y faltan participantes | Hacer una ronda más si la sede lo permite. Si no, se registran los que sí participaron y se aplica la excepción E9 del informe |

## Después del piloto

1. Juntar las hojas de observación y descargar las respuestas de Google Forms.
2. Llenar la [plantilla de resultados](06-plantilla-resultados.md) y el
   [informe final](07-informe-final.md).
3. **Borrar los datos del piloto** después del análisis, a más tardar el 12 de diciembre de 2026:
   - Las cuentas `piloto.pXX@example.com` en Firebase Authentication.
   - Sus documentos en `usuarios` y `avisos`.
   - Sus mensajes, valoraciones y reportes.
   - Las respuestas del formulario, cuando ya estén en la hoja de cálculo.
   - Las tarjetas impresas y la hoja privada de contraseñas.
4. **Al repositorio solo suben los resultados agregados** (porcentajes, promedios, conteos y
   comentarios sin datos personales). Las hojas de observación y la exportación del formulario
   se guardan en el Drive del equipo.
