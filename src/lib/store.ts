import { useSyncExternalStore } from 'react';
import type { HistoryEntry, ProgramId, Purchase } from '../types';
import { SEED_HISTORY } from '../data/history';
import { PROGRAMS } from '../data/programs';
import type { Breakdown } from './benefits';
import { money } from './format';

export interface State {
  /** El onboarding de unificación ya se completó. */
  onboarded: boolean;
  /** Programas vinculados a la identidad única. */
  linked: ProgramId[];
  points: number;
  stamps: number;
  /** Ahorro acumulado en el año — titular de la billetera. */
  savedYtd: number;
  history: HistoryEntry[];
  /** El reto AR ya fue reclamado en esta sesión de demo. */
  arClaimed: boolean;
}

const INITIAL: State = {
  onboarded: false,
  linked: [],
  points: 1240,
  stamps: 5,
  savedYtd: 168.4,
  history: SEED_HISTORY,
  arClaimed: false,
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
