import { useState } from 'react';
import { Icon } from '../components/Icon';
import { ProgramBadge } from '../components/ProgramBadge';
import { Sheet } from '../components/Sheet';
import { StampsRow } from '../components/StampsRow';
import { PROMOS, REDEEM_ITEMS, type RedeemItem } from '../data/catalog';
import { USER } from '../data/user';
import { RULES } from '../lib/benefits';
import { pts, soles } from '../lib/format';
import { useNav } from '../lib/nav';
import { actions, useStore } from '../lib/store';

export function Wallet() {
  const { points, stamps } = useStore();
  const { toast } = useNav();
  const [confirm, setConfirm] = useState<RedeemItem | null>(null);

  const cuponListo = stamps >= RULES.sellosParaCupon;

  function redeem(item: RedeemItem) {
    actions.spendPoints(item.cost);
    setConfirm(null);
    toast(`Canjeaste "${item.title}". Lo encontrás en tus cupones.`);
  }

  return (
    <section className="screen s-wallet">
      <div className="topbar">
        <div className="grow">
          <h1>Beneficios</h1>
          <span className="sub">Todo lo que tenés disponible</span>
        </div>
      </div>

      <div className="scroll">
        {/* Saldo de cada programa, uno al lado del otro */}
        <div className="s-wallet-grid">
          <div className="s-wallet-tile">
            <ProgramBadge id="bonus" size={32} />
            <b>{pts(points)}</b>
            <span className="tiny muted">puntos Bonus</span>
            <span className="s-wallet-eq">{soles(points * RULES.solesPorPunto)}</span>
          </div>
          <div className="s-wallet-tile">
            <ProgramBadge id="sellos" size={32} />
            <b>
              {stamps}/{RULES.sellosParaCupon}
            </b>
            <span className="tiny muted">sellos LiSTO!</span>
            <span className="s-wallet-eq">{cuponListo ? 'Cupón listo' : 'En progreso'}</span>
          </div>
          <div className="s-wallet-tile">
            <ProgramBadge id="convenio" size={32} />
            <b>S/ 1.00</b>
            <span className="tiny muted">por galón premium</span>
            <span className="s-wallet-eq">Activo</span>
          </div>
          <div className="s-wallet-tile">
            <ProgramBadge id="gas" size={32} />
            <b>7 %</b>
            <span className="tiny muted">dto. en Primax Gas</span>
            <span className="s-wallet-eq">Por nivel {USER.tier}</span>
          </div>
        </div>

        {/* Sellos */}
        <div className="section-head">
          <h3>Sellos LiSTO!</h3>
        </div>
        <div className="card">
          <StampsRow filled={stamps} />
          <p className="tiny muted" style={{ marginTop: '.85rem' }}>
            {cuponListo
              ? `Tenés un cupón de ${soles(RULES.valorCupon)} listo. Se aplica solo al pagar en tienda.`
              : `Te faltan ${RULES.sellosParaCupon - stamps} sellos para el próximo cupón.`}
          </p>
        </div>

        {/* Canje de puntos */}
        <div className="section-head">
          <h3>Canjeá tus puntos</h3>
          <span className="tiny muted">{pts(points)} pts</span>
        </div>
        <div className="card">
          {REDEEM_ITEMS.map((item) => {
            const locked = points < item.cost;
            return (
              <div key={item.id} className="prow">
                <ProgramBadge id={item.program} />
                <div className="grow">
                  <h4>{item.title}</h4>
                  <p>{item.detail}</p>
                </div>
                <button
                  className={`btn btn-sm ${locked ? 'btn-ghost' : 'btn-soft'}`}
                  disabled={locked}
                  onClick={() => setConfirm(item)}
                >
                  {locked ? `${pts(item.cost)} pts` : 'Canjear'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Promos guardadas */}
        <div className="section-head">
          <h3>Promos disponibles</h3>
        </div>
        <div className="card">
          {PROMOS.map((p) => (
            <div key={p.id} className="prow">
              <ProgramBadge id={p.program} />
              <div className="grow">
                <h4>{p.title}</h4>
                <p>{p.detail}</p>
              </div>
              {p.badge && <span className="s-wallet-tag">{p.badge}</span>}
            </div>
          ))}
        </div>
      </div>

      <Sheet open={!!confirm} onClose={() => setConfirm(null)} title="Confirmar canje">
        {confirm && (
          <>
            <div className="prow">
              <ProgramBadge id={confirm.program} />
              <div className="grow">
                <h4>{confirm.title}</h4>
                <p>{confirm.detail}</p>
              </div>
              <b>{pts(confirm.cost)} pts</b>
            </div>
            <p className="tiny muted" style={{ margin: '.6rem 0 1rem' }}>
              Te quedan {pts(points - confirm.cost)} puntos después del canje.
            </p>
            <button className="btn btn-primary btn-block" onClick={() => redeem(confirm)}>
              <Icon name="gift" size={18} strokeWidth={2} />
              Canjear ahora
            </button>
          </>
        )}
      </Sheet>
    </section>
  );
}
