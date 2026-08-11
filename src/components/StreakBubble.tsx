import { useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { StreakRow } from './StreakRow';
import { actions, useStore, VISITS_GOAL } from '../lib/store';

/**
 * Aviso tipo notificación push que baja desde arriba al sumar una visita.
 * Muestra la fila de 10 casilleros con el de hoy marcándose en vivo.
 */
export function StreakBubble() {
  const { visitToast } = useStore();
  const timer = useRef<number>();

  const completed = visitToast?.earnedStamp ?? false;

  useEffect(() => {
    if (!visitToast) return;
    // La de "meta cumplida" se queda más tiempo: tiene premio para leer.
    timer.current = window.setTimeout(actions.dismissVisitToast, completed ? 9000 : 6500);
    return () => window.clearTimeout(timer.current);
  }, [visitToast, completed]);

  if (!visitToast) return null;

  const { n } = visitToast;
  const faltan = VISITS_GOAL - n;

  return (
    <div
      className={`streak-bubble${completed ? ' win' : ''}`}
      role="status"
      onClick={actions.dismissVisitToast}
    >
      <div className="streak-bubble-top">
        <span className="streak-bubble-icon">
          <Icon name={completed ? 'gift' : 'flame'} size={19} strokeWidth={2} />
        </span>
        <div className="grow">
          <h4>{completed ? '¡Meta del mes cumplida!' : 'Tus visitas del mes'}</h4>
          <p>
            {completed
              ? `Llegaste a ${VISITS_GOAL} visitas este mes · ganaste 1 sello LiSTO!`
              : `Visita ${n} de ${VISITS_GOAL} · te ${faltan === 1 ? 'falta' : 'faltan'} ${faltan} para tu sello`}
          </p>
        </div>
        <button
          className="streak-bubble-x"
          onClick={(e) => {
            e.stopPropagation();
            actions.dismissVisitToast();
          }}
          aria-label="Cerrar aviso"
        >
          <Icon name="close" size={15} strokeWidth={2.4} />
        </button>
      </div>

      <StreakRow filled={completed ? VISITS_GOAL : n} justChecked={n} />
    </div>
  );
}
