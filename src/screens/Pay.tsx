import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { ProgramBadge } from '../components/ProgramBadge';
import { CONTEXT_LABEL, DEMO_PURCHASES } from '../data/purchases';
import { USER } from '../data/user';
import { useNav } from '../lib/nav';
import type { Context, ProgramId } from '../types';

/** Matriz determinística que simula un QR (no codifica datos reales). */
function fakeQR(size = 25, seed = 7): boolean[][] {
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const m = Array.from({ length: size }, () => Array.from({ length: size }, () => rnd() > 0.52));

  // Los tres cuadrados de posición, para que se lea como un QR de verdad.
  const finder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        m[r0 + r][c0 + c] = edge || core;
      }
    }
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        if (r === -1 || r === 7 || c === -1 || c === 7) m[rr][cc] = false;
      }
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);
  return m;
}

/** Lo que viaja dentro del código único, y que hoy son tres credenciales distintas. */
const CARRIES: { id: ProgramId; label: string }[] = [
  { id: 'bonus', label: 'Bonus' },
  { id: 'sellos', label: 'Sellos' },
  { id: 'convenio', label: 'Convenio' },
  { id: 'go', label: 'Pago' },
];

interface Props {
  context: Context;
  onContext: (c: Context) => void;
}

export function Pay({ context, onContext }: Props) {
  const { go, back } = useNav();
  const [reading, setReading] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const qr = useMemo(() => fakeQR(25, context.length * 31 + 7), [context]);
  const purchase = DEMO_PURCHASES[context];

  function simulate() {
    if (reading) return;
    setReading(true);
    timer.current = window.setTimeout(() => go('paySummary'), 1400);
  }

  return (
    <section className="screen s-pay">
      <div className="topbar">
        <button className="icon-btn ghost" onClick={back} aria-label="Volver">
          <Icon name="left" size={22} />
        </button>
        <div className="grow">
          <h1>Tu código Primax</h1>
          <span className="sub">Uno solo, para todo</span>
        </div>
      </div>

      <div className="scroll no-nav">
        {/* Selector de contexto: en la demo elegimos dónde estamos comprando. */}
        <div className="s-pay-ctx">
          {(Object.keys(CONTEXT_LABEL) as Context[]).map((c) => (
            <button
              key={c}
              className={`s-pay-ctx-btn${c === context ? ' on' : ''}`}
              onClick={() => onContext(c)}
              disabled={reading}
            >
              <Icon name={c === 'playa' ? 'fuel' : c === 'listo' ? 'coffee' : 'flame'} size={17} />
              {CONTEXT_LABEL[c]}
            </button>
          ))}
        </div>

        <div className={`s-pay-card${reading ? ' reading' : ''}`}>
          <div className="s-pay-qr">
            <svg viewBox="0 0 25 25" shapeRendering="crispEdges" aria-label="Código QR de ejemplo">
              {qr.map((row, r) =>
                row.map((on, c) => (on ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" /> : null)),
              )}
            </svg>
            {reading && <span className="s-pay-laser" />}
          </div>

          <p className="s-pay-name">{USER.fullName}</p>
          <p className="s-pay-doc">{USER.doc} · Nivel {USER.tier}</p>

          <div className="s-pay-carries">
            {CARRIES.map((c) => (
              <span key={c.id} className="s-pay-carry">
                <ProgramBadge id={c.id} size={22} />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <p className="s-pay-hint">
          {reading
            ? 'Leyendo el código…'
            : `Mostralo en ${CONTEXT_LABEL[context].toLowerCase()}. Acumula, aplica tu convenio y paga con un solo escaneo.`}
        </p>

        <div className="card s-pay-preview">
          <span className="tiny muted">Lo que vas a pagar en la demo</span>
          {purchase.items.map((it) => (
            <div key={it.name} className="row between s-pay-item">
              <span>{it.name}</span>
              <b>S/ {(it.price * it.qty).toFixed(2)}</b>
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-block" onClick={simulate} disabled={reading}>
          <Icon name="scan" size={19} strokeWidth={2.1} />
          {reading ? 'Leyendo…' : 'Simular lectura en caja'}
        </button>
      </div>
    </section>
  );
}
