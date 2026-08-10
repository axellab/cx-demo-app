import type { Program } from '../types';

/**
 * El punto de partida del problema: hoy cada uno de estos programas vive en su
 * propio canal, y cuatro de ellos piden su propio registro. El onboarding de la
 * app usa esta lista para mostrar el "antes" y después vincularlos.
 */
export const PROGRAMS: Program[] = [
  {
    id: 'bonus',
    name: 'Bonus',
    what: 'Puntos y BonusPaga',
    livesIn: 'app Bonus Perú · bonus.primax.com',
    needsOwnLogin: true,
    color: 'var(--p-bonus)',
    icon: 'sparkles',
  },
  {
    id: 'sellos',
    name: 'Sellos LiSTO!',
    what: 'Sellos y cupones de tienda',
    livesIn: 'selloslisto.primax.com',
    needsOwnLogin: true,
    color: 'var(--p-sellos)',
    icon: 'coffee',
  },
  {
    id: 'convenio',
    name: 'Convenio Primax Card',
    what: 'Descuento por galón',
    livesIn: 'convenios.primax.com.pe',
    needsOwnLogin: true,
    color: 'var(--p-convenio)',
    icon: 'percent',
  },
  {
    id: 'go',
    name: 'Primax GO',
    what: 'Pago desde el celular',
    livesIn: 'app Primax GO',
    needsOwnLogin: true,
    color: 'var(--blue)',
    icon: 'qr',
  },
  {
    id: 'gas',
    name: 'Primax Gas',
    what: 'Balones de GLP a domicilio',
    livesIn: 'call center · distribuidor',
    needsOwnLogin: false,
    color: 'var(--p-gas)',
    icon: 'flame',
  },
  {
    id: 'shell',
    name: 'Lubricantes Shell',
    what: 'Cambios de aceite y service',
    livesIn: 'mostrador de la estación',
    needsOwnLogin: false,
    color: 'var(--p-shell)',
    icon: 'droplet',
  },
];

export const PROGRAM_BY_ID = Object.fromEntries(PROGRAMS.map((p) => [p.id, p])) as Record<
  Program['id'],
  Program
>;
