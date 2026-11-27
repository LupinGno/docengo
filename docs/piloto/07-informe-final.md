# Informe final de la prueba piloto — DocenGo (T-32)

Cierre de T-31 y T-32. Resume los resultados contra las metas del SRS. Documenta formalmente las
**excepciones aceptadas** (criterio A-11) y deja lista la columna **"Piloto"** de la
[matriz de pruebas](../matriz-pruebas.md).

> Solo lleva resultados **agregados**. No escribir nombres, correos, contraseñas ni respuestas
> individuales que permitan saber quién contestó.

| Dato | Valor |
|---|---|
| Responsable | Alexis |
| Fecha del ensayo | ______ ([checklist](05-ensayo.md)) |
| Fecha del piloto | ______ |
| Sede | ______ |
| Rama o commit | ______ |
| Teléfonos | ______ (Expo Go) |
| Observadores | ______ |
| Fecha del informe | ______ |

---

## 1. Resultados contra las metas

Los valores salen de la pestaña "Resultados" de la
[plantilla](06-plantilla-resultados.md).

| Indicador | Meta | Resultado | ✅/❌ | Requisito |
|---|---|---|---|---|
| Participantes | 15 o más | ______ | ⬜ | Análisis 2.2 |
| Duración de la inducción | 10 minutos o menos | ______ min | ⬜ | RNF-12 |
| **Flujo principal sin ayuda** (T1 a T3 con S) | **70 % o más** | ______ % | ⬜ | RNF-12, A-2 |
| **Satisfacción** (respuestas de 4 o 5 en P1 a P9) | **80 % o más** | ______ % | ⬜ | RNF-13 |
| % de tareas completadas sin ayuda (T1 a T5) | Referencia | ______ % | — | Plan de trabajo |
| % de tareas completadas con o sin ayuda | Referencia | ______ % | — | Plan de trabajo |
| Errores críticos abiertos | 0 | ______ | ⬜ | A-10 |
| Piloto terminado antes del 7 de diciembre de 2026 | Sí | ______ | ⬜ | A-12 |

### Por pregunta

| Pregunta | Promedio | % de 4 y 5 | ¿Área de mejora (menos de 80 %)? |
|---|---|---|---|
| P1 Cuenta | | | ☐ |
| P2 Mapa | | | ☐ |
| P3 Servicios | | | ☐ |
| P4 Alertas | | | ☐ |
| P5 Chat | | | ☐ |
| P6 Lugares | | | ☐ |
| P7 Mensajes de error | | | ☐ |
| P8 Rapidez | | | ☐ |
| P9 Recomendaría | | | ☐ |

### Por tarea

| Tarea | % S | % S + A | % N | Problema principal observado |
|---|---|---|---|---|
| T1 Registrarse | | | | |
| T2 Servicio cercano | | | | |
| T3 Alerta de una zona | | | | |
| T4 Chat | | | | |
| T5 Lugares | | | | |

## 2. Hallazgos

**Lo más útil, según los docentes:** *(de 3 a 5 viñetas con las categorías más mencionadas de
A1)*

**Lo que cambiarían:** *(de 3 a 5 viñetas de A2 y de los comentarios en voz alta)*

**Errores encontrados:**

| # | Error | Requisito | Responsable | Issue | ¿Crítico? | Estado |
|---|---|---|---|---|---|---|
| 1 | | | | #___ | ☐ | |

## 3. Excepciones (criterio A-11)

A-11 se cumple si el piloto alcanza un buen nivel de satisfacción y de finalización del flujo
principal, **"o se documentan formalmente las excepciones aceptadas"**.

Las excepciones E1 a E8 ya se conocen antes del piloto. **E9 y siguientes** se agregan si una
meta no se cumple o si algo cambia el día del piloto. Cada una necesita la firma o el visto bueno
de quien la acepta: el asesor o el profesor del proyecto.

| # | Excepción | Requisitos afectados | Por qué | Qué se hizo en el piloto | Plan después del piloto | Responsable | Aceptada por / fecha |
|---|---|---|---|---|---|---|---|
| E1 | Hospedaje en construcción | RF-35 a RF-38, A-8 (hospedaje) | El módulo no está terminado (flag `hospedaje: __DEV__`) | No hay tareas de hospedaje. La pregunta P6 es de lugares, no de hospedaje | Terminar el módulo y contar 3 o más opciones por localidad | Carlos | |
| E2 | Transporte en construcción | RF-39 a RF-42, A-9 | El módulo no está terminado (flag `transporte: __DEV__`) | No hay tareas de transporte | Terminar el módulo y cargar las paradas | José | |
| E3 | Perfil en construcción | RF-01 a RF-04, RF-09 | El módulo no está terminado (flag `perfil: __DEV__`) | La sesión se cierra desde Más | Terminar el perfil | Carlos | |
| E4 | Las alertas no se muestran en el mapa | RF-31, A-4 | RF-31 está pendiente (Carlos y José) | T3 se hace en la pestaña **Alertas** | Mostrar las alertas en el mapa y repetir T3 | Carlos, José | |
| E5 | Sin notificaciones push remotas | RF-24 | Expo Go no las permite en Android desde el SDK 53 y EAS no está configurado (Plan A en código) | No se evalúan. Expo Go usa el Plan B (notificación local con la app abierta) | Configurar EAS y probar el Plan A en un development build | Alexis | |
| E6 | Piloto en Expo Go, no en una app instalada | A-1, RNF-17 | No hay APK porque EAS no está configurado | Teléfonos del equipo con Expo Go y por turnos | Generar la APK con EAS para la entrega | Equipo | |
| E7 | El bloqueo al tercer intento solo se aplica en la app | RF-06, A-3 | Hallazgo H4 de la revisión de seguridad (T-28): al reabrir la app se puede volver a intentar. La corrección E está pendiente con Carlos | Las tarjetas de sobra cubren los bloqueos | Ver [revisión de seguridad](../revision-seguridad.md) | Carlos | |
| E8 | Lugares sin verificar en persona | RF-26 | Ver [datos-piloto.md](../datos-piloto.md) | *(anotar cuántos se cargaron con `--todos`, o "ninguno")* | Verificarlos y cambiar `verificado` a `true` | Alexis | |
| E9 | *(si aplica: menos de 15 participantes, meta no cumplida, piloto en otra fecha…)* | | | | | | |

## 4. Criterios de aceptación del MVP (SRS 10.2)

Estado al cerrar el piloto. Se copia a la sección 4 de la
[matriz de pruebas](../matriz-pruebas.md#4-criterios-de-aceptación-del-mvp-srs-102).

| # | Criterio | Evidencia | ✅/❌/Excepción |
|---|---|---|---|
| A-1 | Instalación y flujo principal en Android e iOS | Integración (T-27) y E6 | ⬜ |
| A-2 | Flujo "registrarse → servicio → alerta" de extremo a extremo | Tareas T1 a T3 | ⬜ |
| A-3 | Contraseñas seguras y bloqueo al tercer intento | Revisión de seguridad (T-28) y E7 | ⬜ |
| A-4 | Tres categorías en el mapa y alertas en las zonas de riesgo | Conteo de T-29 y E4 | ⬜ |
| A-5 | Establecimientos geolocalizados | Conteo de T-29 | ⬜ |
| A-6 | Mapa en segundos en el 90 % de 20 pruebas | RNF-08 (José) | ⬜ |
| A-7 | Chat entre dos dispositivos en segundos | RNF-09 y tarea T4 | ⬜ |
| A-8 | 5 o más lugares y 3 hospedajes por localidad | Conteo de T-29 y E1 | ⬜ |
| A-9 | Paradas y alerta de medio alternativo | E2 | ⬜ |
| A-10 | Casos de prioridad Alta sin defectos críticos abiertos | Sección 2 de este informe y la matriz | ⬜ |
| A-11 | Satisfacción y finalización, o excepciones documentadas | Secciones 1 y 3 de este informe | ⬜ |
| A-12 | Prototipo validado en la primera semana de diciembre de 2026 | Fecha del piloto | ⬜ |

## 5. Cómo llenar la columna "Piloto" de la matriz

| Requisito | Evidencia del piloto | ✅ si… |
|---|---|---|
| RF-05 | T1 | El 70 % o más completó T1 (S o A) y no hubo errores críticos |
| RF-16, RF-17, RF-19 | T2 | El 70 % o más completó T2 (S o A) |
| RF-31 | T3 | El 70 % o más completó T3; anotar "con E4" |
| RF-20, RF-21 | T4 | El 70 % o más completó T4 (S o A) |
| RF-26, RF-27, RF-28 | T5 | El 70 % o más completó T5 (S o A) |
| RNF-07 | P8 | El % de 4 y 5 en P8 es 80 % o más |
| RNF-12 | Flujo sin ayuda | El flujo sin ayuda es 70 % o más y la inducción duró 10 minutos o menos |
| RNF-13 | Satisfacción | La satisfacción es 80 % o más |
| RNF-14 | P7 y errores observados | El % de 4 y 5 en P7 es 80 % o más y cada error visto indicó causa y acción |

- **❌:** se abre un issue con el ID del requisito y se anota el número en la matriz.
- **Requisitos sin tarea en el piloto:** los que tienen ⬜ en la columna "Piloto" y no aparecen en
  esta tabla pasan a **N/A**. Los de hospedaje, transporte y perfil se marcan
  **N/A (E1, E2, E3)**.

## 6. Conclusión

*(De 3 a 5 líneas: si el prototipo queda validado, con qué excepciones y cuáles son los siguientes
pasos.)*

**Datos del piloto borrados** (cuentas, documentos y respuestas individuales): ☐ Sí, fecha
______ (ver el [protocolo](01-protocolo.md#después-del-piloto)).
