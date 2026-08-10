import { useMemo } from 'react';
import type { Receipt } from '../App';
import { Icon } from '../components/Icon';
import { ProgramBadge } from '../components/ProgramBadge';
import { RULES } from '../lib/benefits';
import { plural, pts, soles } from '../lib/format';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';
import type { ProgramId } from '../types';

const COLORS = ['#f4610c', '#fba919', '#17a34a', '#ffffff', '#2440c4'];

interface Movement {
  program: ProgramId;
  title: string;
  detail: string;
  value: string;
}

export function PaySuccess({ receipt }: { receipt: Receipt | null }) {
  const { go } = useNav();
  const { points, stamps } = useStore();

  const confetti = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        delay: `${(i % 9) * 0.11}s`,
        color: COLORS[i % COLORS.length],
        rot: `${(i * 53) % 360}deg`,
      })),
    [],
  );

  if (!receipt) {
    return (
      <section className="screen s-ok">
        <div className="scroll no-nav" style={{ display: 'grid', placeItems: 'center' }}>
          <button className="btn btn-primary" onClick={() => go('home')}>
            Volver al inicio
          </button>
        </div>
      </section>
    );
  }

  const b = receipt.breakdown;

  /* Una sola transacción, movimientos en varios programas a la vez.
     Es exactamente lo que hoy no se puede hacer con apps separadas. */
  const movements: Movement[] = [];
  const convenio = b.rows.find((r) => r.id === 'convenio');
  if (convenio && convenio.amount > 0) {
    movements.push({
      program: 'convenio',
      title: 'Convenio Primax Card',
      detail: 'Descuento aplicado en el surtidor',
      value: `−${soles(convenio.amount)}`,
    });
  }
  if (b.pointsSpent > 0 || b.earn.points > 0) {
    movements.push({
      program: 'bonus',
      title: 'Bonus',
      detail: `${b.pointsSpent > 0 ? `Usaste ${pts(b.pointsSpent)} pts · ` : ''}Ganaste ${b.earn.points} pts · saldo ${pts(points)}`,
      value: b.pointsSpent > 0 ? `−${soles(b.pointsSpent * RULES.solesPorPunto)}` : `+${b.earn.points} pts`,
    });
  }
  if (b.stampsSpent > 0 || b.earn.stamps > 0) {
    movements.push({
      program: 'sellos',
      title: 'Sellos LiSTO!',
      detail: `${b.stampsSpent > 0 ? `Canjeaste ${b.stampsSpent} sellos · ` : ''}Ganaste ${b.earn.stamps} ${plural(b.earn.stamps, 'sello', 'sellos')} · saldo ${stamps}/${RULES.sellosParaCupon}`,
      value: b.stampsSpent > 0 ? `−${soles(RULES.valorCupon)}` : `+${b.earn.stamps}`,
    });
  }

  return (
    <section className="screen s-ok">
      <div className="s-ok-confetti" aria-hidden="true">
        {confetti.map((c, i) => (
          <i
            key={i}
            style={{
              left: c.left,
              background: c.color,
              animationDelay: c.delay,
              transform: `rotate(${c.rot})`,
            }}
          />
        ))}
      </div>

      <div className="scroll no-nav">
        <div className="s-ok-seal">
          <Icon name="check" size={46} strokeWidth={2.8} />
        </div>

        <h2 className="s-ok-title">Pago realizado</h2>
        <p className="s-ok-amount">{soles(b.total)}</p>
        <p className="tiny muted s-ok-place">{receipt.purchase.station}</p>

        {b.discount > 0 && (
          <div className="s-ok-saved">
            <span className="tiny">Ahorraste</span>
            <b>{soles(b.discount)}</b>
            <span className="tiny">
              sobre {soles(b.gross)} · {Math.round((b.discount / b.gross) * 100)}% menos
            </span>
          </div>
        )}

        <div className="section-head">
          <h3>Qué se movió en cada programa</h3>
        </div>
        <div className="card">
          {movements.map((m) => (
            <div key={m.program} className="prow">
              <ProgramBadge id={m.program} />
              <div className="grow">
                <h4>{m.title}</h4>
                <p>{m.detail}</p>
              </div>
              <b className="s-ok-mov">{m.value}</b>
            </div>
          ))}
        </div>

        <p className="s-ok-note">
          <Icon name="info" size={16} />
          Una transacción, {movements.length} programas actualizados al instante. Hoy eso son{' '}
          {movements.length} canales distintos.
        </p>

        <button className="btn btn-primary btn-block" onClick={() => go('home')}>
          Volver al inicio
        </button>
        <button className="btn btn-ghost btn-block" onClick={() => go('history')}>
          Ver mi actividad
        </button>
      </div>
    </section>
  );
}
