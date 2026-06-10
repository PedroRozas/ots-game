import { BALANCE } from '../config/balance.ts';

export function comboMultiplier(combo: number): number {
  return Math.min(
    BALANCE.comboMultiplierMax,
    1 + combo * BALANCE.comboMultiplierStep,
  );
}

export function hitPoints(combo: number): number {
  return Math.round(BALANCE.baseHitPoints * comboMultiplier(combo));
}

export function timeBonus(timeLeftMs: number): number {
  const secondsLeft = Math.floor(timeLeftMs / 1000);
  return secondsLeft * BALANCE.timeBonusPerSecond;
}
