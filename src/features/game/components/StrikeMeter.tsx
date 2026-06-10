import { motion } from 'framer-motion';
import { BALANCE } from '../config/balance.ts';
import styles from './StrikeMeter.module.css';

interface StrikeMeterProps {
  readonly strikes: number;
}

export function StrikeMeter({ strikes }: StrikeMeterProps) {
  const slots = Array.from({ length: BALANCE.maxStrikes }, (_, index) => index < strikes);
  return (
    <div className={styles.strikes} aria-label={`${String(strikes)} strikes`}>
      {slots.map((struck, index) => (
        <motion.span
          key={index}
          animate={struck ? { scale: [1.6, 1], rotate: [12, 0] } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className={struck ? `${styles.slot} ${styles.struck}` : styles.slot}
        >
          ✕
        </motion.span>
      ))}
    </div>
  );
}
