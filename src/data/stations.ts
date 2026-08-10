export interface Station {
  name: string;
  address: string;
  lat: number;
  lng: number;
  services: ('tienda' | 'cafe' | 'gas' | 'lubricantes')[];
  /** Precio de G-Premium 95 por galón, en soles. Referencial para la demo. */
  premium: number;
  open24h: boolean;
  /** Distancia fija, en km. En la demo evitamos pedir permiso de ubicación. */
  dist: number;
}

/** Estaciones tomadas del prototipo original, con precios de referencia agregados. */
export const STATIONS: Station[] = [
  {
    name: 'E/S San Isidro',
    address: 'Av. Javier Prado Oeste 1050, San Isidro',
    lat: -12.0931,
    lng: -77.0465,
    services: ['tienda', 'cafe'],
    premium: 24.0,
    open24h: true,
    dist: 0.4,
  },
  {
    name: 'E/S San Borja',
    address: 'Av. San Luis 200, San Borja',
    lat: -12.1019,
    lng: -76.9975,
    services: ['tienda', 'gas'],
    premium: 23.8,
    open24h: true,
    dist: 2.1,
  },
  {
    name: 'E/S Armendáriz',
    address: 'Av. Armendáriz 575, Miraflores',
    lat: -12.1257,
    lng: -77.0295,
    services: ['tienda', 'cafe', 'gas', 'lubricantes'],
    premium: 24.2,
    open24h: false,
    dist: 3.6,
  },
  {
    name: 'E/S Barranco',
    address: 'Av. República de Panamá 355, Barranco',
    lat: -12.1464,
    lng: -77.0208,
    services: ['tienda', 'lubricantes'],
    premium: 23.9,
    open24h: false,
    dist: 5.2,
  },
];

export const SERVICE_LABEL: Record<Station['services'][number], string> = {
  tienda: 'Tienda LiSTO!',
  cafe: 'Café LiSTO!',
  gas: 'Primax Gas',
  lubricantes: 'Lubricantes Shell',
};

/** Estación "donde estás" en la demo — la que dispara la tarjeta contextual del home. */
export const NEARBY_STATION = STATIONS[0];
