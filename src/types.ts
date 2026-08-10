import type { IconName } from './components/Icon';

/** Los cinco programas que hoy viven separados, más Primax GO (la app de pago). */
export type ProgramId = 'bonus' | 'sellos' | 'convenio' | 'go' | 'gas' | 'shell';

/** Dónde se hace la compra. Define qué beneficios entran en juego. */
export type Context = 'playa' | 'listo' | 'gas';

export type FuelGrade = 'premium' | 'regular' | 'diesel';

export interface LineItem {
  name: string;
  qty: number;
  price: number;
  /** 'combustible' entra al descuento de convenio; 'tienda' a los sellos y cupones. */
  kind: 'combustible' | 'tienda' | 'gas';
  grade?: FuelGrade;
  gallons?: number;
}

export interface Purchase {
  context: Context;
  station: string;
  items: LineItem[];
}

export interface HistoryEntry {
  id: string;
  date: string;
  title: string;
  place: string;
  amount: number;
  saved: number;
  /** Programas que participaron de la transacción — el corazón del historial unificado. */
  programs: ProgramId[];
  earnPoints: number;
  earnStamps: number;
}

export interface Program {
  id: ProgramId;
  name: string;
  what: string;
  /** Dónde vive hoy, antes de unificar. Se muestra en el onboarding. */
  livesIn: string;
  needsOwnLogin: boolean;
  color: string;
  icon: IconName;
}
