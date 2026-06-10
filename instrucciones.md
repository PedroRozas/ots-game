# Prompt para Fable 5 — Construir juego arcade "OK to Shop"

## Contexto

Vas a construir un juego web completo, de principio a fin. Es una iniciativa personal sin fin comercial, así que tienes libertad creativa total en el contenido (nombres de productos, copy, humor). El tema se inspira en **OK to Shop**, una app chilena real que ayuda a personas con restricciones alimentarias (veganos, celíacos, alérgicos, etc.) a saber si un producto del supermercado es apto, leyendo sus ingredientes, sellos "ALTO EN" y trazas.

**No uses datos reales de OK to Shop ni los sellos oficiales exactos.** Inventa productos con nombres-parodia y estiliza los sellos. Es un juego, no un producto de la marca.

El proyecto **Vite ya está creado** (plantilla `react-ts`). Tú construyes todo lo demás dentro de `src/`. No modifiques la configuración base de Vite salvo que sea estrictamente necesario, y si lo haces, justifícalo.

---

## El juego en una frase

Arcade contrarreloj por rondas: en cada ronda llega un cliente con restricciones alimentarias y una lista de compra; debes tocar los productos correctos de una góndola antes de que se acabe el tiempo. La dificultad sube ronda a ronda. Tres fallas y se acaba.

---

## Stack y restricciones técnicas

- **Vite + React + TypeScript estricto.** Sin excepciones.
- **Estado del juego con `useReducer`.** No uses Redux. Si algo necesita estado global más allá del reducer, usa Zustand y nada más pesado.
- **Animación con Framer Motion** para el "juice" (combos, flash de error, entrada de productos, transición entre clientes). CSS transitions para lo básico.
- **Persistencia del récord con `localStorage`.** Solo el récord (mejor puntaje). Nada más.
- **Render en DOM/SVG. NO uses canvas ni motores de juego (Phaser, Pixi).** El juego es selección de tarjetas bajo presión de tiempo, no movimiento físico ni colisiones; el DOM es performante de sobra y más fácil de iterar.
- **Sin backend, sin routing, sin SSR.** Es una SPA de una sola pantalla.
- **No uses MUI** ni ninguna librería de componentes de aplicación. El estilo del juego es propio.

---

## Estándares de código (obligatorios)

- TypeScript estricto: **sin `any`**, sin `unknown` no gestionado.
- Complejidad ciclomática ≤ 10; profundidad de anidamiento ≤ 3; longitud de función ≤ 40 líneas.
- Cero variables, parámetros o imports sin usar.
- Cero números mágicos: todas las constantes de balance (tiempos, puntajes, umbrales de dificultad) viven en un archivo de configuración central y tipado.
- Cero secretos hardcodeados.
- Arquitectura **feature-first**. Estructura esperada:

```
src/
  App.tsx
  main.tsx
  features/
    game/
      components/      # GondolaCard, ClientCard, Timer, ComboMeter, HUD, etc.
      hooks/           # useGameLoop, useRoundTimer
      state/           # reducer, types, actions, initialState
      data/            # products, profiles, rules
      logic/           # aptitude, scoring, difficulty
      screens/         # StartScreen, GameScreen, GameOverScreen
  components/ui/        # Button, IconBadge, etc. reutilizables
  lib/                 # helpers genéricos (localStorage, random, etc.)
  theme/               # tokens de color, tipografía, constantes visuales
```

- Tipa con precisión los modelos de dominio (productos, perfiles, reglas, estado de juego). Los tipos son la columna vertebral de este proyecto.

---

## Modelo de dominio

### Perfiles (clientes)

Define **6 a 8 perfiles** de restricción. Como mínimo: vegano, vegetariano, celíaco, APLV (sin lácteos), intolerante a la lactosa, diabético, alérgico a frutos secos. Un cliente puede tener **una o varias restricciones combinadas**.

### Atributos de producto (la información que el jugador lee)

Cada producto tiene un conjunto de atributos visibles mediante íconos. Como mínimo:

- contiene carne / origen animal
- contiene lácteo
- contiene lactosa
- contiene gluten
- contiene huevo
- contiene frutos secos
- sello "ALTO EN AZÚCAR" (estilizado)
- **trazas de [X]** — el atributo trampa: un ícono pequeño y fácil de pasar por alto que descalifica el producto

Cada producto pertenece además a una **categoría** (ej: leche, pan, snack dulce, bebida) usada por la lista de compra.

### Tabla de reglas (perfil → atributos prohibidos)

Define un mapa explícito y tipado. Ejemplos:

- Vegano → prohíbe: carne, lácteo, huevo (y miel/gelatina si las incluyes)
- Vegetariano → prohíbe: carne
- Celíaco → prohíbe: gluten, trazas de gluten
- APLV → prohíbe: lácteo, trazas de leche
- Intolerante a la lactosa → prohíbe: lactosa
- Diabético → prohíbe: sello ALTO EN AZÚCAR
- Alérgico a frutos secos → prohíbe: frutos secos, trazas de frutos secos

Un producto es **apto para un cliente** si no contiene ninguno de los atributos prohibidos por **ninguna** de sus restricciones.

### Dataset

Crea **25 a 40 productos** con nombres-parodia (libertad creativa, humor chileno bienvenido) y sus atributos/categoría/íconos. Inclúyelos en `data/`.

---

## Mecánica de ronda (el loop central)

Cada ronda dura entre 5 y 10 segundos según dificultad. El bucle:

1. **Telegrafía (≈0.5–1s, reloj congelado):** se muestra el cliente con los íconos de sus restricciones. Esto le da al jugador un instante para procesar antes de la presión. Es obligatorio: sin este respiro el contrarreloj se siente injusto.
2. **Arranca el reloj de la ronda.** Cuenta regresiva visible.
3. Se muestra la **góndola** con N productos, cada uno con sus íconos visibles, y una **lista de compra** (categorías a cumplir, ej: "1 leche · 1 snack").
4. El jugador **toca productos**. Un acierto = producto apto para todas las restricciones **y** de una categoría requerida pendiente.
   - **Acierto:** avanza la lista, suma puntaje, sube el combo. Feedback positivo "juicy".
   - **Error** (no apto, o categoría equivocada/ya cumplida): **flash rojo + el ícono culpable destacado**, se rompe el combo, suma 1 strike. El feedback en ronda es mínimo y rápido: NO interrumpas el ritmo con explicaciones largas.
5. **Completar la lista antes del tiempo** → ronda superada. Bonus por tiempo restante y por combo. Pasa el siguiente cliente.
6. **Se acaba el tiempo sin completar** → suma 1 strike y pasa el siguiente cliente.
7. **3 strikes → Game Over.**

### Puntaje

`puntaje_acierto_base × multiplicador_de_combo`, más bonus por segundos restantes al cerrar la ronda. El combo es lo que premia la perfección y genera el "una más". Todas las constantes en el archivo de balance.

### Feedback educativo

El detalle de los errores NO va durante la partida. Va en la **pantalla de Game Over**: un resumen de qué productos elegiste mal y por qué (qué atributo violó qué restricción). Ese es el único momento didáctico.

---

## Curva de dificultad (regla de oro: sube un eje a la vez)

Hay cinco palancas: número de restricciones del cliente, tamaño de la góndola, cantidad de trampas (trazas escondidas), tamaño de la lista de compra, y segundos por ronda. **Nunca subas todas a la vez en la misma ronda** — eso crea un muro injusto. Escalona. Progresión objetivo:

- **Rondas 1–3:** 1 restricción · góndola de 6 · lista de 1 · ~10s · sin trampas. (Enseña el lenguaje de íconos sin que se note.)
- **Rondas 4–7:** 2 restricciones · góndola de 8 · lista de 2 · ~8s · aparecen las primeras trazas escondidas.
- **Rondas 8–12:** 2–3 restricciones · góndola de 10–12 · lista de 2–3 · ~6s · más trampas/distractores.
- **Rondas 13+:** combinaciones duras; el tiempo baja gradualmente desde ~5s; góndola densa. Modo supervivencia.

Implementa esto como una función de dificultad tipada que, dado el número de ronda, devuelve los parámetros de esa ronda. Constantes en el archivo de balance.

---

## Lenguaje visual y dirección de arte

- **Legibilidad icónica < 2 segundos.** Esta es la decisión de diseño más importante: el jugador debe leer cada producto de un vistazo por sus íconos, nunca por texto de ingredientes. Diseña un set de íconos inconfundibles entre sí incluso a alta velocidad y en tamaño chico. Las trazas deben ser visibles pero sutiles (es la trampa).
- Estética **arcade**: alto contraste, feedback "juicy", animaciones con punch (combos que rebotan, flash de error, productos que entran con resorte).
- **Mobile-first**: el género funciona muy bien en vertical y táctil. Que se sienta bien tanto en touch como en click.
- Humor permitido y bienvenido en el copy y los nombres de producto (sellos inventados tipo "ALTO EN ARREPENTIMIENTO", clientes imposibles de complacer, etc.). La app real es seria; el juego no tiene por qué serlo.
- Tokens de color, tipografía y espaciado centralizados en `theme/`.

---

## Pantallas

1. **Inicio:** título, récord guardado, botón de jugar, instrucciones mínimas.
2. **Juego:** HUD (puntaje, combo, strikes, reloj de ronda) + cliente + góndola + lista.
3. **Game Over:** puntaje final, si es nuevo récord, resumen de errores con su explicación, botón de reintentar.

---

## Criterios de aceptación

- `npm run dev` levanta el juego sin errores ni warnings de TypeScript.
- Se puede jugar una partida completa: telegrafía → rondas → strikes → Game Over → reintentar.
- La dificultad escala según la progresión definida, un eje a la vez.
- El combo sube con aciertos encadenados y se rompe con un error.
- 3 strikes terminan la partida.
- El récord persiste en `localStorage` entre sesiones.
- La pantalla de Game Over muestra el resumen de errores con explicación.
- El código cumple todos los estándares (sin `any`, límites de complejidad, sin números mágicos, feature-first).
- Funciona en touch y en desktop.

---

## Qué NO hacer

- No backend, no routing, no canvas, no motores de juego, no MUI, no Redux.
- No `any` ni números mágicos.
- No datos reales de OK to Shop ni sellos oficiales exactos.
- No metas explicaciones educativas largas durante la partida (matan el ritmo).
- No subas todas las palancas de dificultad a la vez.

Entrega el proyecto completo, archivo por archivo, con todos los imports correctos y sin código muerto.
