import type { Context, Purchase } from '../types';

/**
 * Las tres compras precargadas de la demo, una por contexto.
 *
 * La de playa es la importante: combustible + tienda en una sola transacción.
 * Hoy eso obliga al cliente a usar el convenio por un lado, la app de Bonus por
 * otro y el portal de sellos por otro; acá entra todo en un solo QR.
 */
export const DEMO_PURCHASES: Record<Context, Purchase> = {
  playa: {
    context: 'playa',
    station: 'E/S San Isidro · Isla 3',
    items: [
      {
        name: 'G-Premium 95',
        qty: 1,
        price: 120.0,
        kind: 'combustible',
        grade: 'premium',
        gallons: 5,
      },
      { name: 'Café LiSTO! grande', qty: 1, price: 8.5, kind: 'tienda' },
      { name: 'Sándwich Revolución Gourmet', qty: 1, price: 10.0, kind: 'tienda' },
    ],
  },
  listo: {
    context: 'listo',
    station: 'Tienda LiSTO! · San Isidro',
    items: [
      { name: 'Café LiSTO! grande', qty: 1, price: 8.5, kind: 'tienda' },
      { name: 'Sándwich Revolución Gourmet', qty: 1, price: 10.0, kind: 'tienda' },
      { name: 'Agua San Mateo 625 ml', qty: 1, price: 3.5, kind: 'tienda' },
    ],
  },
  gas: {
    context: 'gas',
    station: 'Primax Gas · delivery a domicilio',
    items: [{ name: 'Balón GLP 10 kg', qty: 1, price: 55.0, kind: 'gas' }],
  },
};

export const CONTEXT_LABEL: Record<Context, string> = {
  playa: 'Playa de combustible',
  listo: 'Tienda LiSTO!',
  gas: 'Primax Gas',
};
