import { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { USER } from '../data/user';

type Phase = 'idle' | 'scanning' | 'ok';

const HINT: Record<Phase, string> = {
  idle: 'Tocá para ingresar con tu huella',
  scanning: 'Verificando tu identidad…',
  ok: `Hola de nuevo, ${USER.firstName}`,
};

/**
 * Ingreso a la cuenta Primax (no es el desbloqueo del teléfono).
 * Una sola autenticación reemplaza los cuatro registros separados de hoy.
 */
export function Splash({ onUnlock }: { onUnlock: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function unlock() {
    if (phase !== 'idle') return;
    setPhase('scanning');
    timers.current.push(
      window.setTimeout(() => setPhase('ok'), 1300),
      window.setTimeout(onUnlock, 2050),
    );
  }

  return (
    <section className="screen s-splash">
      <span className="version-pill">Demo</span>

      <div className="login-logo">
        <img src="./logo-wordmark.jpg" alt="Primax" />
      </div>

      <div className="s-splash-copy">
        <h2>Una sola cuenta para todos tus beneficios</h2>
        <p>Bonus, Sellos LiSTO!, tu convenio, Primax Gas y lubricantes. Todo junto, por fin.</p>
      </div>

      <div className="fp-zone">
        <div className={`fp-wrap ${phase}`}>
          <span className="fp-ring" />
          <span className="fp-ring r2" />
          <button className="fp-btn" onClick={unlock} aria-label="Ingresar con huella">
            <Icon name={phase === 'ok' ? 'check' : 'fingerprint'} size={38} strokeWidth={1.6} />
          </button>
        </div>
        <p className="fp-hint">{HINT[phase]}</p>
        <button className="fp-alt" onClick={unlock}>
          Usar mi DNI y clave
        </button>
      </div>
    </section>
  );
}
