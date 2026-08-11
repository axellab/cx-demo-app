import { Icon } from '../components/Icon';
import { ProgramBadge } from '../components/ProgramBadge';
import { PROGRAMS } from '../data/programs';
import { USER } from '../data/user';
import { useNav } from '../lib/nav';
import { actions, useStore } from '../lib/store';

export function Profile() {
  const { linked } = useStore();
  const { go, toast } = useNav();

  return (
    <section className="screen s-prof">
      <div className="topbar">
        <div className="grow">
          <h1>Mi perfil</h1>
          <span className="sub">Tu identidad Primax</span>
        </div>
      </div>

      <div className="scroll">
        <div className="s-prof-head">
          <div className="s-prof-avatar">{USER.firstName[0]}</div>
          <div className="grow">
            <h2>{USER.fullName}</h2>
            <p className="tiny muted">
              {USER.doc} · {USER.phone}
            </p>
            <span className="s-prof-tier">Nivel {USER.tier} · socio desde {USER.memberSince}</span>
          </div>
        </div>

        <div className="section-head">
          <h3>Mi vehículo</h3>
        </div>
        <div className="card">
          <div className="prow">
            <span className="pbadge" style={{ width: 38, height: 38, background: 'var(--blue)' }}>
              <Icon name="car" size={20} strokeWidth={2} />
            </span>
            <div className="grow">
              <h4>{USER.vehicle.model}</h4>
              <p>
                {USER.vehicle.plate} · {USER.vehicle.fuel}
              </p>
            </div>
          </div>
        </div>

        <div className="section-head">
          <h3>Programas vinculados</h3>
          <span className="tiny muted">{linked.length} de {PROGRAMS.length}</span>
        </div>
        <div className="card">
          {PROGRAMS.map((p) => {
            const on = linked.includes(p.id);
            return (
              <div key={p.id} className="prow">
                <ProgramBadge id={p.id} />
                <div className="grow">
                  <h4>{p.name}</h4>
                  <p>{on ? p.what : p.livesIn}</p>
                </div>
                <span className={`state${on ? ' ok' : ''}`}>
                  {on ? (
                    <>
                      <Icon name="check" size={15} strokeWidth={3} />
                      Vinculado
                    </>
                  ) : (
                    'Sin vincular'
                  )}
                </span>
              </div>
            );
          })}
        </div>

        <div className="section-head">
          <h3>Ayuda</h3>
        </div>
        <div className="card">
          <button className="prow s-prof-link" onClick={() => toast('Primax Te Escucha: contanos qué pasó')}>
            <span className="pbadge" style={{ width: 38, height: 38, background: 'var(--p-gas)' }}>
              <Icon name="message" size={19} strokeWidth={2} />
            </span>
            <div className="grow">
              <h4>Primax Te Escucha</h4>
              <p>Reclamos y sugerencias, sin salir de la app</p>
            </div>
            <Icon name="right" size={18} />
          </button>
        </div>

        {/* Controles pensados para presentar la demo más de una vez */}
        <div className="section-head">
          <h3>Demo</h3>
        </div>
        <div className="card">
          <button className="prow s-prof-link" onClick={() => { actions.replayOnboarding(); go('onboarding'); }}>
            <span className="pbadge" style={{ width: 38, height: 38, background: 'var(--blue)' }}>
              <Icon name="link" size={19} strokeWidth={2} />
            </span>
            <div className="grow">
              <h4>Ver la unificación otra vez</h4>
              <p>Repite el onboarding de "antes y después"</p>
            </div>
            <Icon name="right" size={18} />
          </button>
          <button
            className="prow s-prof-link"
            onClick={() => {
              actions.simulateVisitsFinal();
              go('home');
            }}
          >
            <span className="pbadge" style={{ width: 38, height: 38, background: 'var(--p-sellos)' }}>
              <Icon name="flame" size={19} strokeWidth={2} />
            </span>
            <div className="grow">
              <h4>Completar las 10 visitas del mes</h4>
              <p>Muestra el aviso de meta cumplida y suma el sello</p>
            </div>
            <Icon name="right" size={18} />
          </button>
          <button
            className="prow s-prof-link"
            onClick={() => {
              actions.reset();
              toast('Demo reiniciada');
              go('splash');
            }}
          >
            <span className="pbadge" style={{ width: 38, height: 38, background: 'var(--danger)' }}>
              <Icon name="refresh" size={19} strokeWidth={2} />
            </span>
            <div className="grow">
              <h4>Reiniciar la demo</h4>
              <p>Vuelve a 1,240 puntos, 5 sellos y el historial original</p>
            </div>
            <Icon name="right" size={18} />
          </button>
          <button
            className="prow s-prof-link"
            onClick={async () => {
              // El link con ?reset=1 arranca siempre desde el onboarding:
              // sirve para pasarle el teléfono a la próxima persona.
              const link = `${location.origin}${location.pathname}?reset=1`;
              try {
                await navigator.clipboard.writeText(link);
                toast('Link copiado: quien lo abra empieza desde cero');
              } catch {
                toast(link);
              }
            }}
          >
            <span className="pbadge" style={{ width: 38, height: 38, background: 'var(--p-convenio)' }}>
              <Icon name="link" size={19} strokeWidth={2} />
            </span>
            <div className="grow">
              <h4>Copiar link para otra persona</h4>
              <p>Abre la demo desde el onboarding, sin arrastrar tu recorrido</p>
            </div>
            <Icon name="right" size={18} />
          </button>
        </div>

        <p className="tiny muted s-prof-foot">
          Prototipo de demostración. Los saldos, precios y movimientos son datos de ejemplo.
        </p>
      </div>
    </section>
  );
}
