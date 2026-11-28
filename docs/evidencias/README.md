# Evidencias de las pruebas manuales

Capturas del celular (Expo Go) y de la terminal con que se dio por buena cada prueba manual de la
[matriz](../matriz-pruebas.md). Nombre: `RF-XX_descripcion.png`.

## José (27/11/2026)

| Archivo | Prueba | Resultado |
|---|---|---|
| `H11_antes.png` | Caso 21 de `revision-seguridad.md` con las reglas viejas: crear perfil con rol admin | Permitido (el hueco) |
| `H11_despues.png` | Casos 21 y P2 con las reglas de main: rol admin y rol docente | Denegado y Permitido |
| `RF-42_reglas_paradas.png` | Casos 22 y 23: otro docente cambia solo horarios y luego el nombre | Permitido y Denegado |
| `RF-04_preferencias.png` | Categorías y distancia se conservan al reabrir la app | Pasa |
| `RF-10_mapa.png` | El mapa carga y responde en la región piloto | Pasa |
| `RF-11_categorias.png` | Se ven puntos de interés, riesgo y referencia | Pasa |
| `RF-12_ficha.png` | La ficha de un punto muestra sus datos | Pasa |
| `RF-13_otra_cuenta.png` | Un punto nuevo aparece en el mapa de otra cuenta | Pasa |
| `RF-14_filtros.png` | Los filtros dejan solo los puntos que corresponden | Pasa |
| `RF-15_sin_permiso.png`, `RF-15_con_permiso.png` | Sin permiso sale el aviso; con permiso, la posición | Pasa |
| `RF-16_geolocalizado.png` | Cada servicio tiene su ubicación en el mapa | Pasa |
| `RF-17_farmacias.png` | Al elegir un tipo solo salen servicios de ese tipo | Pasa |
| `RF-18_ficha_servicio.png` | La ficha de un servicio muestra sus campos | Pasa |
| `RF-19_cercania.png` | La lista sale ordenada por cercanía | Pasa |
| `RF-31_zona_riesgo.png` | Una zona de riesgo muestra su alerta | Pasa |
| `RF-39_parada_mapa.png` | La parada registrada aparece en el mapa | Pasa |
| `RF-40_sin_transporte.png` | Zona sin paradas: aviso de medio alternativo | Pasa |
| `RF-41_ficha_parada.png` | La ficha de la parada muestra horarios y próxima salida | Pasa |
| `RF-42_nueva_parada.png`, `RF-42_horario_actualizado.png` | Alta de parada y otra cuenta actualiza el horario | Pasa |

Las pruebas de servicios usaron 8 servicios de prueba marcados "(prueba)", cargados solo para esto.
