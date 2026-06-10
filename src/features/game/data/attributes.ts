import type { ProductAttribute } from '../state/types.ts';

export interface AttributeMeta {
  readonly label: string;
  readonly color: string;
}

export const ATTRIBUTE_META: Record<ProductAttribute, AttributeMeta> = {
  meat: { label: 'Origen animal', color: '#c0392b' },
  dairy: { label: 'Lácteo', color: '#2d7dd2' },
  lactose: { label: 'Lactosa', color: '#0fa3b1' },
  gluten: { label: 'Gluten', color: '#d68910' },
  egg: { label: 'Huevo', color: '#e67e22' },
  nuts: { label: 'Frutos secos', color: '#8d5524' },
  highSugar: { label: 'ALTO EN AZÚCAR', color: '#14100c' },
};
