# Plantilla de resultados — Prueba piloto DocenGo (T-32)

Cómo pasar los datos del piloto a una hoja de cálculo de Google y calcular las metas. La hoja se
guarda en el **Drive del equipo**, no en el repositorio. Al repositorio solo pasan los totales,
en el [informe final](07-informe-final.md).

La hoja tiene 4 pestañas:

| Pestaña | Contenido |
|---|---|
| **Encuesta** | La que crea Google Forms al vincularse; no se modifica |
| **Observación** | Se transcriben las hojas de observación |
| **Resultados** | Las fórmulas de abajo |
| **Comentarios** | Clasificación de las preguntas abiertas y de los comentarios en voz alta |

## 1. Pestaña "Encuesta"

Columnas según [03-encuesta.md](03-encuesta.md#columnas-de-la-exportación):

| A | B | C | D | E | F a N | O | P |
|---|---|---|---|---|---|---|---|
| Marca temporal | Consentimiento | Código | Localidad | Reubicación | P1 a P9 | Lo más útil | Qué cambiaría |

Antes de calcular:
- Las respuestas con **"No acepto"** no tienen preguntas: quedan fuera solas.
- Si un código aparece **dos veces**, se queda la primera respuesta y se anota en el informe.
- Las encuestas en papel se transcriben al final, con la marca temporal en blanco.

## 2. Pestaña "Observación"

Una fila por participante:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Código | Localidad | Inducción (min) | T1 | T2 | T3 | T4 | T5 | Flujo sin ayuda |

- En D a H va **S**, **A** o **N**, como en la hoja impresa.
- Columna I (fila 2, y copiar hacia abajo): `=Y(D2="S";E2="S";F2="S")`
- Los tiempos de cada tarea pueden ir en las columnas J a N, si se quieren analizar.

> Las fórmulas usan **`;`** y los nombres en español (`Y`, `CONTAR.SI`, `PROMEDIO`), como en una
> hoja de Google configurada en español de México. Si la hoja está en inglés, se usan `,`,
> `AND`, `COUNTIF` y `AVERAGE`.

## 3. Pestaña "Resultados"

### Metas

| Indicador | Fórmula | Meta | Requisito |
|---|---|---|---|
| Participantes con tareas | `=CONTARA('Observación'!A2:A)` | 15 o más | Análisis 2.2 |
| Participantes con encuesta | `=CONTAR.SI(Encuesta!B2:B;"Sí, acepto")` | 15 o más | Análisis 2.2 |
| **Satisfacción** | `=CONTAR.SI(Encuesta!F2:N;">=4")/CONTAR(Encuesta!F2:N)` | **80 % o más** | RNF-13 |
| **Flujo principal sin ayuda** | `=CONTAR.SI('Observación'!I2:I;VERDADERO)/CONTARA('Observación'!A2:A)` | **70 % o más** | RNF-12, A-2 |
| Inducción de 10 minutos o menos | `=MAX('Observación'!C2:C)<=10` | VERDADERO | RNF-12 |
| % de tareas completadas sin ayuda | `=CONTAR.SI('Observación'!D2:H;"S")/(5*CONTARA('Observación'!A2:A))` | Referencia (plan de trabajo) | — |
| % de tareas completadas, con o sin ayuda | `=(CONTAR.SI('Observación'!D2:H;"S")+CONTAR.SI('Observación'!D2:H;"A"))/(5*CONTARA('Observación'!A2:A))` | Referencia (plan de trabajo) | — |

Formato de porcentaje con un decimal en las celdas de satisfacción, flujo y tareas.

**Cómo se calcula la satisfacción.** Se cuentan todas las respuestas de las 9 preguntas de todos
los participantes. La satisfacción es el porcentaje de esas respuestas que son 4 o 5.

> Ejemplo: 15 participantes × 9 preguntas = 135 respuestas. Si 112 son 4 o 5, la satisfacción es
> 112 / 135 = **83.0 %** y cumple la meta.

### Por pregunta

Una fila por pregunta. Para P1 se usa la columna F, y se cambia la letra en cada fila (G, H…).

| Pregunta | Promedio | % de 4 y 5 | Respuestas de 1 y 2 |
|---|---|---|---|
| P1 Cuenta | `=PROMEDIO(Encuesta!F2:F)` | `=CONTAR.SI(Encuesta!F2:F;">=4")/CONTAR(Encuesta!F2:F)` | `=CONTAR.SI(Encuesta!F2:F;"<=2")` |
| P2 Mapa | Columna G | | |
| P3 Servicios | Columna H | | |
| P4 Alertas | Columna I | | |
| P5 Chat | Columna J | | |
| P6 Lugares | Columna K | | |
| P7 Errores | Columna L | | |
| P8 Rapidez | Columna M | | |
| P9 Recomendaría | Columna N | | |

Las preguntas con el **% de 4 y 5 por debajo de 80 %** se señalan en el informe como áreas de
mejora, con su módulo y su responsable.

### Por tarea

| Tarea | S | A | N | % S | % S + A |
|---|---|---|---|---|---|
| T1 Registrarse | `=CONTAR.SI('Observación'!D2:D;"S")` | `=CONTAR.SI('Observación'!D2:D;"A")` | `=CONTAR.SI('Observación'!D2:D;"N")` | S / participantes | (S + A) / participantes |
| T2 Servicio cercano | Columna E | | | | |
| T3 Alerta | Columna F | | | | |
| T4 Chat | Columna G | | | | |
| T5 Lugares | Columna H | | | | |

### Por localidad (opcional)

Si hay **5 participantes o más** en una localidad, se puede calcular su satisfacción con
`CONTAR.SI.CONJUNTO`. Con menos, no se reporta por separado, porque con tan pocas personas se
podría saber quién contestó qué.

## 4. Pestaña "Comentarios"

Las respuestas de A1, A2 y los comentarios en voz alta se agrupan en categorías. Se cuentan, y se
copia **un ejemplo sin datos personales** de cada categoría.

| Pregunta | Categoría | Cuántas | Ejemplo | Módulo y responsable | Issue |
|---|---|---|---|---|---|
| A1 Lo más útil | Servicios cercanos | | | José | — |
| A1 | Alertas | | | Carlos | — |
| A1 | Chat | | | Alexis | — |
| A1 | Lugares destacados | | | Alexis | — |
| A1 | Mapa | | | José | — |
| A2 Qué cambiaría | Error o falla de la app | | | | #___ |
| A2 | Algo difícil de encontrar o de entender | | | | #___ |
| A2 | Función que falta | | | | #___ |
| A2 | Datos incompletos o incorrectos | | | | #___ |
| A2 | Rapidez | | | | #___ |

Si un comentario incluye un nombre, teléfono o dirección de una persona, **se quita** antes de
copiarlo.

## 5. Errores encontrados

Por cada error de la app de las hojas de observación o de la encuesta, se abre un issue en GitHub
con el ID del requisito, igual que en la integración (T-27):

| # | Tarea o pregunta | Error (qué se vio) | Participantes afectados | Requisito | Responsable | Issue | ¿Crítico? |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | #___ | ☐ |

Un error es **crítico** si impidió terminar el flujo principal (T1 a T3). Los críticos se revisan
contra el criterio A-10.
