import { ATTRIBUTE_META } from '../data/attributes.ts';
import { RESTRICTION_META, RESTRICTION_RULES } from '../data/restrictions.ts';
import type { Client, ProductAttribute, TraceAttribute } from '../state/types.ts';
import { AttributeIcon } from './AttributeIcon.tsx';
import styles from './ClientCard.module.css';

interface ClientCardProps {
  readonly client: Client;
  readonly layout: 'compact' | 'featured';
}

interface ForbiddenEntry {
  readonly key: string;
  readonly attribute: ProductAttribute | TraceAttribute;
  readonly isTrace: boolean;
  readonly label: string;
}

function collectForbidden(client: Client): ForbiddenEntry[] {
  const attributes = new Set<ProductAttribute>();
  const traces = new Set<TraceAttribute>();
  for (const restriction of client.restrictions) {
    const rule = RESTRICTION_RULES[restriction];
    rule.forbiddenAttributes.forEach((attribute) => attributes.add(attribute));
    rule.forbiddenTraces.forEach((trace) => traces.add(trace));
  }
  return [
    ...[...attributes].map((attribute) => ({
      key: attribute,
      attribute,
      isTrace: false,
      label: ATTRIBUTE_META[attribute].label,
    })),
    ...[...traces].map((trace) => ({
      key: `trace-${trace}`,
      attribute: trace,
      isTrace: true,
      label: `Trazas ${ATTRIBUTE_META[trace].label.toLowerCase()}`,
    })),
  ];
}

function ForbiddenIcons({ entries, featured }: { entries: ForbiddenEntry[]; featured: boolean }) {
  return (
    <div className={styles.forbidden}>
      <span className={styles.forbiddenLabel}>NO PUEDE</span>
      {entries.map((entry) => (
        <span key={entry.key} className={featured ? styles.forbiddenEntry : undefined}>
          <span className={styles.slashed}>
            <AttributeIcon
              attribute={entry.attribute}
              variant={entry.isTrace ? 'trace' : 'solid'}
              size={featured ? 'large' : 'medium'}
            />
          </span>
          {featured ? <span className={styles.forbiddenName}>{entry.label}</span> : null}
        </span>
      ))}
    </div>
  );
}

export function ClientCard({ client, layout }: ClientCardProps) {
  const featured = layout === 'featured';
  return (
    <div className={featured ? `${styles.card} ${styles.featured}` : styles.card}>
      <span className={styles.avatar}>{client.emoji}</span>
      <div className={styles.info}>
        <span className={styles.name}>{client.name}</span>
        <div className={styles.chips}>
          {client.restrictions.map((restriction) => (
            <span key={restriction} className={styles.chip}>
              {RESTRICTION_META[restriction].emoji} {RESTRICTION_META[restriction].label}
            </span>
          ))}
        </div>
        <ForbiddenIcons entries={collectForbidden(client)} featured={featured} />
      </div>
    </div>
  );
}
