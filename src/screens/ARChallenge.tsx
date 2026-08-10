import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { useNav } from '../lib/nav';
import { actions } from '../lib/store';

/* ============================================================
   Reto AR — port del módulo MindAR del prototipo original.

   Se mantiene la misma librería (MindAR 1.2.5 + A-Frame 1.4.2) y el mismo
   `targets.mind`, compilado a partir del logo de Primax. Cambia el encuadre:
   ahora es un reto dentro de "Retos y misiones", no una pantalla suelta.

   Requiere HTTPS (o localhost) y permiso de cámara. Si falta `targets.mind`
   o la cámara se rechaza, el resto de la app sigue funcionando igual.
   ============================================================ */

/**
 * Solo estos dos, y en este orden.
 *
 * El prototipo original cargaba además `mindar-image.prod.js`, pero ese archivo
 * es un ES module de 266 bytes: en un <script> clásico tira error de sintaxis,
 * nunca define `window.MINDAR` y no aporta nada. `mindar-image-aframe.prod.js`
 * es un bundle autocontenido que ya trae el Controller y el Compiler, y registra
 * los componentes de A-Frame — por eso A-Frame tiene que estar cargado antes.
 */
const SCRIPTS = [
  'https://aframe.io/releases/1.4.2/aframe.min.js',
  'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js',
];

const REWARD = 100;

/** Carga los scripts en orden y una sola vez, aunque se entre y salga del reto. */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === '1') resolve();
      else {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error(`No se pudo cargar ${src}`)), { once: true });
      }
      return;
    }
    const el = document.createElement('script');
    el.src = src;
    el.async = false;
    el.addEventListener('load', () => {
      el.dataset.loaded = '1';
      resolve();
    });
    el.addEventListener('error', () => reject(new Error(`No se pudo cargar ${src}`)));
    document.head.appendChild(el);
  });
}

type Phase = 'permission' | 'starting' | 'scanning' | 'found' | 'error';

export function ARChallenge() {
  const { back, toast } = useNav();
  const [phase, setPhase] = useState<Phase>('permission');
  const [error, setError] = useState('');
  const [log, setLog] = useState<string[]>([]);
  // Espejo de `phase` para poder consultarlo desde timers sin recrearlos.
  const phaseRef = useRef<Phase>('permission');
  phaseRef.current = phase;

  const hostRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<{ start: () => Promise<void>; stop: () => void } | null>(null);
  const startedRef = useRef(false);
  const watchdog = useRef<number>();

  const debug = new URLSearchParams(location.search).get('debug') === '1';

  const dlog = useCallback((msg: string) => {
    console.log('[AR]', msg);
    setLog((l) => [...l, `${new Date().toLocaleTimeString()}  ${msg}`]);
  }, []);

  /** Apaga la cámara y desmonta la escena. Se llama al salir y al desmontar. */
  const teardown = useCallback(() => {
    window.clearTimeout(watchdog.current);
    try {
      systemRef.current?.stop();
    } catch {
      /* la escena ya podía estar destruida */
    }
    systemRef.current = null;
    startedRef.current = false;
    if (hostRef.current) hostRef.current.innerHTML = '';
  }, []);

  useEffect(() => teardown, [teardown]);

  async function start() {
    if (startedRef.current) return;
    startedRef.current = true;
    setPhase('starting');

    // Si el permiso de cámara queda colgado (pasa cuando el navegador lo tiene
    // bloqueado), no dejamos la pantalla en "preparando…" para siempre.
    watchdog.current = window.setTimeout(() => {
      if (phaseRef.current !== 'starting') return;
      setError(
        'La cámara no respondió a tiempo. Revisá que el navegador tenga permiso de cámara y que estés entrando por HTTPS (o localhost).',
      );
      setPhase('error');
    }, 12000);

    try {
      dlog('Cargando MindAR y A-Frame…');
      for (const src of SCRIPTS) await loadScript(src);
      dlog('Librerías cargadas.');

      const host = hostRef.current;
      if (!host) return;

      // A-Frame necesita elementos reales en el DOM: se monta imperativamente,
      // fuera del árbol que reconcilia React.
      host.innerHTML = `
        <a-scene
          mindar-image="imageTargetSrc: ${import.meta.env.BASE_URL}targets.mind; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
          color-space="sRGB"
          renderer="colorManagement: true; physicallyCorrectLights: true"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false">
          <a-assets></a-assets>
          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
          <a-entity mindar-image-target="targetIndex: 0" id="ar-target-0">
            <a-plane position="0 0 0" height="0.01" width="0.01" material="opacity:0"></a-plane>
          </a-entity>
        </a-scene>`;

      const scene = host.querySelector('a-scene') as (HTMLElement & {
        hasLoaded?: boolean;
        systems?: Record<string, { start: () => Promise<void>; stop: () => void }>;
      }) | null;
      if (!scene) throw new Error('No se pudo crear la escena AR');

      const target = host.querySelector('#ar-target-0');
      target?.addEventListener('targetFound', () => {
        dlog('🎯 targetFound — logo detectado.');
        setPhase('found');
      });
      target?.addEventListener('targetLost', () => {
        dlog('targetLost — se perdió el logo.');
        setPhase((p) => (p === 'found' ? 'scanning' : p));
      });

      const boot = () => {
        const system = scene.systems?.['mindar-image-system'];
        if (!system) {
          dlog('Esperando a que A-Frame monte mindar-image-system…');
          window.setTimeout(boot, 200);
          return;
        }
        systemRef.current = system;
        dlog('Pidiendo cámara y cargando targets.mind…');
        system
          .start()
          .then(() => {
            window.clearTimeout(watchdog.current);
            dlog('Cámara y targets.mind listos.');
            setPhase('scanning');
          })
          .catch((err: Error) => {
            window.clearTimeout(watchdog.current);
            dlog(`start() rechazado: ${err?.message ?? err}`);
            setError(
              err?.message ??
                'Revisá que exista targets.mind, que estés en HTTPS y que hayas dado permiso de cámara.',
            );
            setPhase('error');
          });
      };

      if (scene.hasLoaded) boot();
      else scene.addEventListener('loaded', boot, { once: true });
    } catch (err) {
      window.clearTimeout(watchdog.current);
      const e = err as Error;
      dlog(`Error: ${e.message}`);
      setError(e.message);
      setPhase('error');
    }
  }

  function claim() {
    actions.claimAR(REWARD);
    teardown();
    toast(`+${REWARD} pts sumados a tu billetera`);
    back();
  }

  function exit() {
    teardown();
    back();
  }

  /** Vuelve a intentar sin salir de la pantalla (las librerías ya están en caché). */
  function retry() {
    teardown();
    setError('');
    setLog([]);
    setPhase('permission');
  }

  const live = phase === 'starting' || phase === 'scanning' || phase === 'found';

  return (
    <section className="screen s-ar">
      {/* Contenedor de la escena A-Frame — lo maneja MindAR, no React. */}
      <div className="s-ar-stage" ref={hostRef} style={{ display: live ? 'block' : 'none' }} />

      {phase === 'permission' && (
        <div className="s-ar-intro">
          <button className="icon-btn ghost s-ar-close" onClick={exit} aria-label="Salir">
            <Icon name="close" size={22} />
          </button>
          <span className="s-ar-icon">
            <Icon name="camera" size={34} strokeWidth={1.7} />
          </span>
          <h2>Descubrí tu sorpresa</h2>
          <p>
            Apuntá la cámara al marcador de Primax — en la estación, en tu tienda LiSTO! o en el
            surtidor — y desbloqueá un bono de puntos.
          </p>
          <button className="btn btn-primary btn-block" onClick={start}>
            Activar cámara
          </button>
          <p className="tiny muted">
            Necesita permiso de cámara y HTTPS (o localhost). Para probarlo, generá e imprimí el
            marcador desde <code>/herramientas/marcador.html</code>.
          </p>
        </div>
      )}

      {live && (
        <>
          <div className="s-ar-hud">
            <span className="s-ar-dot" />
            {phase === 'starting'
              ? 'Preparando la cámara…'
              : phase === 'found'
                ? '¡Logo Primax encontrado!'
                : 'Buscando el logo Primax…'}
          </div>
          <button className="icon-btn s-ar-exit" onClick={exit} aria-label="Salir del reto">
            <Icon name="close" size={20} />
          </button>
        </>
      )}

      {phase === 'found' && (
        <div className="s-ar-prize">
          <span className="s-ar-prize-emoji">🎉</span>
          <h3>¡Encontraste el logo Primax!</h3>
          <p>Ganaste un bono de puntos</p>
          <b>+{REWARD} pts</b>
          <button className="btn btn-primary btn-block" onClick={claim}>
            Sumar a mi billetera
          </button>
        </div>
      )}

      {phase === 'error' && (
        <div className="s-ar-intro">
          <span className="s-ar-icon err">
            <Icon name="info" size={34} strokeWidth={1.8} />
          </span>
          <h2>No pudimos abrir la cámara</h2>
          <p>{error}</p>
          {/* El log va a la vista sí o sí: si falla en una demo, esto es lo que
              hace falta para saber por qué, sin tener que recargar con ?debug=1. */}
          <div className="s-ar-errlog">
            {log.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
          <button className="btn btn-primary btn-block" onClick={retry}>
            Reintentar
          </button>
          <button className="btn btn-ghost btn-block" onClick={exit}>
            Volver a los retos
          </button>
        </div>
      )}

      {debug && phase !== 'error' && log.length > 0 && (
        <div className="s-ar-debug">
          {log.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      )}
    </section>
  );
}
