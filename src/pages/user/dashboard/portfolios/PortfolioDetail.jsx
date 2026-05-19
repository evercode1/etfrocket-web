import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BarChart3,
  Edit,
  PieChart as PieChartIcon,
  Plus,
  Rocket,
  ShieldCheck,
  Snowflake,
  Trash2,
  WalletCards,
  Upload,
} from "lucide-react";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const portfolioStub = {
  id: 1,
  portfolio_name: "Income Rocket",
  is_default: true,
  portfolio_value: 86747.25,
  cost_basis: 75240.0,
  monthly_income: 2715.42,
  total_return_percentage: 15.29,
  nav_health: "Stable",
};

const holdingsStub = [
  {
    symbol: "NVII",
    fund_name: "NVII ETF",
    shares: 320,
    market_value: 25560,
    monthly_income: 745.2,
    allocation: 29.46,
  },
  {
    symbol: "AMDY",
    fund_name: "AMDY ETF",
    shares: 415,
    market_value: 23040,
    monthly_income: 812.6,
    allocation: 26.56,
  },
  {
    symbol: "CHPY",
    fund_name: "CHPY ETF",
    shares: 290,
    market_value: 21025,
    monthly_income: 650.1,
    allocation: 24.24,
  },
  {
    symbol: "GOOY",
    fund_name: "GOOY ETF",
    shares: 260,
    market_value: 17122.25,
    monthly_income: 507.52,
    allocation: 19.74,
  },
];

const allocationData = holdingsStub.map((holding) => ({
  name: holding.symbol,
  value: holding.market_value,
}));

export default function PortfolioDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <Link
          to="/dashboard/portfolios"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolios
        </Link>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
                Portfolio Details
              </p>

              {portfolioStub.is_default && (
                <span className="rounded-full border border-brand-primary/40 bg-brand-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-brand-primary">
                  Default
                </span>
              )}
            </div>

            <h1 className="mt-3 font-display text-5xl font-bold">
              {portfolioStub.portfolio_name}
            </h1>

            <p className="mt-4 max-w-3xl text-brand-muted">
              Review allocation, holdings, income strength, NAV health, and
              transaction activity for this portfolio.
            </p>

            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-brand-muted">
              Portfolio ID: {id}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/dashboard/portfolios/${id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              <Edit className="h-4 w-4" />
              Update
            </Link>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-danger/50 px-5 py-3 text-sm font-semibold text-brand-danger transition hover:bg-brand-danger/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={WalletCards}
          label="Portfolio Value"
          value={formatCurrency(portfolioStub.portfolio_value)}
          detail={`Cost basis: ${formatCurrency(portfolioStub.cost_basis)}`}
        />

        <MetricCard
          icon={Snowflake}
          label="Monthly Income"
          value={formatCurrency(portfolioStub.monthly_income)}
          detail="Projected from current holdings"
        />

        <MetricCard
          icon={BarChart3}
          label="Total Return"
          value={formatPercent(portfolioStub.total_return_percentage)}
          detail="Unrealized gain/loss"
        />

        <MetricCard
          icon={ShieldCheck}
          label="NAV Health"
          value={portfolioStub.nav_health}
          detail="Based on ETF metric signals"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="glass-card rounded-3xl p-6 lg:col-span-2">
          <CardTitle
            icon={PieChartIcon}
            title="ETF Allocation"
            subtitle="Portfolio weight by current market value"
          />

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={115}
                  paddingAngle={4}
                >
                  {allocationData.map((entry) => (
                    <Cell key={entry.name} fill="currentColor" />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#94a3b8",
                    color: "#0f172a",
                  }}
                  labelStyle={{
                    color: "#0f172a",
                    fontWeight: 700,
                  }}
                  itemStyle={{
                    color: "#1e293b",
                    fontWeight: 600,
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 grid gap-3">
            {holdingsStub.map((holding) => (
              <div
                key={holding.symbol}
                className="flex items-center justify-between rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3"
              >
                <span className="font-semibold text-brand-text">
                  {holding.symbol}
                </span>

                <span className="text-sm text-brand-muted">
                  {holding.allocation.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 lg:col-span-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </button>

            <button
              type="button"
              className="rocket-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-surfaceHigh text-brand-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">ETF</th>
                  <th className="px-4 py-3 font-semibold">Shares</th>
                  <th className="px-4 py-3 font-semibold">Value</th>
                  <th className="px-4 py-3 font-semibold">Income</th>
                  <th className="px-4 py-3 font-semibold">Allocation</th>
                </tr>
              </thead>

              <tbody>
                {holdingsStub.map((holding) => (
                  <tr
                    key={holding.symbol}
                    className="border-t border-brand-outline text-brand-muted"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-brand-text">
                          {holding.symbol}
                        </p>
                        <p className="text-xs text-brand-muted">
                          {holding.fund_name}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4">{holding.shares}</td>

                    <td className="px-4 py-4">
                      {formatCurrency(holding.market_value)}
                    </td>

                    <td className="px-4 py-4">
                      {formatCurrency(holding.monthly_income)}
                    </td>

                    <td className="px-4 py-4">
                      {holding.allocation.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <CardTitle
          icon={BarChart3}
          title="Recent Transactions"
          subtitle="Placeholder area for buys, sells, imports, and edits"
        />

        <div className="mt-6 rounded-2xl border border-dashed border-brand-outline bg-brand-surfaceHigh p-8 text-center">
          <p className="font-display text-2xl font-bold">
            Transactions Coming Next
          </p>

          <p className="mt-3 text-brand-muted">
            This section will show recent buys, sells, imported rows, and
            portfolio adjustments once transaction management is wired in.
          </p>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-5 text-sm text-brand-muted">{label}</p>

      <p className="mt-2 font-display text-3xl font-bold">{value}</p>

      <p className="mt-2 text-sm text-brand-muted">{detail}</p>
    </div>
  );
}

function CardTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <p className="text-sm text-brand-muted">{subtitle}</p>
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

function formatPercent(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${Number(value).toFixed(2)}%`;
}
