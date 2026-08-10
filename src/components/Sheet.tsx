import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Hoja inferior estándar. Se cierra tocando el fondo. */
export function Sheet({ open, onClose, title, children }: Props) {
  if (!open) return null;
  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet-grip" />
        {title && <h3 style={{ fontSize: '1.02rem', fontWeight: 800, marginBottom: '.7rem' }}>{title}</h3>}
        {children}
      </div>
    </>
  );
}
