import { motion } from 'framer-motion';
import { CATEGORY_META } from '../data/categories.ts';
import type { ShoppingItem } from '../state/types.ts';
import styles from './ShoppingList.module.css';

interface ShoppingListProps {
  readonly items: readonly ShoppingItem[];
}

export function ShoppingList({ items }: ShoppingListProps) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <motion.span
          key={item.category}
          layout
          animate={item.fulfilled ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className={item.fulfilled ? `${styles.item} ${styles.fulfilled}` : styles.item}
        >
          {item.fulfilled ? <span className={styles.check}>✔</span> : null}
          {CATEGORY_META[item.category].emoji} 1 {CATEGORY_META[item.category].label}
        </motion.span>
      ))}
    </div>
  );
}
