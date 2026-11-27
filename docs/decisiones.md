# Registro de decisiones

Cada decisión de diseño que afecte requisitos, datos o pruebas se anota aquí, en el mismo PR donde se toma.

| Fecha | Decisión | Motivo | RF | Tarea |
|---|---|---|---|---|
| 17/11/2026 | Firebase (Auth + Firestore) en lugar de Node.js + MySQL | Autenticación y tiempo real sin servidor propio; plazo de 3 semanas | RF-05, RF-20 | Base |
| 17/11/2026 | Trunk-based development con feature flags | Integrar a diario sin mostrar módulos incompletos en el piloto | — | Base |
| 22/11/2026 | Todas las reglas de Firestore de la semana se centralizan en T-00 | Evitar conflictos de merge en `firestore.rules` y publicar una sola vez | Varios | T-00 |
| 22/11/2026 | La regla general de Firestore no se aplica a `usuarios` ni a las colecciones con reglas propias | Corrige el hallazgo H11 (un docente podía darse el rol de admin) | RF-43 | T-00 |
| 22/11/2026 | Coordenadas válidas = caja de la región piloto (lat 19.95 a 20.40, lon -101.40 a -100.95) | El prototipo se limita a la región piloto (SRS 2.5) | RF-13, RF-26, RF-30 | T-00 |
| 22/11/2026 | Los puntos de riesgo exigen descripción | Toda zona de riesgo debe mostrar su alerta con descripción (RF-31) | RF-13, RF-31 | T-02 |
| 22/11/2026 | Al editar un punto no se cambian sus coordenadas | Evita mover puntos por error; para moverlo se borra y se crea otro | RF-13 | T-02 |
| 22/11/2026 | El contacto se guarda como texto (vacío si no hay) | Firestore no acepta campos `undefined` | RF-12, RF-13 | T-02 |
| 23/11/2026 | Radio "Todos" se guarda como 0, no como null | El operador `??` cambiaría null por el valor por defecto | RF-04, RF-14 | T-05 |
| 23/11/2026 | El zoom solo se guarda si cambió más de 10 % | Evita una escritura en Firestore por cada movimiento del mapa | RF-04 | T-05 |
| 23/11/2026 | La ubicación se actualiza cada 50 m | El filtro por distancia sigue al docente sin gastar batería de más | RF-14, RF-15 | T-05 |
| 24/11/2026 | Formato de horario "H:MM a H:MM"; "0:00 a 0:00" = 24 horas | Permite calcular "Abierto ahora"; los datos reales deben seguirlo | RF-18 | T-08 |
| 24/11/2026 | El cierre es exclusivo (a las 21:00 de "9:00 a 21:00" ya está cerrado) | Evita mandar a alguien a un lugar que acaba de cerrar | RF-18 | T-08 |
| 24/11/2026 | La ficha de servicio muestra un mapa pequeño con su ubicación | Hace visible que cada servicio está geolocalizado (RF-16) | RF-16 | T-08 |
| 25/11/2026 | Puntos de riesgo y alertas se dibujan igual (zona: círculo de 300 m + globo) | Una sola forma de ver el riesgo; cumple RF-31 al 100 % | RF-31 | T-11 |
| 25/11/2026 | Los puntos de riesgo sin nivel se muestran como riesgo medio | Los puntos no tienen nivel; las alertas sí | RF-32 | T-11 |
| 25/11/2026 | Mantener presionado el mapa ofrece "Agregar punto" o "Reportar alerta aquí" | Un solo gesto para aportar contenido desde el mapa | RF-13, RF-30 | T-11 |
| 26/11/2026 | La llegada se calcula con la duración del trayecto (`duracionMin`) en vez de capturar cada hora de llegada | La comunidad solo captura un dato extra por parada | RF-41 | T-14 |
| 26/11/2026 | Si ya no hay salidas hoy se muestra la primera de mañana | El docente siempre sabe cuándo es la siguiente opción | RF-41 | T-14 |
| 26/11/2026 | Las paradas son una capa del mapa con su propio chip ("Transporte") | Usa el mismo filtro por distancia que los puntos | RF-39 | T-14 |
| 27/11/2026 | Zona sin cobertura = localidad sin paradas, o ninguna parada a 1 km de "Mi ubicación" | Criterio medible para RF-40 | RF-40 | T-17 |
| 27/11/2026 | Cualquier docente puede actualizar horarios; solo el autor o un admin cambia el resto de la parada | RF-42 pide que la comunidad actualice; las reglas limitan qué campos | RF-42 | T-17 |
| 27/11/2026 | Duración del trayecto opcional, de 1 a 300 minutos | Evita datos absurdos sin obligar a capturarla | RF-41, RF-42 | T-17 |
| 27/11/2026 | Se registra quién y cuándo actualizó los horarios | Da confianza a la información comunitaria | RF-42 | T-17 |
