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
  const { points, stamps, credit } = useStore();
  const { toast } = useNav();
  const [confirm, setConfirm] = useState<RedeemItem | null>(null);
  const [confirmCredit, setConfirmCredit] = useState(false);

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
          {credit > 0 ? (
            <div className="s-wallet-tile">
              <ProgramBadge id="bonus" size={32} />
              <b>{soles(credit)}</b>
              <span className="tiny muted">saldo a favor</span>
              <span className="s-wallet-eq">Se aplica al pagar</span>
            </div>
          ) : (
            <div className="s-wallet-tile">
              <ProgramBadge id="gas" size={32} />
              <b>7 %</b>
              <span className="tiny muted">dto. en Primax Gas</span>
              <span className="s-wallet-eq">Por nivel {USER.tier}</span>
            </div>
          )}
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

        {/* Canje sin mínimo: siempre hay algo para hacer con los puntos, aunque
            no alcancen para el premio más barato del catálogo. */}
        <button
          className="s-wallet-direct"
          onClick={() => setConfirmCredit(true)}
          disabled={points === 0}
        >
          <span className="s-wallet-direct-icon">
            <Icon name="percent" size={22} strokeWidth={2} />
          </span>
          <span className="grow">
            <h4>Descontá tus puntos de tu próxima compra</h4>
            <p>
              {points > 0
                ? `Tus ${pts(points)} pts se convierten en ${soles(points * RULES.solesPorPunto)} de saldo a favor`
                : 'Sumá puntos para volver a usar esta opción'}
            </p>
          </span>
          <span className="s-wallet-direct-tag">Sin mínimo</span>
        </button>

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

      <Sheet
        open={confirmCredit}
        onClose={() => setConfirmCredit(false)}
        title="Descontar de tu próxima compra"
      >
        <p className="tiny muted" style={{ marginBottom: '.9rem', lineHeight: 1.6 }}>
          Convertís tus <b>{pts(points)} puntos</b> en{' '}
          <b>{soles(points * RULES.solesPorPunto)}</b> de saldo a favor. El saldo se descuenta solo
          la próxima vez que pagues con tu QR, en playa, tienda LiSTO! o Primax Gas.
        </p>
        <button
          className="btn btn-primary btn-block"
          onClick={() => {
            const value = points * RULES.solesPorPunto;
            actions.redeemPointsForCredit();
            setConfirmCredit(false);
            toast(`${soles(value)} de saldo a favor listo para tu próxima compra`);
          }}
        >
          <Icon name="percent" size={18} strokeWidth={2.1} />
          Convertir {pts(points)} pts
        </button>
      </Sheet>

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
