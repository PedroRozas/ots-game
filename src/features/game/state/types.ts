export const PRODUCT_ATTRIBUTES = [
  'meat',
  'dairy',
  'lactose',
  'gluten',
  'egg',
  'nuts',
  'highSugar',
] as const;

export type ProductAttribute = (typeof PRODUCT_ATTRIBUTES)[number];

export const TRACE_ATTRIBUTES = ['gluten', 'dairy', 'nuts', 'egg'] as const;

export type TraceAttribute = (typeof TRACE_ATTRIBUTES)[number];

export const PRODUCT_CATEGORIES = [
  'milk',
  'bread',
  'sweetSnack',
  'saltySnack',
  'drink',
  'breakfast',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const RESTRICTION_IDS = [
  'vegan',
  'vegetarian',
  'celiac',
  'milkAllergy',
  'lactoseIntolerant',
  'diabetic',
  'nutAllergy',
] as const;

export type RestrictionId = (typeof RESTRICTION_IDS)[number];

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly emoji: string;
  readonly category: ProductCategory;
  readonly attributes: readonly ProductAttribute[];
  readonly traces: readonly TraceAttribute[];
}

export interface RestrictionRule {
  readonly forbiddenAttributes: readonly ProductAttribute[];
  readonly forbiddenTraces: readonly TraceAttribute[];
}

export interface Client {
  readonly name: string;
  readonly emoji: string;
  readonly restrictions: readonly RestrictionId[];
}

export interface ShoppingItem {
  readonly category: ProductCategory;
  readonly fulfilled: boolean;
}

export interface RoundConfig {
  readonly restrictionCount: number;
  readonly gondolaSize: number;
  readonly listSize: number;
  readonly trapCount: number;
  readonly roundMs: number;
}

export interface Round {
  readonly number: number;
  readonly client: Client;
  readonly gondola: readonly Product[];
  readonly shoppingList: readonly ShoppingItem[];
  readonly config: RoundConfig;
}

export type Violation =
  | { readonly kind: 'attribute'; readonly attribute: ProductAttribute; readonly restriction: RestrictionId }
  | { readonly kind: 'trace'; readonly trace: TraceAttribute; readonly restriction: RestrictionId };

export type PickFault =
  | { readonly kind: 'notApt'; readonly violations: readonly Violation[] }
  | { readonly kind: 'wrongCategory' }
  | { readonly kind: 'categoryFulfilled' };

export interface Mistake {
  readonly roundNumber: number;
  readonly client: Client;
  readonly product: Product;
  readonly fault: PickFault;
}

export type GamePhase =
  | 'idle'
  | 'tutorial'
  | 'telegraph'
  | 'playing'
  | 'cleared'
  | 'timeUp'
  | 'gameOver';

export interface PickFeedback {
  readonly seq: number;
  readonly productId: string;
  readonly outcome: 'hit' | 'miss';
  readonly points: number;
  readonly fault: PickFault | null;
}

export interface GameState {
  readonly phase: GamePhase;
  readonly round: Round | null;
  readonly timeLeftMs: number;
  readonly score: number;
  readonly combo: number;
  readonly maxCombo: number;
  readonly strikes: number;
  readonly hitProductIds: readonly string[];
  readonly mistakes: readonly Mistake[];
  readonly lastPick: PickFeedback | null;
  readonly roundBonus: number;
  readonly bestScore: number;
  readonly isNewBest: boolean;
}

export type GameAction =
  | { readonly type: 'TUTORIAL_STARTED' }
  | { readonly type: 'GAME_STARTED'; readonly round: Round }
  | { readonly type: 'CLOCK_STARTED' }
  | { readonly type: 'CLOCK_TICKED'; readonly deltaMs: number }
  | { readonly type: 'PRODUCT_PICKED'; readonly productId: string }
  | { readonly type: 'NEXT_ROUND_LOADED'; readonly round: Round }
  | { readonly type: 'WENT_HOME' };
