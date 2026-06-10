import { AnimatePresence, motion } from 'framer-motion';
import { useState, type Dispatch } from 'react';
import { ClientCard } from '../components/ClientCard.tsx';
import { GondolaCard } from '../components/GondolaCard.tsx';
import { Hud } from '../components/Hud.tsx';
import { RoundTimer } from '../components/RoundTimer.tsx';
import { ShoppingList } from '../components/ShoppingList.tsx';
import type { GameAction, GameState, Round } from '../state/types.ts';
import styles from './GameScreen.module.css';

interface GameScreenProps {
  readonly state: GameState;
  readonly dispatch: Dispatch<GameAction>;
}

const DENSE_GONDOLA_THRESHOLD = 8;

function ClientBriefing({ round, title }: { round: Round; title: string }) {
  return (
    <>
      <motion.span
        initial={{ y: -30, scale: 0.6 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className={styles.roundLabel}
      >
        {title}
      </motion.span>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <ClientCard client={round.client} layout="featured" />
      </motion.div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className={styles.briefingList}
      >
        <span className={styles.listLabel}>BUSCA</span>
        <ShoppingList items={round.shoppingList} />
      </motion.div>
    </>
  );
}

function TelegraphOverlay({ round }: { round: Round }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      className={styles.overlay}
    >
      <ClientBriefing round={round} title={`RONDA ${String(round.number)}`} />
    </motion.div>
  );
}

function ClientDetailOverlay({ round, onClose }: { round: Round; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.overlay}
      onClick={onClose}
    >
      <ClientBriefing round={round} title={round.client.name.toUpperCase()} />
      <span className={styles.detailHint}>⏱ El reloj sigue corriendo · toca para volver</span>
    </motion.div>
  );
}

function RoundBanner({ state }: { state: GameState }) {
  const isCleared = state.phase === 'cleared';
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.overlay}
    >
      <motion.p
        initial={{ scale: 0, rotate: -8 }}
        animate={{ scale: 1, rotate: isCleared ? -2 : 2 }}
        transition={{ type: 'spring', stiffness: 320, damping: 14 }}
        className={isCleared ? styles.banner : `${styles.banner} ${styles.bannerBad}`}
      >
        {isCleared ? '¡TODO OK! 🛒' : '¡SE FUE SIN COMPRAR!'}
      </motion.p>
      {isCleared && state.roundBonus > 0 ? (
        <motion.span
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className={styles.bonus}
        >
          BONUS DE TIEMPO +{state.roundBonus}
        </motion.span>
      ) : null}
    </motion.div>
  );
}

export function GameScreen({ state, dispatch }: GameScreenProps) {
  const round = state.round;
  const [detailRound, setDetailRound] = useState<number | null>(null);

  if (round === null) {
    return null;
  }
  const clientDetailOpen = detailRound === round.number;
  const isDense = round.gondola.length > DENSE_GONDOLA_THRESHOLD;
  return (
    <div className={styles.screen}>
      <Hud
        score={state.score}
        combo={state.combo}
        strikes={state.strikes}
        roundNumber={round.number}
      />
      <RoundTimer timeLeftMs={state.timeLeftMs} totalMs={round.config.roundMs} />
      <button
        type="button"
        className={styles.clientButton}
        onClick={() => setDetailRound(round.number)}
        aria-label={`Ver restricciones de ${round.client.name}`}
      >
        <ClientCard client={round.client} layout="compact" />
        <span className={styles.peekBadge}>👁 VER</span>
      </button>
      <div className={styles.listRow}>
        <span className={styles.listLabel}>LISTA</span>
        <ShoppingList items={round.shoppingList} />
      </div>
      <div key={round.number} className={isDense ? `${styles.gondola} ${styles.dense}` : styles.gondola}>
        {round.gondola.map((product, index) => (
          <GondolaCard
            key={product.id}
            product={product}
            index={index}
            isHit={state.hitProductIds.includes(product.id)}
            feedback={state.lastPick?.productId === product.id ? state.lastPick : null}
            onPick={(productId) => dispatch({ type: 'PRODUCT_PICKED', productId })}
          />
        ))}
      </div>
      <AnimatePresence>
        {state.phase === 'telegraph' ? <TelegraphOverlay round={round} /> : null}
        {state.phase === 'playing' && clientDetailOpen ? (
          <ClientDetailOverlay round={round} onClose={() => setDetailRound(null)} />
        ) : null}
        {state.phase === 'cleared' || state.phase === 'timeUp' ? (
          <RoundBanner state={state} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
