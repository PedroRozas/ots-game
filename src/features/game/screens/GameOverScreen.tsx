import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button.tsx';
import { describeMistake } from '../logic/faultDescription.ts';
import type { GameState, Mistake } from '../state/types.ts';
import styles from './GameOverScreen.module.css';

interface GameOverScreenProps {
  readonly state: GameState;
  readonly onRetry: () => void;
  readonly onHome: () => void;
}

function MistakeList({ mistakes }: { mistakes: readonly Mistake[] }) {
  if (mistakes.length === 0) {
    return (
      <p className={styles.perfect}>
        Cero productos mal elegidos: te ganó el reloj, no la etiqueta. 🕐
      </p>
    );
  }
  return (
    <>
      {mistakes.map((mistake, index) => (
        <span key={index} className={styles.lesson}>
          <span className={styles.lessonEmoji}>{mistake.product.emoji}</span>
          {describeMistake(mistake)}
        </span>
      ))}
    </>
  );
}

export function GameOverScreen({ state, onRetry, onHome }: GameOverScreenProps) {
  const lastRound = state.round?.number ?? 0;
  return (
    <div className={styles.screen}>
      <motion.h1
        initial={{ scale: 0, rotate: 8 }}
        animate={{ scale: 1, rotate: -1.5 }}
        transition={{ type: 'spring', stiffness: 280, damping: 15 }}
        className={styles.title}
      >
        CAJA CERRADA
      </motion.h1>
      <div className={styles.scoreBox}>
        <span className={styles.scoreLabel}>PUNTAJE FINAL</span>
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 16 }}
          className={styles.scoreValue}
        >
          {state.score}
        </motion.span>
      </div>
      {state.isNewBest ? (
        <motion.span
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={styles.newBest}
        >
          🏆 ¡NUEVO RÉCORD!
        </motion.span>
      ) : (
        <span className={styles.stats}>Récord: {state.bestScore}</span>
      )}
      <span className={styles.stats}>
        Llegaste a la ronda {lastRound} · Combo máximo ×{state.maxCombo}
      </span>
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className={styles.lessons}
      >
        <span className={styles.lessonsTitle}>📋 LO QUE DICE LA ETIQUETA</span>
        <MistakeList mistakes={state.mistakes} />
      </motion.div>
      <div className={styles.actions}>
        <Button onClick={onRetry}>↻ OTRA VUELTA</Button>
        <Button onClick={onHome} variant="secondary">
          Inicio
        </Button>
      </div>
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={styles.cta}
      >
        <img src="/favicon152x152.jpg" alt="OK to Shop" className={styles.ctaLogo} />
        <p className={styles.ctaText}>
          En la vida real no hay strikes: escanea los productos con la app{' '}
          <strong>OK to Shop</strong> y sabe al tiro si lo que comes es apto para ti.
        </p>
        <a
          href="https://okto.shop"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaButton}
        >
          📲 ESCANEA CON OK TO SHOP
        </a>
      </motion.div>
    </div>
  );
}
