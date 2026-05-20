import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  CalendarClock,
  ChevronDown,
  Gauge,
  LineChart as LineChartIcon,
  Plus,
  Settings,
  ShieldCheck,
  Snowflake,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function PortfolioSnapshot({
  missionControl,
  portfolioSelects,
  selectedPortfolioId,
  setSelectedPortfolioId,
  isLoading,
}) {
  const snapshot = missionControl?.portfolio_snapshot || null;
  const flightPath = missionControl?.portfolio_flight_path || [];
  const incomeProjection = buildIncomeProjection(snapshot?.monthly_income);

  const incomeProjectionPreview = incomeProjection.filter(
    (row) => row.monthNumber % 2 === 0,
  );

  const hasPortfolio = Object.keys(portfolioSelects || {}).length > 0;

  const detailPortfolioId =
    selectedPortfolioId || missionControl?.selected_portfolio?.id;

  const portfolioDetailUrl = detailPortfolioId
    ? `/dashboard/portfolios/${detailPortfolioId}`
    : null;

  if (isLoading) {
    return (
      <section className="space-y-5">
        <SectionHeader
          icon={Gauge}
          eyebrow="Portfolio Snapshot"
          title="State of the Mission"
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
        <SectionHeader
          icon={Gauge}
          eyebrow="Portfolio Snapshot"
          title="State of the Mission"
          description="A summary of yield, income, return, NAV health, and portfolio stability."
        />

        <PortfolioControls
          portfolioSelects={portfolioSelects}
          selectedPortfolioId={selectedPortfolioId}
          setSelectedPortfolioId={setSelectedPortfolioId}
          hasPortfolio={hasPortfolio}
        />
      </div>

      {!hasPortfolio ? (
        <EmptyPortfolioState />
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              to={portfolioDetailUrl}
              icon={WalletCards}
              label="Portfolio Value"
              value={formatCurrency(snapshot?.portfolio_value)}
              detail={`Cost basis: ${formatCurrency(snapshot?.cost_basis)}`}
            />

            <MetricCard
              to={portfolioDetailUrl}
              icon={Snowflake}
              label="Monthly Income"
              value={formatCurrency(snapshot?.monthly_income)}
              detail="Projected from recent distributions"
            />

            <MetricCard
              to={portfolioDetailUrl}
              icon={TrendingUp}
              label="Total Return"
              value={formatPercent(snapshot?.total_return_percentage)}
              detail={`Gain/Loss: ${formatCurrency(snapshot?.unrealized_gain_loss)}`}
            />

            <MetricCard
              to={portfolioDetailUrl}
              icon={ShieldCheck}
              label="NAV Health"
              value={snapshot?.nav_health || "Unknown"}
              detail="Based on ETF metric signals"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-5">
            <div className="glass-card rounded-3xl p-6 lg:col-span-3">
              <CardTitle
                icon={LineChartIcon}
                title="Portfolio Flight Path"
                subtitle="Monthly portfolio value based on transactions and ETF prices"
              />

              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={flightPath}>
                    <defs>
                      <linearGradient
                        id="portfolioValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="currentColor"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="currentColor"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />

                    <YAxis />

                    <Tooltip
                      formatter={(value) =>
                        Number(value).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      }
                    />

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="currentColor"
                      fill="url(#portfolioValue)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <CardTitle
                  icon={CalendarClock}
                  title="Income Projection"
                  subtitle="Base case monthly income path"
                />

                <span className="rounded-full border border-brand-primary/40 bg-brand-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-brand-primary">
                  Base Case
                </span>
              </div>

              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={incomeProjectionPreview}
                    margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      hide
                      domain={[
                        (dataMin) => dataMin * 0.97,
                        (dataMax) => dataMax * 1.01,
                      ]}
                    />

                    <Tooltip formatter={(value) => formatCurrency(value)} />

                    <ReferenceLine
                      y={Number(snapshot?.monthly_income || 0)}
                      stroke="currentColor"
                      strokeDasharray="4 4"
                      opacity={0.35}
                    />

                    <Bar
                      dataKey="income"
                      fill="currentColor"
                      radius={[10, 10, 4, 4]}
                      opacity={0.75}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <Link
                to={`/dashboard/income-projection/${detailPortfolioId}`}
                className="mt-5 flex w-full items-center justify-center rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
              >
                Change Assumptions
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function PortfolioControls({
  portfolioSelects,
  selectedPortfolioId,
  setSelectedPortfolioId,
  hasPortfolio,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const portfolioOptions = Object.entries(portfolioSelects || {}).map(
    ([id, name]) => ({
      id: Number(id),
      name,
    }),
  );

  const selectedPortfolio =
    portfolioOptions.find(
      (portfolio) => portfolio.id === Number(selectedPortfolioId),
    ) || portfolioOptions[0];

  if (!hasPortfolio) {
    return (
      <Link
        to="/dashboard/portfolios/create"
        className="rocket-button-primary flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
      >
        <Plus className="h-4 w-4" />
        Create Portfolio
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 rounded-xl border border-brand-outline bg-brand-surfaceHigh px-5 py-3 text-sm font-semibold text-brand-text transition hover:border-brand-primary"
        >
          <span>{selectedPortfolio?.name}</span>
          <ChevronDown className="h-4 w-4 text-brand-muted" />
        </button>

        {isOpen && (
          <div
            onMouseLeave={() => setIsOpen(false)}
            className="absolute right-0 z-40 mt-3 w-64 rounded-2xl border border-brand-outline bg-brand-surface p-2 shadow-glow"
          >
            {portfolioOptions.map((portfolio) => (
              <button
                key={portfolio.id}
                type="button"
                onClick={() => {
                  setSelectedPortfolioId(portfolio.id);
                  setIsOpen(false);
                }}
                className="block w-full rounded-xl px-3 py-2 text-left text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
              >
                {portfolio.name}
              </button>
            ))}

            <div className="mt-2 border-t border-brand-outline pt-2">
              <Link
                to="/dashboard/portfolios/create"
                className="block w-full rounded-xl px-3 py-2 text-left text-sm text-brand-primary transition hover:bg-brand-surfaceHighest"
              >
                + New Portfolio
              </Link>
            </div>
          </div>
        )}
      </div>

      <Link
        to="/dashboard/portfolios"
        className="flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
      >
        <Settings className="h-4 w-4" />
        Manage All
      </Link>
    </div>
  );
}

function EmptyPortfolioState() {
  return (
    <div className="glass-card rounded-3xl p-8 text-brand-muted">
      Create a portfolio to unlock dashboard telemetry.
    </div>
  );
}

function SectionHeader({ icon: Icon, eyebrow, title, description }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <Icon className="h-5 w-5" />
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
          {eyebrow}
        </p>
      </div>

      <h2 className="mt-3 font-display text-3xl font-bold">{title}</h2>

      <p className="mt-2 max-w-3xl text-brand-muted">{description}</p>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail, to = null }) {
  const content = (
    <div className="glass-card h-full rounded-3xl p-6 transition hover:-translate-y-1 hover:border-brand-primary/50">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand-primary">
          <span>Live</span>
          {to && <ArrowUpRight className="h-4 w-4" />}
        </div>
      </div>

      <p className="mt-5 text-sm text-brand-muted">{label}</p>

      <p className="mt-2 font-display text-3xl font-bold">{value}</p>

      <p className="mt-2 text-sm text-brand-muted">{detail}</p>
    </div>
  );

  if (!to) {
    return content;
  }

  return (
    <Link to={to} className="block h-full">
      {content}
    </Link>
  );
}

function CardTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="font-display text-xl font-bold">{title}</h3>
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

function buildIncomeProjection(monthlyIncome = 0) {
  const startingMonthlyIncome = Number(monthlyIncome || 0);
  const totalMonths = 12;
  const monthlyGrowthRate = 6 / 100 / 12;

  let projectedMonthlyIncome = startingMonthlyIncome;
  let cumulativeIncome = 0;

  return Array.from({ length: totalMonths }, (_, index) => {
    const monthNumber = index + 1;

    projectedMonthlyIncome = projectedMonthlyIncome * (1 + monthlyGrowthRate);
    cumulativeIncome += projectedMonthlyIncome;

    return {
      monthNumber,
      month: `Month ${monthNumber}`,
      income: Number(projectedMonthlyIncome.toFixed(2)),
      cumulativeIncome: Number(cumulativeIncome.toFixed(2)),
    };
  });
}
