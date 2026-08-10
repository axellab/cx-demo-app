import { useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { StreakRow } from './StreakRow';
import { actions, STREAK_GOAL, useStore } from '../lib/store';

/**
 * Aviso tipo notificación push que baja desde arriba cuando la racha avanza.
 * Muestra la fila de 10 casilleros con el de hoy marcándose en vivo.
 */
export function StreakBubble() {
  const { streakToast } = useStore();
  const timer = useRef<number>();

  const completed = streakToast?.earnedStamp ?? false;

  useEffect(() => {
    if (!streakToast) return;
    // La de "racha completa" se queda más tiempo: tiene premio para leer.
    timer.current = window.setTimeout(actions.dismissStreakToast, completed ? 9000 : 6500);
    return () => window.clearTimeout(timer.current);
  }, [streakToast, completed]);

  if (!streakToast) return null;

  const { day } = streakToast;
  const faltan = STREAK_GOAL - day;

  return (
    <div
      className={`streak-bubble${completed ? ' win' : ''}`}
      role="status"
      onClick={actions.dismissStreakToast}
    >
      <div className="streak-bubble-top">
        <span className="streak-bubble-icon">
          <Icon name={completed ? 'gift' : 'flame'} size={19} strokeWidth={2} />
        </span>
        <div className="grow">
          <h4>{completed ? '¡Racha completa!' : 'Racha de 10 días'}</h4>
          <p>
            {completed
              ? `Entraste ${STREAK_GOAL} días seguidos · ganaste 1 sello LiSTO!`
              : `Día ${day} de ${STREAK_GOAL} · te ${faltan === 1 ? 'falta' : 'faltan'} ${faltan} para tu sello`}
          </p>
        </div>
        <button
          className="streak-bubble-x"
          onClick={(e) => {
            e.stopPropagation();
            actions.dismissStreakToast();
          }}
          aria-label="Cerrar aviso"
        >
          <Icon name="close" size={15} strokeWidth={2.4} />
        </button>
      </div>

      <StreakRow filled={completed ? STREAK_GOAL : day} justChecked={day} />
    </div>
  );
}
