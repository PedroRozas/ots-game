import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button.tsx';
import styles from './StartScreen.module.css';

interface StartScreenProps {
  readonly bestScore: number;
  readonly onPlay: () => void;
}

export function StartScreen({ bestScore, onPlay }: StartScreenProps) {
  return (
    <div className={styles.screen}>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={styles.brand}
      >
        <img src="/favicon152x152.jpg" alt="OK to Shop" className={styles.brandLogo} />
        <span className={styles.brandText}>OK to Shop presenta</span>
      </motion.div>
      <motion.div
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: 1, rotate: -2 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
        className={styles.sign}
      >
        <h1 className={styles.title}>¿APTO O NO?</h1>
        <p className={styles.subtitle}>EL ARCADE DE LA GÓNDOLA</p>
      </motion.div>
      {bestScore > 0 ? (
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.record}
        >
          🏆 RÉCORD: {bestScore}
        </motion.p>
      ) : null}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={styles.howTo}
      >
        <span className={styles.howToTitle}>CÓMO SE JUEGA</span>
        <span className={styles.step}>
          <span className={styles.stepIcon}>🛒</span> Llega un cliente con restricciones y una
          lista de compra.
        </span>
        <span className={styles.step}>
          <span className={styles.stepIcon}>👆</span> Toca solo productos aptos antes de que corra
          el reloj. ¡Ojo con las trazas!
        </span>
        <span className={styles.step}>
          <span className={styles.stepIcon}>💥</span> Tres errores y se acabó. Encadena aciertos
          para multiplicar puntos.
        </span>
      </motion.div>
      <Button onClick={onPlay}>▶ JUGAR</Button>
      <a
        href="https://okto.shop"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.footerLink}
      >
        Un juego de OK to Shop · la app para saber lo que comes
      </a>
    </div>
  );
}
