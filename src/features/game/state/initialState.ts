import { readBestScore } from '../../../lib/storage.ts';
import type { GameState } from './types.ts';

export function createInitialState(): GameState {
  return {
    phase: 'idle',
    round: null,
    timeLeftMs: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    strikes: 0,
    hitProductIds: [],
    mistakes: [],
    lastPick: null,
    roundBonus: 0,
    bestScore: readBestScore(),
    isNewBest: false,
  };
}
