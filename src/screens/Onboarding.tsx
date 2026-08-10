import { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { ProgramBadge } from '../components/ProgramBadge';
import { PROGRAMS } from '../data/programs';
import { USER } from '../data/user';
import { RULES } from '../lib/benefits';
import { pts, soles } from '../lib/format';
import { actions, useStore } from '../lib/store';

type Step = 'antes' | 'vinculando' | 'listo';

/**
 * El "antes y después" de la demo.
 *
 * Paso 1 muestra el problema tal cual es hoy: seis programas repartidos en
 * apps y portales distintos, cuatro de ellos con su propio registro.
 * Paso 2 los vincula a la identidad única. Paso 3 muestra el resultado.
 */
export function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>('antes');
  const { linked, points, stamps } = useStore();
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function startLinking() {
    setStep('vinculando');
    PROGRAMS.forEach((p, i) => {
      timers.current.push(window.setTimeout(() => actions.link(p.id), 420 + i * 340));
    });
    timers.current.push(
      window.setTimeout(() => {
        actions.finishOnboarding();
        setStep('listo');
      }, 420 + PROGRAMS.length * 340 + 500),
    );
  }

  const ownLogins = PROGRAMS.filter((p) => p.needsOwnLogin).length;

  return (
    <section className="screen s-onb">
      <div className="scroll no-nav">
        {step !== 'listo' ? (
          <>
            <header className="s-onb-head">
              <span className="s-onb-kicker">Hola, {USER.firstName}</span>
              <h2>
                {step === 'antes' ? (
                  <>
                    Tus beneficios están en <em>{PROGRAMS.length} lugares</em> distintos
                  </>
                ) : (
                  <>Uniendo todo en una sola cuenta…</>
                )}
              </h2>
              <p>
                {step === 'antes'
                  ? `Encontramos todo lo que ya tenés con Primax. ${ownLogins} de estos programas te piden usuario y clave por separado.`
                  : 'Vinculamos cada programa a tu identidad Primax. No perdés nada de lo acumulado.'}
              </p>
            </header>

            <div className="card s-onb-list">
              {PROGRAMS.map((p) => {
                const on = linked.includes(p.id);
                return (
                  <div key={p.id} className="prow">
                    <ProgramBadge id={p.id} />
                    <div className="grow">
                      <h4>{p.name}</h4>
                      <p>{on ? p.what : p.livesIn}</p>
                    </div>
                    {step === 'antes' ? (
                      <span className={`state${p.needsOwnLogin ? '' : ' ok'}`}>
                        {p.needsOwnLogin ? 'Login aparte' : 'Sin canal digital'}
                      </span>
                    ) : (
                      <span className={`state${on ? ' ok' : ''}`}>
                        {on ? (
                          <>
                            <Icon name="check" size={15} strokeWidth={3} />
                            Vinculado
                          </>
                        ) : (
                          <span className="s-onb-spin" />
                        )}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {step === 'antes' && (
              <>
                <button className="btn btn-primary btn-block s-onb-cta" onClick={startLinking}>
                  <Icon name="link" size={19} strokeWidth={2.2} />
                  Unificar mis programas
                </button>
                <p className="tiny muted" style={{ textAlign: 'center', marginTop: '.8rem' }}>
                  Verificamos tu identidad con tu {USER.doc.split(' ')[0]} y tu celular. No hace falta
                  crear nada nuevo.
                </p>
              </>
            )}
          </>
        ) : (
          <div className="s-onb-done">
            <div className="s-onb-seal">
              <Icon name="check" size={44} strokeWidth={2.6} />
            </div>
            <h2>Listo, {USER.firstName}</h2>
            <p className="muted">Una identidad. Una billetera. Un solo QR.</p>

            <div className="card s-onb-summary">
              <div className="row between">
                <span className="tiny muted">Puntos Bonus</span>
                <b>{pts(points)} pts</b>
              </div>
              <div className="row between">
                <span className="tiny muted">Sellos LiSTO!</span>
                <b>
                  {stamps}/{RULES.sellosParaCupon} · cupón listo
                </b>
              </div>
              <div className="row between">
                <span className="tiny muted">Convenio {USER.convenio.company}</span>
                <b>S/ 1.00 por galón</b>
              </div>
              <div className="row between">
                <span className="tiny muted">Todo junto vale</span>
                <b style={{ color: 'var(--orange)' }}>
                  {soles(points * RULES.solesPorPunto + RULES.valorCupon)}
                </b>
              </div>
            </div>

            <button className="btn btn-primary btn-block" onClick={onDone}>
              Entrar a mi cuenta
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
