import { useState } from "react";

import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  Activity,
  Building2,
  ChevronDown,
  CircleUserRound,
  ExternalLink,
  FileClock,
  Headset,
  ListChecks,
  LogOut,
  Rocket,
  Timer,
  Users,
  Wallet,
} from "lucide-react";

import AdminSupportBell from "../components/support/AdminSupportBell";
import EtfSearch from "../components/search/EtfSearch";

import { useAuth } from "../context/AuthContext";
import SiteDisclaimer from "../components/layout/SiteDisclaimer";

const NAV_ITEMS = [
  { to: "/admin", label: "Pipeline Health", icon: Activity, end: true },
  { to: "/admin/securities", label: "Securities", icon: Wallet },
  { to: "/admin/issuers", label: "Issuers", icon: Building2 },
  { to: "/admin/selects", label: "Selects", icon: ListChecks },
  { to: "/admin/cron-reports", label: "Cron Reports", icon: Timer },
  { to: "/admin/import-list", label: "Import Activity", icon: FileClock },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/support", label: "Support", icon: Headset },
];

export default function AdminLayout() {
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
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            to="/admin"
            className="flex shrink-0 items-center gap-3 font-display text-2xl font-bold text-brand-primary"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 shadow-glow">
              <Rocket className="h-5 w-5 text-brand-primary" />
            </div>

            <span className="hidden sm:inline">
              ETF Rocket <span className="text-brand-muted">Admin</span>
            </span>
          </Link>

          <EtfSearch className="ml-auto hidden w-72 lg:block" />

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <Link
              to="/aum"
              className="hidden items-center gap-1.5 text-sm text-brand-muted transition hover:text-brand-primary md:inline-flex"
            >
              View site
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            <AdminSupportBell />

            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 rounded-full border border-brand-outline bg-brand-surfaceHigh px-4 py-2 transition hover:border-brand-primary"
              >
                <CircleUserRound className="h-5 w-5 text-brand-primary" />

                <span className="hidden text-sm text-brand-muted md:inline">
                  Admin Pilot
                </span>

                <ChevronDown className="h-4 w-4 text-brand-muted" />
              </button>

              {isUserMenuOpen && (
                <div
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 z-50 mt-3 w-56 rounded-2xl border border-brand-outline bg-brand-surface p-2 shadow-glow"
                >
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
                    onClick={() => setIsUserMenuOpen(false)}
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
                  >
                    <CircleUserRound className="h-4 w-4" />
                    Account Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-danger"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-brand-outline/60 px-4 py-3 sm:px-6 lg:hidden">
          <EtfSearch className="w-full" />
        </div>

        <nav
          aria-label="Admin sections"
          className="border-t border-brand-outline/60"
        >
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm transition ${
                    isActive
                      ? "border-brand-primary text-brand-primary"
                      : "border-transparent text-brand-muted hover:text-brand-text"
                  }`
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <SiteDisclaimer />
    </div>
  );
}
