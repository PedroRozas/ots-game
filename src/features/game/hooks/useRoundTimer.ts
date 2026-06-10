import { useEffect, type Dispatch } from 'react';
import { BALANCE } from '../config/balance.ts';
import type { GameAction, GamePhase } from '../state/types.ts';

export function useRoundTimer(phase: GamePhase, dispatch: Dispatch<GameAction>): void {
  useEffect(() => {
    if (phase !== 'playing') {
      return;
    }
    let lastTimestamp = performance.now();
    const intervalId = window.setInterval(() => {
      const now = performance.now();
      dispatch({ type: 'CLOCK_TICKED', deltaMs: now - lastTimestamp });
      lastTimestamp = now;
    }, BALANCE.tickMs);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [phase, dispatch]);
}
