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
  /** Visitas contadas en el mes en curso, de 0 a VISITS_GOAL. */
  visits: number;
  /** Mes (YYYY-MM) al que corresponden esas visitas. Al cambiar de mes, arranca de cero. */
  visitsMonth: string | null;
  /** Último día contabilizado: una visita por día como máximo. */
  lastVisitDay: string | null;
  /** Aviso a mostrar cuando se suma una visita. No se persiste. */
  visitToast: { n: number; earnedStamp: boolean } | null;
}

/** Visitas que hay que juntar dentro del mes para ganar el sello. */
export const VISITS_GOAL = 10;

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Fecha local en formato YYYY-MM-DD, para los límites diarios. */
export function today(): string {
  return ymd(new Date());
}

/** Mes local en formato YYYY-MM. */
export function currentMonth(): string {
  return today().slice(0, 7);
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
  // Arranca con visitas ya acumuladas para que en la demo se vea el progreso
  // real, y no una fila vacía.
  visits: 6,
  visitsMonth: currentMonth(),
  lastVisitDay: yesterday(),
  visitToast: null,
};

const KEY = 'primax-id-demo/v1';

/**
 * `?reset=1` en la URL arranca la demo desde cero.
 *
 * Es para pasarle el teléfono a la próxima persona sin entrar a Perfil: se
 * comparte ese link y cada vez que se abre, la app empieza en el onboarding.
 * Después el parámetro se saca de la URL, así que si esa persona recarga en
 * medio del recorrido no pierde lo que venía haciendo.
 */
function consumeResetParam(): void {
  try {
    const url = new URL(location.href);
    if (url.searchParams.get('reset') !== '1') return;
    localStorage.removeItem(KEY);
    url.searchParams.delete('reset');
    history.replaceState(null, '', url.toString());
  } catch {
    /* sin URL válida o sin storage: la demo sigue igual */
  }
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return INITIAL;
    // Merge sobre INITIAL para que agregar campos nuevos no rompa una demo ya guardada.
    // streakToast es transitorio: nunca se restaura, para que recargar no lo repita.
    return { ...INITIAL, ...(JSON.parse(raw) as Partial<State>), visitToast: null };
  } catch {
    return INITIAL;
  }
}

consumeResetParam();
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

  /**
   * "Ahora no": deja entrar a la app sin vincular nada. Vincular tiene que ser
   * una decisión del cliente, no un peaje para poder usar la app. Desde la
   * billetera y desde Perfil se puede hacer más tarde.
   */
  skipOnboarding() {
    set({ onboarded: true, linked: [] });
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
   * Registra la visita del día. Se llama al llegar al home.
   *
   * Cuenta hasta una visita por día, dentro del mes en curso: no hace falta que
   * sean días seguidos, y saltarse un día no penaliza. Al cambiar de mes el
   * contador arranca de nuevo. Al llegar a VISITS_GOAL suma un sello LiSTO! y
   * el contador vuelve a cero, para que la mecánica se pueda repetir.
   */
  registerVisit() {
    const t = today();
    if (state.lastVisitDay === t) return; // ya contamos hoy

    const mes = currentMonth();
    const mismoMes = state.visitsMonth === mes;
    const n = (mismoMes ? state.visits : 0) + 1;

    if (n >= VISITS_GOAL) {
      set((s) => ({
        visits: 0,
        visitsMonth: mes,
        lastVisitDay: t,
        stamps: s.stamps + 1,
        visitToast: { n: VISITS_GOAL, earnedStamp: true },
      }));
      return;
    }
    set({
      visits: n,
      visitsMonth: mes,
      lastVisitDay: t,
      visitToast: { n, earnedStamp: false },
    });
  },

  dismissVisitToast() {
    set({ visitToast: null });
  },

  /** Control de demo: deja el contador a una visita del final y la suma. */
  simulateVisitsFinal() {
    set({ visits: VISITS_GOAL - 1, visitsMonth: currentMonth(), lastVisitDay: yesterday() });
    actions.registerVisit();
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
