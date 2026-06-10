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
  vegan: { label: 'Vegano', emoji: '🌱', phrase: 'sigue dieta vegana' },
  vegetarian: { label: 'Vegetariano', emoji: '🥬', phrase: 'sigue dieta vegetariana' },
  celiac: { label: 'Celíaco', emoji: '🌾', phrase: 'tiene celiaquía' },
  milkAllergy: { label: 'APLV', emoji: '🥛', phrase: 'tiene alergia a la proteína de la leche' },
  lactoseIntolerant: {
    label: 'Sin lactosa',
    emoji: '💧',
    phrase: 'tiene intolerancia a la lactosa',
  },
  diabetic: { label: 'Diabético', emoji: '🍬', phrase: 'vive con diabetes' },
  nutAllergy: {
    label: 'Sin frutos secos',
    emoji: '🥜',
    phrase: 'tiene alergia a los frutos secos',
  },
};

export const REDUNDANT_RESTRICTION_PAIRS: readonly (readonly [RestrictionId, RestrictionId])[] = [
  ['vegan', 'vegetarian'],
  ['vegan', 'milkAllergy'],
  ['vegan', 'lactoseIntolerant'],
  ['milkAllergy', 'lactoseIntolerant'],
];
