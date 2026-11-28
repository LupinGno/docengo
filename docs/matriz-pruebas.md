# Matriz de pruebas

Aquí juntamos todos los requisitos del SRS v1.0 y cómo se prueba cada uno. Por cada requisito
viene su caso de uso, las pruebas automáticas que lo cubren (`CB-XXX-n`, explicadas en
[`pruebas-caja-blanca.md`](pruebas-caja-blanca.md)), la prueba manual que pide el SRS, quién
la hace y cómo salió.

## De dónde sale cada cosa

- **Requisitos y criterios:** del SRS v1.0, secciones 4 y 5 (criterios de aceptación), 9
  (trazabilidad) y 10 (cómo se verifica y se acepta).
- **Integración (T-27):** Alexis corre los flujos F1 (cuenta), F6 (hospedaje), F9 (perfil) y
  F10 (administración) y los anota en [`registro-integracion.md`](registro-integracion.md).
  Lo que salga ahí se pasa a la columna Resultado de esta matriz.
- **Seguridad (T-28):** las revisiones S1 a S11 y los casos del Área de pruebas de reglas
  están en [`revision-seguridad.md`](revision-seguridad.md).
- **Piloto (T-31 y T-32):** el protocolo, el consentimiento, la encuesta y las plantillas están
  en [`piloto/`](piloto/01-protocolo.md). La columna Piloto se llena como dice la sección 5 del
  [informe final](piloto/07-informe-final.md#5-cómo-llenar-la-columna-piloto-de-la-matriz), y
  las excepciones del criterio A-11 están en la sección 3 del mismo informe.
- **Falta:** agregar los flujos F2 a F8 cuando tengamos el Anexo B del plan de trabajo.

## Cómo leer la matriz

- **Pruebas CB:** pruebas automáticas que corren solas con `npm run revisar` y en GitHub. Un
  guion (—) quiere decir que ese requisito todavía no tiene prueba automática.
- **Prueba manual:** lo que pide el SRS para dar el requisito por bueno. Se hace en el celular.
- **Resultado:** cómo salió la prueba manual. Si sale Falla, se abre un issue en GitHub con el
  ID del requisito.
- **Piloto:** cómo salió con los docentes en el piloto. Si el piloto no lo usa, va N/A.
- **Responsable:** quién hizo esa parte, según el encabezado de cada pantalla en `src/app/`.
  "Por asignar" quiere decir que todavía nadie lo tiene.

| Valor | Qué quiere decir |
|---|---|
| Pasa | La prueba salió bien |
| Falla | La prueba salió mal; hay que abrir un issue |
| Pendiente | Todavía no se hace |
| N/A | No aplica |

### Tipos de prueba (SRS 10.1)

| Clave | Tipo | Para qué sirve |
|---|---|---|
| PF | Prueba funcional | Ver que la app hace lo que debe |
| IN | Inspección | Revisar algo sin correr la app (base de datos, repositorio, reglas) |
| DE | Demostración | Enseñarlo funcionando a los interesados |
| ME | Medición | Medir tiempos o qué tan fácil es de usar |
| PS | Prueba de seguridad | Probar que nadie entra o cambia lo que no debe |
| PP | Prueba piloto | Ver si a los docentes reales les sirve y les gusta |

---

## 1. Requisitos funcionales

### 4.1 Perfil y configuración del docente — CU-02

| ID | Prioridad | Pruebas CB | Prueba manual (criterio del SRS) | Tipo | Responsable | Resultado | Piloto |
|---|---|---|---|---|---|---|---|
| RF-01 | Media | — | Crear un perfil, cerrar sesión y comprobar que la información se conserva | PF | Carlos | Pendiente | Pendiente |
| RF-02 | Media | — | Cambiar una preferencia y verificar que las contribuciones anteriores conservan contenido y autoría | PF | Carlos | Pendiente | Pendiente |
| RF-03 | Baja | — | Cambiar el idioma y comprobar que las etiquetas se actualizan sin reiniciar los datos | PF | Por asignar | Pendiente | Pendiente |
| RF-04 | Media | CB-MAP-1 a 4, CB-PRF-1 a 6 | Configurar las categorías visibles y comprobar que el mapa las respeta en la siguiente sesión | PF | José (T-05) | Pasa | Pendiente |

### 4.2 Registro, autenticación y cuenta — CU-01

| ID | Prioridad | Pruebas CB | Prueba manual (criterio del SRS) | Tipo | Responsable | Resultado | Piloto |
|---|---|---|---|---|---|---|---|
| RF-05 | Alta | CB-VAL-1 a 6 | Registrar una cuenta y verificar mediante auditoría que la contraseña está cifrada | PF, IN | Carlos | Pendiente | Pendiente |
| RF-06 | Alta | CB-INT-1 a 6, CB-LOG-1 a 9 | Iniciar sesión con credenciales válidas e inválidas; al tercer intento la cuenta se bloquea | PF, PS | Carlos | Pendiente | Pendiente |
| RF-07 | Media | — | Solicitar el restablecimiento y completar el cambio de contraseña | PF | Carlos | Pendiente | Pendiente |
| RF-08 | Media | — | Cerrar sesión y comprobar que las funciones protegidas piden autenticación otra vez | PF, PS | Carlos | Pendiente | Pendiente |
| RF-09 | Media | — | Editar un dato y eliminar una cuenta de prueba confirmando la acción | PF | Carlos | Pendiente | Pendiente |

### 4.3 Mapa interactivo — CU-03

| ID | Prioridad | Pruebas CB | Prueba manual (criterio del SRS) | Tipo | Responsable | Resultado | Piloto |
|---|---|---|---|---|---|---|---|
| RF-10 | Alta | — | Abrir el mapa y navegar por la región piloto comprobando la carga y la respuesta | PF, DE | José | Pasa | Pendiente |
| RF-11 | Alta | — | Verificar que se muestran las tres categorías: interés, riesgo y referencia | PF | José | Pasa | Pendiente |
| RF-12 | Media | CB-CON-1 a 5, CB-FPT-1 a 6 | Seleccionar un punto y comprobar que muestra su ficha de detalle | PF | José | Pasa | Pendiente |
| RF-13 | Media | CB-PTO-1 a 18, CB-FRM-1 a 6, CB-NVP-1 a 2, CB-EDP-1 a 7, CB-FPT-7 a 9 | Registrar un punto nuevo y verificar que aparece en el mapa de otro usuario | PF | José | Pasa | Pendiente |
| RF-14 | Media | CB-GEO-1 a 10, CB-MAP-5 a 16, CB-FMA-1 a 4 | Aplicar cada filtro y comprobar que los puntos visibles corresponden | PF | José | Pasa | Pendiente |
| RF-15 | Media | — | Conceder el permiso y ver la posición; negarlo y ver el mensaje informativo | PF | José | Pasa | Pendiente |

### 4.4 Servicios cercanos — CU-04

| ID | Prioridad | Pruebas CB | Prueba manual (criterio del SRS) | Tipo | Responsable | Resultado | Piloto |
|---|---|---|---|---|---|---|---|
| RF-16 | Alta | CB-GEO2-1 a 3, CB-FSV-1 | El 100 % de los establecimientos de la BD de prueba aparecen geolocalizados | PF, IN | José | Pasa | Pendiente |
| RF-17 | Alta | CB-GEO-1 a 10, CB-LSV-1 a 4, CB-LST-2 | Buscar una categoría y verificar que solo se listan resultados de ella | PF | José | Pasa | Pendiente |
| RF-18 | Media | CB-SRV-1 a 12, CB-FSV-1 a 5 | Abrir la ficha de un servicio y comprobar los campos mostrados | PF | José | Pasa | Pendiente |
| RF-19 | Media | CB-GEO-1 a 10, CB-LSV-3, CB-LST-4 | Ordenar por cercanía y verificar el orden de la lista | PF | José | Pasa | Pendiente |

### 4.5 Chat comunitario — CU-05

| ID | Prioridad | Pruebas CB | Prueba manual (criterio del SRS) | Tipo | Responsable | Resultado | Piloto |
|---|---|---|---|---|---|---|---|
| RF-20 | Alta | — | Enviar y recibir mensajes sin errores desde al menos dos dispositivos | PF, DE | Alexis | Pendiente | Pendiente |
| RF-21 | Media | CB-SAL-1 a 3 | A escribe en Uriangato · Escuela; B lo ve ahí y **no** en Yuriria · Escuela | PF | Alexis | Pendiente | Pendiente |
| RF-22 | Alta | CB-RES-1 a 2 | A publica una duda; B la responde con cita; ambos ven la respuesta en la conversación | PF | Alexis | Pendiente | Pendiente |
| RF-23 | Baja | — | Enviar un mensaje con imagen y comprobar que el receptor lo recibe | PF | Por asignar | Pendiente | Pendiente |
| RF-24 | Media | CB-NOT-1 a 5 | Con la app en segundo plano en B, A escribe; la notificación llega en menos de 10 s (Plan B en Expo Go: solo con la app viva; completo con el Plan A en una development build) | PF, ME | Alexis | Pendiente | Pendiente |
| RF-25 | Media | CB-REP-1 a 4 | Reportar un mensaje y verlo en `reportes`; reportar dos veces deja un solo documento | PF, IN | Alexis | Pendiente | Pendiente |

### 4.6 Lugares destacados — CU-06

| ID | Prioridad | Pruebas CB | Prueba manual (criterio del SRS) | Tipo | Responsable | Resultado | Piloto |
|---|---|---|---|---|---|---|---|
| RF-26 | Alta | CB-LUG-1 a 6 | Publicar al menos 5 lugares desde la app y verlos desde otra cuenta | PF, DE | Alexis | Pendiente | Pendiente |
| RF-27 | Alta | CB-FLU-1 a 4 | Filtrar por localidad de la región piloto y por categoría; comprobar los resultados | PF | Alexis | Pendiente | Pendiente |
| RF-28 | Media | CB-VLR-1 a 8 | A da 5 y B da 3: promedio de 4.0 estrellas; A cambia a 4: promedio de 3.5 (siguen siendo 2 votos) | PF | Alexis | Pendiente | Pendiente |
| RF-29 | Media | CB-VLR-9 | Editar una publicación propia y comprobar que el cambio persiste; otra cuenta no puede editarla | PF, PS | Alexis | Pendiente | Pendiente |

### 4.7 Alertas de inseguridad — CU-07

| ID | Prioridad | Pruebas CB | Prueba manual (criterio del SRS) | Tipo | Responsable | Resultado | Piloto |
|---|---|---|---|---|---|---|---|
| RF-30 | Alta | — | Registrar una alerta con descripción y comprobar su publicación en la zona | PF | Carlos | Pendiente | Pendiente |
| RF-31 | Alta | CB-ZON-1 a 8, CB-CRI-1 a 3 | Toda zona marcada como riesgo despliega su alerta | PF, DE | Carlos, José | Pasa | Pendiente |
| RF-32 | Media | CB-ZON-5, CB-CRI-1, CB-LEY-1 | Registrar alertas de distinto nivel y comprobar la clasificación mostrada | PF | Carlos | Pendiente | Pendiente |
| RF-33 | Media | — | Simular cercanía a una zona con alerta y comprobar la notificación | PF | Carlos | Pendiente | Pendiente |
| RF-34 | Media | — | Confirmar una alerta existente y comprobar que su estado se actualiza | PF | Carlos | Pendiente | Pendiente |

### 4.8 Hospedaje — CU-08

| ID | Prioridad | Pruebas CB | Prueba manual (criterio del SRS) | Tipo | Responsable | Resultado | Piloto |
|---|---|---|---|---|---|---|---|
| RF-35 | Alta | — | Al menos 3 opciones por localidad piloto con contacto funcional | PF, IN | Carlos | Pendiente | Pendiente |
| RF-36 | Media | — | Publicar una opción y comprobar que los datos de contacto funcionan | PF | Carlos | Pendiente | Pendiente |
| RF-37 | Media | — | Aplicar cada filtro (localidad, tipo, precio) y comprobar los resultados | PF | Carlos | Pendiente | Pendiente |
| RF-38 | Media | — | Iniciar el contacto desde la ficha y comprobar que se abre el medio | PF | Carlos | Pendiente | Pendiente |

### 4.9 Transporte público — CU-09

| ID | Prioridad | Pruebas CB | Prueba manual (criterio del SRS) | Tipo | Responsable | Resultado | Piloto |
|---|---|---|---|---|---|---|---|
| RF-39 | Alta | CB-TRA-14, CB-CPA-1 | Las paradas registradas aparecen geolocalizadas en el mapa | PF | José | Pasa | Pendiente |
| RF-40 | Alta | CB-COB-1 a 4, CB-ZEL-1 a 3, CB-PTR-1 a 5 | Consultar una zona sin transporte y comprobar la alerta de medio alternativo | PF, DE | José | Pasa | Pendiente |
| RF-41 | Media | CB-TRA-1 a 13, CB-FPA-1 a 5 | Abrir la ficha de una parada y comprobar el horario | PF | José | Pasa | Pendiente |
| RF-42 | Media | CB-HOR-1 a 5, CB-DUR-1 a 4, CB-VHO-1 a 4, CB-VPA-1 a 5, CB-ARM-1 a 4, CB-NPA-1 a 5, CB-AHO-1 a 6, CB-FPA-6 a 7, CB-ACC-6 | Actualizar un horario y comprobar su publicación en la ficha | PF | José | Pasa | Pendiente |

### 4.10 Administración y moderación — CU-10

| ID | Prioridad | Pruebas CB | Prueba manual (criterio del SRS) | Tipo | Responsable | Resultado | Piloto |
|---|---|---|---|---|---|---|---|
| RF-43 | Media | — | Cambiar el rol de un usuario de prueba y comprobar los permisos resultantes | PF, PS | Por asignar | Pendiente | N/A |
| RF-44 | Media | — | Cargar un lote de servicios y comprobar su disponibilidad en la app | PF | Por asignar | Pendiente | N/A |
| RF-45 | Media | — | Ocultar un contenido reportado (p. ej. desde `reportes`) y comprobar que deja de verse | PF, PS | Por asignar | Pendiente | N/A |

---

## 2. Requisitos no funcionales

| ID | Atributo | Caso(s) de uso | Pruebas CB | Prueba manual (criterio del SRS) | Tipo | Responsable | Resultado | Piloto |
|---|---|---|---|---|---|---|---|---|
| RNF-01 | Seguridad | CU-01 | — | Ninguna contraseña legible en BD ni repositorio; la clave no está en el código (`git grep`) | IN | Alexis, Carlos (T-28) | Pendiente | N/A |
| RNF-02 | Seguridad | CU-01 | — | Reutilizar un token después de cerrar sesión; el backend lo rechaza | PS | Alexis, Carlos (T-28) | Pendiente | N/A |
| RNF-03 | Seguridad | CU-01 | — | Invocar la API con un rol sin permiso; la operación se rechaza (Área de pruebas de reglas) | PS | Alexis, Carlos (T-28) | Pendiente | N/A |
| RNF-04 | Seguridad | CU-01, CU-05 | CB-VAL-1 a 6, CB-REP-1 a 3 | Enviar cargas maliciosas en formularios y chat; se rechazan o se muestran como texto plano | PS | Alexis, Carlos (T-28) | Pendiente | N/A |
| RNF-05 | Privacidad | CU-03, CU-07 | — | Revisar perfiles, publicaciones y chat desde otra cuenta: no se ven correo ni teléfono | IN, PS | Alexis, Carlos (T-28) | Pendiente | N/A |
| RNF-06 | Privacidad | CU-03, CU-07 | — | Revisar el esquema y el tráfico: no se guarda historial de ubicaciones | IN | José | Pendiente | N/A |
| RNF-07 | Rendimiento | CU-03, CU-05 | — | Navegación local en menos de 1 s en el 95 % de una muestra de interacciones | ME | Equipo | Pendiente | Pendiente |
| RNF-08 | Rendimiento | CU-03 | — | 20 cargas del mapa en 4G: 10 s o menos en al menos el 90 % | ME | José | Pendiente | Pendiente |
| RNF-09 | Rendimiento | CU-05 | — | 50 mensajes entre dos dispositivos: 10 s o menos en al menos el 90 % | ME | Alexis | Pendiente | Pendiente |
| RNF-10 | Rendimiento | CU-03, CU-05 | CB-LOG-9 | Simular red lenta y verificar el indicador de progreso | PF | Equipo | Pendiente | Pendiente |
| RNF-11 | Rendimiento | CU-03, CU-05 | — | Prueba de carga con 30 sesiones simultáneas | ME | Equipo | Pendiente | N/A |
| RNF-12 | Usabilidad | CU-01, CU-04, CU-07 | — | Flujo "registrarse, buscar un servicio cercano y ver una alerta" sin ayuda en al menos el 70 %, tras una inducción de 10 minutos o menos (tareas T1 a T3 de la [hoja de observación](piloto/04-hoja-observacion.md)) | ME, PP | Alexis (T-32) | Pendiente | Pendiente |
| RNF-13 | Usabilidad | Todos | — | Encuesta al final del piloto con al menos 80 % de satisfacción: respuestas de 4 o 5 sobre el total de las 9 preguntas ([encuesta](piloto/03-encuesta.md)) | PP | Alexis (T-31, T-32) | N/A | Pendiente |
| RNF-14 | Usabilidad | Todos | CB-ERR-1 a 3, CB-LOG-8 | Revisar el catálogo de errores: cada uno indica causa y acción | IN | Equipo | Pendiente | Pendiente |
| RNF-15 | Usabilidad | Todos | CB-FLG-1 a 3 | Cada sección principal se alcanza en 3 toques o menos | IN | Equipo | Pendiente | Pendiente |
| RNF-16 | Accesibilidad | CU-07 | — | Revisar las alertas en escala de grises: el nivel se distingue por texto o icono | IN | Carlos | Pendiente | N/A |
| RNF-17 | Compatibilidad | Todos | — | Flujo principal en Android 10 e iOS 14 (dispositivo o emulador) | PF | Equipo | Pendiente | N/A |
| RNF-18 | Compatibilidad | Todos | — | Pantallas principales en 5" y 6.9" sin cortes ni desplazamiento horizontal | IN | Equipo | Pendiente | N/A |
| RNF-19 | Compatibilidad | Todos | — | Negar cada permiso por separado y recorrer todos los módulos | PF | Equipo | Pendiente | Pendiente |
| RNF-20 | Confiabilidad | CU-03, CU-05 | — | Quitar la red durante un envío (alerta, punto, hospedaje, lugar, mensaje, reporte); los datos se conservan | PF | Equipo | Pendiente | Pendiente |
| RNF-21 | Confiabilidad | CU-05 | — | Enviar un mensaje sin red, reactivarla y comprobar la entrega | PF | Alexis | Pendiente | Pendiente |
| RNF-22 | Confiabilidad | CU-03 | — | Consultar con red, desactivarla, reabrir y ver la información con su fecha | PF | Equipo | Pendiente | Pendiente |
| RNF-23 | Confiabilidad | CU-03, CU-05 | — | Detener el chat y comprobar que mapa, servicios y alertas siguen funcionando | PF | Equipo | Pendiente | N/A |
| RNF-24 | Confiabilidad | — | — | Restaurar un respaldo en un entorno de pruebas y verificar la integridad | PF, IN | Por asignar | Pendiente | N/A |
| RNF-25 | Mantenibilidad | CU-03 | — | Sustituir el adaptador de mapas por uno de prueba sin otros cambios | PF, IN | José | Pendiente | N/A |
| RNF-26 | Mantenibilidad | CU-10 | — | Inspeccionar la estructura del proyecto y la documentación de la API | IN | Equipo | Pendiente | N/A |
| RNF-27 | Mantenibilidad | CU-10 | — | Dar de alta una región de prueba solo con datos y verificar su funcionamiento | PF | Por asignar | Pendiente | N/A |

---

## 3. Trazabilidad por necesidad (SRS sección 9)

| Necesidad | Requisitos | Caso(s) de uso | Evidencia principal | Prioridad | Estado |
|---|---|---|---|---|---|
| Acceso seguro con cuenta autenticada | RF-05 a RF-09; RNF-01 a RNF-04; RN-03, RN-06 | CU-01 | Auditoría del almacenamiento de contraseñas y prueba de bloqueo al tercer intento | Alta | Pendiente |
| Personalizar la experiencia del docente | RF-01 a RF-04 | CU-02 | Persistencia de perfil y preferencias | Media | Pendiente |
| Explorar la zona antes de llegar y durante la estancia | RF-10 a RF-15; RNF-08, RNF-22 | CU-03 | Prueba funcional del mapa y 20 cargas en 4G | Alta | Pendiente |
| Localizar servicios esenciales cercanos | RF-16 a RF-19 | CU-04 | BD de prueba con 100 % de servicios geolocalizados | Alta | Pendiente |
| Resolver dudas con la comunidad docente | RF-20 a RF-25; RNF-09, RNF-21 | CU-05 | Prueba entre dos dispositivos y latencia con 50 mensajes | Alta | Pendiente |
| Conocer lugares recomendados por la comunidad | RF-26 a RF-29 | CU-06 | Al menos 5 registros de prueba y verificación de filtros | Alta | Pendiente |
| Anticipar riesgos de seguridad en la zona | RF-30 a RF-34; RNF-16; RN-02, RN-04, RN-05 | CU-07 | Alertas en zonas de riesgo y revisión en escala de grises | Alta | Pendiente |
| Encontrar hospedaje | RF-35 a RF-38; RN-07 | CU-08 | Al menos 3 opciones por localidad con contacto funcional | Alta | Pendiente |
| Conocer el transporte disponible | RF-39 a RF-42 | CU-09 | Paradas geolocalizadas y alerta de medio alternativo | Alta | Pendiente |
| Mantener la calidad del contenido comunitario | RF-43 a RF-45; RN-01, RN-08 | CU-10 | Pruebas de roles y de ocultamiento de contenido reportado | Media | Pendiente |
| Proteger la privacidad de los docentes | RNF-05, RNF-06; RN-04, RN-07; SRS 6.2 | CU-03, CU-07 | Revisión del esquema, del tráfico y de perfiles desde otra cuenta | Alta | Pendiente |
| Funcionar con conectividad limitada | RNF-20 a RNF-23 | CU-03, CU-05 | Pruebas con la red desactivada o lenta | Alta | Pendiente |
| Rendimiento aceptable en el dispositivo de prueba | RNF-07 a RNF-11 | CU-03, CU-05 | Mediciones y prueba de carga con 30 sesiones | Alta | Pendiente |
| Facilidad de uso y satisfacción docente | RNF-12 a RNF-15 | CU-01, CU-04, CU-07 | Prueba de usabilidad y encuesta en el piloto | Alta | Pendiente |
| Sustituir el proveedor de mapas y sumar regiones | RNF-25 a RNF-27; R-02 | CU-03, CU-10 | Adaptador de prueba y alta de una región solo con datos | Alta | Pendiente |

---

## 4. Criterios de aceptación del MVP (SRS 10.2)

| # | Criterio | Requisitos | Resultado |
|---|---|---|---|
| A-1 | La app se instala y ejecuta el flujo principal en el dispositivo de prueba y en al menos un dispositivo o emulador Android e iOS | RNF-17 | Pendiente |
| A-2 | El flujo "registrarse, buscar un servicio cercano y consultar la alerta de una zona" funciona de extremo a extremo | RF-05, RF-16, RF-31 | Pendiente |
| A-3 | Las contraseñas se almacenan de forma segura y la cuenta se bloquea al tercer intento fallido | RF-05, RF-06, RNF-01 | Pendiente |
| A-4 | El mapa muestra las tres categorías de puntos y toda zona de riesgo despliega su alerta | RF-11, RF-31 | Pendiente |
| A-5 | Los establecimientos de la BD de prueba aparecen geolocalizados | RF-16 | Pendiente |
| A-6 | El mapa carga en segundos en al menos el 90 % de 20 pruebas | RNF-08 | Pendiente |
| A-7 | El chat entrega los mensajes entre dos dispositivos en segundos | RF-20, RNF-09 | Pendiente |
| A-8 | La región piloto tiene al menos 5 lugares destacados y 3 opciones de hospedaje por localidad con contacto funcional (conteo en [`datos-piloto.md`](datos-piloto.md)) | RF-26, RF-35 | Pendiente |
| A-9 | Las paradas aparecen en el mapa y la alerta de medio alternativo se despliega en zonas sin cobertura | RF-39, RF-40 | Pendiente |
| A-10 | Los casos de prueba de prioridad Alta se ejecutan sin defectos críticos abiertos | Todos los de prioridad Alta | Pendiente |
| A-11 | El piloto alcanza buen nivel de satisfacción y de finalización del flujo principal, o se documentan las excepciones (resultados y excepciones en el [informe final](piloto/07-informe-final.md)) | RNF-12, RNF-13 | Pendiente |
| A-12 | El prototipo se entrega validado antes de terminar la primera semana de diciembre de 2026 | — | Pendiente |

---

## 5. Resumen de pruebas automáticas existentes

| Prefijo | Casos | Archivo | Requisito(s) |
|---|---|---|---|
| CB-VAL | 1 a 6 | `__tests__/lib/validacion.test.ts` | RF-05, RNF-04 |
| CB-INT | 1 a 6 | `__tests__/lib/intentos.test.ts` | RF-06 |
| CB-LOG | 1 a 9 | `__tests__/pantallas/login.test.tsx` | RF-06, RNF-10, RNF-14 |
| CB-ERR | 1 a 3 | `__tests__/lib/errores.test.ts` | RNF-14 |
| CB-GEO | 1 a 10 | `__tests__/lib/geo.test.ts` | RF-14, RF-17, RF-19 |
| CB-FLG | 1 a 3 | `__tests__/lib/flags.test.ts` | RNF-15 (secciones visibles por flag) |
| CB-SAL | 1 a 3 | `__tests__/lib/salas.test.ts` | RF-21 |
| CB-RES | 1 a 2 | `__tests__/lib/respuestas.test.ts` | RF-22 |
| CB-REP | 1 a 4 | `__tests__/lib/reportes.test.ts` | RF-25, RNF-04 |
| CB-LUG | 1 a 6 | `__tests__/lib/lugares.test.ts` | RF-26 |
| CB-FLU | 1 a 4 | `__tests__/lib/filtros-lugares.test.ts` | RF-27 |
| CB-VLR | 1 a 9 | `__tests__/lib/valoraciones.test.ts` | RF-28, RF-29 |
| CB-NOT | 1 a 5 | `__tests__/lib/notificaciones.test.ts` | RF-24 |
| CB-PRM | 1 a 4 | `__tests__/lib/permisos.test.ts` | RF-13, RF-29, RF-45 |
| CB-CON | 1 a 5 | `__tests__/lib/contacto.test.ts` | RF-12 |
| CB-FPT | 1 a 9 | `__tests__/pantallas/punto.test.tsx` | RF-12, RF-13 |
| CB-PTO | 1 a 18 | `__tests__/lib/puntos.test.ts` | RF-13 |
| CB-FRM | 1 a 6 | `__tests__/pantallas/formulario-punto.test.tsx` | RF-13 |
| CB-NVP | 1 a 2 | `__tests__/pantallas/nuevo-punto.test.tsx` | RF-13 |
| CB-EDP | 1 a 7 | `__tests__/pantallas/editar-punto.test.tsx` | RF-13 |
| CB-MAP | 1 a 16 | `__tests__/lib/mapa.test.ts` | RF-04, RF-14 |
| CB-PRF / CB-FMA | 1 a 6 / 1 a 4 | `__tests__/pantallas/filtros-mapa.test.tsx` | RF-04, RF-14 |
| CB-SRV / CB-GEO2 / CB-LSV | 1 a 12 / 1 a 3 / 1 a 4 | `__tests__/lib/servicios.test.ts` | RF-16 a RF-19 |
| CB-FSV / CB-LST | 1 a 5 / 1 a 5 | `__tests__/pantallas/servicios.test.tsx` | RF-16 a RF-19 |
| CB-ZON | 1 a 8 | `__tests__/lib/zonas.test.ts` | RF-31, RF-32 |
| CB-CRI / CB-LEY / CB-ACC | 1 a 3 / 1 / 1 a 6 | `__tests__/pantallas/capa-riesgo.test.tsx` | RF-31, RF-32, RF-42 |
| CB-TRA / CB-COB / CB-ZEL / CB-HOR / CB-DUR / CB-VHO / CB-VPA / CB-ARM | varios | `__tests__/lib/transporte.test.ts` | RF-39 a RF-42 |
| CB-FPA / CB-CPA | 1 a 7 / 1 | `__tests__/pantallas/parada.test.tsx` | RF-39, RF-41, RF-42 |
| CB-PTR / CB-NPA / CB-AHO | 1 a 5 / 1 a 5 / 1 a 6 | `__tests__/pantallas/transporte.test.tsx` | RF-40, RF-42 |
| DAT | 1 a 4 (validación de datos, no caja blanca) | `__tests__/datos/lugares-piloto.test.ts` | RF-26, RF-27, A-8 ([`datos-piloto.md`](datos-piloto.md)) |
