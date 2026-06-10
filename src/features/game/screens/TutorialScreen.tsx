import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '../../../components/ui/Button.tsx';
import { ClientCard } from '../components/ClientCard.tsx';
import { GondolaCard } from '../components/GondolaCard.tsx';
import { ShoppingList } from '../components/ShoppingList.tsx';
import {
  TUTORIAL_CLIENT,
  TUTORIAL_GONDOLA,
  TUTORIAL_LIST,
  TUTORIAL_STEPS,
  type TutorialFocus,
  type TutorialStep,
} from '../data/tutorial.ts';
import { evaluatePick } from '../logic/aptitude.ts';
import { describeMistake } from '../logic/faultDescription.ts';
import type { PickFeedback, ShoppingItem } from '../state/types.ts';
import styles from './TutorialScreen.module.css';

interface TutorialScreenProps {
  readonly onPlay: () => void;
  readonly onExit: () => void;
}

interface TutorialProgress {
  readonly stepIndex: number;
  readonly list: readonly ShoppingItem[];
  readonly hitIds: readonly string[];
  readonly lastPick: PickFeedback | null;
  readonly errorText: string | null;
}

const INITIAL_PROGRESS: TutorialProgress = {
  stepIndex: 0,
  list: TUTORIAL_LIST,
  hitIds: [],
  lastPick: null,
  errorText: null,
};

function sectionClass(section: Exclude<TutorialFocus, null>, focus: TutorialFocus): string {
  if (focus === null || focus === section) {
    return focus === section ? `${styles.section} ${styles.focused}` : styles.section;
  }
  return `${styles.section} ${styles.dimmed}`;
}

interface CoachProps {
  readonly step: TutorialStep;
  readonly stepIndex: number;
  readonly errorText: string | null;
  readonly onNext: () => void;
  readonly onPlay: () => void;
  readonly onExit: () => void;
}

function Coach({ step, stepIndex, errorText, onNext, onPlay, onExit }: CoachProps) {
  const isLast = stepIndex >= TUTORIAL_STEPS.length - 1;
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={styles.coach}
    >
      <div className={styles.progress}>
        {TUTORIAL_STEPS.map((_, index) => (
          <span
            key={index}
            className={index <= stepIndex ? `${styles.dot} ${styles.dotActive}` : styles.dot}
          />
        ))}
      </div>
      <p
        key={errorText ?? step.text}
        className={errorText === null ? styles.coachText : `${styles.coachText} ${styles.coachError}`}
      >
        {errorText ?? step.text}
      </p>
      {step.requiresPick ? null : isLast ? (
        <div className={styles.coachActions}>
          <Button onClick={onPlay}>▶ ¡A JUGAR!</Button>
          <Button onClick={onExit} variant="secondary">
            Inicio
          </Button>
        </div>
      ) : (
        <Button onClick={onNext}>SIGUIENTE →</Button>
      )}
    </motion.div>
  );
}

export function TutorialScreen({ onPlay, onExit }: TutorialScreenProps) {
  const [progress, setProgress] = useState<TutorialProgress>(INITIAL_PROGRESS);
  const stepIndex = Math.min(progress.stepIndex, TUTORIAL_STEPS.length - 1);
  const step: TutorialStep = TUTORIAL_STEPS[stepIndex] ?? TUTORIAL_STEPS[0];

  const handlePick = (productId: string) => {
    if (!step.requiresPick || progress.hitIds.includes(productId)) {
      return;
    }
    const product = TUTORIAL_GONDOLA.find((candidate) => candidate.id === productId);
    if (product === undefined) {
      return;
    }
    const fault = evaluatePick(product, TUTORIAL_CLIENT.restrictions, progress.list);
    const seq = (progress.lastPick?.seq ?? 0) + 1;
    if (fault === null) {
      setProgress({
        stepIndex: progress.stepIndex + 1,
        list: progress.list.map((item) =>
          item.category === product.category ? { ...item, fulfilled: true } : item,
        ),
        hitIds: [...progress.hitIds, productId],
        lastPick: { seq, productId, outcome: 'hit', points: 0, fault: null },
        errorText: null,
      });
      return;
    }
    const mistake = { roundNumber: 1, client: TUTORIAL_CLIENT, product, fault };
    setProgress({
      ...progress,
      lastPick: { seq, productId, outcome: 'miss', points: 0, fault },
      errorText: `${describeMistake(mistake)} Tranqui: aquí no hay strikes, intenta otra vez.`,
    });
  };

  return (
    <div className={styles.screen}>
      <span className={styles.practiceBadge}>🎓 MODO PRÁCTICA · SIN RELOJ</span>
      <div className={sectionClass('client', step.focus)}>
        <ClientCard client={TUTORIAL_CLIENT} layout="compact" />
      </div>
      <div className={sectionClass('list', step.focus)}>
        <ShoppingList items={progress.list} />
      </div>
      <div className={`${sectionClass('gondola', step.focus)} ${styles.gondola}`}>
        {TUTORIAL_GONDOLA.map((product, index) => (
          <GondolaCard
            key={product.id}
            product={product}
            index={index}
            isHit={progress.hitIds.includes(product.id)}
            feedback={progress.lastPick?.productId === product.id ? progress.lastPick : null}
            onPick={handlePick}
          />
        ))}
      </div>
      <Coach
        step={step}
        stepIndex={stepIndex}
        errorText={progress.errorText}
        onNext={() => setProgress({ ...progress, stepIndex: progress.stepIndex + 1 })}
        onPlay={onPlay}
        onExit={onExit}
      />
    </div>
  );
}
