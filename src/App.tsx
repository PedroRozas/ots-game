import { useReducer } from 'react';
import { useGameLoop } from './features/game/hooks/useGameLoop.ts';
import { generateRound } from './features/game/logic/roundGenerator.ts';
import { createInitialState } from './features/game/state/initialState.ts';
import { gameReducer } from './features/game/state/reducer.ts';
import { GameOverScreen } from './features/game/screens/GameOverScreen.tsx';
import { GameScreen } from './features/game/screens/GameScreen.tsx';
import { StartScreen } from './features/game/screens/StartScreen.tsx';
import { TutorialScreen } from './features/game/screens/TutorialScreen.tsx';

export function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  useGameLoop(state, dispatch);

  const startGame = () => {
    dispatch({ type: 'GAME_STARTED', round: generateRound(1) });
  };

  if (state.phase === 'idle') {
    return (
      <StartScreen
        bestScore={state.bestScore}
        onPlay={startGame}
        onTutorial={() => dispatch({ type: 'TUTORIAL_STARTED' })}
      />
    );
  }
  if (state.phase === 'tutorial') {
    return (
      <TutorialScreen onPlay={startGame} onExit={() => dispatch({ type: 'WENT_HOME' })} />
    );
  }
  if (state.phase === 'gameOver') {
    return (
      <GameOverScreen
        state={state}
        onRetry={startGame}
        onHome={() => dispatch({ type: 'WENT_HOME' })}
      />
    );
  }
  return <GameScreen state={state} dispatch={dispatch} />;
}
