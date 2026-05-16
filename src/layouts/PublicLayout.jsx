import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-brand-background text-brand-text">
      <header className="border-b border-brand-outline bg-brand-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="font-display text-3xl font-bold text-brand-primary"
          >
            ETF Rocket
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/auth/login"
              className="rounded-xl border border-brand-outline px-5 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-surfaceHighest"
            >
              Login
            </Link>

            <Link
              to="/auth/register"
              className="rounded-xl bg-brand-primaryStrong px-5 py-2 text-sm font-bold text-brand-background shadow-glow transition hover:scale-105"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
