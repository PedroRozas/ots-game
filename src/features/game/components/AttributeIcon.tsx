import type { ReactNode } from 'react';
import { ATTRIBUTE_META } from '../data/attributes.ts';
import type { ProductAttribute } from '../state/types.ts';
import styles from './AttributeIcon.module.css';

type IconSize = 'small' | 'medium' | 'large';

interface AttributeIconProps {
  readonly attribute: ProductAttribute;
  readonly variant?: 'solid' | 'trace';
  readonly size?: IconSize;
  readonly highlighted?: boolean;
}

const GLYPHS: Record<Exclude<ProductAttribute, 'highSugar'>, ReactNode> = {
  meat: (
    <g>
      <circle cx="14.5" cy="9.5" r="5.6" />
      <path d="M11 13 6.4 17.6" stroke="inherit" strokeWidth="3" strokeLinecap="round" />
      <circle cx="5.4" cy="16.6" r="2.3" />
      <circle cx="7.4" cy="18.6" r="2.3" />
    </g>
  ),
  dairy: (
    <path d="M10 3h4v3c1.9 1 2.6 2.5 2.6 4.3V19a2 2 0 0 1-2 2H9.4a2 2 0 0 1-2-2v-8.7C7.4 8.5 8.1 7 10 6z" />
  ),
  lactose: (
    <path d="M12 3c3.5 4.6 5.9 7.8 5.9 11a5.9 5.9 0 1 1-11.8 0C6.1 10.8 8.5 7.6 12 3z" />
  ),
  gluten: (
    <g>
      <path d="M12 21.5V7" stroke="inherit" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 8.5C8.8 8 7.6 5.8 7.6 3c2.8 0 5 1.4 4.4 5.5z" />
      <path d="M12 8.5c3.2-.5 4.4-2.7 4.4-5.5-2.8 0-5 1.4-4.4 5.5z" />
      <path d="M12 14c-3.2-.5-4.4-2.7-4.4-5.5 2.8 0 5 1.4 4.4 5.5z" />
      <path d="M12 14c3.2-.5 4.4-2.7 4.4-5.5-2.8 0-5 1.4-4.4 5.5z" />
    </g>
  ),
  egg: (
    <g>
      <path d="M12 3.4c3.2 0 6 4.8 6 9.1a6 6 0 1 1-12 0c0-4.3 2.8-9.1 6-9.1z" />
      <circle cx="12" cy="13.5" r="2.6" fill="rgba(43, 33, 24, 0.35)" />
    </g>
  ),
  nuts: (
    <g>
      <circle cx="12" cy="8.2" r="4.2" />
      <circle cx="12" cy="15.6" r="4.9" />
      <circle cx="10.4" cy="14.8" r="0.9" fill="rgba(43, 33, 24, 0.35)" />
      <circle cx="13.6" cy="16.4" r="0.9" fill="rgba(43, 33, 24, 0.35)" />
    </g>
  ),
};

function sizeClass(size: IconSize): string {
  if (size === 'small') {
    return ` ${styles.small}`;
  }
  return size === 'large' ? ` ${styles.large}` : '';
}

function SugarSeal({ size }: { readonly size: IconSize }) {
  const width = size === 'small' ? 34 : size === 'large' ? 56 : 44;
  return (
    <svg
      className={styles.seal}
      width={width}
      height={width * 0.62}
      viewBox="0 0 44 27"
      role="img"
      aria-label={ATTRIBUTE_META.highSugar.label}
    >
      <polygon
        points="11,1 33,1 43,9 43,18 33,26 11,26 1,18 1,9"
        fill="var(--color-seal)"
        stroke="var(--color-card)"
        strokeWidth="1.6"
      />
      <text x="22" y="11.5" textAnchor="middle" fill="#fff" fontSize="6.4" fontWeight="700">
        ALTO EN
      </text>
      <text x="22" y="21" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800">
        AZÚCAR
      </text>
    </svg>
  );
}

export function AttributeIcon({
  attribute,
  variant = 'solid',
  size = 'medium',
  highlighted = false,
}: AttributeIconProps) {
  const meta = ATTRIBUTE_META[attribute];
  const highlightClass = highlighted ? ` ${styles.highlighted}` : '';
  if (attribute === 'highSugar') {
    return (
      <span className={`${styles.seal}${highlightClass}`}>
        <SugarSeal size={size} />
      </span>
    );
  }
  const isTrace = variant === 'trace';
  const glyphColor = isTrace ? meta.color : 'var(--color-card)';
  const label = isTrace ? `Trazas de ${meta.label.toLowerCase()}` : meta.label;
  return (
    <span
      className={`${styles.badge}${sizeClass(size)}${isTrace ? ` ${styles.trace}` : ''}${highlightClass}`}
      style={{ backgroundColor: isTrace ? undefined : meta.color, borderColor: isTrace ? meta.color : undefined }}
      role="img"
      aria-label={label}
      title={label}
    >
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill={glyphColor} stroke={glyphColor}>
        {GLYPHS[attribute]}
      </svg>
    </span>
  );
}
