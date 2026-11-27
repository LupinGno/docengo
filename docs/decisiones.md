# Registro de decisiones

Cada decisión de diseño que afecte requisitos, datos o pruebas se anota aquí, en el mismo PR donde se toma.

| Fecha | Decisión | Motivo | RF | Tarea |
|---|---|---|---|---|
| 17/11/2026 | Firebase usamos (Auth + Firestore) en lugar de Node.js + MySQL | Autenticación y tiempo real sin servidor propio; plazo de 3 semanas | RF-05, RF-20 | Base |
| 17/11/2026 | Trunk-based development con feature flags | Integrar a diario sin mostrar módulos incompletos en el piloto | — | Base |
| 22/11/2026 | Todas las reglas de Firestore de la semana se centralizan en T-00 | Evitar conflictos de merge en `firestore.rules` y publicar una sola vez | Varios | T-00 |
| 22/11/2026 | La regla general de Firestore excluye `usuarios` y `reportes` | Corrige el hallazgo H2 (escalamiento a admin) | RF-43 | T-00 |
| 22/11/2026 | Coordenadas válidas = caja de la región piloto (lat 19.95 a 20.40, lon -101.40 a -100.95) | El prototipo se limita a la región piloto (SRS 2.5) | RF-13, RF-26, RF-30 | T-00 |
| 22/11/2026 | Los puntos de riesgo exigen descripción | Toda zona de riesgo debe mostrar su alerta con descripción (RF-31) | RF-13, RF-31 | T-02 |
| 22/11/2026 | Al editar un punto no se cambian sus coordenadas | Evita mover puntos por error; para moverlo se borra y se crea otro | RF-13 | T-02 |
| 22/11/2026 | El contacto se guarda como texto (vacío si no hay) | Firestore no acepta campos `undefined` | RF-12, RF-13 | T-02 |
