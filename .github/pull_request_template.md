## Qué cambia

<!-- Una o dos líneas. Ej.: Formulario para registrar alertas de inseguridad. -->

**Requisitos:** RF-
**Issue:** #

## Autor: antes de pedir revisión

- [ ] La rama tiene menos de 2 días y se actualizó con `git pull --rebase origin main`
- [ ] `npm run revisar` pasa en mi computadora (tipos, lint y pruebas)
- [ ] Si el módulo no está terminado, queda escondido detrás de su flag en `src/constants/flags.ts`
- [ ] La lógica nueva está en `src/lib/` y tiene 100 % de ramas cubiertas
- [ ] Agregué a `docs/pruebas-caja-blanca.md` la función nueva: V(G), caminos y casos
- [ ] Probé en el celular con Expo Go

## Revisor: revisión de caja blanca

- [ ] Leí el código completo, no solo el resultado en la app
- [ ] Cada `if`, `else`, `? :`, `&&` y `||` nuevo tiene una prueba para cada lado
- [ ] El número de caminos en el documento coincide con V(G) = decisiones + 1
- [ ] Revisé el reporte de cobertura (artefacto **cobertura** en la pestaña Actions)
- [ ] No hay llaves, contraseñas ni `.env.local` en el cambio
- [ ] Todo lo que se guarda en Firestore lleva `autorId: usuario.uid`
- [ ] Los mensajes de error se entienden y están en español

## Hallazgos de la revisión

<!-- Caminos sin prueba, ramas inalcanzables, código muerto. Escribir "Ninguno" si no hay. -->
