import type { FuelGrade, ProgramId, Purchase } from '../types';
import { money } from './format';

/* ============================================================
   REGLAS DE NEGOCIO

   Datos públicos de Primax (verificados en agosto de 2026):
   · Convenio Primax Card — S/ 1.00 por galón en premium, S/ 0.50 en regular
     y S/ 0.20 en diésel, en más de 250 estaciones.
   · Bonus — 1 punto por cada S/ 7.50 de consumo en tiendas LiSTO!.
     BonusPaga permite pagar total o parcialmente combustible, LiSTO!,
     Primax Gas y lubricantes Shell con los puntos.
   · Sellos LiSTO! — compras de S/ 10 o más suman sello; pagando con Bonus
     se duplican; al juntar 5 se habilita un cupón.

   Supuestos de la demo (NO son datos oficiales — están acá para que los
   números cierren en pantalla, y como tales hay que presentarlos):
   · 100 puntos = S/ 1.00  (heredado del prototipo: 1.240 pts ≈ S/ 12.40)
   · Combustible: 1 punto por galón
   · El cupón de sellos vale S/ 5.50
   ============================================================ */
export const RULES = {
  convenioPorGalon: { premium: 1.0, regular: 0.5, diesel: 0.2 } as Record<FuelGrade, number>,
  solesPorPunto: 0.01,
  solesPorPuntoListo: 7.5,
  puntosPorGalon: 1,
  compraMinimaSello: 10,
  sellosParaCupon: 5,
  valorCupon: 5.5,
};

export interface WalletState {
  points: number;
  stamps: number;
  hasConvenio: boolean;
}

export interface Selection {
  convenio: boolean;
  cupon: boolean;
  bonusPts: number;
}

export interface BenefitRow {
  id: 'convenio' | 'cupon' | 'bonuspaga';
  program: ProgramId;
  title: string;
  detail: string;
  /** Descuento en soles que aporta esta línea, ya considerando el resto. */
  amount: number;
  /** Si el beneficio existe para esta compra. Si es false, se muestra apagado. */
  applies: boolean;
  reason?: string;
  /** El convenio se aplica solo, como en el surtidor: no se puede desactivar. */
  locked: boolean;
  enabled: boolean;
}

export interface Breakdown {
  rows: BenefitRow[];
  gross: number;
  discount: number;
  total: number;
  pointsSpent: number;
  stampsSpent: number;
  maxBonusPts: number;
  earn: { points: number; stamps: number; notes: string[] };
  programsTouched: ProgramId[];
}

/** Suma las líneas de la compra separando combustible, tienda y gas. */
export function subtotals(p: Purchase) {
  let fuel = 0;
  let store = 0;
  let gas = 0;
  let gallons = 0;
  let grade: FuelGrade | undefined;

  for (const it of p.items) {
    const line = it.price * it.qty;
    if (it.kind === 'combustible') {
      fuel += line;
      gallons += it.gallons ?? 0;
      grade = grade ?? it.grade;
    } else if (it.kind === 'tienda') {
      store += line;
    } else {
      gas += line;
    }
  }

  return {
    fuel: money(fuel),
    store: money(store),
    gas: money(gas),
    gallons,
    grade,
    gross: money(fuel + store + gas),
  };
}

/**
 * Calcula el desglose completo de la compra: qué beneficios aplican, cuánto
 * descuenta cada uno y qué suma el cliente. Es puro — la pantalla lo vuelve a
 * llamar con cada cambio de los controles y la aritmética siempre cierra.
 *
 * El orden importa: convenio y cupón bajan el monto primero, y BonusPaga
 * cubre lo que queda (no tendría sentido gastar puntos sobre plata que los
 * otros beneficios ya descontaron).
 */
export function computeBreakdown(p: Purchase, w: WalletState, sel: Selection): Breakdown {
  const st = subtotals(p);

  /* ── 1. Convenio (solo combustible) ─────────────────────────── */
  const convenioApplies = w.hasConvenio && st.fuel > 0 && !!st.grade;
  const convenioRate = st.grade ? RULES.convenioPorGalon[st.grade] : 0;
  const convenioAmount = convenioApplies ? money(st.gallons * convenioRate) : 0;
  const convenioOn = convenioApplies && sel.convenio;

  /* ── 2. Cupón de sellos (solo tienda LiSTO!) ────────────────── */
  const cuponApplies = w.stamps >= RULES.sellosParaCupon && st.store > 0;
  const cuponAmount = cuponApplies ? money(Math.min(RULES.valorCupon, st.store)) : 0;
  const cuponOn = cuponApplies && sel.cupon;

  /* ── 3. BonusPaga sobre el saldo restante ───────────────────── */
  const afterOthers = money(st.gross - (convenioOn ? convenioAmount : 0) - (cuponOn ? cuponAmount : 0));
  const maxBonusPts = Math.max(0, Math.min(w.points, Math.round(afterOthers / RULES.solesPorPunto)));
  const bonusApplies = w.points > 0 && afterOthers > 0;
  const pointsSpent = bonusApplies ? Math.max(0, Math.min(sel.bonusPts, maxBonusPts)) : 0;
  const bonusAmount = money(pointsSpent * RULES.solesPorPunto);

  const rows: BenefitRow[] = [
    {
      id: 'convenio',
      program: 'convenio',
      title: 'Convenio Primax Card',
      detail: convenioApplies
        ? `S/ ${convenioRate.toFixed(2)} por galón · ${st.gallons} gal`
        : 'Aplica solo a combustible',
      amount: convenioOn ? convenioAmount : 0,
      applies: convenioApplies,
      reason: convenioApplies ? undefined : 'Esta compra no incluye combustible',
      locked: true,
      enabled: convenioOn,
    },
    {
      id: 'cupon',
      program: 'sellos',
      title: 'Cupón Sellos LiSTO!',
      detail: cuponApplies
        ? `Usás ${RULES.sellosParaCupon} sellos · vale S/ ${RULES.valorCupon.toFixed(2)}`
        : st.store > 0
          ? `Te faltan ${RULES.sellosParaCupon - w.stamps} sellos`
          : 'Aplica solo a productos de tienda',
      amount: cuponOn ? cuponAmount : 0,
      applies: cuponApplies,
      reason: cuponApplies
        ? undefined
        : st.store > 0
          ? 'Todavía no juntaste 5 sellos'
          : 'Esta compra no incluye productos LiSTO!',
      locked: false,
      enabled: cuponOn,
    },
    {
      id: 'bonuspaga',
      program: 'bonus',
      title: 'BonusPaga',
      detail: bonusApplies
        ? `${pointsSpent.toLocaleString('es-PE')} de tus ${w.points.toLocaleString('es-PE')} puntos`
        : 'No tenés puntos disponibles',
      amount: bonusAmount,
      applies: bonusApplies,
      reason: bonusApplies ? undefined : 'Sin puntos Bonus disponibles',
      locked: false,
      enabled: pointsSpent > 0,
    },
  ];

  const discount = money((convenioOn ? convenioAmount : 0) + (cuponOn ? cuponAmount : 0) + bonusAmount);
  const total = money(st.gross - discount);

  /* ── Lo que el cliente suma con esta misma compra ────────────── */
  const earnPoints =
    Math.floor(st.gallons * RULES.puntosPorGalon) +
    Math.floor((st.store + st.gas) / RULES.solesPorPuntoListo);

  const paidWithBonus = pointsSpent > 0;
  const earnStamps =
    st.store >= RULES.compraMinimaSello ? (paidWithBonus ? 2 : 1) : 0;

  const notes: string[] = [];
  if (st.gallons > 0) notes.push(`${st.gallons} galones cargados`);
  if (st.store >= RULES.compraMinimaSello && paidWithBonus) {
    notes.push('Sellos duplicados por pagar con Bonus');
  }

  const programsTouched: ProgramId[] = [];
  if (convenioOn) programsTouched.push('convenio');
  if (cuponOn || earnStamps > 0) programsTouched.push('sellos');
  if (paidWithBonus || earnPoints > 0) programsTouched.push('bonus');
  if (st.gas > 0) programsTouched.push('gas');

  return {
    rows,
    gross: st.gross,
    discount,
    total,
    pointsSpent,
    stampsSpent: cuponOn ? RULES.sellosParaCupon : 0,
    maxBonusPts,
    earn: { points: earnPoints, stamps: earnStamps, notes },
    programsTouched,
  };
}

/**
 * Selección inicial: la app propone la mejor combinación posible, que es lo que
 * el cliente hoy tiene que armar a mano entre tres canales distintos.
 */
export function bestSelection(p: Purchase, w: WalletState): Selection {
  const probe = computeBreakdown(p, w, { convenio: true, cupon: true, bonusPts: 0 });
  return { convenio: true, cupon: true, bonusPts: probe.maxBonusPts };
}
