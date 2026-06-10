# ¿Apto o No? — El arcade de la góndola

Arcade contrarreloj inspirado (en tono de parodia) en OK to Shop: en cada ronda llega un cliente con restricciones alimentarias y una lista de compra. Hay que tocar los productos aptos de la góndola antes de que se acabe el tiempo, leyendo los íconos de ingredientes, sellos y trazas. Tres errores y se cierra la caja.

> Proyecto personal sin fin comercial. Todos los productos son inventados y los sellos están estilizados; no se usan datos ni material de la app real.

## Cómo jugar

- **Telegrafía:** antes de cada ronda se presenta al cliente con sus restricciones (reloj congelado).
- **Compra:** toca solo productos aptos para *todas* sus restricciones y de las categorías pendientes de la lista.
- **Combo:** aciertos encadenados multiplican el puntaje; un error lo rompe y suma un strike.
- **Trazas:** el ícono punteado es la trampa — descalifica al producto para alérgicos y celíacos.
- **Game Over:** el resumen final explica qué etiqueta violó cada error. El récord queda guardado en `localStorage`.

## Desarrollo

```bash
npm install
npm run dev      # juego en http://localhost:5173
npm run build    # tsc -b + build de producción
npm run lint     # eslint
```

## Stack

Vite + React 19 + TypeScript estricto · estado con `useReducer` · animaciones con Framer Motion · render DOM/SVG (sin canvas) · sin backend ni routing.

## Estructura

```
src/
  features/game/
    components/   # GondolaCard, ClientCard, RoundTimer, ComboMeter, StrikeMeter, HUD…
    config/       # balance.ts: todas las constantes de juego y dificultad
    data/         # productos parodia, perfiles, reglas, clientes
    hooks/        # useGameLoop, useRoundTimer
    logic/        # aptitud, puntaje, dificultad, generador de rondas
    screens/      # StartScreen, GameScreen, GameOverScreen
    state/        # types, reducer, initialState
  components/ui/  # piezas reutilizables
  lib/            # localStorage, random
  theme/          # tokens de color, tipografía y estilos globales
```

El balance completo (tiempos, puntajes, curva de dificultad) vive en `src/features/game/config/balance.ts`.
