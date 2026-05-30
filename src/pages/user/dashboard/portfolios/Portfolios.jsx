import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  Plus,
  Rocket,
  ShieldCheck,
  Snowflake,
  WalletCards,
} from "lucide-react";

export default function Portfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadPortfolios() {
    setIsLoading(true);

    try {
      const response = await getPortfolioCardSummaries();

      console.log("Portfolio summaries response:", response);

      const portfolioRows = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      console.log("Portfolio rows:", portfolioRows);

      setPortfolios(portfolioRows);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPortfolios();
  }, []);

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading portfolios...
      </div>
    );
  }

  const hasPortfolios = portfolios.length > 0;

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
              Portfolio Bay
            </p>

            <h1 className="mt-3 font-display text-4xl font-bold">Portfolios</h1>

            <p className="mt-3 max-w-3xl text-brand-muted">
              Create, review, and manage the ETF portfolios that power Mission
              Control and Dividend Snowball.
            </p>
          </div>

          {hasPortfolios && (
            <Link
              to="/dashboard/portfolios/create"
              className="rocket-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
            >
              <Plus className="h-4 w-4" />
              Add Portfolio
            </Link>
          )}
        </div>
      </section>

      {!hasPortfolios ? (
        <EmptyPortfoliosState />
      ) : (
        <section className="grid gap-6 lg:grid-cols-2">
          {portfolios.map((portfolio) => (
            <PortfolioCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </section>
      )}
    </div>
  );
}

function EmptyPortfoliosState() {
  return (
    <section className="glass-card rounded-3xl p-8">
      <div className="max-w-3xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary shadow-glow">
          <Rocket className="h-7 w-7" />
        </div>

        <h2 className="mt-6 font-display text-3xl font-bold">
          Launch Your First Portfolio
        </h2>

        <p className="mt-4 leading-relaxed text-brand-muted">
          Create a portfolio to track ETF allocation, projected income, NAV
          health, total return, and dividend activity.
        </p>

        <Link
          to="/dashboard/portfolios/create"
          className="rocket-button-primary mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
        >
          <Plus className="h-4 w-4" />
          Create Portfolio
        </Link>
      </div>
    </section>
  );
}

function PortfolioCard({ portfolio }) {
  return (
    <Link
      to={`/dashboard/portfolios/${portfolio.id}`}
      className="glass-card group rounded-3xl p-7 transition hover:border-brand-primary"
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-3xl font-bold">
              {portfolio.portfolio_name}
            </h2>

            {portfolio.is_default && (
              <span className="rounded-full border border-brand-primary/40 bg-brand-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-brand-primary">
                Default
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-brand-muted">
            View holdings, allocation, income, and transaction activity.
          </p>
        </div>

        <ArrowUpRight className="h-5 w-5 text-brand-primary transition group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <MiniMetric
          icon={WalletCards}
          label="Portfolio Value"
          value={formatCurrency(portfolio.portfolio_value)}
        />

        <MiniMetric
          icon={Snowflake}
          label="Monthly Income"
          value={formatCurrency(portfolio.monthly_income)}
        />

        <MiniMetric
          icon={ShieldCheck}
          label="NAV Health"
          value={portfolio.nav_health}
        />

        <MiniMetric
          icon={Rocket}
          label="Holdings"
          value={portfolio.holdings_count}
        />
      </div>
    </Link>
  );
}

function MiniMetric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <p className="text-xs text-brand-muted">{label}</p>
          <p className="mt-1 font-semibold text-brand-text">{value}</p>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value) {
  if (value === null || value === undefined) {
    return "$0.00";
  }

  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
