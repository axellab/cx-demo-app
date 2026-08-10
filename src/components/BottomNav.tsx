import { Icon, type IconName } from './Icon';
import { useNav, type ScreenId } from '../lib/nav';

const ITEMS: { id: ScreenId; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Inicio', icon: 'home' },
  { id: 'wallet', label: 'Beneficios', icon: 'wallet' },
  { id: 'history', label: 'Actividad', icon: 'clock' },
  { id: 'profile', label: 'Perfil', icon: 'user' },
];

export function BottomNav() {
  const { screen, go } = useNav();

  return (
    <nav className="bottom-nav">
      {ITEMS.slice(0, 2).map((it) => (
        <NavItem key={it.id} {...it} active={screen === it.id} onClick={() => go(it.id)} />
      ))}

      <button className="nav-fab" onClick={() => go('pay')} aria-label="Pagar con mi QR Primax">
        <Icon name="qr" size={26} strokeWidth={2} />
      </button>

      {ITEMS.slice(2).map((it) => (
        <NavItem key={it.id} {...it} active={screen === it.id} onClick={() => go(it.id)} />
      ))}
    </nav>
  );
}

function NavItem({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: IconName;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`nav-item${active ? ' active' : ''}`} onClick={onClick} aria-current={active}>
      <Icon name={icon} size={21} strokeWidth={active ? 2.1 : 1.8} />
      {label}
    </button>
  );
}
