import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SecuritySymbol from "../../../../components/ui/SecuritySymbol";

import {
  ArrowLeft,
  BarChart3,
  DollarSign,
  Eye,
  PieChart as PieChartIcon,
  Settings,
  Snowflake,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { getPortfolioHoldings } from "../../../../api/holdings";
import { setStoredPortfolioId } from "../../../../utils/portfolioContext";

export default function PortfolioHoldings() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [holdingsData, setHoldingsData] = useState(null);
  const [selectedView, setSelectedView] = useState("performance");

  async function loadHoldings() {
    setIsLoading(true);

    try {
      const response = await getPortfolioHoldings(id);

      setHoldingsData(response.data || null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    if (id) {
      setStoredPortfolioId(id);
    }

    loadHoldings();
  }, [id]);

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading holdings analysis...
      </div>
    );
  }

  const portfolio = holdingsData?.portfolio || {};
  const summary = holdingsData?.summary || {};
  const insights = holdingsData?.insights || {};
  const holdings = holdingsData?.holdings || [];
  const portfolioSelects = holdingsData?.portfolio_selects || {};

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <div className="flex flex-col gap-8">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
              Holdings Analysis
            </p>

            <h1 className="mt-3 font-display text-5xl font-bold">
              {portfolio.name
                ? `${portfolio.name} Holdings`
                : "Portfolio Holdings"}
            </h1>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center"></div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex h-14 items-center gap-3 rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4">
                <span className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                  Active Portfolio
                </span>

                <select
                  value={String(portfolio.id || id)}
                  onChange={(event) => {
                    const nextPortfolioId = event.target.value;

                    setStoredPortfolioId(nextPortfolioId);

                    navigate(
                      `/dashboard/portfolios/${nextPortfolioId}/holdings`,
                    );
                  }}
                  className="bg-transparent text-sm font-semibold text-brand-text outline-none"
                >
                  {Object.entries(portfolioSelects).map(
                    ([portfolioId, name]) => (
                      <option
                        key={portfolioId}
                        value={portfolioId}
                        className="bg-brand-surface text-brand-text"
                      >
                        {name}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={WalletCards}
          label="Market Value"
          value={formatCurrency(summary.market_value)}
          detail="Current value across holdings"
        />

        <MetricCard
          icon={DollarSign}
          label="Cost Basis"
          value={formatCurrency(summary.cost_basis)}
          detail="Total invested capital"
        />

        <MetricCard
          icon={TrendingUp}
          label="Unrealized Gain/Loss"
          value={formatCurrency(summary.unrealized_gain_loss)}
          detail={formatPercent(summary.unrealized_gain_loss_percentage)}
          tone={
            Number(summary.unrealized_gain_loss || 0) < 0 ? "danger" : "success"
          }
        />

        <MetricCard
          icon={Snowflake}
          label="Monthly Income"
          value={formatCurrency(summary.monthly_income)}
          detail="Projected from holdings"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <CalloutCard
          title="Largest Position"
          value={
            insights.largest_position?.symbol ? (
              <SecuritySymbol symbol={insights.largest_position.symbol} />
            ) : (
              "—"
            )
          }
          detail={`${formatPercent(
            insights.largest_position?.value,
          )} of portfolio market value`}
        />

        <CalloutCard
          title="Top Income Driver"
          value={
            insights.top_income_driver?.symbol ? (
              <SecuritySymbol symbol={insights.top_income_driver.symbol} />
            ) : (
              "—"
            )
          }
          detail={`${formatPercent(
            insights.top_income_driver?.value,
          )} of projected monthly income`}
        />

        <CalloutCard
          title="Highest Gain"
          value={
            insights.highest_gain?.symbol ? (
              <SecuritySymbol symbol={insights.highest_gain.symbol} />
            ) : (
              "—"
            )
          }
          detail={`${formatCurrency(
            insights.highest_gain?.value,
          )} unrealized gain`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <InsightPanel
          icon={PieChartIcon}
          title="Allocation by Market Value"
          description="Shows which positions dominate current portfolio value."
          rows={holdings.map((holding) => ({
            label: holding.symbol,
            value: holding.allocation_percentage,
            display: formatPercent(holding.allocation_percentage),
          }))}
        />

        <InsightPanel
          icon={Snowflake}
          title="Allocation by Income"
          description="Shows which positions generate the most projected monthly income."
          rows={holdings.map((holding) => ({
            label: holding.symbol,
            value: holding.income_allocation_percentage,
            display: formatPercent(holding.income_allocation_percentage),
          }))}
        />
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Full Holdings Breakdown
            </h2>

            <p className="mt-1 text-sm text-brand-muted">
              Position-level performance, income, allocation, and risk signals.
            </p>
          </div>

          <Link
            to={`/dashboard/radar/portfolio-compare/${id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
          >
            <BarChart3 className="h-4 w-4" />
            Compare ETFs
          </Link>
        </div>

        <div className="mt-6 inline-flex overflow-hidden rounded-xl border border-brand-outline bg-brand-surfaceHigh">
          <button
            type="button"
            onClick={() => setSelectedView("performance")}
            className={`px-4 py-3 text-xs font-bold transition ${
              selectedView === "performance"
                ? "bg-brand-primary/20 text-brand-primary"
                : "text-brand-muted hover:text-brand-primary"
            }`}
          >
            Performance
          </button>

          <button
            type="button"
            onClick={() => setSelectedView("income")}
            className={`px-4 py-3 text-xs font-bold transition ${
              selectedView === "income"
                ? "bg-brand-primary/20 text-brand-primary"
                : "text-brand-muted hover:text-brand-primary"
            }`}
          >
            Income & Risk
          </button>
        </div>

        {holdings.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-8 text-center text-brand-muted">
            No current holdings found for this portfolio.
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-brand-outline">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-surfaceHigh text-brand-muted">
                {selectedView === "performance" ? (
                  <tr>
                    <th className="px-4 py-3 font-semibold">ETF</th>
                    <th className="px-4 py-3 font-semibold">Shares</th>
                    <th className="px-4 py-3 font-semibold">Avg Cost</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Market Value</th>
                    <th className="px-4 py-3 font-semibold">Cost Basis</th>
                    <th className="px-4 py-3 font-semibold">Gain/Loss</th>
                    <th className="px-4 py-3 font-semibold">Gain/Loss %</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-4 py-3 font-semibold">ETF</th>
                    <th className="px-4 py-3 font-semibold">Monthly Income</th>
                    <th className="px-4 py-3 font-semibold">Yield on Cost</th>
                    <th className="px-4 py-3 font-semibold">Allocation</th>
                    <th className="px-4 py-3 font-semibold">Income Weight</th>
                    <th className="px-4 py-3 font-semibold">NAV Health</th>
                    <th className="px-4 py-3 font-semibold">AUM Flow</th>
                  </tr>
                )}
              </thead>

              <tbody>
                {holdings.map((holding) =>
                  selectedView === "performance" ? (
                    <tr
                      key={holding.security_id}
                      className="border-t border-brand-outline text-brand-muted"
                    >
                      <td className="px-4 py-4 font-display text-xl font-bold text-brand-primary">
                        <SecuritySymbol symbol={holding.symbol} />
                      </td>

                      <td className="px-4 py-4">
                        {formatNumber(holding.shares)}
                      </td>

                      <td className="px-4 py-4">
                        {formatCurrency(holding.average_cost)}
                      </td>

                      <td className="px-4 py-4">
                        {formatCurrency(holding.current_price)}
                      </td>

                      <td className="px-4 py-4 font-semibold text-brand-text">
                        {formatCurrency(holding.market_value)}
                      </td>

                      <td className="px-4 py-4">
                        {formatCurrency(holding.cost_basis)}
                      </td>

                      <td
                        className={`px-4 py-4 font-semibold ${
                          Number(holding.unrealized_gain_loss || 0) < 0
                            ? "text-brand-danger"
                            : "text-emerald-300"
                        }`}
                      >
                        {formatCurrency(holding.unrealized_gain_loss)}
                      </td>

                      <td
                        className={`px-4 py-4 font-semibold ${
                          Number(holding.unrealized_gain_loss_percentage || 0) <
                          0
                            ? "text-brand-danger"
                            : "text-emerald-300"
                        }`}
                      >
                        {formatPercent(holding.unrealized_gain_loss_percentage)}
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={holding.security_id}
                      className="border-t border-brand-outline text-brand-muted"
                    >
                      <td className="px-4 py-4 font-display text-xl font-bold text-brand-primary">
                        {holding.symbol}
                      </td>

                      <td className="px-4 py-4">
                        {formatCurrency(holding.estimated_monthly_income)}
                      </td>

                      <td className="px-4 py-4">
                        {formatPercent(holding.yield_on_cost_percentage)}
                      </td>

                      <td className="px-4 py-4">
                        {formatPercent(holding.allocation_percentage)}
                      </td>

                      <td className="px-4 py-4">
                        {formatPercent(holding.income_allocation_percentage)}
                      </td>

                      <td className="px-4 py-4">
                        <SignalBadge value={holding.nav_health} />
                      </td>

                      <td
                        className={`px-4 py-4 font-semibold ${
                          Number(holding.aum_flow_percentage || 0) < 0
                            ? "text-brand-danger"
                            : "text-emerald-300"
                        }`}
                      >
                        {formatPercent(holding.aum_flow_percentage)}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone = "default" }) {
  const toneClass =
    tone === "danger"
      ? "text-brand-danger"
      : tone === "success"
        ? "text-emerald-300"
        : "text-brand-text";

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-5 text-sm text-brand-muted">{label}</p>

      <p className={`mt-2 font-display text-3xl font-bold ${toneClass}`}>
        {value}
      </p>

      <p className="mt-2 text-sm text-brand-muted">{detail}</p>
    </div>
  );
}

function InsightPanel({ icon: Icon, title, description, rows }) {
  const maxValue = Math.max(...rows.map((row) => Number(row.value || 0)), 1);

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <p className="text-sm text-brand-muted">{description}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-6 text-center text-sm text-brand-muted">
          Allocation data will appear once holdings are available.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {rows.map((row) => (
            <div key={row.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-brand-text">
                  {row.label}
                </span>
                <span className="text-brand-muted">{row.display}</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-brand-surfaceHigh">
                <div
                  className="h-full rounded-full bg-brand-primary"
                  style={{
                    width: `${Math.max((Number(row.value || 0) / maxValue) * 100, 4)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SignalBadge({ value }) {
  const normalized = String(value || "").toLowerCase();

  const className = normalized.includes("watch")
    ? "border-brand-danger/40 bg-brand-danger/10 text-brand-danger"
    : normalized.includes("mixed")
      ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
      : normalized.includes("stable")
        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
        : "border-brand-outline bg-brand-surfaceHigh text-brand-muted";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${className}`}
    >
      {value || "Unknown"}
    </span>
  );
}

function CalloutCard({ title, value, detail }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-brand-muted">{title}</p>
      <p className="mt-3 font-display text-3xl font-bold text-brand-primary">
        {value}
      </p>
      <p className="mt-2 text-sm text-brand-muted">{detail}</p>
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

function formatNumber(value) {
  return Math.round(Number(value || 0)).toLocaleString("en-US");
}

function formatPercent(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${Number(value).toFixed(2)}%`;
}
