import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BarChart3,
  DollarSign,
  PieChart as PieChartIcon,
  ShieldCheck,
  Snowflake,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const holdings = [
  {
    etf_id: 1,
    symbol: "NVII",
    fund_name: "NVII Test ETF",
    shares: 275,
    average_cost: 24.85,
    current_price: 26.42,
    market_value: 7265.5,
    cost_basis: 6833.75,
    unrealized_gain_loss: 431.75,
    unrealized_gain_loss_percentage: 6.32,
    estimated_monthly_income: 814.22,
    yield_on_cost_percentage: 142.98,
    allocation_percentage: 42.18,
    income_allocation_percentage: 48.7,
    nav_health: "Mixed",
    aum_flow_percentage: 18.4,
  },
  {
    etf_id: 2,
    symbol: "CHPY",
    fund_name: "CHPY Test ETF",
    shares: 150,
    average_cost: 29.1,
    current_price: 34.41,
    market_value: 5161.5,
    cost_basis: 4365,
    unrealized_gain_loss: 796.5,
    unrealized_gain_loss_percentage: 18.25,
    estimated_monthly_income: 623.1,
    yield_on_cost_percentage: 171.31,
    allocation_percentage: 29.96,
    income_allocation_percentage: 37.26,
    nav_health: "Stable",
    aum_flow_percentage: 24.6,
  },
  {
    etf_id: 3,
    symbol: "AMDY",
    fund_name: "AMDY Test ETF",
    shares: 210,
    average_cost: 24.12,
    current_price: 23.02,
    market_value: 4834.2,
    cost_basis: 5065.2,
    unrealized_gain_loss: -231,
    unrealized_gain_loss_percentage: -4.56,
    estimated_monthly_income: 234.9,
    yield_on_cost_percentage: 55.65,
    allocation_percentage: 27.86,
    income_allocation_percentage: 14.04,
    nav_health: "Watch",
    aum_flow_percentage: -6.2,
  },
];

export default function PortfolioHoldings() {
  const { id } = useParams();

  const totals = holdings.reduce(
    (carry, holding) => {
      carry.marketValue += Number(holding.market_value || 0);
      carry.costBasis += Number(holding.cost_basis || 0);
      carry.monthlyIncome += Number(holding.estimated_monthly_income || 0);
      carry.unrealizedGainLoss += Number(holding.unrealized_gain_loss || 0);

      return carry;
    },
    {
      marketValue: 0,
      costBasis: 0,
      monthlyIncome: 0,
      unrealizedGainLoss: 0,
    },
  );

  const unrealizedGainLossPercentage =
    totals.costBasis > 0
      ? (totals.unrealizedGainLoss / totals.costBasis) * 100
      : null;

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <Link
          to={`/dashboard/portfolios/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio Detail
        </Link>

        <p className="mt-8 font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Holdings Analysis
        </p>

        <h1 className="mt-3 font-display text-5xl font-bold">
          Portfolio Holdings
        </h1>

        <p className="mt-4 max-w-3xl text-brand-muted">
          Review position-level value, cost basis, gain/loss, income
          contribution, allocation weight, NAV health, and AUM flow.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={WalletCards}
          label="Market Value"
          value={formatCurrency(totals.marketValue)}
          detail="Current value across holdings"
        />

        <MetricCard
          icon={DollarSign}
          label="Cost Basis"
          value={formatCurrency(totals.costBasis)}
          detail="Total invested capital"
        />

        <MetricCard
          icon={TrendingUp}
          label="Unrealized Gain/Loss"
          value={formatCurrency(totals.unrealizedGainLoss)}
          detail={formatPercent(unrealizedGainLossPercentage)}
          tone={totals.unrealizedGainLoss < 0 ? "danger" : "success"}
        />

        <MetricCard
          icon={Snowflake}
          label="Monthly Income"
          value={formatCurrency(totals.monthlyIncome)}
          detail="Projected from holdings"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <CalloutCard
          title="Largest Position"
          value="NVII"
          detail={`${formatPercent(42.18)} of portfolio market value`}
        />

        <CalloutCard
          title="Top Income Driver"
          value="NVII"
          detail={`${formatPercent(48.7)} of projected monthly income`}
        />

        <CalloutCard
          title="Highest Gain"
          value="CHPY"
          detail={`${formatCurrency(796.5)} unrealized gain`}
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

        <div className="mt-6 overflow-x-auto rounded-2xl border border-brand-outline">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="bg-brand-surfaceHigh text-brand-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">ETF</th>
                <th className="px-4 py-3 font-semibold">Shares</th>
                <th className="px-4 py-3 font-semibold">Avg Cost</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Market Value</th>
                <th className="px-4 py-3 font-semibold">Cost Basis</th>
                <th className="px-4 py-3 font-semibold">Gain/Loss</th>
                <th className="px-4 py-3 font-semibold">Gain/Loss %</th>
                <th className="px-4 py-3 font-semibold">Monthly Income</th>
                <th className="px-4 py-3 font-semibold">Yield on Cost</th>
                <th className="px-4 py-3 font-semibold">Allocation</th>
                <th className="px-4 py-3 font-semibold">Income Weight</th>
                <th className="px-4 py-3 font-semibold">NAV Health</th>
                <th className="px-4 py-3 font-semibold">AUM Flow</th>
              </tr>
            </thead>

            <tbody>
              {holdings.map((holding) => (
                <tr
                  key={holding.etf_id}
                  className="border-t border-brand-outline text-brand-muted"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-display text-xl font-bold text-brand-primary">
                        {holding.symbol}
                      </p>
                      <p className="text-xs text-brand-muted">
                        {holding.fund_name}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4">{formatNumber(holding.shares)}</td>

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
                      Number(holding.unrealized_gain_loss_percentage || 0) < 0
                        ? "text-brand-danger"
                        : "text-emerald-300"
                    }`}
                  >
                    {formatPercent(holding.unrealized_gain_loss_percentage)}
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
              ))}
            </tbody>
          </table>
        </div>
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

      <div className="mt-6 space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-brand-text">{row.label}</span>
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
    </div>
  );
}

function SignalBadge({ value }) {
  const normalized = String(value || "").toLowerCase();

  const className = normalized.includes("watch")
    ? "border-brand-danger/40 bg-brand-danger/10 text-brand-danger"
    : normalized.includes("mixed")
      ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
      : "border-emerald-400/40 bg-emerald-400/10 text-emerald-300";

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
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
}

function formatPercent(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${Number(value).toFixed(2)}%`;
}
