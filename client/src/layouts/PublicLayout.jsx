import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Simple navbar for public pages */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-cream-dark">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🌍</span>
            <span className="font-display font-bold text-xl text-ink group-hover:text-lavender-dark transition-colors">
              TinyWorld
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-ink-light hover:text-ink transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 text-sm font-semibold bg-lavender hover:bg-lavender-dark text-ink rounded-xl transition-all shadow-soft hover:shadow-card"
            >
              Create Your World
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
