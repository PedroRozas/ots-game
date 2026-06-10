import type { Client, Product, ShoppingItem } from '../state/types.ts';
import { PRODUCTS } from './products.ts';

export const TUTORIAL_CLIENT: Client = {
  name: 'La Tía Pochi',
  emoji: '👵',
  restrictions: ['celiac'],
};

const TUTORIAL_GONDOLA_IDS = [
  'marraqueta-crujiente',
  'pan-piedra-pomez',
  'avena-despierta',
  'mermelada-dieta-eterna',
  'cereal-aros',
  'agua-cerro-mojado',
] as const;

export const TUTORIAL_GONDOLA: readonly Product[] = TUTORIAL_GONDOLA_IDS.map((id) => {
  const product = PRODUCTS.find((candidate) => candidate.id === id);
  if (product === undefined) {
    throw new Error(`Producto de tutorial no encontrado: ${id}`);
  }
  return product;
});

export const TUTORIAL_LIST: readonly ShoppingItem[] = [
  { category: 'bread', fulfilled: false },
  { category: 'breakfast', fulfilled: false },
];

export type TutorialFocus = 'client' | 'list' | 'gondola' | null;

export interface TutorialStep {
  readonly focus: TutorialFocus;
  readonly text: string;
  readonly requiresPick: boolean;
}

export const TUTORIAL_STEPS: readonly TutorialStep[] = [
  {
    focus: 'client',
    text: '👋 Ella es La Tía Pochi y es celíaca. Los íconos tachados bajo NO PUEDE muestran lo que le hace mal: gluten, incluso en trazas.',
    requiresPick: false,
  },
  {
    focus: 'list',
    text: '🛒 Esta es su lista de compra: 1 Pan y 1 Desayuno. Solo sirven productos de esas categorías.',
    requiresPick: false,
  },
  {
    focus: 'gondola',
    text: '👆 Cada producto muestra sus sellos con íconos. Toca un PAN que no tenga el ícono de gluten.',
    requiresPick: true,
  },
  {
    focus: 'gondola',
    text: '⚠️ Los íconos punteados son TRAZAS y también descalifican: la avena tiene trazas de gluten. Ahora toca el DESAYUNO apto.',
    requiresPick: true,
  },
  {
    focus: null,
    text: '🎉 ¡Lista completa! En el juego real hay reloj, 3 strikes y combos que multiplican puntos. Ya sabes leer la góndola.',
    requiresPick: false,
  },
];
