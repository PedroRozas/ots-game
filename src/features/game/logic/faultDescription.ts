import { ATTRIBUTE_META } from '../data/attributes.ts';
import { RESTRICTION_META } from '../data/restrictions.ts';
import type { Mistake, Violation } from '../state/types.ts';

function describeViolation(mistake: Mistake, violation: Violation): string {
  const who = `${mistake.client.name} ${RESTRICTION_META[violation.restriction].phrase}`;
  if (violation.kind === 'trace') {
    const label = ATTRIBUTE_META[violation.trace].label.toLowerCase();
    return `${mistake.product.name} tiene trazas de ${label} y ${who}.`;
  }
  if (violation.attribute === 'highSugar') {
    return `${mistake.product.name} lleva sello ALTO EN AZÚCAR y ${who}.`;
  }
  const label = ATTRIBUTE_META[violation.attribute].label.toLowerCase();
  return `${mistake.product.name} contiene ${label} y ${who}.`;
}

export function describeMistake(mistake: Mistake): string {
  switch (mistake.fault.kind) {
    case 'notApt': {
      const first = mistake.fault.violations[0];
      return first === undefined
        ? `${mistake.product.name} no era apto para ${mistake.client.name}.`
        : describeViolation(mistake, first);
    }
    case 'wrongCategory':
      return `${mistake.product.name} no estaba en la lista de ${mistake.client.name}.`;
    case 'categoryFulfilled':
      return `Esa categoría ya estaba completa en la compra de ${mistake.client.name}.`;
  }
}
