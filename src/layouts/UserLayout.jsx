import { useState, useEffect } from "react";

import { Link, Outlet, useNavigate } from "react-router-dom";

import { getStoredPortfolioId } from "../utils/portfolioContext";

import { getSecuritySelects } from "../api/securities";

import {
  BookOpen,
  ChevronDown,
  CircleUserRound,
  Headset,
  LayoutDashboard,
  LogOut,
  Settings,
  Rocket,
  BrainCircuit,
} from "lucide-react";

import SupportBell from "../components/support/SupportBell";

import { useAuth } from "../context/AuthContext";

const COMMANDS = [
  {
    keywords: ["dashboard", "home", "main", "dashbord", "dash"],
    getPath: () => "/dashboard",
  },

  {
    keywords: [
      "pofolio",
      "porfolio",
      "portfolio",
      "portfolios",
      "protfolio",
      "protfolios",
      "accounts",
    ],
    getPath: () => "/dashboard/portfolios",
  },

  {
    keywords: [
      "transactions",
      "transaction",
      "ledger",
      "buys",
      "sells",
      "trans",
      "tranctions",
      "transactons",
    ],
    getPath: (portfolioId) =>
      `/dashboard/portfolios/${portfolioId}/transactions`,
  },

  {
    keywords: ["holdings", "holding", "positions", "position", "holdngs"],
    getPath: (portfolioId) => `/dashboard/portfolios/${portfolioId}/holdings`,
  },

  {
    keywords: [
      "income",
      "projection",
      "income projection",
      "forecast",
      "cashflow",
      "cash flow",
    ],
    getPath: (portfolioId) => `/dashboard/income-projection/${portfolioId}`,
  },

  {
    keywords: [
      "dividends",
      "dividend",
      "income",
      "payouts",
      "distribution",
      "distributions",
    ],
    getPath: (portfolioId) => `/dashboard/dividends/${portfolioId}`,
  },

  {
    keywords: ["calendar", "dividend calendar", "ex date", "ex-date"],
    getPath: (portfolioId) => `/dashboard/dividends/${portfolioId}/calendar`,
  },

  {
    keywords: ["history", "dividend history", "payment history"],
    getPath: (portfolioId) => `/dashboard/dividends/${portfolioId}/history`,
  },

  {
    keywords: [
      "compare",
      "compare symbols",
      "symbol compare",
      "radar",
      "comparison",
      "comparisons",
    ],
    getPath: () => "/dashboard/radar/compare-symbols",
  },

  {
    keywords: ["compare portfolio", "portfolio compare", "compare holdings"],
    getPath: (portfolioId) =>
      `/dashboard/radar/portfolio-compare/${portfolioId}`,
  },

  {
    keywords: [
      "rankings",
      "ranking",
      "leaderboard",
      "filters",
      "explorer",
      "metrics",
      "metric explorer",
    ],
    getPath: () => "/dashboard/radar/metric-explorer",
  },

  {
    keywords: ["backtest", "backtesting", "back test", "historical"],
    getPath: () => "/dashboard/backtesting",
  },

  {
    keywords: ["watchlist", "watch list", "signals", "etf watchlist"],
    getPath: () => "/dashboard/signals/watchlist",
  },

  {
    keywords: ["snapshot", "market snapshot", "market"],
    getPath: () => "/dashboard/signals/market-snapshot",
  },

  {
    keywords: ["conditions", "market conditions", "condition"],
    getPath: () => "/dashboard/signals/market-conditions",
  },

  {
    keywords: ["events", "market events", "calendar events"],
    getPath: () => "/dashboard/signals/market-events",
  },

  {
    keywords: [
      "ai",
      "insights",
      "ai insights",
      "intelligence",
      "signal",
      "signals",
    ],
    getPath: () => "/dashboard/ai-insights",
  },

  {
    keywords: ["support", "ticket", "tickets", "help"],
    getPath: () => "/dashboard/support",
  },

  {
    keywords: ["new ticket", "create ticket", "contact support"],
    getPath: () => "/dashboard/support/create",
  },

  {
    keywords: [
      "settings",
      "preferences",
      "account",
      "profile",
      "configuration",
    ],
    getPath: () => "/dashboard/settings",
  },
];

export default function UserLayout() {
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [securitySymbols, setSecuritySymbols] = useState([]);

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    async function loadSymbols() {
      try {
        const response = await getSecuritySelects();

        const symbols = Object.values(response.data || {});

        setSecuritySymbols(symbols.map((symbol) => symbol.toUpperCase()));

        console.log(
          "Loaded security symbols:",

          symbols.slice(0, 10),
        );
      } catch (error) {
        console.error("Failed to load security symbols", error);
      }
    }

    loadSymbols();
  }, []);

  function handleSearch(event) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const query = event.currentTarget.value.trim().toLowerCase();

    if (!query) {
      return;
    }

    const portfolioId = getStoredPortfolioId();

    const command = COMMANDS.find((command) =>
      command.keywords.includes(query),
    );

    if (command) {
      const path = command.getPath(portfolioId);

      if (path.includes("undefined")) {
        alert("No active portfolio found.");

        return;
      }

      navigate(path);

      setSearchTerm("");

      return;
    }

    const symbol = query.toUpperCase();

    if (securitySymbols.includes(symbol)) {
      navigate(`/dashboard/securities/${symbol}`);

      setSearchTerm("");

      return;
    }

    setSearchTerm("");

    alert(`No match found for "${query}"`);
  }

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
              className="flex items-center gap-3 font-display text-2xl font-bold text-brand-primary"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 shadow-glow">
                <Rocket className="h-5 w-5 text-brand-primary" />
              </div>

              <span>ETF Rocket</span>
            </Link>

            <nav className="ml-auto mr-8 flex gap-4 text-sm text-brand-muted">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 transition hover:text-brand-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/dashboard/ai-insights"
                className="flex items-center gap-2 transition hover:text-brand-primary"
              >
                <BrainCircuit className="h-4 w-4" />
                AI Insights
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;

                  setSearchTerm(value);

                  const query = value.trim().toLowerCase();

                  if (!query) {
                    setSuggestions([]);

                    return;
                  }

                  const commandMatches = COMMANDS.filter((command) =>
                    command.keywords.some((keyword) => keyword.includes(query)),
                  ).map((command) => ({
                    type: "command",
                    label: command.keywords[0],
                    command,
                  }));

                  const symbolMatches = securitySymbols
                    .filter((symbol) => symbol.toLowerCase().includes(query))
                    .slice(0, 8)
                    .map((symbol) => ({
                      type: "symbol",
                      label: symbol,
                    }));

                  setSuggestions(
                    [...commandMatches, ...symbolMatches].slice(0, 10),
                  );
                }}
                onKeyDown={handleSearch}
                placeholder="Search ETFs, pages, actions..."
                className="w-72 rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-2 text-sm text-brand-text outline-none transition focus:border-brand-primary"
              />

              {suggestions.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-brand-outline bg-brand-surface shadow-glow">
                  {suggestions.map((item) => (
                    <button
                      key={`${item.type}-${item.label}`}
                      type="button"
                      onClick={() => {
                        if (item.type === "symbol") {
                          navigate(`/dashboard/securities/${item.label}`);
                        } else {
                          const portfolioId = getStoredPortfolioId();

                          const path = item.command.getPath(portfolioId);

                          if (!path.includes("undefined")) {
                            navigate(path);
                          }
                        }

                        setSearchTerm("");

                        setSuggestions([]);
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
                    >
                      <span>{item.label}</span>

                      <span className="text-xs uppercase opacity-60">
                        {item.type === "symbol" ? "SYMBOL" : "PAGE"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                <div
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 z-50 mt-3 w-64 rounded-2xl border border-brand-outline bg-brand-surface p-2 shadow-glow"
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
                    to="/help"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
                  >
                    <BookOpen className="h-4 w-4" />
                    Help Center
                  </Link>

                  <Link
                    to="/dashboard/support"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
                  >
                    <Headset className="h-4 w-4" />
                    Support
                  </Link>

                  <Link
                    to="/dashboard/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>

                  {user?.is_admin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin
                    </Link>
                  )}

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
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
