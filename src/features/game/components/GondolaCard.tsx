import { motion, type TargetAndTransition, type Transition } from 'framer-motion';
import type { PickFeedback, Product, ProductAttribute, TraceAttribute } from '../state/types.ts';
import { AttributeIcon } from './AttributeIcon.tsx';
import styles from './GondolaCard.module.css';

interface GondolaCardProps {
  readonly product: Product;
  readonly index: number;
  readonly isHit: boolean;
  readonly feedback: PickFeedback | null;
  readonly onPick: (productId: string) => void;
}

interface GuiltyMark {
  readonly attribute: ProductAttribute | TraceAttribute;
  readonly isTrace: boolean;
}

const ENTRY_STAGGER_S = 0.04;

function guiltyMark(feedback: PickFeedback | null): GuiltyMark | null {
  if (feedback?.fault?.kind !== 'notApt') {
    return null;
  }
  const violation = feedback.fault.violations[0];
  if (violation === undefined) {
    return null;
  }
  return violation.kind === 'trace'
    ? { attribute: violation.trace, isTrace: true }
    : { attribute: violation.attribute, isTrace: false };
}

function cardClassName(isHit: boolean, isMiss: boolean): string {
  if (isHit) {
    return `${styles.card} ${styles.hit}`;
  }
  return isMiss ? `${styles.card} ${styles.missFlash}` : styles.card;
}

function cardAnimation(isMiss: boolean, index: number): {
  animate: TargetAndTransition;
  transition: Transition;
} {
  if (isMiss) {
    return {
      animate: { scale: 1, y: 0, x: [0, -8, 8, -5, 5, 0] },
      transition: { x: { duration: 0.4 } },
    };
  }
  return {
    animate: { scale: 1, y: 0 },
    transition: { type: 'spring', stiffness: 420, damping: 22, delay: index * ENTRY_STAGGER_S },
  };
}

function ProductIcons({ product, guilty }: { product: Product; guilty: GuiltyMark | null }) {
  const isClean = product.attributes.length === 0 && product.traces.length === 0;
  return (
    <span className={styles.icons}>
      {product.attributes.map((attribute) => (
        <AttributeIcon
          key={attribute}
          attribute={attribute}
          size="small"
          highlighted={guilty !== null && !guilty.isTrace && guilty.attribute === attribute}
        />
      ))}
      {product.traces.map((trace) => (
        <AttributeIcon
          key={`trace-${trace}`}
          attribute={trace}
          variant="trace"
          size="small"
          highlighted={guilty !== null && guilty.isTrace && guilty.attribute === trace}
        />
      ))}
      {isClean ? <span className={styles.clean}>SIN SELLOS</span> : null}
    </span>
  );
}

function PointsPop({ points }: { points: number }) {
  return (
    <motion.span
      initial={{ opacity: 1, y: 0, x: '-50%' }}
      animate={{ opacity: 0, y: -26 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={styles.points}
    >
      +{points}
    </motion.span>
  );
}

export function GondolaCard({ product, index, isHit, feedback, onPick }: GondolaCardProps) {
  const isMiss = feedback?.outcome === 'miss';
  const guilty = isMiss ? guiltyMark(feedback) : null;
  const { animate, transition } = cardAnimation(isMiss, index);
  return (
    <motion.button
      type="button"
      layout
      initial={{ scale: 0, y: 24 }}
      animate={animate}
      transition={transition}
      whileTap={isHit ? undefined : { scale: 0.93 }}
      className={cardClassName(isHit, isMiss)}
      onClick={() => onPick(product.id)}
      aria-label={product.name}
    >
      {isHit ? <span className={styles.hitBadge}>✓</span> : null}
      {feedback?.outcome === 'hit' ? <PointsPop points={feedback.points} /> : null}
      <span className={styles.emoji}>{product.emoji}</span>
      <span className={styles.name}>{product.name}</span>
      <ProductIcons product={product} guilty={guilty} />
    </motion.button>
  );
}
