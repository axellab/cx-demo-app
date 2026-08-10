import { Icon } from '../components/Icon';
import { CHALLENGES } from '../data/catalog';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';

export function Challenges() {
  const { go, toast } = useNav();
  const { arClaimed } = useStore();

  const ar = CHALLENGES.find((c) => c.kind === 'ar')!;
  const rest = CHALLENGES.filter((c) => c.kind !== 'ar');

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
