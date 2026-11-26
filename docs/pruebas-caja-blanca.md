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
