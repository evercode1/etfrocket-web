import { Link } from "react-router-dom";

import {
  BarChart3,
  Gauge,
  ShieldCheck,
  Snowflake,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import PortfolioControls from "./PortfolioControls";
import SectionHeader from "./SectionHeader";
import SnapshotMetricCard from "./SnapshotMetricCard";
import PortfolioFlightPathChart from "./PortfolioFlightPathChart";
import IncomeProjectionChart from "./IncomeProjectionChart";

export default function PortfolioSnapshot({
  missionControl,
  portfolioSelects,
  selectedPortfolioId,
  setSelectedPortfolioId,
  isLoading,
}) {
  const snapshot = missionControl?.portfolio_snapshot || null;
  const flightPath = missionControl?.portfolio_flight_path || [];
  const incomeProjection = snapshot?.income_projection || [];

  const hasPortfolio = Object.keys(portfolioSelects || {}).length > 0;

  const detailPortfolioId =
    selectedPortfolioId || missionControl?.selected_portfolio?.id;

  const portfolioDetailUrl = detailPortfolioId
    ? `/dashboard/portfolios/${detailPortfolioId}`
    : null;

  const portfolioHoldingsUrl = detailPortfolioId
    ? `/dashboard/portfolios/${detailPortfolioId}/holdings`
    : null;

  if (isLoading) {
    return (
      <section className="space-y-5">
        <SectionHeader
          icon={Gauge}
          eyebrow="Portfolio Snapshot"
          title="Portfolio Snapshot"
          description="Loading portfolio telemetry..."
        />

        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          Loading portfolio data...
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
            Portfolio Snapshot
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-5xl font-bold">
              {missionControl?.selected_portfolio?.portfolio_name ||
                "Portfolio Snapshot"}
            </h2>

            {portfolioDetailUrl && (
              <Link
                to={portfolioDetailUrl}
                className="inline-flex items-center gap-1 rounded-full border border-brand-outline bg-brand-surfaceHigh px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
              >
                Details
              </Link>
            )}
          </div>

          <p className="mt-4 max-w-3xl text-brand-muted">
            Income-focused ETF portfolio emphasizing yield, NAV durability,
            monthly cash flow, and allocation strength.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {portfolioHoldingsUrl && (
            <Link
              to={portfolioHoldingsUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Holdings
            </Link>
          )}

          <PortfolioControls
            portfolioSelects={portfolioSelects}
            selectedPortfolioId={selectedPortfolioId}
            setSelectedPortfolioId={setSelectedPortfolioId}
            hasPortfolio={hasPortfolio}
          />
        </div>
      </div>

      {!hasPortfolio ? (
        <EmptyPortfolioState />
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <SnapshotMetricCard
              to={portfolioDetailUrl}
              icon={WalletCards}
              label="Portfolio Value"
              value={formatCurrency(snapshot?.portfolio_value)}
              detail={`Cost basis: ${formatCurrency(snapshot?.cost_basis)}`}
            />

            <SnapshotMetricCard
              to={portfolioDetailUrl}
              icon={Snowflake}
              label="Monthly Income"
              value={formatCurrency(snapshot?.monthly_income)}
              detail="Projected from recent distributions"
            />

            <SnapshotMetricCard
              to={portfolioDetailUrl}
              icon={TrendingUp}
              label="Total Return"
              value={formatPercent(snapshot?.total_return_percentage)}
              detail={`${
                Number(snapshot?.unrealized_gain_loss || 0) >= 0
                  ? "Gain"
                  : "Loss"
              }: ${formatCurrency(Math.abs(snapshot?.unrealized_gain_loss || 0))}`}
            />

            <SnapshotMetricCard
              to={portfolioDetailUrl}
              icon={ShieldCheck}
              label="NAV Health"
              value={snapshot?.nav_health || "Unknown"}
              detail="Based on ETF metric signals"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-5">
            <PortfolioFlightPathChart
              flightPath={flightPath}
              detailPortfolioId={detailPortfolioId}
            />

            <IncomeProjectionChart
              incomeProjection={incomeProjection}
              monthlyIncome={snapshot?.monthly_income}
              detailPortfolioId={detailPortfolioId}
            />
          </div>
        </>
      )}
    </section>
  );
}

function EmptyPortfolioState() {
  return (
    <div className="glass-card rounded-3xl p-8 text-brand-muted">
      Create a portfolio to unlock dashboard telemetry.
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

function formatPercent(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${Number(value).toFixed(2)}%`;
}
