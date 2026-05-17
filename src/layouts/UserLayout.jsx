import { useState } from "react";

import { Link, Outlet, useNavigate } from "react-router-dom";

import SupportBell from "../components/support/SupportBell";

import {
  BookOpen,
  ChevronDown,
  CircleUserRound,
  Headset,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function UserLayout() {
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();

    navigate("/");
  }

  return (
    <div className="min-h-screen bg-brand-background text-brand-text">
      <header className="border-b border-brand-outline bg-brand-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex flex-1 items-center justify-between gap-6">
            <Link
              to="/dashboard"
              className="font-display text-2xl font-bold text-brand-primary"
            >
              ETF Rocket
            </Link>

            <nav className="ml-auto mr-8 flex gap-4 text-sm text-brand-muted">
              <Link
                to="/dashboard"
                className="transition hover:text-brand-primary"
              >
                Dashboard
              </Link>

              <Link
                to="/dashboard/etfs"
                className="transition hover:text-brand-primary"
              >
                ETFs
              </Link>

              <Link
                to="/dashboard/etfs/compare"
                className="transition hover:text-brand-primary"
              >
                Compare
              </Link>

              <Link
                to="/dashboard/portfolios"
                className="transition hover:text-brand-primary"
              >
                Portfolios
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <SupportBell />
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 rounded-full border border-brand-outline bg-brand-surfaceHigh px-4 py-2 transition hover:border-brand-primary"
              >
                <CircleUserRound className="h-5 w-5 text-brand-primary" />

                <span className="hidden text-sm text-brand-muted md:inline">
                  Mission Pilot
                </span>

                <ChevronDown className="h-4 w-4 text-brand-muted" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 z-50 mt-3 w-56 rounded-2xl border border-brand-outline bg-brand-surface p-2 shadow-glow">
                  <div className="border-b border-brand-outline px-3 py-3">
                    <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                      Signed In
                    </p>

                    <p className="mt-1 truncate text-sm text-brand-muted">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/dashboard/settings"
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
                  >
                    <BookOpen className="h-4 w-4" />
                    Help Center
                  </Link>
                  <Link
                    to="/dashboard/support"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
                  >
                    <Headset className="h-4 w-4" />
                    Support
                  </Link>

                  {user?.is_admin && (
                    <Link
                      to="/admin"
                      className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-danger"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
