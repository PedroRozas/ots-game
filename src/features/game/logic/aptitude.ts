import { RESTRICTION_RULES } from '../data/restrictions.ts';
import type {
  PickFault,
  Product,
  RestrictionId,
  ShoppingItem,
  Violation,
} from '../state/types.ts';

export function getViolations(
  product: Product,
  restrictions: readonly RestrictionId[],
): Violation[] {
  return restrictions.flatMap((restriction) => {
    const rule = RESTRICTION_RULES[restriction];
    const attributeHits = product.attributes
      .filter((attribute) => rule.forbiddenAttributes.includes(attribute))
      .map<Violation>((attribute) => ({ kind: 'attribute', attribute, restriction }));
    const traceHits = product.traces
      .filter((trace) => rule.forbiddenTraces.includes(trace))
      .map<Violation>((trace) => ({ kind: 'trace', trace, restriction }));
    return [...attributeHits, ...traceHits];
  });
}

export function isApt(product: Product, restrictions: readonly RestrictionId[]): boolean {
  return getViolations(product, restrictions).length === 0;
}

export function evaluatePick(
  product: Product,
  restrictions: readonly RestrictionId[],
  shoppingList: readonly ShoppingItem[],
): PickFault | null {
  const violations = getViolations(product, restrictions);
  if (violations.length > 0) {
    return { kind: 'notApt', violations };
  }
  const item = shoppingList.find((entry) => entry.category === product.category);
  if (item === undefined) {
    return { kind: 'wrongCategory' };
  }
  if (item.fulfilled) {
    return { kind: 'categoryFulfilled' };
  }
  return null;
}
