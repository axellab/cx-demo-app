import { RULES } from '../lib/benefits';
import { Icon } from './Icon';

interface Props {
  filled: number;
  goal?: number;
}

/** Tarjeta de sellos LiSTO!: 5 sellos habilitan el cupón. */
export function StampsRow({ filled, goal = RULES.sellosParaCupon }: Props) {
  return (
    <div className="stamps">
      {Array.from({ length: goal }, (_, i) => {
        const on = i < filled;
        return (
          <span
            key={i}
            className={`stamp${on ? ' filled' : ''}`}
            style={on ? { animationDelay: `${i * 60}ms` } : undefined}
          >
            {on ? <Icon name="check" size={16} strokeWidth={2.8} /> : <Icon name="coffee" size={16} />}
          </span>
        );
      })}
    </div>
  );
}
