interface Range {
  readonly min: number;
  readonly max: number;
}

export interface DifficultyTier {
  readonly fromRound: number;
  readonly restrictionCount: Range;
  readonly gondolaSize: Range;
  readonly listSize: Range;
  readonly trapCount: number;
  readonly roundMs: number;
}

export const DIFFICULTY_TIERS: readonly DifficultyTier[] = [
  {
    fromRound: 1,
    restrictionCount: { min: 1, max: 1 },
    gondolaSize: { min: 6, max: 6 },
    listSize: { min: 1, max: 1 },
    trapCount: 0,
    roundMs: 12_000,
  },
  {
    fromRound: 4,
    restrictionCount: { min: 2, max: 2 },
    gondolaSize: { min: 8, max: 8 },
    listSize: { min: 2, max: 2 },
    trapCount: 1,
    roundMs: 10_000,
  },
  {
    fromRound: 8,
    restrictionCount: { min: 2, max: 3 },
    gondolaSize: { min: 10, max: 12 },
    listSize: { min: 2, max: 3 },
    trapCount: 2,
    roundMs: 8_000,
  },
  {
    fromRound: 13,
    restrictionCount: { min: 2, max: 3 },
    gondolaSize: { min: 12, max: 12 },
    listSize: { min: 3, max: 3 },
    trapCount: 3,
    roundMs: 7_000,
  },
] as const;

export const SURVIVAL = {
  decayPerRoundMs: 100,
  minRoundMs: 5_000,
} as const;

export const BALANCE = {
  maxStrikes: 3,
  telegraphMs: 2_500,
  clearedPauseMs: 1_200,
  strikePauseMs: 1_100,
  tickMs: 100,
  baseHitPoints: 100,
  comboMultiplierStep: 0.5,
  comboMultiplierMax: 5,
  timeBonusPerSecond: 25,
} as const;
