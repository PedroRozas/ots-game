import styles from './RoundTimer.module.css';

interface RoundTimerProps {
  readonly timeLeftMs: number;
  readonly totalMs: number;
}

const WARNING_RATIO = 0.5;
const URGENT_RATIO = 0.25;

function fillColor(ratio: number): string {
  if (ratio > WARNING_RATIO) {
    return 'var(--color-green)';
  }
  return ratio > URGENT_RATIO ? 'var(--color-yellow)' : 'var(--color-red)';
}

export function RoundTimer({ timeLeftMs, totalMs }: RoundTimerProps) {
  const ratio = totalMs > 0 ? timeLeftMs / totalMs : 0;
  const seconds = Math.ceil(timeLeftMs / 1000);
  const isUrgent = ratio <= URGENT_RATIO;
  return (
    <div className={styles.timer}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${String(ratio * 100)}%`, backgroundColor: fillColor(ratio) }}
        />
      </div>
      <span className={isUrgent ? `${styles.seconds} ${styles.urgent}` : styles.seconds}>
        {seconds}s
      </span>
    </div>
  );
}
