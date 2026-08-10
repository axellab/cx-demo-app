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
  /** Días seguidos entrando a la app, de 0 a STREAK_GOAL. */
  streakDays: number;
  /** Último día contabilizado para la racha. */
  streakLastDay: string | null;
  /** Aviso a mostrar cuando la racha avanza. No se persiste. */
  streakToast: { day: number; earnedStamp: boolean } | null;
}

/** Días seguidos que hay que entrar para ganar el sello. */
export const STREAK_GOAL = 10;

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Fecha local en formato YYYY-MM-DD, para los límites diarios. */
export function today(): string {
  return ymd(new Date());
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return ymd(d);
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
  // Arranca con racha empezada para que en la demo se vea el progreso real,
  // y no una fila vacía en el día 1.
  streakDays: 6,
  streakLastDay: yesterday(),
  streakToast: null,
};

const KEY = 'primax-id-demo/v1';

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return INITIAL;
    // Merge sobre INITIAL para que agregar campos nuevos no rompa una demo ya guardada.
    // streakToast es transitorio: nunca se restaura, para que recargar no lo repita.
    return { ...INITIAL, ...(JSON.parse(raw) as Partial<State>), streakToast: null };
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

  /**
   * Registra la visita del día para la racha. Se llama al llegar al home.
   *
   * Si entró ayer, la racha sigue; si se saltó un día, vuelve a empezar en 1.
   * Al llegar a STREAK_GOAL suma un sello LiSTO! y la racha arranca de cero,
   * para que la mecánica se pueda repetir.
   */
  checkInStreak() {
    const t = today();
    if (state.streakLastDay === t) return; // ya contamos hoy

    const seguido = state.streakLastDay === yesterday();
    const dia = seguido ? state.streakDays + 1 : 1;

    if (dia >= STREAK_GOAL) {
      set((s) => ({
        streakDays: 0,
        streakLastDay: t,
        stamps: s.stamps + 1,
        streakToast: { day: STREAK_GOAL, earnedStamp: true },
      }));
      return;
    }
    set({ streakDays: dia, streakLastDay: t, streakToast: { day: dia, earnedStamp: false } });
  },

  dismissStreakToast() {
    set({ streakToast: null });
  },

  /** Control de demo: deja la racha a un día de completarse y la avanza. */
  simulateStreakFinal() {
    set({ streakDays: STREAK_GOAL - 1, streakLastDay: yesterday() });
    actions.checkInStreak();
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
