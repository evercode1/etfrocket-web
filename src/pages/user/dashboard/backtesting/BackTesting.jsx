import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import {
  ArrowLeft,
  CalendarRange,
  DollarSign,
  LineChart,
  Play,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  ComposedChart,
} from "recharts";

import { runBackTest, getEtfSelects } from "../../../../api/comparisons";

export default function BackTesting() {
  const [symbol, setSymbol] = useState("CHPY");

  const [timeframe, setTimeframe] = useState("5y");

  const [initialInvestment, setInitialInvestment] = useState("10000");

  const [monthlyContribution, setMonthlyContribution] = useState("0");

  const [dripPercentage, setDripPercentage] = useState("100");

  const [unsupportedSymbol, setUnsupportedSymbol] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingEtfs, setIsLoadingEtfs] = useState(true);

  const [backTestData, setBackTestData] = useState(null);

  const [etfOptions, setEtfOptions] = useState([]);

  useEffect(() => {
    async function loadEtfOptions() {
      try {
        const response = await getEtfSelects();

        setEtfOptions(
          Object.entries(response.data || {}).map(([id, symbol]) => ({
            id: Number(id),

            symbol,
          })),
        );
      } finally {
        setIsLoadingEtfs(false);
      }
    }

    loadEtfOptions();
  }, []);

  const projectedMonthlyIncome = useMemo(() => {
    if (!backTestData?.summary?.total_dividends) {
      return 0;
    }

    return Math.round(backTestData.summary.total_dividends / 12);
  }, [backTestData]);

  async function handleRunBacktest() {
    const normalized = symbol.trim().toUpperCase();

    const selectedEtf = etfOptions.find(
      (etf) => etf.symbol?.toUpperCase() === normalized,
    );

    if (!selectedEtf) {
      setUnsupportedSymbol(true);

      return;
    }

    setUnsupportedSymbol(false);

    setIsLoading(true);

    try {
      const endDate = new Date();

      const startDate = calculateStartDate(timeframe);

      const response = await runBackTest({
        etf_id: selectedEtf.id,

        start_date: startDate,

        end_date: endDate.toISOString().split("T")[0],

        initial_investment: Number(initialInvestment),

        monthly_contribution: Number(monthlyContribution),

        drip_percentage: Number(dripPercentage),
      });

      setBackTestData(response.data || null);

      setSymbol(normalized);
    } finally {
      setIsLoading(false);
    }
  }

  const chartRows = backTestData?.chart_rows || [];

  const analytics = backTestData?.analytics || {};

  const summary = backTestData?.summary || {};

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mt-8 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
              ETF Strategy Lab
            </p>

            <h1 className="mt-3 font-display text-5xl font-bold">
              Back Testing
            </h1>

            <p className="mt-4 max-w-3xl text-brand-muted">
              Simulate historical ETF performance using reinvestment, recurring
              contributions, and income strategies to evaluate long-term
              portfolio outcomes.
            </p>
          </div>

          <div className="rounded-3xl border border-brand-outline bg-brand-surfaceHigh px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
              Current Strategy
            </p>

            <p className="mt-2 font-display text-3xl font-bold text-brand-primary">
              {symbol}
            </p>

            <p className="mt-2 text-sm text-brand-muted">
              Historical DRIP simulation with recurring contributions.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
              <LineChart className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold">
                Strategy Inputs
              </h2>

              <p className="text-sm text-brand-muted">
                Configure your historical simulation.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <InputGroup label="ETF Symbol" icon={TrendingUp}>
              <input
                list="etf-options"
                value={symbol}
                onChange={(event) => setSymbol(event.target.value)}
                placeholder="Enter ETF symbol"
                className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-sm font-semibold uppercase text-brand-text outline-none transition focus:border-brand-primary"
              />

              <datalist id="etf-options">
                {etfOptions.map((etf) => (
                  <option key={etf.id} value={etf.symbol}>
                    {etf.symbol}
                  </option>
                ))}
              </datalist>
            </InputGroup>

            {unsupportedSymbol && (
              <div className="rounded-2xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm font-semibold text-brand-danger">
                ETF not currently supported for historical back testing.
              </div>
            )}

            <InputGroup label="Timeframe" icon={CalendarRange}>
              <select
                value={timeframe}
                onChange={(event) => setTimeframe(event.target.value)}
                className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary"
              >
                <option value="1y">1 Year</option>

                <option value="3y">3 Years</option>

                <option value="5y">5 Years</option>

                <option value="10y">10 Years</option>
              </select>
            </InputGroup>

            <InputGroup label="Initial Investment" icon={DollarSign}>
              <input
                value={initialInvestment}
                onChange={(event) => setInitialInvestment(event.target.value)}
                type="number"
                min="0"
                className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary"
              />
            </InputGroup>

            <InputGroup label="Monthly Contribution" icon={RefreshCcw}>
              <input
                value={monthlyContribution}
                onChange={(event) => setMonthlyContribution(event.target.value)}
                type="number"
                min="0"
                className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary"
              />
            </InputGroup>

            <InputGroup label="DRIP Percentage" icon={ShieldCheck}>
              <div>
                <input
                  value={dripPercentage}
                  onChange={(event) => setDripPercentage(event.target.value)}
                  type="range"
                  min="0"
                  max="100"
                  className="w-full"
                />

                <div className="mt-2 flex items-center justify-between text-xs font-semibold text-brand-muted">
                  <span>0%</span>

                  <span>{dripPercentage}% Reinvested</span>

                  <span>100%</span>
                </div>

                <p className="mt-3 text-xs text-brand-muted">
                  Rerun the back test after adjusting DRIP allocation.
                </p>
              </div>
            </InputGroup>

            <button
              type="button"
              onClick={handleRunBacktest}
              disabled={isLoading || isLoadingEtfs}
              className="rocket-button-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-bold disabled:opacity-60"
            >
              <Play className="h-4 w-4" />

              {isLoading ? "Running..." : "Run Back Test"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Final Portfolio Value"
              value={formatCurrency(summary.final_value || 0)}
            />

            <StatCard
              label="Total Return"
              value={`${Number(analytics.total_return_percentage || 0).toFixed(
                2,
              )}%`}
            />

            <StatCard
              label="Projected Monthly Income"
              value={formatCurrency(projectedMonthlyIncome)}
            />

            <StatCard
              label="Max Drawdown"
              value={`${Number(analytics.max_drawdown || 0).toFixed(2)}%`}
              danger
            />
          </section>

          <section className="glass-card rounded-3xl p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  Portfolio Growth Simulation
                </h2>

                <p className="mt-1 text-sm text-brand-muted">
                  Historical compounding with reinvestment and recurring
                  contributions.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Pill
                  label={`CAGR ${Number(analytics.cagr || 0).toFixed(2)}%`}
                />
              </div>
            </div>

            <div className="mt-8 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartRows}>
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

                  <Area
                    type="monotone"
                    dataKey="portfolio_value"
                    fill="currentColor"
                    fillOpacity={0.08}
                    stroke="none"
                    tooltipType="none"
                  />

                  <Line
                    type="monotone"
                    dataKey="portfolio_value"
                    stroke="currentColor"
                    strokeWidth={3}
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function InputGroup({ label, icon: Icon, children }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-primary" />

        <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
          {label}
        </span>
      </div>

      {children}
    </div>
  );
}

function StatCard({ label, value, danger = false }) {
  return (
    <div className="glass-card rounded-3xl p-5">
      <p className="text-sm text-brand-muted">{label}</p>

      <p
        className={`mt-3 font-display text-3xl font-bold ${
          danger ? "text-brand-danger" : "text-brand-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Pill({ label }) {
  return (
    <div className="rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-2 text-sm font-semibold text-brand-muted">
      {label}
    </div>
  );
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function calculateStartDate(timeframe) {
  const now = new Date();

  switch (timeframe) {
    case "1y":
      now.setFullYear(now.getFullYear() - 1);
      break;

    case "3y":
      now.setFullYear(now.getFullYear() - 3);
      break;

    case "5y":
      now.setFullYear(now.getFullYear() - 5);
      break;

    case "10y":
      now.setFullYear(now.getFullYear() - 10);
      break;

    default:
      now.setFullYear(now.getFullYear() - 5);
  }

  return now.toISOString().split("T")[0];
}
