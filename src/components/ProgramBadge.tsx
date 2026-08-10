import { PROGRAM_BY_ID } from '../data/programs';
import type { ProgramId } from '../types';
import { Icon } from './Icon';

interface Props {
  id: ProgramId;
  size?: number;
  /** Fondo tintado en vez de sólido, para fondos claros. */
  soft?: boolean;
}

export function ProgramBadge({ id, size = 38, soft = false }: Props) {
  const p = PROGRAM_BY_ID[id];
  return (
    <span
      className={`pbadge${soft ? ' soft' : ''}`}
      style={{
        width: size,
        height: size,
        color: soft ? p.color : '#fff',
        background: p.color,
      }}
      title={p.name}
    >
      <Icon name={p.icon} size={Math.round(size * 0.52)} strokeWidth={2} />
    </span>
  );
}
