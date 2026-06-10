import { motion } from 'framer-motion';
import { ComboMeter } from './ComboMeter.tsx';
import { StrikeMeter } from './StrikeMeter.tsx';
import styles from './Hud.module.css';

interface HudProps {
  readonly score: number;
  readonly combo: number;
  readonly strikes: number;
  readonly roundNumber: number;
}

export function Hud({ score, combo, strikes, roundNumber }: HudProps) {
  return (
    <div className={styles.hud}>
      <div className={styles.score}>
        <span className={styles.scoreLabel}>PUNTOS</span>
        <motion.span
          key={score}
          initial={{ scale: 1.18 }}
          animate={{ scale: 1 }}
          className={styles.scoreValue}
        >
          {score}
        </motion.span>
      </div>
      <span className={styles.round}>RONDA {roundNumber}</span>
      <div className={styles.right}>
        <ComboMeter combo={combo} />
        <StrikeMeter strikes={strikes} />
      </div>
    </div>
  );
}
