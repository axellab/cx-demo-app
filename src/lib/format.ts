/** Formatea soles: 101.5 → "S/ 101.50" */
export function soles(n: number): string {
  return `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Formatea puntos con separador de miles: 1240 → "1.240" */
export function pts(n: number): string {
  return Math.round(n).toLocaleString('es-PE');
}

/** Redondea a céntimos, evitando arrastres de coma flotante en las sumas. */
export function money(n: number): number {
  return Math.round(n * 100) / 100;
}

export function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}
