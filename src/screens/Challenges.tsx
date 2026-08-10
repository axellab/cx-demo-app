import { Icon } from '../components/Icon';
import { StreakRow } from '../components/StreakRow';
import { CHALLENGES } from '../data/catalog';
import { useNav } from '../lib/nav';
import { STREAK_GOAL, today, useStore } from '../lib/store';

export function Challenges() {
  const { go, toast } = useNav();
  const { arClaimed, gamePlayedOn, streakDays, streakLastDay } = useStore();

  const ar = CHALLENGES.find((c) => c.kind === 'ar')!;
  const game = CHALLENGES.find((c) => c.kind === 'game')!;
  const streak = CHALLENGES.find((c) => c.kind === 'streak')!;
  const rest = CHALLENGES.filter((c) => c.kind === 'progress');
  const wonToday = gamePlayedOn === today();
  const contadoHoy = streakLastDay === today();

  return (
    <section className="screen s-chal">
      <div className="topbar">
        <div className="grow">
          <h1>Retos y misiones</h1>
          <span className="sub">Sumá puntos haciendo lo de siempre</span>
        </div>
      </div>

      <div className="scroll">
        {/* Reto de realidad aumentada */}
        <button className="s-chal-ar" onClick={() => go('ar')}>
          <span className="glow" />
          <span className="s-chal-ar-icon">
            <Icon name="camera" size={26} strokeWidth={1.8} />
          </span>
          <h3>{ar.title}</h3>
          <p>{ar.detail}</p>
          <span className="s-chal-ar-cta">
            {arClaimed ? 'Volver a jugar' : 'Activar cámara'} · {ar.reward}
          </span>
        </button>

        {/* Racha diaria: un sello al entrar diez días seguidos */}
        <div className="section-head">
          <h3>Tu racha diaria</h3>
          <span className="tiny muted">{contadoHoy ? 'Hoy ya cuenta' : 'Entrá hoy para sumar'}</span>
        </div>
        <div className="card">
          <div className="row between" style={{ marginBottom: '.85rem' }}>
            <div className="grow">
              <h4 style={{ fontSize: '.9rem', fontWeight: 700 }}>{streak.title}</h4>
              <p className="tiny muted">{streak.detail}</p>
            </div>
            <span className="s-chal-reward">{streak.reward}</span>
          </div>
          <StreakRow filled={streakDays} justChecked={contadoHoy ? streakDays : undefined} />
          <p className="tiny muted" style={{ marginTop: '.7rem' }}>
            {streakDays === 0
              ? `Arrancá hoy: son ${STREAK_GOAL} días seguidos.`
              : `Llevás ${streakDays} ${streakDays === 1 ? 'día' : 'días'} · te ${
                  STREAK_GOAL - streakDays === 1 ? 'falta' : 'faltan'
                } ${STREAK_GOAL - streakDays} para tu sello.`}{' '}
            Si te salteás un día, vuelve a empezar.
          </p>
        </div>

        {/* Juego diario — pensado para que jueguen los chicos en la estación */}
        <div className="section-head">
          <h3>Para jugar en familia</h3>
        </div>
        <button className="s-chal-game" onClick={() => go('game')}>
          <span className="s-chal-game-icons">
            <Icon name="fuel" size={18} strokeWidth={2} />
            <Icon name="coffee" size={18} strokeWidth={2} />
            <Icon name="flame" size={18} strokeWidth={2} />
            <Icon name="sparkles" size={18} strokeWidth={2} />
          </span>
          <span className="grow">
            <h4>{game.title}</h4>
            <p>{game.detail}</p>
          </span>
          <span className={`s-chal-game-tag${wonToday ? ' done' : ''}`}>
            {wonToday ? 'Ya jugaste hoy' : game.reward}
          </span>
        </button>

        <div className="section-head">
          <h3>En curso</h3>
        </div>

        {rest.map((c) => {
          const pct = Math.round((c.progress / c.goal) * 100);
          return (
            <div key={c.id} className="card s-chal-item">
              <div className="row between">
                <div className="grow">
                  <h4>{c.title}</h4>
                  <p className="tiny muted">{c.detail}</p>
                </div>
                <span className="s-chal-reward">{c.reward}</span>
              </div>
              <div className="progress" style={{ marginTop: '.8rem' }}>
                <i style={{ width: `${pct}%` }} />
              </div>
              <p className="tiny muted" style={{ marginTop: '.45rem' }}>
                {c.progress} de {c.goal} completado
              </p>
            </div>
          );
        })}

        <button
          className="btn btn-ghost btn-block"
          onClick={() => toast('Los retos se renuevan cada semana')}
        >
          ¿Cómo funcionan los retos?
        </button>
      </div>
    </section>
  );
}
