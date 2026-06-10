import { BALANCE } from '../config/balance.ts';
import { evaluatePick } from '../logic/aptitude.ts';
import { hitPoints, timeBonus } from '../logic/scoring.ts';
import { createInitialState } from './initialState.ts';
import type {
  GameAction,
  GameState,
  PickFault,
  Product,
  Round,
} from './types.ts';

function nextSeq(state: GameState): number {
  return state.lastPick === null ? 1 : state.lastPick.seq + 1;
}

function startRound(state: GameState, round: Round): GameState {
  return {
    ...state,
    phase: 'telegraph',
    round,
    timeLeftMs: round.config.roundMs,
    hitProductIds: [],
    lastPick: null,
    roundBonus: 0,
  };
}

function finishGame(state: GameState): GameState {
  return {
    ...state,
    phase: 'gameOver',
    bestScore: Math.max(state.score, state.bestScore),
    isNewBest: state.score > 0 && state.score > state.bestScore,
  };
}

function applyHit(state: GameState, round: Round, product: Product): GameState {
  const points = hitPoints(state.combo);
  const shoppingList = round.shoppingList.map((item) =>
    item.category === product.category ? { ...item, fulfilled: true } : item,
  );
  const listComplete = shoppingList.every((item) => item.fulfilled);
  const bonus = listComplete ? timeBonus(state.timeLeftMs) : 0;
  const combo = state.combo + 1;
  return {
    ...state,
    phase: listComplete ? 'cleared' : 'playing',
    round: { ...round, shoppingList },
    score: state.score + points + bonus,
    combo,
    maxCombo: Math.max(combo, state.maxCombo),
    hitProductIds: [...state.hitProductIds, product.id],
    roundBonus: bonus,
    lastPick: { seq: nextSeq(state), productId: product.id, outcome: 'hit', points, fault: null },
  };
}

function applyMiss(state: GameState, round: Round, product: Product, fault: PickFault): GameState {
  const struck: GameState = {
    ...state,
    combo: 0,
    strikes: state.strikes + 1,
    mistakes: [
      ...state.mistakes,
      { roundNumber: round.number, client: round.client, product, fault },
    ],
    lastPick: { seq: nextSeq(state), productId: product.id, outcome: 'miss', points: 0, fault },
  };
  return struck.strikes >= BALANCE.maxStrikes ? finishGame(struck) : struck;
}

function reducePick(state: GameState, productId: string): GameState {
  if (state.phase !== 'playing' || state.round === null) {
    return state;
  }
  if (state.hitProductIds.includes(productId)) {
    return state;
  }
  const product = state.round.gondola.find((candidate) => candidate.id === productId);
  if (product === undefined) {
    return state;
  }
  const fault = evaluatePick(product, state.round.client.restrictions, state.round.shoppingList);
  return fault === null
    ? applyHit(state, state.round, product)
    : applyMiss(state, state.round, product, fault);
}

function reduceTick(state: GameState, deltaMs: number): GameState {
  if (state.phase !== 'playing') {
    return state;
  }
  const timeLeftMs = Math.max(0, state.timeLeftMs - deltaMs);
  if (timeLeftMs > 0) {
    return { ...state, timeLeftMs };
  }
  const struck: GameState = {
    ...state,
    timeLeftMs,
    phase: 'timeUp',
    combo: 0,
    strikes: state.strikes + 1,
  };
  return struck.strikes >= BALANCE.maxStrikes ? finishGame(struck) : struck;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'GAME_STARTED':
      return startRound({ ...createInitialState(), bestScore: state.bestScore }, action.round);
    case 'CLOCK_STARTED':
      return state.phase === 'telegraph' ? { ...state, phase: 'playing' } : state;
    case 'CLOCK_TICKED':
      return reduceTick(state, action.deltaMs);
    case 'PRODUCT_PICKED':
      return reducePick(state, action.productId);
    case 'NEXT_ROUND_LOADED':
      return startRound(state, action.round);
    case 'WENT_HOME':
      return { ...createInitialState(), bestScore: state.bestScore };
  }
}
