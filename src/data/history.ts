import type { HistoryEntry } from '../types';

/**
 * Historial semilla. El valor de mostrarlo unificado: cada línea deja ver qué
 * programas se movieron en esa compra. Hoy el cliente tendría que entrar a tres
 * sitios distintos para reconstruir esto.
 */
export const SEED_HISTORY: HistoryEntry[] = [
  {
    id: 'h1',
    date: '6 de agosto',
    title: 'G-Prix 90 · 8 gal',
    place: 'E/S San Borja',
    amount: 168.0,
    saved: 4.0,
    programs: ['convenio', 'bonus'],
    earnPoints: 8,
    earnStamps: 0,
  },
  {
    id: 'h2',
    date: '4 de agosto',
    title: 'Café + medialuna',
    place: 'Tienda LiSTO! San Isidro',
    amount: 12.5,
    saved: 0,
    programs: ['bonus', 'sellos'],
    earnPoints: 1,
    earnStamps: 1,
  },
  {
    id: 'h3',
    date: '29 de julio',
    title: 'Balón GLP 10 kg',
    place: 'Primax Gas · delivery',
    amount: 55.0,
    saved: 7.0,
    programs: ['gas', 'bonus'],
    earnPoints: 7,
    earnStamps: 0,
  },
  {
    id: 'h4',
    date: '22 de julio',
    title: 'Cambio de aceite Shell Helix',
    place: 'E/S Armendáriz',
    amount: 189.0,
    saved: 0,
    programs: ['shell', 'bonus'],
    earnPoints: 25,
    earnStamps: 0,
  },
];
