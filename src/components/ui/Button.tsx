import type { ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  readonly children: ReactNode;
  readonly onClick: () => void;
  readonly variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  const className =
    variant === 'secondary' ? `${styles.button} ${styles.secondary}` : styles.button;
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
