import type { RestrictionId, RestrictionRule } from '../state/types.ts';

export interface RestrictionMeta {
  readonly label: string;
  readonly emoji: string;
  readonly phrase: string;
}

export const RESTRICTION_RULES: Record<RestrictionId, RestrictionRule> = {
  vegan: {
    forbiddenAttributes: ['meat', 'dairy', 'egg'],
    forbiddenTraces: [],
  },
  vegetarian: {
    forbiddenAttributes: ['meat'],
    forbiddenTraces: [],
  },
  celiac: {
    forbiddenAttributes: ['gluten'],
    forbiddenTraces: ['gluten'],
  },
  milkAllergy: {
    forbiddenAttributes: ['dairy'],
    forbiddenTraces: ['dairy'],
  },
  lactoseIntolerant: {
    forbiddenAttributes: ['lactose'],
    forbiddenTraces: [],
  },
  diabetic: {
    forbiddenAttributes: ['highSugar'],
    forbiddenTraces: [],
  },
  nutAllergy: {
    forbiddenAttributes: ['nuts'],
    forbiddenTraces: ['nuts'],
  },
};

export const RESTRICTION_META: Record<RestrictionId, RestrictionMeta> = {
  vegan: { label: 'Vegano', emoji: '🌱', phrase: 'es vegano' },
  vegetarian: { label: 'Vegetariano', emoji: '🥬', phrase: 'es vegetariano' },
  celiac: { label: 'Celíaco', emoji: '🌾', phrase: 'es celíaco' },
  milkAllergy: { label: 'APLV', emoji: '🥛', phrase: 'tiene alergia a la proteína de la leche' },
  lactoseIntolerant: { label: 'Sin lactosa', emoji: '💧', phrase: 'es intolerante a la lactosa' },
  diabetic: { label: 'Diabético', emoji: '🍬', phrase: 'vive con diabetes' },
  nutAllergy: { label: 'Sin frutos secos', emoji: '🥜', phrase: 'es alérgico a los frutos secos' },
};

export const REDUNDANT_RESTRICTION_PAIRS: readonly (readonly [RestrictionId, RestrictionId])[] = [
  ['vegan', 'vegetarian'],
  ['vegan', 'milkAllergy'],
  ['vegan', 'lactoseIntolerant'],
  ['milkAllergy', 'lactoseIntolerant'],
];
