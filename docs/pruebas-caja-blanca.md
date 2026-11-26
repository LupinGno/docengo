# Pruebas de caja blanca — DocenGo

Cada función con lógica tiene sus caminos independientes calculados con la
complejidad ciclomática **V(G) = decisiones + 1**. Cada camino tiene al menos
una prueba automática (Jest) con un identificador `CB-XXX-n`.

- Las pruebas viven en `__tests__/`.
- La lógica de `src/lib/` debe tener **100 % de ramas cubiertas** (`npm run test:cobertura`).
- ESLint rechaza funciones con V(G) mayor que 10.
- Cada Pull Request que agregue lógica agrega aquí su sección.

---

## 1. Validación del registro (RF-05) — `src/lib/validacion.ts`

**`validarRegistro(nombre, correo, contrasena)`** — 3 decisiones → **V(G) = 4**

| Caso | Camino | Resultado esperado |
|---|---|---|
| CB-VAL-1 | Nombre vacío | "Escribe tu nombre." |
| CB-VAL-2 | Correo inválido | "Escribe un correo válido." |
| CB-VAL-3 | Contraseña de menos de 8 caracteres | "La contraseña debe tener al menos 8 caracteres." |
| CB-VAL-4 | Todo correcto | `null` |

**`correoValido(correo)`** — se prueban ambos resultados de la expresión regular.

| Caso | Entrada | Resultado |
|---|---|---|
| CB-VAL-5 | Correo correcto con espacios alrededor | `true` |
| CB-VAL-6 | Sin dominio, o con espacio en medio | `false` |

## 2. Contador de intentos (RF-06) — `src/lib/intentos.ts`

| Caso | Función | Qué se comprueba |
|---|---|---|
| CB-INT-1 | `registrarFallo` | 1.º y 2.º fallo no bloquean (`fallidos >= 3` falso) |
| CB-INT-2 | `registrarFallo` | El 3.er fallo bloquea (`fallidos >= 3` verdadero) |
| CB-INT-3 | `registrarFallo` | No modifica el estado original |
| CB-INT-4 | `intentosRestantes` | Quedan intentos (gana `3 - fallidos`) |
| CB-INT-5 | `intentosRestantes` | Nunca negativo (gana `0` en `Math.max`) |
| CB-INT-6 | `registrarExito` | Reinicia el contador |

## 3. Mensajes de error (RNF de usabilidad) — `src/lib/errores.ts`

**`mensajeDeError(codigo)`** — 2 decisiones (`codigo &&`, `||`) → **V(G) = 3**

| Caso | Entrada | Resultado |
|---|---|---|
| CB-ERR-1 | Código conocido | Su mensaje en español |
| CB-ERR-2 | Código desconocido | "Ocurrió un error. Intenta de nuevo." |
| CB-ERR-3 | Sin código | "Ocurrió un error. Intenta de nuevo." |

## 4. Distancias (RF-14, RF-17, RF-19) — `src/lib/geo.ts`

| Caso | Función | Qué se comprueba |
|---|---|---|
| CB-GEO-1 | `distanciaKm` (V(G) = 1) | Mismo punto da 0 |
| CB-GEO-2 | `distanciaKm` | Yuriria–Moroleón entre 8 y 14 km, y es simétrica |
| CB-GEO-3 | `filtrarPorDistancia` | Lista vacía: el ciclo no se ejecuta |
| CB-GEO-4 | `filtrarPorDistancia` | Un elemento dentro y otro fuera |
| CB-GEO-5 | `filtrarPorDistancia` | Valor límite: exactamente a `maxKm` sí entra |
| CB-GEO-6 | `ordenarPorCercania` | Ordena del más cercano al más lejano |
| CB-GEO-7 | `ordenarPorCercania` | No modifica el arreglo original |
| CB-GEO-8 | `formatearDistancia` (V(G) = 2) | Menos de 1 km → metros |
| CB-GEO-9 | `formatearDistancia` | 1 km o más → km |
| CB-GEO-10 | `formatearDistancia` | Valor límite: exactamente 1 km |

## 5. Banderas de función — `src/lib/flags.ts`

**`opcionesVisibles(opciones, flags)`** — 1 decisión compuesta (`!o.flag || flags[o.flag]`) → **V(G) = 2**,
con cobertura de condiciones múltiples = 3 casos.

| Caso | Entrada | Resultado |
|---|---|---|
| CB-FLG-1 | Opción sin flag | Se muestra |
| CB-FLG-2 | Opción con flag encendida | Se muestra |
| CB-FLG-3 | Opción con flag apagada | Se oculta |

## 6. Pantalla de inicio de sesión (RF-06) — `src/app/(auth)/login.tsx`

**`entrar()`** — **V(G) = 7** (pruebas en `__tests__/pantallas/login.test.tsx`)

| Caso | Camino |
|---|---|
| CB-LOG-1 | Cuenta bloqueada: un cuarto intento no llega a Firebase |
| CB-LOG-2 | Correo vacío: no llama a Firebase |
| CB-LOG-3 | Correo lleno y contraseña vacía: no llama a Firebase |
| CB-LOG-4 | Credenciales correctas: inicia sesión sin errores |
| CB-LOG-5 | Fallo: avisa los intentos restantes |
| CB-LOG-6 | Tercer fallo: bloquea la cuenta |
| CB-LOG-7 | Un inicio exitoso reinicia el contador |
| CB-LOG-8 | Error sin código: mensaje genérico |
| CB-LOG-9 | Mientras Firebase responde: indicador en lugar de "Entrar" |

## 7. Alertas (RF-30) — `src/lib/alertas.ts`

**`validarAlerta(borrador)`** — 5 decisiones → **V(G) = 6**

```
if (!tipo)                → 1
if (!nivel)               → 2
if (!localidad)           → 3
if (texto.length < 10)    → 4
if (texto.length > 280)   → 5
                    V(G) = 5 + 1 = 6
```

| Caso | Camino | Resultado esperado |
|---|---|---|
| CB-ALE-1 | Sin tipo | "Elige el tipo de alerta." |
| CB-ALE-2 | Sin nivel | "Elige el nivel de riesgo." |
| CB-ALE-3 | Sin localidad | "Elige la localidad." |
| CB-ALE-4 | Descripción de menos de 10 caracteres (los espacios no cuentan) | "Describe lo que pasó (mínimo 10 caracteres)." |
| CB-ALE-5 | Descripción de 281 caracteres | "La descripción no puede pasar de 280 caracteres." |
| CB-ALE-6 | Todo correcto, incluido el límite exacto de 280 | `null` |

**`armarAlerta(datos, coordenada, autorId, fecha)`** — sin decisiones → **V(G) = 1**

| Caso | Qué se comprueba |
|---|---|
| CB-ALE-7 | El documento lleva `autorId`, contadores en 0 y la descripción sin espacios sobrantes |

**Prueba manual (criterio del SRS):** registrar una alerta de cada nivel (alto, medio y bajo)
con una cuenta y verlas desde otra cuenta.
