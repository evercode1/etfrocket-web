import { Link, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import SiteDisclaimer from "../components/layout/SiteDisclaimer";
import EtfSearch from "../components/search/EtfSearch";

import { Rocket } from "lucide-react";

const outlineLink =
  "whitespace-nowrap rounded-xl border border-brand-outline px-3 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-surfaceHighest sm:px-5";

const primaryLink =
  "whitespace-nowrap rounded-xl bg-brand-primaryStrong px-3 py-2 text-sm font-bold text-brand-background shadow-glow transition hover:scale-105 sm:px-5";

export default function PublicLayout() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-background text-brand-text">
      <header className="relative z-40 border-b border-brand-outline bg-brand-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-3 px-4 py-5 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-3 font-display text-2xl font-bold text-brand-primary"
            aria-label="ETF Rocket home"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-primary/10 shadow-glow">
              <Rocket className="h-5 w-5 text-brand-primary" />
            </div>

            <span className="hidden whitespace-nowrap sm:inline">ETF Rocket</span>
          </Link>

          {/* Own full-width row below lg; inline between logo and nav at lg+. */}
          <EtfSearch className="order-last w-full lg:order-none lg:mx-4 lg:w-auto lg:max-w-xs lg:flex-1" />

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link to="/aum" className={outlineLink}>
              <span className="sm:hidden">AUM</span>
              <span className="hidden sm:inline">AUM Leaderboard</span>
            </Link>

            <Link to="/help" className={`hidden xl:inline-block ${outlineLink}`}>
              Help Center
            </Link>

            {user ? (
              <Link
                to={user.is_admin ? "/admin" : "/dashboard"}
                className={primaryLink}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/auth/login" className={outlineLink}>
                  Login
                </Link>

                <Link
                  to="/auth/register"
                  className={`hidden sm:inline-block ${primaryLink}`}
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="relative z-30 flex min-h-[calc(100vh-88px)] flex-col">
        <main className="flex-1">
          <Outlet />
        </main>

        <SiteDisclaimer />
      </div>
    </div>
  );
}
