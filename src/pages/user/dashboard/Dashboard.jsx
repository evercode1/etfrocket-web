import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  getMissionControl,
  getPortfolioSelects,
} from "../../../api/missionControl";

import {
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  CalendarClock,
  ChevronDown,
  Eye,
  Gauge,
  LineChart as LineChartIcon,
  Plus,
  RadioTower,
  Rocket,
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
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const portfolioTrendData = [
  { date: "Jan", value: 10000, income: 220 },
  { date: "Feb", value: 10400, income: 245 },
  { date: "Mar", value: 10150, income: 238 },
  { date: "Apr", value: 10900, income: 271 },
  { date: "May", value: 11450, income: 292 },
];

const watchlistData = [
  { ticker: "NVII", yield: "38.4%", nav: "Improving", momentum: "+8.7%" },
  { ticker: "CHPY", yield: "41.2%", nav: "Stable", momentum: "+4.1%" },
  { ticker: "AMDY", yield: "52.8%", nav: "Watch", momentum: "-2.6%" },
];

const alertData = [
  {
    type: "Risk",
    title: "NAV pressure detected",
    message: "AMDY shows short-term NAV erosion across the latest range.",
  },
  {
    type: "Opportunity",
    title: "Momentum improving",
    message: "NVII total return trend is strengthening over recent data.",
  },
  {
    type: "Income",
    title: "Dividend activity",
    message: "Several covered-call ETFs have fresh dividend records available.",
  },
];

const activityData = [
  "Price history imported for NVII",
  "Dividend history updated for AMDY",
  "ETF metrics recalculated",
  "AI extraction queued for covered-call universe",
];

export default function Dashboard() {
  const [missionControl, setMissionControl] = useState(null);
  const [portfolioSelects, setPortfolioSelects] = useState({});
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadDashboard(portfolioId = null) {
    setIsLoading(true);

    try {
      const selectsResponse = await getPortfolioSelects();

      const selects = selectsResponse.data || {};

      setPortfolioSelects(selects);

      const missionResponse = await getMissionControl(portfolioId);

      const missionData = missionResponse.data || null;

      setMissionControl(missionData);

      if (!portfolioId && missionData?.selected_portfolio?.id) {
        setSelectedPortfolioId(missionData.selected_portfolio.id);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard(selectedPortfolioId);
  }, [selectedPortfolioId]);

  return (
    <div className="space-y-8">
      <section className="glass-card overflow-hidden rounded-3xl p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
              Mission Control
            </p>

            <h1 className="mt-3 font-display text-5xl font-bold">
              ETF Command Center
            </h1>

            <p className="mt-4 max-w-3xl text-brand-muted">
              Monitor portfolio strength, ETF risk signals, watchlist movement,
              and system intelligence from one launch deck.
            </p>
          </div>

          <div className="rounded-3xl border border-brand-outline bg-brand-surfaceHigh p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary shadow-glow">
                <Rocket className="h-6 w-6" />
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                  Mission Status
                </p>

                <p className="mt-1 text-sm text-brand-muted">
                  {isLoading
                    ? "Syncing mission telemetry..."
                    : "Systems online. Portfolio module active."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PortfolioSnapshot
        missionControl={missionControl}
        portfolioSelects={portfolioSelects}
        selectedPortfolioId={selectedPortfolioId}
        setSelectedPortfolioId={setSelectedPortfolioId}
        isLoading={isLoading}
      />

      <RiskOpportunityAlerts />

      <WatchlistIntelligence />

      <SystemActivity />
    </div>
  );
}

function PortfolioSnapshot({
  missionControl,
  portfolioSelects,
  selectedPortfolioId,
  setSelectedPortfolioId,
  isLoading,
}) {
  const snapshot = missionControl?.portfolio_snapshot || null;
  const flightPath = missionControl?.portfolio_flight_path || [];
  const incomeProjection = buildIncomeProjection(snapshot?.monthly_income);

  const hasPortfolio = Object.keys(portfolioSelects || {}).length > 0;

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
              icon={WalletCards}
              label="Portfolio Value"
              value={formatCurrency(snapshot?.portfolio_value)}
              detail={`Cost basis: ${formatCurrency(snapshot?.cost_basis)}`}
            />

            <MetricCard
              icon={Snowflake}
              label="Monthly Income"
              value={formatCurrency(snapshot?.monthly_income)}
              detail="Projected from recent distributions"
            />

            <MetricCard
              icon={TrendingUp}
              label="Total Return"
              value={formatPercent(snapshot?.total_return_percentage)}
              detail={`Gain/Loss: ${formatCurrency(snapshot?.unrealized_gain_loss)}`}
            />

            <MetricCard
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
              <CardTitle
                icon={CalendarClock}
                title="Income Projection"
                subtitle="Current monthly income projected forward"
              />

              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeProjection}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" />
                    <YAxis />
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
                      formatter={(value) =>
                        Number(value).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      }
                    />
                    <Bar
                      dataKey="income"
                      fill="currentColor"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
              >
                Change Assumptions
              </button>
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
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/dashboard/portfolios/create"
          className="rocket-button-primary flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
        >
          <Plus className="h-4 w-4" />
          Create Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {portfolioOptions.length > 1 ? (
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
                <button
                  type="button"
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm text-brand-primary transition hover:bg-brand-surfaceHighest"
                >
                  + New Portfolio
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-brand-outline bg-brand-surfaceHigh px-5 py-3 text-sm font-semibold text-brand-text">
          {selectedPortfolio?.name}
        </div>
      )}

      <Link
        to="/dashboard/portfolios"
        className="flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
      >
        <Settings className="h-4 w-4" />
        Manage
      </Link>
    </div>
  );
}

function EmptyPortfolioState() {
  return (
    <div className="glass-card rounded-3xl p-8">
      <div className="grid gap-8 lg:grid-cols-5 lg:items-center">
        <div className="lg:col-span-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary shadow-glow">
            <WalletCards className="h-7 w-7" />
          </div>

          <h3 className="mt-6 font-display text-3xl font-bold">
            Launch Your First Portfolio
          </h3>

          <p className="mt-4 max-w-2xl leading-relaxed text-brand-muted">
            Create a portfolio to track ETF yield, projected income, total
            return, NAV health, and dividend activity from Mission Control.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PreviewChip label="Track Income" />
            <PreviewChip label="Monitor NAV" />
            <PreviewChip label="Project Snowball" />
          </div>

          <Link
            to="/dashboard/portfolios/create"
            className="rocket-button-primary flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
          >
            <Plus className="h-4 w-4" />
            Create Portfolio
          </Link>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-brand-outline bg-brand-surfaceHigh p-5">
            <CardTitle
              icon={LineChartIcon}
              title="Preview Flight Path"
              subtitle="Portfolio charts unlock after setup"
            />

            <div className="mt-6 h-56 opacity-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioTrendData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
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
                    fill="currentColor"
                    fillOpacity={0.15}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskOpportunityAlerts() {
  return (
    <section className="space-y-5">
      <SectionHeader
        icon={BellRing}
        eyebrow="Risk & Opportunity Alerts"
        title="Signals Worth Watching"
        description="Future alerts generated from NAV erosion, dividend changes, momentum shifts, and unusual ETF activity."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {alertData.map((alert) => (
          <div key={alert.title} className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                {alert.type}
              </p>
            </div>

            <h3 className="mt-5 font-display text-2xl font-bold">
              {alert.title}
            </h3>

            <p className="mt-3 leading-relaxed text-brand-muted">
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WatchlistIntelligence() {
  return (
    <section className="space-y-5">
      <SectionHeader
        icon={Eye}
        eyebrow="Watchlist Intelligence"
        title="Tracked ETF Radar"
        description="A future snapshot of ETFs the user follows, with yield, NAV direction, and momentum signals."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {watchlistData.map((etf) => (
          <div key={etf.ticker} className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-3xl font-bold text-brand-primary">
                  {etf.ticker}
                </p>

                <p className="mt-1 text-sm text-brand-muted">
                  Placeholder ETF intelligence card
                </p>
              </div>

              <ArrowUpRight className="h-5 w-5 text-brand-primary" />
            </div>

            <div className="mt-6 grid gap-3">
              <MiniStat label="Yield" value={etf.yield} />
              <MiniStat label="NAV Trend" value={etf.nav} />
              <MiniStat label="Momentum" value={etf.momentum} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SystemActivity() {
  return (
    <section className="space-y-5">
      <SectionHeader
        icon={RadioTower}
        eyebrow="Market & System Activity"
        title="Latest Telemetry"
        description="A future stream of imports, dividend updates, extraction events, and ETF data refreshes."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="glass-card rounded-3xl p-6 lg:col-span-3">
          <CardTitle
            icon={RadioTower}
            title="Activity Feed"
            subtitle="Placeholder operational timeline"
          />

          <div className="mt-6 space-y-4">
            {activityData.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3"
              >
                <div className="h-2.5 w-2.5 rounded-full bg-brand-primary shadow-glow" />

                <p className="text-sm text-brand-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 lg:col-span-2">
          <CardTitle
            icon={TrendingUp}
            title="Momentum Pulse"
            subtitle="Placeholder ETF momentum sample"
          />

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" />
                <YAxis />
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
                  formatter={(value) =>
                    Number(value).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="currentColor"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
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

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <Icon className="h-5 w-5" />
        </div>

        <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
          Live
        </p>
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
        <h3 className="font-display text-xl font-bold">{title}</h3>
        <p className="text-sm text-brand-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3">
      <span className="text-sm text-brand-muted">{label}</span>
      <span className="font-semibold text-brand-text">{value}</span>
    </div>
  );
}

function PreviewChip({ label }) {
  return (
    <span className="rounded-full border border-brand-outline bg-brand-surfaceHigh px-4 py-2 text-sm text-brand-muted">
      {label}
    </span>
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
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const income = Number(monthlyIncome || 0);

  const currentMonth = new Date().getMonth();

  return Array.from({ length: 6 }, (_, index) => {
    const monthIndex = (currentMonth + index) % 12;

    return {
      month: monthNames[monthIndex],
      income,
    };
  });
}
