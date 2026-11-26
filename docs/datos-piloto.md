# Datos reales de la región piloto — DocenGo (T-29)

Carga de los lugares destacados reales (RF-26) y verificación de los mínimos de datos de
todas las colecciones (SRS 10.2, criterios A-4, A-5, A-8 y A-9). La prueba del plan de trabajo
es **contar en pantalla**: lo que cuenta es lo que se ve en la app, no lo que hay en la consola.

| Dato | Valor |
|---|---|
| Responsable | Alexis |
| Lugares | `scripts/datos/lugares-piloto.json` (12 lugares, 4 por localidad) |
| Script | `scripts/cargar-lugares.mjs` (`npm run cargar:lugares`) |
| Validación automática | `__tests__/datos/lugares-piloto.test.ts` (DAT-1 a DAT-4, corre en CI) |

---

## 1. Lugares destacados

### Fuente y licencia

- Las coordenadas vienen de **OpenStreetMap**, consultadas el 26 de noviembre de 2026:
  - **Moroleón y Uriangato:** Overpass API, con lugares con nombre dentro de cada municipio.
  - **Yuriria:** Nominatim, porque Overpass no respondió.
- Las coordenadas son © colaboradores de OpenStreetMap y se usan bajo la licencia
  [ODbL](https://www.openstreetmap.org/copyright). Si la app muestra estos datos al público,
  hay que citar "© OpenStreetMap" en la pantalla de créditos o en Acerca de.
- Las descripciones las escribió el equipo; no se copiaron reseñas de Google ni de otros sitios.
- Los lugares no incluyen teléfonos, correos ni datos de personas (RNF-05).

### Lugares a verificar

**Ninguno está verificado todavía.** OpenStreetMap puede tener negocios cerrados o pines
corridos. Para cada lugar:

1. Abrir su elemento en OpenStreetMap, por ejemplo `https://www.openstreetmap.org/way/477372992`.
2. Compararlo con Google Maps o, mejor, confirmarlo en persona.
3. Revisar que el lugar existe y está abierto, que el pin cae en el lugar correcto y que la
   descripción es cierta.
4. Si todo está bien, cambiar `"verificado": false` a `true` en el JSON. Si no, corregirlo o
   cambiarlo por otro lugar.

| # | Id | Lugar | Categoría | Distancia al centro | Elemento OSM | Verificado |
|---|---|---|---|---|---|---|
| 1 | `piloto-yuriria-ex-convento` | Museo Ex Convento Agustino de San Pablo | Cultura | 0.38 km | relation/21200841 | ⬜ |
| 2 | `piloto-yuriria-jardin-principal` | Jardín Principal de Yuriria | Parque o recreación | 0.31 km | way/477372992 | ⬜ |
| 3 | `piloto-yuriria-malecon` | Malecón de la Laguna de Yuriria | Parque o recreación | 1.26 km | way/889438668 | ⬜ |
| 4 | `piloto-yuriria-crater-la-joya` | Parque Ecológico Lago-Cráter La Joya | Parque o recreación | 2.74 km | way/1245280918 | ⬜ |
| 5 | `piloto-uriangato-mercado` | Mercado Municipal de Uriangato | Compras | 1.03 km | way/363985010 | ⬜ |
| 6 | `piloto-uriangato-jardin-principal` | Jardín Principal de Uriangato | Parque o recreación | 0.61 km | way/553389850 | ⬜ |
| 7 | `piloto-uriangato-cafe-el-jardin` | Café El Jardín | Cafetería | 0.60 km | node/3684167523 | ⬜ |
| 8 | `piloto-uriangato-casa-cultura` | Casa de la Cultura de Uriangato | Cultura | 1.09 km | way/424215603 | ⬜ |
| 9 | `piloto-moroleon-plaza-principal` | Plaza Principal de Moroleón | Parque o recreación | 0.07 km | way/37574285 | ⬜ |
| 10 | `piloto-moroleon-casa-cultura` | Casa de la Cultura de Moroleón | Cultura | 1.09 km | way/732374016 | ⬜ |
| 11 | `piloto-moroleon-mercado` | Mercado Municipal de Moroleón | Compras | 0.70 km | node/443438734 | ⬜ |
| 12 | `piloto-moroleon-palapa-zavalita` | Palapa de Zavalita | Comida | 1.62 km | way/954421354 | ⬜ |

La distancia es al centro de la localidad que usa la app (`CENTRO_LOCALIDAD` en
`src/lib/alertas.ts`).

**Puntos a revisar con más cuidado:**
- Los dos negocios privados (7 y 12) pueden haber cerrado.
- Moroleón tiene **dos** "Mercado Municipal" en OSM: se eligió el del Boulevard Ponciano Vega.
  El otro es way/159593405, cerca de la calle 12 de Octubre.
- El cráter La Joya (4) está a las afueras: confirmar que el acceso es seguro.
- Faltan cafeterías y restaurantes en Yuriria: los docentes pueden sugerir los que conozcan.

### Validación automática (DAT-1 a DAT-4)

No son pruebas de caja blanca: revisan los **datos** antes de cargarlos, y corren en CI cada vez
que cambia el JSON.

| Prueba | Qué revisa |
|---|---|
| DAT-1 | Cada lugar pasa `validarLugar()` y cumple los máximos de 60 y 300 caracteres. Cada uno declara su `fuente` y un `verificado` booleano |
| DAT-2 | Hay al menos 5 lugares (RF-26, A-8) y al menos 3 por localidad, para probar los filtros (RF-27) |
| DAT-3 | Cada coordenada está a 8 km o menos del centro de su localidad (atrapa coordenadas invertidas o de otro municipio) |
| DAT-4 | Los ids son únicos y tienen el formato `piloto-<localidad>-<nombre>` |

### Cómo cargarlos

1. **Cuenta de carga.** Desde la app, registrar una cuenta docente con el nombre
   **"Equipo DocenGo"**. Será la autora de los lugares: solo ella puede editarlos o
   eliminarlos, y no puede valorarlos, así que las demás cuentas sí pueden.
2. **`.env.local`.** Copiar `.env.example` como `.env.local` (no se sube a GitHub) y llenar:
   - las variables `EXPO_PUBLIC_FIREBASE_*`;
   - `CARGA_CORREO` y `CARGA_CONTRASENA` de la cuenta de carga.
3. **Reglas.** Publicar el `firestore.rules` de la rama, que incluye el bloque de `lugares`.
4. **Simular:** `npm run cargar:lugares -- --simular` muestra qué se cargaría, sin iniciar
   sesión ni escribir.
5. **Cargar:** `npm run cargar:lugares` carga solo los verificados. Con `-- --todos` carga
   también los que faltan por verificar; úsalo solo para pruebas.
6. **Revisar la salida.** El script vuelve a leer `lugares` y muestra el total, el conteo por
   localidad y el conteo por categoría.

El script inicia sesión como docente, no con una llave de administrador. Por eso
`firestore.rules` revisa cada lugar con `lugarValido()`, igual que si se publicara desde la app.
Si se corre dos veces, actualiza los mismos documentos en lugar de duplicarlos, porque los ids
son fijos.

---

## 2. Mínimos de todas las colecciones (contar en pantalla)

Cada colección la carga su responsable. Aquí solo se **cuenta** lo que se ve en la app.

| Colección | Mínimo (SRS) | Cómo contarlo en la app | Responsable | Pantalla | Conteo | ✅/❌ |
|---|---|---|---|---|---|---|
| `lugares` | 5 o más (RF-26, A-8); meta del equipo: 3 o más por localidad | Más → Lugares destacados: "Todas" y luego cada localidad | Alexis | ✅ | Total: · Yuriria: · Uriangato: · Moroleón: | ⬜ |
| `hospedajes` | 3 o más por localidad con contacto funcional (RF-35, A-8) | Más → Hospedaje, filtrando cada localidad; tocar un contacto | Carlos | 🚫 en construcción | | ⬜ |
| `servicios` | El 100 % de los establecimientos de prueba geolocalizados (RF-16, A-5) | Pestaña Servicios: cada tipo, y que todos muestren distancia | José | ✅ | | ⬜ |
| `puntos` | Al menos 1 por categoría: interés, riesgo y referencia (RF-11, A-4) | Pestaña Mapa, activando cada filtro | José | ✅ | Interés: · Riesgo: · Referencia: | ⬜ |
| `alertas` | Cada zona de riesgo despliega su alerta (RF-31, A-4) | Pestaña Alertas y Mapa | Carlos | ✅ | | ⬜ |
| `paradas` | Paradas geolocalizadas y al menos 1 zona sin cobertura con su alerta (RF-39, RF-40, A-9) | Más → Transporte | José | 🚫 en construcción | | ⬜ |

**Fecha del conteo:** · **Teléfono:** · **Rama o commit:**

Si un mínimo no se cumple, avisar a su responsable y anotarlo en la matriz (criterios A-4, A-5,
A-8 y A-9 de [`matriz-pruebas.md`](matriz-pruebas.md)).
