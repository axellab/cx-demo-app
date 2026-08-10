import { useEffect, useRef, useState } from 'react';
import type { Receipt } from '../App';
import { Icon } from '../components/Icon';
import { ProgramBadge } from '../components/ProgramBadge';
import { PROGRAM_BY_ID } from '../data/programs';
import { DEMO_PURCHASES } from '../data/purchases';
import { bestSelection, computeBreakdown, type Selection, type WalletState } from '../lib/benefits';
import { plural, pts, soles } from '../lib/format';
import { useNav } from '../lib/nav';
import { actions, useStore } from '../lib/store';
import type { Context } from '../types';

interface Props {
  context: Context;
  onPaid: (r: Receipt) => void;
}

/**
 * El momento "aha" de la demo.
 *
 * La app arma sola la mejor combinación de beneficios entre programas que hoy
 * viven separados, y deja ver el ahorro antes de confirmar. Los controles
 * recalculan todo en vivo: es la prueba de que no es una maqueta pintada.
 */
export function PaySummary({ context, onPaid }: Props) {
  const store = useStore();
  const { back } = useNav();
  const purchase = DEMO_PURCHASES[context];

  const wallet: WalletState = { points: store.points, stamps: store.stamps, hasConvenio: true };
  const [sel, setSel] = useState<Selection>(() => bestSelection(purchase, wallet));
  const [authorizing, setAuthorizing] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const b = computeBreakdown(purchase, wallet, sel);
  const activos = b.rows.filter((r) => r.applies && r.amount > 0).length;

  function confirm() {
    if (authorizing) return;
    setAuthorizing(true);
    timer.current = window.setTimeout(() => {
      actions.commitPurchase(purchase, b);
      onPaid({ purchase, breakdown: b });
    }, 1600);
  }

  return (
    <section className="screen s-sum">
      <div className="topbar">
        <button className="icon-btn ghost" onClick={back} aria-label="Volver">
          <Icon name="left" size={22} />
        </button>
        <div className="grow">
          <h1>Confirmá tu compra</h1>
          <span className="sub">{purchase.station}</span>
        </div>
      </div>

      <div className="scroll no-nav">
        {/* Detalle de la compra */}
        <div className="card">
          {purchase.items.map((it) => (
            <div key={it.name} className="row between s-sum-item">
              <span>
                {it.name}
                {it.gallons ? <em className="muted"> · {it.gallons} gal</em> : null}
              </span>
              <b>{soles(it.price * it.qty)}</b>
            </div>
          ))}
          <div className="row between s-sum-gross">
            <span>Subtotal</span>
            <b>{soles(b.gross)}</b>
          </div>
        </div>

        {/* ── Motor de beneficios ─────────────────────────────── */}
        <div className="s-sum-engine">
          <div className="s-sum-engine-head">
            <Icon name="sparkles" size={18} strokeWidth={2} />
            <div className="grow">
              <h3>Lo mejor para vos</h3>
              <p>
                {activos > 1
                  ? `Combinamos ${activos} beneficios de programas distintos`
                  : activos === 1
                    ? 'Aplicamos el único beneficio disponible para esta compra'
                    : 'No hay beneficios aplicables a esta compra'}
              </p>
            </div>
          </div>

          {b.rows.map((row) => (
            <div key={row.id} className={`s-sum-row${row.applies ? '' : ' off'}`}>
              <ProgramBadge id={row.program} size={34} />
              <div className="grow">
                <h4>{row.title}</h4>
                <p>{row.applies ? row.detail : row.reason}</p>
              </div>

              {row.applies ? (
                <>
                  <b className="s-sum-amount">−{soles(row.amount)}</b>
                  {row.locked ? (
                    <span className="s-sum-auto" title="Se aplica solo, como en el surtidor">
                      Auto
                    </span>
                  ) : (
                    <Switch
                      on={row.enabled}
                      onChange={(v) => {
                        if (row.id === 'cupon') setSel({ ...sel, cupon: v });
                        if (row.id === 'bonuspaga') {
                          setSel({ ...sel, bonusPts: v ? b.maxBonusPts : 0 });
                        }
                      }}
                      label={row.title}
                    />
                  )}
                </>
              ) : (
                <span className="s-sum-na">—</span>
              )}
            </div>
          ))}

          {/* Cuántos puntos usar: el cliente decide, la app propone el máximo. */}
          {b.maxBonusPts > 0 && (
            <div className="s-sum-slider">
              <div className="row between">
                <span className="tiny">Puntos a usar</span>
                <b className="tiny">
                  {pts(b.pointsSpent)} pts = {soles(b.pointsSpent * 0.01)}
                </b>
              </div>
              <input
                type="range"
                min={0}
                max={b.maxBonusPts}
                step={10}
                value={b.pointsSpent}
                onChange={(e) => setSel({ ...sel, bonusPts: Number(e.target.value) })}
                aria-label="Puntos Bonus a usar en esta compra"
              />
              <div className="row between tiny muted">
                <span>0</span>
                <span>Máximo {pts(b.maxBonusPts)} pts</span>
              </div>
            </div>
          )}
        </div>

        {/* Totales */}
        <div className="s-sum-total">
          <div className="row between">
            <span className="muted">Subtotal</span>
            <span>{soles(b.gross)}</span>
          </div>
          <div className="row between s-sum-save-row">
            <span>Beneficios aplicados</span>
            <span>−{soles(b.discount)}</span>
          </div>
          <div className="row between s-sum-final">
            <span>Total a pagar</span>
            <b>{soles(b.total)}</b>
          </div>
          {b.discount > 0 && (
            <div className="s-sum-badge">
              <Icon name="trophy" size={16} strokeWidth={2.2} />
              Ahorrás {soles(b.discount)} en esta compra
            </div>
          )}
        </div>

        {/* Lo que suma: la misma transacción alimenta varios programas */}
        <div className="card s-sum-earn">
          <span className="tiny muted">Con esta misma compra sumás</span>
          <div className="s-sum-earn-row">
            <span className="s-sum-earn-pill">
              <ProgramBadge id="bonus" size={22} />+{b.earn.points} pts Bonus
            </span>
            {b.earn.stamps > 0 && (
              <span className="s-sum-earn-pill">
                <ProgramBadge id="sellos" size={22} />+{b.earn.stamps}{' '}
                {plural(b.earn.stamps, 'sello', 'sellos')}
              </span>
            )}
          </div>
          {b.earn.notes.length > 0 && <p className="tiny muted">{b.earn.notes.join(' · ')}</p>}
        </div>

        <button className="btn btn-primary btn-block" onClick={confirm} disabled={authorizing}>
          <Icon name="shield" size={19} strokeWidth={2} />
          {authorizing ? 'Autorizando…' : `Pagar ${soles(b.total)}`}
        </button>
        {activos > 1 && (
          <p className="tiny muted" style={{ textAlign: 'center', marginTop: '.7rem' }}>
            Hoy esto serían {activos} canales distintos:{' '}
            {b.rows
              .filter((r) => r.applies && r.amount > 0)
              .map((r) => PROGRAM_BY_ID[r.program].name)
              .join(', ')}
            .
          </p>
        )}
      </div>

      {authorizing && (
        <div className="s-sum-face">
          <div className="s-sum-face-ring">
            <Icon name="user" size={44} strokeWidth={1.4} />
          </div>
          <p>Confirmá con tu rostro</p>
        </div>
      )}
    </section>
  );
}

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      className={`switch${on ? ' on' : ''}`}
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      aria-label={label}
    >
      <span />
    </button>
  );
}
