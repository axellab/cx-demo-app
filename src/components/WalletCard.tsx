import { USER } from '../data/user';
import { RULES } from '../lib/benefits';
import { pts, soles } from '../lib/format';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';
import { Icon } from './Icon';

/**
 * El titular de la experiencia unificada: en vez de "1.240 puntos" suelto en
 * una app y "5 sellos" en un portal aparte, un único valor en soles con el
 * desglose de dónde sale.
 */
export function WalletCard() {
  const { points, stamps, savedYtd, linked } = useStore();
  const { go, toast } = useNav();

  const cupon = stamps >= RULES.sellosParaCupon ? RULES.valorCupon : 0;
  const available = points * RULES.solesPorPunto + cupon;
  const sources = [points > 0, cupon > 0, true].filter(Boolean).length;

  /* Si eligió "ahora no" en el onboarding, no podemos mostrarle saldos de
     programas que todavía no vinculó: mostramos la invitación, no el número. */
  if (linked.length === 0) {
    return (
      <div className="wcard">
        <span className="label">Tu billetera</span>
        <div className="wcard-locked">
          <Icon name="link" size={30} strokeWidth={1.7} />
          <h3>Todavía no vinculaste tus programas</h3>
          <p>
            Bonus, Sellos LiSTO!, tu convenio, Primax Gas y lubricantes. Al vincularlos, vas a ver
            todo lo que tenés acumulado en un solo número.
          </p>
        </div>
        <div className="wcard-actions">
          <button className="hot" onClick={() => go('onboarding')}>
            <Icon name="link" size={17} strokeWidth={2} />
            Vincular ahora
          </button>
          <button onClick={() => toast('Podés vincularlos cuando quieras, desde acá o desde Perfil')}>
            <Icon name="info" size={17} strokeWidth={2} />
            Más tarde
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wcard">
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <span className="label">Tu billetera unificada</span>
        <span className="chip tier">Nivel {USER.tier}</span>
      </div>

      <div className="amount">
        <small>S/</small>{' '}
        {available.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className="sub">
        Disponible ahora entre {sources} programas · ahorrado este año {soles(savedYtd)}
      </div>

      <div className="wcard-chips">
        <span className="wcard-chip" style={{ borderColor: 'rgba(244,97,12,.5)' }}>
          <Icon name="sparkles" size={14} strokeWidth={2.2} />
          <b>{pts(points)}</b> pts Bonus
        </span>
        <span className="wcard-chip">
          <Icon name="coffee" size={14} strokeWidth={2.2} />
          <b>
            {stamps}/{RULES.sellosParaCupon}
          </b>{' '}
          sellos
        </span>
        <span className="wcard-chip">
          <Icon name="percent" size={14} strokeWidth={2.2} />
          Convenio <b>S/ 1.00</b>/gal
        </span>
      </div>

      <div className="wcard-actions">
        <button className="hot" onClick={() => go('pay')}>
          <Icon name="qr" size={17} strokeWidth={2} />
          Pagar
        </button>
        <button onClick={() => go('wallet')}>
          <Icon name="gift" size={17} strokeWidth={2} />
          Canjear
        </button>
        <button onClick={() => go('map')}>
          <Icon name="pin" size={17} strokeWidth={2} />
          Estaciones
        </button>
      </div>
    </div>
  );
}
