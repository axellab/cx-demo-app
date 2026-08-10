import { useState } from 'react';
import { ProgramBadge } from '../components/ProgramBadge';
import { PROGRAMS } from '../data/programs';
import { plural, soles } from '../lib/format';
import { useStore } from '../lib/store';
import type { ProgramId } from '../types';

type Filter = 'todos' | ProgramId;

/**
 * Historial unificado. Hoy, reconstruir esto obliga al cliente a entrar a la
 * app de Bonus, al portal de sellos y al de convenios por separado.
 */
export function History() {
  const { history, savedYtd } = useStore();
  const [filter, setFilter] = useState<Filter>('todos');

  const shown = filter === 'todos' ? history : history.filter((h) => h.programs.includes(filter));
  const usados = PROGRAMS.filter((p) => history.some((h) => h.programs.includes(p.id)));

  return (
    <section className="screen s-hist">
      <div className="topbar">
        <div className="grow">
          <h1>Actividad</h1>
          <span className="sub">Todos tus programas, en una sola línea de tiempo</span>
        </div>
      </div>

      <div className="scroll">
        <div className="s-hist-summary">
          <div>
            <span className="tiny muted">Ahorrado este año</span>
            <b>{soles(savedYtd)}</b>
          </div>
          <div>
            <span className="tiny muted">Movimientos</span>
            <b>{history.length}</b>
          </div>
        </div>

        <div className="s-hist-filters">
          <button
            className={`s-hist-chip${filter === 'todos' ? ' on' : ''}`}
            onClick={() => setFilter('todos')}
          >
            Todos
          </button>
          {usados.map((p) => (
            <button
              key={p.id}
              className={`s-hist-chip${filter === p.id ? ' on' : ''}`}
              onClick={() => setFilter(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>

        {shown.length === 0 && <p className="tiny muted">No hay movimientos de este programa todavía.</p>}

        {shown.map((h) => (
          <div key={h.id} className="s-hist-item">
            <div className="row between">
              <div className="grow">
                <h4>{h.title}</h4>
                <p className="tiny muted">
                  {h.place} · {h.date}
                </p>
              </div>
              <div className="s-hist-amount">
                <b>{soles(h.amount)}</b>
                {h.saved > 0 && <span>ahorraste {soles(h.saved)}</span>}
              </div>
            </div>

            <div className="s-hist-tags">
              {h.programs.map((id) => (
                <ProgramBadge key={id} id={id} size={22} />
              ))}
              <span className="tiny muted">
                {h.earnPoints > 0 && `+${h.earnPoints} ${plural(h.earnPoints, 'pt', 'pts')}`}
                {h.earnPoints > 0 && h.earnStamps > 0 && ' · '}
                {h.earnStamps > 0 && `+${h.earnStamps} ${plural(h.earnStamps, 'sello', 'sellos')}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
