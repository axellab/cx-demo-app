import { Icon } from './Icon';
import { STREAK_GOAL } from '../lib/store';

interface Props {
  /** Casilleros ya completados. */
  filled: number;
  /** Índice (base 1) del casillero que se acaba de marcar: se anima aparte. */
  justChecked?: number;
  compact?: boolean;
}

/** La fila de 10 casilleros de la racha diaria. */
export function StreakRow({ filled, justChecked, compact = false }: Props) {
  return (
    <div className={`streak-row${compact ? ' compact' : ''}`}>
      {Array.from({ length: STREAK_GOAL }, (_, i) => {
        const on = i < filled;
        const isNew = justChecked === i + 1;
        return (
          <span
            key={i}
            className={`streak-slot${on ? ' on' : ''}${isNew ? ' new' : ''}`}
            aria-label={`Día ${i + 1}${on ? ', completado' : ''}`}
          >
            {on ? <Icon name="check" size={compact ? 11 : 13} strokeWidth={3.4} /> : i + 1}
          </span>
        );
      })}
    </div>
  );
}
