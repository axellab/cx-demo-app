import type { CSSProperties, ReactNode } from 'react';

/** Set de íconos de línea, uniforme, para no depender de una librería externa. */
const PATHS: Record<string, ReactNode> = {
  home: (
    <>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5a2 2 0 0 1 4 0v5h3a1 1 0 0 0 1-1v-9" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M16 12h5v4h-5a2 2 0 0 1 0-4z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20c0-3.8 3.6-5.8 7.5-5.8s7.5 2 7.5 5.8" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>
  ),
  qr: (
    <>
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.5" />
      <path d="M14 14h3v3h-3z" />
      <path d="M20.5 14v3M17.5 20.5h3M14 20.5h.01" />
    </>
  ),
  scan: (
    <>
      <path d="M4 8V6a2 2 0 0 1 2-2h2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v2" />
      <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
      <path d="M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M4 12h16" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10" r="2.8" />
    </>
  ),
  right: <path d="m9 5 7 7-7 7" />,
  left: <path d="m15 5-7 7 7 7" />,
  down: <path d="m5 9 7 7 7-7" />,
  check: <path d="M5 13l4 4L19 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  camera: (
    <>
      <path d="M4 8a2 2 0 0 1 2-2h1.2a1 1 0 0 0 .9-.55l.5-1A2 2 0 0 1 10.4 3.5h3.2a2 2 0 0 1 1.8.95l.5 1a1 1 0 0 0 .9.55H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  fingerprint: (
    <>
      <path d="M12 4.5c-3.6 0-6.5 2.6-6.5 5.8 0 1.4.2 2.6.6 3.7" />
      <path d="M18.5 10.3c0-3.2-2.9-5.8-6.5-5.8" />
      <path d="M8.6 19.2c-.8-1.3-1.3-2.9-1.3-4.6 0-2.3 2.1-4.2 4.7-4.2s4.7 1.9 4.7 4.2c0 .9-.1 1.7-.3 2.5" />
      <path d="M12 14.6v1.8c0 1 .2 2 .6 2.9" />
      <path d="M18.6 19.5c.6-1.2 1-2.6 1-4.1" />
    </>
  ),
  fuel: (
    <>
      <path d="M5 20V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v14" />
      <path d="M4 20h11" />
      <path d="M7 9h5" />
      <path d="M14 9h2.5a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V9l-2.5-2.5" />
    </>
  ),
  coffee: (
    <>
      <path d="M5 8h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 4.5v1.2M11.5 4v1.7" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3s5 4.2 5 9a5 5 0 0 1-10 0c0-1.7.7-3.1 1.6-4.2.3 1.4 1.2 2.2 2 2.2 1.3 0 1.6-1.6 1.4-7z" />
    </>
  ),
  droplet: <path d="M12 3.5s5.5 5.6 5.5 9.3A5.5 5.5 0 0 1 6.5 12.8C6.5 9.1 12 3.5 12 3.5z" />,
  percent: (
    <>
      <path d="M18 6 6 18" />
      <circle cx="7.8" cy="7.8" r="2.4" />
      <circle cx="16.2" cy="16.2" r="2.4" />
    </>
  ),
  gift: (
    <>
      <path d="M3.5 11h17v8.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" />
      <path d="M2.8 7.5h18.4V11H2.8z" />
      <path d="M12 7.5v13" />
      <path d="M12 7.5S10.6 3.5 8.4 3.5a2 2 0 0 0 0 4M12 7.5s1.4-4 3.6-4a2 2 0 0 1 0 4" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3.5 13.7 8l4.5 1.7-4.5 1.7L12 16l-1.7-4.6L5.8 9.7 10.3 8z" />
      <path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 5.5H4.5V7a3 3 0 0 0 3 3M17 5.5h2.5V7a3 3 0 0 1-3 3" />
      <path d="M12 14v3M8.5 20.5h7l-.7-3.5h-5.6z" />
    </>
  ),
  link: (
    <>
      <path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-1.3 1.3" />
      <path d="M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l1.3-1.3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 5 6v5.5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V6z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8h.01" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  car: (
    <>
      <path d="M4.5 16v2.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V16M22.5 16v2.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V16" />
      <path d="M2.5 16v-4l2-5.2A2 2 0 0 1 6.4 5.5h11.2a2 2 0 0 1 1.9 1.3l2 5.2v4z" />
      <path d="M4 11.5h16M6.5 14h2M15.5 14h2" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 4v4.5h-4.5" />
    </>
  ),
  logout: (
    <>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 8 6 12l4 4M6 12h9" />
    </>
  ),
  message: (
    <>
      <path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9l-4.5 3.5V16.5H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" />
    </>
  ),
};

export type IconName = keyof typeof PATHS;

interface Props {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 20, strokeWidth = 1.8, className, style }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
