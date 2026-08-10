import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from '../components/Icon';
import { pts } from '../lib/format';
import { useNav } from '../lib/nav';
import { actions, today, useStore } from '../lib/store';

/* ============================================================
   Memotest Primax — el reto pensado para que jueguen los chicos
   mientras la familia carga combustible o espera en la tienda.

   Premio bajo (5 pts) y una vez por día: suma tráfico y tiempo en la app
   sin costo real para el programa de puntos.
   ============================================================ */

const PRIZE = 5;

const PAIRS: { icon: IconName; color: string; name: string }[] = [
  { icon: 'fuel', color: 'var(--blue)', name: 'surtidor' },
  { icon: 'coffee', color: 'var(--p-sellos)', name: 'café' },
  { icon: 'flame', color: 'var(--p-gas)', name: 'balón de gas' },
  { icon: 'droplet', color: 'var(--p-shell)', name: 'aceite' },
  { icon: 'sparkles', color: 'var(--orange)', name: 'estrella' },
  { icon: 'car', color: 'var(--p-convenio)', name: 'auto' },
];

interface Card {
  key: number;
  pair: number;
}

function newDeck(): Card[] {
  const cards: Card[] = PAIRS.flatMap((_, i) => [
    { key: i * 2, pair: i },
    { key: i * 2 + 1, pair: i },
  ]);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function MiniGame() {
  const { back, toast } = useNav();
  const { gamePlayedOn, points } = useStore();

  const [deck, setDeck] = useState<Card[]>(newDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [awarded, setAwarded] = useState<boolean | null>(null);
  const timer = useRef<number>();
  const settled = useRef(false);

  const wonToday = gamePlayedOn === today();
  const done = matched.length === PAIRS.length;

  useEffect(() => () => clearTimeout(timer.current), []);

  // Al completar el tablero se cobra el premio, si todavía no jugó hoy.
  useEffect(() => {
    if (!done || settled.current) return;
    settled.current = true;
    setAwarded(actions.winGame(PRIZE));
  }, [done]);

  function flip(index: number) {
    if (done || flipped.length === 2) return;
    if (flipped.includes(index) || matched.includes(deck[index].pair)) return;

    const next = [...flipped, index];
    setFlipped(next);
    if (next.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = next;
    if (deck[a].pair === deck[b].pair) {
      setMatched((m) => [...m, deck[a].pair]);
      setFlipped([]);
    } else {
      timer.current = window.setTimeout(() => setFlipped([]), 750);
    }
  }

  function playAgain() {
    clearTimeout(timer.current);
    settled.current = false;
    setDeck(newDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setAwarded(null);
  }

  return (
    <section className="screen s-game">
      <div className="topbar">
        <button className="icon-btn ghost" onClick={back} aria-label="Volver">
          <Icon name="left" size={22} />
        </button>
        <div className="grow">
          <h1>Memotest Primax</h1>
          <span className="sub">Encontrá las {PAIRS.length} parejas</span>
        </div>
      </div>

      <div className="scroll no-nav">
        <div className="s-game-bar">
          <span>
            Jugadas <b>{moves}</b>
          </span>
          <span>
            Parejas{' '}
            <b>
              {matched.length}/{PAIRS.length}
            </b>
          </span>
          <span className={`s-game-prize${wonToday ? ' spent' : ''}`}>
            {wonToday ? 'Premio de hoy ya cobrado' : `+${PRIZE} pts`}
          </span>
        </div>

        <div className="s-game-grid">
          {deck.map((card, i) => {
            const open = flipped.includes(i) || matched.includes(card.pair);
            const p = PAIRS[card.pair];
            return (
              <button
                key={card.key}
                className={`s-game-card${open ? ' open' : ''}`}
                onClick={() => flip(i)}
                aria-label={open ? p.name : 'Carta tapada'}
                style={open ? { background: p.color, borderColor: p.color } : undefined}
              >
                {open ? (
                  <Icon name={p.icon} size={28} strokeWidth={1.9} />
                ) : (
                  <span className="s-game-back">?</span>
                )}
              </button>
            );
          })}
        </div>

        <p className="tiny muted s-game-rules">
          Un premio por día. Podés seguir jugando todas las veces que quieras, pero los {PRIZE}{' '}
          puntos se cobran una sola vez cada día.
        </p>
      </div>

      {done && (
        <div className="s-game-win">
          <span className="s-game-win-emoji">🎉</span>
          <h3>¡Encontraste todas!</h3>
          <p>
            Lo resolviste en {moves} jugadas
            {awarded === false && ' · el premio de hoy ya lo habías cobrado'}
          </p>
          {awarded && <b>+{PRIZE} pts</b>}
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              if (awarded) toast(`+${PRIZE} pts sumados · saldo ${pts(points)}`);
              back();
            }}
          >
            {awarded ? 'Sumar a mi billetera' : 'Volver a los retos'}
          </button>
          <button className="btn btn-ghost btn-block" onClick={playAgain}>
            Jugar de nuevo
          </button>
        </div>
      )}
    </section>
  );
}
