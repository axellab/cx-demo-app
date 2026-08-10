import type { ProgramId } from '../types';

/* ── Promos del home ──────────────────────────────────────────── */
export interface Promo {
  id: string;
  title: string;
  detail: string;
  program: ProgramId;
  badge?: string;
  before?: number;
  now?: number;
  tone: 'gourmet' | 'cafe' | 'combo' | 'gas';
}

export const PROMOS: Promo[] = [
  {
    id: 'gourmet',
    title: 'Revolución Gourmet',
    detail: 'Sándwich + café en LiSTO!',
    program: 'sellos',
    badge: '-54%',
    before: 12.9,
    now: 5.9,
    tone: 'gourmet',
  },
  {
    id: 'cafe',
    title: '2x1 en Café LiSTO!',
    detail: 'Todos los martes, antes de las 10 a. m.',
    program: 'sellos',
    badge: '2x1',
    tone: 'cafe',
  },
  {
    id: 'tanque',
    title: 'Tanque lleno',
    detail: 'Carga 10+ galones y suma puntos extra',
    program: 'bonus',
    badge: '+50 pts',
    tone: 'combo',
  },
  {
    id: 'gas',
    title: 'Balón de 10 kg',
    detail: 'Delivery sin costo a tu domicilio',
    program: 'gas',
    badge: 'Envío gratis',
    before: 62.0,
    now: 55.0,
    tone: 'gas',
  },
];

/* ── Catálogo de canje de puntos Bonus ────────────────────────── */
export interface RedeemItem {
  id: string;
  title: string;
  detail: string;
  cost: number;
  program: ProgramId;
}

export const REDEEM_ITEMS: RedeemItem[] = [
  { id: 'cafe', title: 'Café LiSTO! grande', detail: 'Retiralo en cualquier tienda', cost: 400, program: 'sellos' },
  { id: 'combustible', title: 'S/ 10 en combustible', detail: 'BonusPaga en playa', cost: 1000, program: 'bonus' },
  { id: 'gas', title: 'S/ 15 en Primax Gas', detail: 'Aplica a balón de 10 kg', cost: 1500, program: 'gas' },
  { id: 'aceite', title: 'Cambio de aceite Shell Helix', detail: 'En estaciones con taller', cost: 3200, program: 'shell' },
];

/* ── Retos y misiones (gamificación) ──────────────────────────── */
export interface Challenge {
  id: string;
  title: string;
  detail: string;
  reward: string;
  progress: number;
  goal: number;
  /** El reto AR abre la cámara en lugar de mostrar progreso. */
  kind: 'progress' | 'ar';
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'ar-logo',
    title: 'Caza el logo Primax',
    detail: 'Apuntá la cámara al logo en la estación o en tu tienda LiSTO!',
    reward: '+100 pts',
    progress: 0,
    goal: 1,
    kind: 'ar',
  },
  {
    id: 'visitas',
    title: 'Tres visitas esta semana',
    detail: 'Cargá combustible tres veces antes del domingo',
    reward: '+150 pts',
    progress: 2,
    goal: 3,
    kind: 'progress',
  },
  {
    id: 'desayuno',
    title: 'Desayuno LiSTO!',
    detail: 'Comprá café antes de las 9 a. m., cinco días distintos',
    reward: 'Cupón de S/ 8',
    progress: 3,
    goal: 5,
    kind: 'progress',
  },
  {
    id: 'gas',
    title: 'Probá Primax Gas',
    detail: 'Pedí tu primer balón desde la app',
    reward: '+200 pts',
    progress: 0,
    goal: 1,
    kind: 'progress',
  },
];
