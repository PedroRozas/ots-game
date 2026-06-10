import { DIFFICULTY_TIERS, SURVIVAL, type DifficultyTier } from '../config/balance.ts';
import { randomInt } from '../../../lib/random.ts';
import type { RoundConfig } from '../state/types.ts';

function tierForRound(roundNumber: number): DifficultyTier {
  const tier = [...DIFFICULTY_TIERS]
    .reverse()
    .find((candidate) => roundNumber >= candidate.fromRound);
  if (tier === undefined) {
    throw new Error(`No hay tier de dificultad para la ronda ${String(roundNumber)}`);
  }
  return tier;
}

function survivalRoundMs(tier: DifficultyTier, roundNumber: number): number {
  const isLastTier = tier.fromRound === DIFFICULTY_TIERS[DIFFICULTY_TIERS.length - 1]?.fromRound;
  if (!isLastTier) {
    return tier.roundMs;
  }
  const decay = (roundNumber - tier.fromRound) * SURVIVAL.decayPerRoundMs;
  return Math.max(SURVIVAL.minRoundMs, tier.roundMs - decay);
}

export function getRoundConfig(roundNumber: number): RoundConfig {
  const tier = tierForRound(roundNumber);
  return {
    restrictionCount: randomInt(tier.restrictionCount.min, tier.restrictionCount.max),
    gondolaSize: randomInt(tier.gondolaSize.min, tier.gondolaSize.max),
    listSize: randomInt(tier.listSize.min, tier.listSize.max),
    trapCount: tier.trapCount,
    roundMs: survivalRoundMs(tier, roundNumber),
  };
}
