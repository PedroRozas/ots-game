import { useEffect, type Dispatch } from 'react';
import { saveBestScore } from '../../../lib/storage.ts';
import { BALANCE } from '../config/balance.ts';
import { generateRound } from '../logic/roundGenerator.ts';
import type { GameAction, GameState } from '../state/types.ts';
import { useRoundTimer } from './useRoundTimer.ts';

function phaseDelayMs(phase: GameState['phase']): number | null {
  switch (phase) {
    case 'telegraph':
      return BALANCE.telegraphMs;
    case 'cleared':
      return BALANCE.clearedPauseMs;
    case 'timeUp':
      return BALANCE.strikePauseMs;
    default:
      return null;
  }
}

export function useGameLoop(state: GameState, dispatch: Dispatch<GameAction>): void {
  const { phase, bestScore } = state;
  const roundNumber = state.round?.number ?? 0;

  useRoundTimer(phase, dispatch);

  useEffect(() => {
    const delayMs = phaseDelayMs(phase);
    if (delayMs === null) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      if (phase === 'telegraph') {
        dispatch({ type: 'CLOCK_STARTED' });
        return;
      }
      dispatch({ type: 'NEXT_ROUND_LOADED', round: generateRound(roundNumber + 1) });
    }, delayMs);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [phase, roundNumber, dispatch]);

  useEffect(() => {
    if (phase === 'gameOver') {
      saveBestScore(bestScore);
    }
  }, [phase, bestScore]);
}
