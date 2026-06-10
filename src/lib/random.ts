export function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function pickOne<T>(items: readonly T[]): T {
  const item = items[randomInt(0, items.length - 1)];
  if (item === undefined) {
    throw new Error('pickOne requiere una lista no vacía');
  }
  return item;
}

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    const a = result[i] as T;
    result[i] = result[j] as T;
    result[j] = a;
  }
  return result;
}

export function takeRandom<T>(items: readonly T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}
