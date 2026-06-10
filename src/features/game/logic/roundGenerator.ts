import { pickOne, shuffle, takeRandom } from '../../../lib/random.ts';
import { PRODUCTS } from '../data/products.ts';
import { REDUNDANT_RESTRICTION_PAIRS } from '../data/restrictions.ts';
import { SHOPPER_PERSONAS } from '../data/shoppers.ts';
import {
  PRODUCT_CATEGORIES,
  RESTRICTION_IDS,
  type Client,
  type Product,
  type ProductCategory,
  type RestrictionId,
  type Round,
  type RoundConfig,
  type ShoppingItem,
} from '../state/types.ts';
import { getViolations, isApt } from './aptitude.ts';
import { getRoundConfig } from './difficulty.ts';

function isCompatible(candidate: RestrictionId, chosen: readonly RestrictionId[]): boolean {
  return REDUNDANT_RESTRICTION_PAIRS.every(
    ([a, b]) =>
      !(candidate === a && chosen.includes(b)) && !(candidate === b && chosen.includes(a)),
  );
}

function sampleRestrictions(count: number): RestrictionId[] {
  const chosen: RestrictionId[] = [];
  for (const candidate of shuffle(RESTRICTION_IDS)) {
    if (chosen.length < count && isCompatible(candidate, chosen)) {
      chosen.push(candidate);
    }
  }
  return chosen;
}

function aptCategories(restrictions: readonly RestrictionId[]): ProductCategory[] {
  return PRODUCT_CATEGORIES.filter((category) =>
    PRODUCTS.some((product) => product.category === category && isApt(product, restrictions)),
  );
}

function generateClient(config: RoundConfig): Client {
  const attempts = 20;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const restrictions = sampleRestrictions(config.restrictionCount);
    if (aptCategories(restrictions).length >= config.listSize) {
      const persona = pickOne(SHOPPER_PERSONAS);
      return { name: persona.name, emoji: persona.emoji, restrictions };
    }
  }
  const persona = pickOne(SHOPPER_PERSONAS);
  return { name: persona.name, emoji: persona.emoji, restrictions: sampleRestrictions(1) };
}

function buildShoppingList(client: Client, listSize: number): ShoppingItem[] {
  const categories = takeRandom(aptCategories(client.restrictions), listSize);
  return categories.map((category) => ({ category, fulfilled: false }));
}

function isSubtleTrap(product: Product, restrictions: readonly RestrictionId[]): boolean {
  const violations = getViolations(product, restrictions);
  return violations.length > 0 && violations.every((violation) => violation.kind === 'trace');
}

function pickTraps(
  client: Client,
  requiredCategories: readonly ProductCategory[],
  usedIds: ReadonlySet<string>,
  trapCount: number,
): Product[] {
  const pool = PRODUCTS.filter(
    (product) =>
      !usedIds.has(product.id) &&
      requiredCategories.includes(product.category) &&
      !isApt(product, client.restrictions),
  );
  const subtle = pool.filter((product) => isSubtleTrap(product, client.restrictions));
  const blunt = pool.filter((product) => !isSubtleTrap(product, client.restrictions));
  return [...takeRandom(subtle, trapCount), ...shuffle(blunt)].slice(0, trapCount);
}

function buildGondola(
  client: Client,
  shoppingList: readonly ShoppingItem[],
  config: RoundConfig,
): Product[] {
  const requiredCategories = shoppingList.map((item) => item.category);
  const solutions = requiredCategories.map((category) =>
    pickOne(
      PRODUCTS.filter(
        (product) => product.category === category && isApt(product, client.restrictions),
      ),
    ),
  );
  const usedIds = new Set(solutions.map((product) => product.id));
  const traps = pickTraps(client, requiredCategories, usedIds, config.trapCount);
  traps.forEach((trap) => usedIds.add(trap.id));
  const fillerPool = PRODUCTS.filter((product) => !usedIds.has(product.id));
  const fillers = takeRandom(fillerPool, Math.max(0, config.gondolaSize - usedIds.size));
  return shuffle([...solutions, ...traps, ...fillers]);
}

export function generateRound(roundNumber: number): Round {
  const config = getRoundConfig(roundNumber);
  const client = generateClient(config);
  const listSize = Math.min(config.listSize, aptCategories(client.restrictions).length);
  const shoppingList = buildShoppingList(client, listSize);
  const gondola = buildGondola(client, shoppingList, config);
  return { number: roundNumber, client, gondola, shoppingList, config };
}
