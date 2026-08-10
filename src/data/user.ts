/** Perfil de demo. Datos ficticios. */
export const USER = {
  firstName: 'Esteban',
  fullName: 'Esteban Ramírez Salazar',
  doc: 'DNI 45 872 103',
  phone: '+51 987 654 321',
  email: 'esteban.ramirez@correo.pe',
  memberSince: 2019,
  tier: 'Oro',
  nextTier: 'Platino',
  /** Puntos Bonus que faltan para el siguiente nivel. */
  pointsToNextTier: 760,
  vehicle: {
    plate: 'ABC-482',
    model: 'Toyota Hilux 2021',
    fuel: 'G-Premium 95',
  },
  /** Empresa ficticia con la que Primax tendría un convenio corporativo. */
  convenio: {
    company: 'Constructora Andina S.A.C.',
    code: 'CA-2291',
  },
} as const;
