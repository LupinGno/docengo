# Encuesta de satisfacción — DocenGo (T-31, RNF-13)

Texto para copiar **tal cual** a Google Forms. Tiene 4 secciones:

1. Consentimiento.
2. Datos generales, sin datos personales.
3. 9 preguntas del 1 al 5.
4. 2 preguntas abiertas.

El orden de las preguntas no se debe cambiar, porque la
[plantilla de resultados](06-plantilla-resultados.md) usa las columnas de la exportación.

## Configuración del formulario

| Ajuste de Google Forms | Valor | Por qué |
|---|---|---|
| Título | *Encuesta de satisfacción — Prueba piloto DocenGo* | |
| Recopilar direcciones de correo | **No** | No se piden datos identificables (SRS 2.5) |
| Limitar a 1 respuesta | **No** | Exige iniciar sesión con Google, y eso identifica a la persona |
| Permitir editar después de enviar | No | |
| Mostrar resumen de resultados a los participantes | No | |
| Todas las preguntas de las secciones 1 a 3 | **Obligatorias** | Para que el total de respuestas sea 9 × participantes |
| Escala de las preguntas 1 a 9 | **Escala lineal de 1 a 5**. Etiqueta en 1: "Totalmente en desacuerdo"; en 5: "Totalmente de acuerdo" | La exportación queda en números |
| Sección 1, respuesta "No acepto" | **Ir a: Enviar formulario** (opción "Ir a la sección según la respuesta") | Termina sin pedir más datos |
| Vincular con Hojas de cálculo | Sí, una hoja nueva en el Drive del equipo | Es la hoja "Encuesta" de la plantilla de resultados |
| Acceso | Liga y código QR impreso | Se contesta desde el teléfono del participante |

---

## Sección 1 · Consentimiento

**1.1** Leí la información de la prueba piloto y acepto participar. Entiendo que es voluntario,
que no se registra mi nombre y que mis respuestas se usan solo de forma agregada. *(obligatoria)*

- Sí, acepto
- No acepto → *Enviar formulario*

Descripción de la sección: copiar el texto completo de
[02-consentimiento.md](02-consentimiento.md) (de "¿Qué es DocenGo?" a "Dudas o retiro de sus
datos").

## Sección 2 · Datos generales

**2.1** Código de participante (viene en su tarjeta, por ejemplo P07). *(obligatoria, respuesta
corta)*
Validación: expresión regular `^[Pp][0-9]{2}$`, con el mensaje "Escriba la P y dos números, como
en su tarjeta."

**2.2** ¿En qué localidad trabaja o va a trabajar? *(obligatoria, opción múltiple)*
- Yuriria
- Uriangato
- Moroleón
- Otra

**2.3** ¿Ha sido reubicado o lo van a reubicar en esta región? *(obligatoria, opción múltiple)*
- Sí
- No
- No lo sé

## Sección 3 · Su opinión sobre DocenGo

Descripción de la sección: *"Marque qué tan de acuerdo está con cada frase. 1 = Totalmente en
desacuerdo, 5 = Totalmente de acuerdo."*

| # | Pregunta (escala lineal 1 a 5, obligatoria) | Módulo o aspecto | Requisito relacionado |
|---|---|---|---|
| P1 | Fue fácil crear mi cuenta e iniciar sesión. | Cuenta | RF-05, RF-06 |
| P2 | El mapa fue fácil de usar para ubicarme en la región. | Mapa | RF-10 |
| P3 | Encontré rápido un servicio cercano (farmacia, papelería, etc.). | Servicios | RF-16 a RF-19 |
| P4 | La información de alertas fue clara y entendí que son reportes de docentes, no alertas oficiales. | Alertas | RF-30, RF-31, RN-02 |
| P5 | El chat me serviría para resolver dudas con otros docentes de la región. | Chat | RF-20 a RF-22 |
| P6 | Los lugares destacados me parecen útiles para conocer la zona. | Lugares | RF-26 a RF-28 |
| P7 | Cuando algo falló, la app me dijo qué pasó y qué hacer. | Mensajes de error | RNF-14 |
| P8 | La app respondió con rapidez. | Rendimiento | RNF-07 |
| P9 | Recomendaría DocenGo a un docente que va a ser reubicado en la región. | Utilidad general | RNF-13 |

> La columna "Módulo o aspecto" y la de requisitos **no se copian** al formulario: sirven para el
> análisis.

## Sección 4 · Comentarios

**A1** ¿Qué fue lo más útil de DocenGo? *(párrafo, opcional)*

**A2** ¿Qué cambiaría o qué le faltó? *(párrafo, opcional)*

Texto antes de las preguntas abiertas: *"No escriba nombres, teléfonos ni datos personales suyos
ni de otras personas."*

Mensaje de confirmación al enviar: *"¡Gracias! Su respuesta se guardó con su código, sin su
nombre."*

---

## Columnas de la exportación

Cuando el formulario se vincula con Hojas de cálculo, las columnas quedan así. La plantilla de
resultados depende de este orden:

| Columna | Contenido |
|---|---|
| A | Marca temporal |
| B | 1.1 Consentimiento |
| C | 2.1 Código |
| D | 2.2 Localidad |
| E | 2.3 Reubicación |
| F a N | P1 a P9 (números del 1 al 5) |
| O | A1 Lo más útil |
| P | A2 Qué cambiaría |

## Prueba del formulario (T-31)

Es la prueba que pide el plan de trabajo: **llenar la encuesta una vez y borrar la respuesta.**
Se registra en el [checklist del ensayo](05-ensayo.md).

1. Abrir la liga **desde el código QR impreso**, en un teléfono sin sesión de Google.
2. Contestar con el código `P00`:
   - Elegir "No acepto" y comprobar que el formulario termina.
   - Volver a empezar, elegir "Sí, acepto" y contestar todo.
3. Comprobar que el código `X1` muestra el mensaje de validación.
4. Comprobar que **no** pide iniciar sesión ni correo.
5. En la hoja vinculada, comprobar que las columnas coinciden con la tabla de arriba y que F a N
   son números.
6. **Borrar las respuestas de prueba:**
   - En Forms: Respuestas → Individual → icono de papelera, y Respuestas → "Eliminar todas las
     respuestas".
   - En la hoja vinculada: borrar las filas de prueba, porque **borrar en Forms no las quita de
     la hoja**.
7. Comprobar que Forms muestra **0 respuestas** y que la hoja solo tiene los encabezados.
