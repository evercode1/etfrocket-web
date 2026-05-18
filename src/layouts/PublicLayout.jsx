import { Link, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import PublicFooter from "../components/layout/PublicFooter";

import { Rocket } from "lucide-react";

export default function PublicLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-brand-background text-brand-text">
      <header className="border-b border-brand-outline bg-brand-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="flex items-center gap-3 font-display text-2xl font-bold text-brand-primary"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 shadow-glow">
              <Rocket className="h-5 w-5 text-brand-primary" />
            </div>

            <span>ETF Rocket</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/help"
              className="rounded-xl border border-brand-outline px-5 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-surfaceHighest"
            >
              Help Center
            </Link>

            {user ? (
              <Link
                to="/dashboard"
                className="rounded-xl bg-brand-primaryStrong px-5 py-2 text-sm font-bold text-brand-background shadow-glow transition hover:scale-105"
              >
                Dashboard
              </Link>
            ) : (
              <>
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
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-88px)] flex-col">
        <main className="flex-1">
          <Outlet />
        </main>

        <PublicFooter />
      </div>
    </div>
  );
}
