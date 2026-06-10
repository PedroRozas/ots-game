import type { ProductCategory } from '../state/types.ts';

export interface CategoryMeta {
  readonly label: string;
  readonly emoji: string;
}

export const CATEGORY_META: Record<ProductCategory, CategoryMeta> = {
  milk: { label: 'Leche', emoji: '🥛' },
  bread: { label: 'Pan', emoji: '🍞' },
  sweetSnack: { label: 'Snack dulce', emoji: '🍪' },
  saltySnack: { label: 'Snack salado', emoji: '🍿' },
  drink: { label: 'Bebida', emoji: '🥤' },
  breakfast: { label: 'Desayuno', emoji: '🍳' },
};
