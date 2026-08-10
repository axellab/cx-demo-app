import { createContext, useContext } from 'react';

export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'pay'
  | 'paySummary'
  | 'paySuccess'
  | 'wallet'
  | 'history'
  | 'challenges'
  | 'ar'
  | 'game'
  | 'map'
  | 'profile';

/** Las cuatro pestañas de la botonera (el QR del centro no es pestaña). */
export const TABS: ScreenId[] = ['home', 'wallet', 'history', 'profile'];

export interface Nav {
  screen: ScreenId;
  /** `replace` cambia la pantalla sin dejar rastro en la pila (login, onboarding). */
  go: (id: ScreenId, opts?: { replace?: boolean }) => void;
  back: () => void;
  toast: (msg: string) => void;
}

export const NavCtx = createContext<Nav>({
  screen: 'splash',
  go: () => {},
  back: () => {},
  toast: () => {},
});

export const useNav = () => useContext(NavCtx);
