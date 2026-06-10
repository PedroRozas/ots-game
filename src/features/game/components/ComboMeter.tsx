import { motion } from 'framer-motion';
import { comboMultiplier } from '../logic/scoring.ts';
import styles from './ComboMeter.module.css';

interface ComboMeterProps {
  readonly combo: number;
}

const HOT_COMBO_THRESHOLD = 4;

export function ComboMeter({ combo }: ComboMeterProps) {
  const multiplier = comboMultiplier(combo);
  const className =
    combo === 0
      ? `${styles.combo} ${styles.idle}`
      : combo >= HOT_COMBO_THRESHOLD
        ? `${styles.combo} ${styles.hot}`
        : styles.combo;
  return (
    <motion.span
      key={combo}
      initial={combo > 0 ? { scale: 1.5, rotate: -6 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      className={className}
    >
      ×{multiplier.toFixed(1)}
    </motion.span>
  );
}
