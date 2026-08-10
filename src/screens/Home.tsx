import { Icon } from '../components/Icon';
import { ProgramBadge } from '../components/ProgramBadge';
import { StampsRow } from '../components/StampsRow';
import { WalletCard } from '../components/WalletCard';
import { CHALLENGES, PROMOS } from '../data/catalog';
import { PROGRAMS } from '../data/programs';
import { NEARBY_STATION } from '../data/stations';
import { USER } from '../data/user';
import { RULES } from '../lib/benefits';
import { soles } from '../lib/format';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';

export function Home() {
  const { go, toast } = useNav();
  const { stamps } = useStore();

  const cuponListo = stamps >= RULES.sellosParaCupon;
  const tierPct = Math.round(((2000 - USER.pointsToNextTier) / 2000) * 100);
  const precioConConvenio = NEARBY_STATION.premium - RULES.convenioPorGalon.premium;

  return (
    <section className="screen s-home">
      <div className="topbar">
        <img src="./logo-wordmark.jpg" alt="Primax" className="brand-logo" />
        <div className="grow" />
        <button className="icon-btn" onClick={() => toast('No tenés notificaciones nuevas')} aria-label="Notificaciones">
          <Icon name="bell" size={19} />
          <span className="badge-dot" />
        </button>
        <button className="icon-btn" onClick={() => go('profile')} aria-label="Mi perfil">
          <Icon name="user" size={19} />
        </button>
      </div>

      <div className="scroll">
        <header className="s-home-hi">
          <h2>Hola, {USER.firstName}</h2>
          <p className="tiny muted">
            Socio desde {USER.memberSince} · {USER.vehicle.model} · {USER.vehicle.plate}
          </p>
        </header>

        <WalletCard />

        {/* Tarjeta contextual: la app sabe dónde estás y qué te conviene ahí. */}
        <button className="s-home-near" onClick={() => go('pay')}>
          <span className="s-home-near-dot" />
          <div className="grow">
            <h4>Estás en {NEARBY_STATION.name}</h4>
            <p>
              G-Premium {soles(NEARBY_STATION.premium)}/gal ·{' '}
              <b>{soles(precioConConvenio)} con tu convenio</b>
            </p>
          </div>
          <Icon name="right" size={18} />
        </button>

        {/* Progreso hacia el próximo beneficio */}
        <div className="section-head">
          <h3>Tu próximo beneficio</h3>
        </div>
        <div className="card">
          {cuponListo && (
            <div className="s-home-ready">
              <ProgramBadge id="sellos" size={34} />
              <div className="grow">
                <h4>Cupón LiSTO! listo para usar</h4>
                <p className="tiny muted">Juntaste tus {RULES.sellosParaCupon} sellos · vale {soles(RULES.valorCupon)}</p>
              </div>
              <span className="s-home-ready-tag">Disponible</span>
            </div>
          )}
          <div className="s-home-tier">
            <div className="row between" style={{ marginBottom: '.5rem' }}>
              <span className="tiny">
                Nivel <b>{USER.tier}</b> → {USER.nextTier}
              </span>
              <span className="tiny muted">Faltan {USER.pointsToNextTier} pts</span>
            </div>
            <div className="progress">
              <i style={{ width: `${tierPct}%` }} />
            </div>
          </div>
        </div>

        {/* Sellos */}
        <div className="section-head">
          <h3>Sellos LiSTO!</h3>
          <button onClick={() => toast(`Sumás 1 sello por cada compra de ${soles(RULES.compraMinimaSello)} o más`)}>
            ¿Cómo sumo?
          </button>
        </div>
        <div className="card">
          <StampsRow filled={stamps} />
          <p className="tiny muted" style={{ marginTop: '.85rem' }}>
            {cuponListo
              ? 'Tu cupón se aplica solo cuando pagues en tienda LiSTO!.'
              : `Te faltan ${RULES.sellosParaCupon - stamps} sellos para tu próximo cupón.`}{' '}
            Pagando con Bonus, los sellos se duplican.
          </p>
        </div>

        {/* Retos y misiones (incluye el reto AR) */}
        <div className="section-head">
          <h3>Retos y misiones</h3>
          <button onClick={() => go('challenges')}>Ver todos</button>
        </div>
        <button className="s-home-ar" onClick={() => go('ar')}>
          <span className="glow" />
          <span className="s-home-ar-icon">
            <Icon name="camera" size={24} strokeWidth={1.9} />
          </span>
          <div className="grow">
            <h4>{CHALLENGES[0].title}</h4>
            <p>{CHALLENGES[0].detail}</p>
          </div>
          <span className="s-home-ar-reward">{CHALLENGES[0].reward}</span>
        </button>

        {/* Promos */}
        <div className="section-head">
          <h3>Promos para vos</h3>
          <button onClick={() => go('wallet')}>Ver todas</button>
        </div>
        <div className="s-home-carousel">
          {PROMOS.map((p) => (
            <button key={p.id} className="s-promo" onClick={() => toast(`"${p.title}" guardada en tu billetera`)}>
              <span className={`s-promo-img t-${p.tone}`}>
                <Icon
                  name={p.tone === 'gas' ? 'flame' : p.tone === 'combo' ? 'fuel' : 'coffee'}
                  size={26}
                  strokeWidth={1.7}
                />
                {p.badge && <em>{p.badge}</em>}
              </span>
              <span className="s-promo-body">
                <ProgramBadge id={p.program} size={20} />
                <h5>{p.title}</h5>
                <p>{p.detail}</p>
                {p.now !== undefined && (
                  <span className="s-promo-price">
                    {p.before !== undefined && <s>{soles(p.before)}</s>}
                    <b>{soles(p.now)}</b>
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Recordatorio permanente de la propuesta de valor */}
        <div className="section-head">
          <h3>Todo en un solo lugar</h3>
          <button onClick={() => go('profile')}>Gestionar</button>
        </div>
        <button className="card s-home-programs" onClick={() => go('profile')}>
          <div className="s-home-programs-row">
            {PROGRAMS.map((p) => (
              <ProgramBadge key={p.id} id={p.id} size={40} />
            ))}
          </div>
          <p className="tiny muted">
            {PROGRAMS.length} programas vinculados a tu identidad Primax. Antes eran 4 registros
            distintos.
          </p>
        </button>
      </div>
    </section>
  );
}
