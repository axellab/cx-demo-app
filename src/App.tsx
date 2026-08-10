import { useCallback, useMemo, useRef, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { NavCtx, TABS, type Nav, type ScreenId } from './lib/nav';
import { useStore } from './lib/store';
import type { Breakdown } from './lib/benefits';
import type { Context, Purchase } from './types';

import { Splash } from './screens/Splash';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Pay } from './screens/Pay';
import { PaySummary } from './screens/PaySummary';
import { PaySuccess } from './screens/PaySuccess';
import { Wallet } from './screens/Wallet';
import { History } from './screens/History';
import { Challenges } from './screens/Challenges';
import { ARChallenge } from './screens/ARChallenge';
import { MiniGame } from './screens/MiniGame';
import { MapScreen } from './screens/MapScreen';
import { Profile } from './screens/Profile';

export interface Receipt {
  purchase: Purchase;
  breakdown: Breakdown;
}

/** Pantallas que muestran la botonera inferior. */
const WITH_NAV: ScreenId[] = ['home', 'wallet', 'history', 'profile', 'challenges', 'map'];

export default function App() {
  const { onboarded } = useStore();
  const [stack, setStack] = useState<ScreenId[]>(['splash']);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number>();

  /* Estado del flujo de pago, compartido por las tres pantallas del flujo. */
  const [payContext, setPayContext] = useState<Context>('playa');
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const screen = stack[stack.length - 1];

  const go = useCallback((id: ScreenId, opts?: { replace?: boolean }) => {
    setStack((s) => {
      if (opts?.replace) return [...s.slice(0, -1), id];
      // Las pestañas son raíces: volver a una pestaña reinicia la pila.
      if (TABS.includes(id)) return [id];
      if (s[s.length - 1] === id) return s;
      return [...s, id];
    });
  }, []);

  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : ['home']));
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const nav = useMemo<Nav>(() => ({ screen, go, back, toast }), [screen, go, back, toast]);

  return (
    <NavCtx.Provider value={nav}>
      <div className="app">
        {screen === 'splash' && <Splash onUnlock={() => go(onboarded ? 'home' : 'onboarding', { replace: true })} />}
        {screen === 'onboarding' && <Onboarding onDone={() => go('home', { replace: true })} />}
        {screen === 'home' && <Home />}
        {screen === 'pay' && <Pay context={payContext} onContext={setPayContext} />}
        {screen === 'paySummary' && (
          <PaySummary
            context={payContext}
            onPaid={(r) => {
              setReceipt(r);
              go('paySuccess', { replace: true });
            }}
          />
        )}
        {screen === 'paySuccess' && <PaySuccess receipt={receipt} />}
        {screen === 'wallet' && <Wallet />}
        {screen === 'history' && <History />}
        {screen === 'challenges' && <Challenges />}
        {screen === 'ar' && <ARChallenge />}
        {screen === 'game' && <MiniGame />}
        {screen === 'map' && <MapScreen />}
        {screen === 'profile' && <Profile />}

        {WITH_NAV.includes(screen) && <BottomNav />}
        {toastMsg && <div className="toast">{toastMsg}</div>}
      </div>
    </NavCtx.Provider>
  );
}
