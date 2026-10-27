import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useEffect } from 'react';
import {
  Home,
  Gamepad2,
  ShoppingBag,
  ListChecks,
  BarChart3,
  Settings,
  LogOut,
  Coins,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/room', icon: Home, label: 'Room' },
  { to: '/games', icon: Gamepad2, label: 'Mini Games' },
  { to: '/shop', icon: ShoppingBag, label: 'Shop' },
  { to: '/activities', icon: ListChecks, label: 'Activities' },
  { to: '/progress', icon: BarChart3, label: 'Progress' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { refreshGameData } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.onboardingCompleted) {
      navigate('/onboarding', { replace: true });
      return;
    }
    refreshGameData();
  }, [user, navigate, refreshGameData]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('See you soon! 👋');
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-cream-dark p-4 sticky top-0 h-screen">
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 mb-6">
          <span className="text-2xl">🌍</span>
          <span className="font-display font-bold text-xl text-ink">TinyWorld</span>
        </div>

        {/* User badge */}
        <div className="bg-cream rounded-xl p-3 mb-6">
          <p className="font-semibold text-ink text-sm truncate">{user?.displayName}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-muted">
            <span className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-peach-dark" />
              {user?.coins ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-lavender-dark" />
              Lv. {user?.level ?? 1}
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-lavender/30 text-ink font-semibold'
                    : 'text-ink-muted hover:bg-cream hover:text-ink'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-muted hover:bg-danger/10 hover:text-danger-dark transition-all mt-2 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream-dark z-40">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 px-2 py-1 ${
                  isActive ? 'text-lavender-dark' : 'text-ink-muted'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
