const BEST_SCORE_KEY = 'apto-o-no:best-score';

export function readBestScore(): number {
  try {
    const raw = window.localStorage.getItem(BEST_SCORE_KEY);
    const parsed = raw === null ? 0 : Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch (error) {
    console.warn('No se pudo leer el récord guardado', error);
    return 0;
  }
}

export function saveBestScore(score: number): void {
  try {
    window.localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch (error) {
    console.warn('No se pudo guardar el récord', error);
  }
}
