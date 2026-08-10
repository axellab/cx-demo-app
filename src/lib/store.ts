import { useSyncExternalStore } from 'react';
import type { HistoryEntry, ProgramId, Purchase } from '../types';
import { SEED_HISTORY } from '../data/history';
import { PROGRAMS } from '../data/programs';
import { RULES, type Breakdown } from './benefits';
import { money } from './format';

export interface State {
  /** El onboarding de unificación ya se completó. */
  onboarded: boolean;
  /** Programas vinculados a la identidad única. */
  linked: ProgramId[];
  points: number;
  stamps: number;
  /** Saldo a favor en soles, de haber canjeado puntos por descuento directo. */
  credit: number;
  /** Ahorro acumulado en el año — titular de la billetera. */
  savedYtd: number;
  history: HistoryEntry[];
  /** El reto AR ya fue reclamado en esta sesión de demo. */
  arClaimed: boolean;
  /** Día (YYYY-MM-DD) en que se cobró el premio del juego. Uno por día. */
  gamePlayedOn: string | null;
}

/** Fecha local en formato YYYY-MM-DD, para el límite diario del juego. */
export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const INITIAL: State = {
  onboarded: false,
  linked: [],
  points: 1240,
  stamps: 5,
  credit: 0,
  savedYtd: 168.4,
  history: SEED_HISTORY,
  arClaimed: false,
  gamePlayedOn: null,
};

const KEY = 'primax-id-demo/v1';

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return INITIAL;
    // Merge sobre INITIAL para que agregar campos nuevos no rompa una demo ya guardada.
    return { ...INITIAL, ...(JSON.parse(raw) as Partial<State>) };
  } catch {
    return INITIAL;
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function set(patch: Partial<State> | ((s: State) => Partial<State>)) {
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...next };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* modo privado / storage lleno: la demo sigue funcionando en memoria */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => INITIAL,
  );
}

export function getState(): State {
  return state;
}

/* ============================================================
   Acciones
   ============================================================ */

export const actions = {
  link(id: ProgramId) {
    if (state.linked.includes(id)) return;
    set((s) => ({ linked: [...s.linked, id] }));
  },

  linkAll() {
    set({ linked: PROGRAMS.map((p) => p.id) });
  },

  finishOnboarding() {
    set({ onboarded: true, linked: PROGRAMS.map((p) => p.id) });
  },

  /** Vuelve a mostrar el onboarding sin perder el resto del estado. */
  replayOnboarding() {
    set({ onboarded: false, linked: [] });
  },

  addPoints(n: number) {
    set((s) => ({ points: s.points + n }));
  },

  claimAR(points: number) {
    set((s) => ({ points: s.points + points, arClaimed: true }));
  },

  spendPoints(n: number) {
    set((s) => ({ points: Math.max(0, s.points - n) }));
  },

  /**
   * Canje siempre disponible: cualquier cantidad de puntos se convierte en
   * saldo a favor, sin mínimo. Resuelve el caso del cliente que nunca llega
   * al premio más barato y siente que sus puntos no sirven para nada.
   */
  redeemPointsForCredit() {
    set((s) => ({
      credit: money(s.credit + s.points * RULES.solesPorPunto),
      points: 0,
    }));
  },

  /** Premio del juego diario. Solo suma si todavía no jugó hoy. */
  winGame(prize: number) {
    const day = today();
    if (state.gamePlayedOn === day) return false;
    set((s) => ({ points: s.points + prize, gamePlayedOn: day }));
    return true;
  },

  /**
   * Registra la compra: una sola transacción que mueve varios programas a la vez.
   * Es lo que hoy es imposible, porque cada uno vive en una app distinta.
   */
  commitPurchase(purchase: Purchase, b: Breakdown) {
    const entry: HistoryEntry = {
      id: `h${Date.now()}`,
      date: 'Hoy',
      title: purchase.items.map((i) => i.name).join(' + '),
      place: purchase.station,
      amount: b.total,
      saved: b.discount,
      programs: b.programsTouched,
      earnPoints: b.earn.points,
      earnStamps: b.earn.stamps,
    };

    set((s) => ({
      points: s.points - b.pointsSpent + b.earn.points,
      stamps: s.stamps - b.stampsSpent + b.earn.stamps,
      credit: money(s.credit - b.creditSpent),
      savedYtd: money(s.savedYtd + b.discount),
      history: [entry, ...s.history],
    }));
  },

  reset() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignorado */
    }
    state = INITIAL;
    listeners.forEach((l) => l());
  },
};
