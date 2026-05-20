import { useEffect, useMemo, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BarChart3,
  Calculator,
  CalendarClock,
  DollarSign,
  Rocket,
  Snowflake,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getMissionControl,
  getPortfolioSelects,
} from "../../../../api/missionControl";

const scenarios = {
  conservative: {
    label: "Conservative",
    annualIncomeGrowth: 3,
  },
  base: {
    label: "Base Case",
    annualIncomeGrowth: 6,
  },
  aggressive: {
    label: "Aggressive",
    annualIncomeGrowth: 10,
  },
};

export default function IncomeProjection() {
  const { portfolioId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [portfolioSelects, setPortfolioSelects] = useState({});
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(portfolioId);

  const [startingMonthlyIncome, setStartingMonthlyIncome] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [annualIncomeGrowth, setAnnualIncomeGrowth] = useState(6);
  const [reinvestPercent, setReinvestPercent] = useState(0);
  const [years, setYears] = useState(5);
  const [scenario, setScenario] = useState("base");

  async function loadPortfolioSelects() {
    const response = await getPortfolioSelects();

    setPortfolioSelects(response.data || {});
  }

  async function loadProjectionBase(portfolioIdToLoad = selectedPortfolioId) {
    setIsLoading(true);

    try {
      const response = await getMissionControl(portfolioIdToLoad);

      const snapshot = response.data?.portfolio_snapshot;

      setStartingMonthlyIncome(
        Number(Number(snapshot?.monthly_income || 0).toFixed(2)),
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPortfolioSelects();
  }, []);

  useEffect(() => {
    loadProjectionBase(selectedPortfolioId);
  }, [selectedPortfolioId]);

  function handleScenarioChange(value) {
    setScenario(value);
    setAnnualIncomeGrowth(scenarios[value].annualIncomeGrowth);
  }

  function resetProjectionAssumptions() {
    setMonthlyContribution(0);
    setAnnualIncomeGrowth(6);
    setReinvestPercent(0);
    setYears(5);
    setScenario("base");
  }

  function handlePortfolioChange(event) {
    resetProjectionAssumptions();
    setSelectedPortfolioId(event.target.value);
  }

  const projection = useMemo(() => {
    return buildProjection({
      startingMonthlyIncome,
      monthlyContribution,
      annualIncomeGrowth,
      reinvestPercent,
      years,
    });
  }, [
    startingMonthlyIncome,
    monthlyContribution,
    annualIncomeGrowth,
    reinvestPercent,
    years,
  ]);

  const chartProjection = useMemo(() => {
    return projection.filter((row) => row.monthNumber % 3 === 0);
  }, [projection]);

  const finalMonth = projection[projection.length - 1];

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading income projection...
      </div>
    );
  }

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

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
              Income Projection
            </p>

            <h1 className="mt-3 font-display text-5xl font-bold">
              Dividend Snowball Simulator
            </h1>

            <p className="mt-4 max-w-3xl text-brand-muted">
              Adjust assumptions and project how monthly ETF income could grow
              over time.
            </p>

            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-brand-muted">
              Portfolio ID: {selectedPortfolioId}
            </p>
          </div>

          <div className="rounded-3xl border border-brand-outline bg-brand-surfaceHigh p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary shadow-glow">
                <Rocket className="h-6 w-6" />
              </div>

              <div className="min-w-64">
                <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                  Projection Portfolio
                </p>

                <p className="mt-1 text-sm text-brand-muted">
                  Choose which portfolio income baseline to model.
                </p>

                <select
                  value={selectedPortfolioId}
                  onChange={handlePortfolioChange}
                  className="mt-4 w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary"
                >
                  {Object.entries(portfolioSelects).map(
                    ([portfolioId, portfolioName]) => (
                      <option key={portfolioId} value={portfolioId}>
                        {portfolioName}
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
          icon={Snowflake}
          label="Starting Monthly Income"
          value={formatCurrency(startingMonthlyIncome)}
          detail="Current portfolio income baseline"
        />

        <MetricCard
          icon={TrendingUp}
          label="Projected Monthly Income"
          value={formatCurrency(finalMonth?.monthlyIncome)}
          detail={`After ${years} year${years === 1 ? "" : "s"}`}
        />

        <MetricCard
          icon={DollarSign}
          label="Projected Annual Income"
          value={formatCurrency((finalMonth?.monthlyIncome || 0) * 12)}
          detail="Final month annualized"
        />

        <MetricCard
          icon={CalendarClock}
          label="Total Projected Income"
          value={formatCurrency(finalMonth?.cumulativeIncome)}
          detail="Cumulative income over projection"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="glass-card rounded-3xl p-6 lg:col-span-3">
          <CardTitle
            icon={BarChart3}
            title="Income Projection"
            subtitle="Quarterly checkpoints from the monthly projection"
          />

          <div className="mt-6 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartProjection}
                margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  interval={Math.max(Math.floor(chartProjection.length / 8), 0)}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tickFormatter={(value) =>
                    Number(value).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })
                  }
                />

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

                <Bar
                  dataKey="monthlyIncome"
                  fill="currentColor"
                  radius={[10, 10, 4, 4]}
                  opacity={0.78}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 lg:col-span-2">
          <CardTitle
            icon={Calculator}
            title="Projection Assumptions"
            subtitle="Change the inputs to model different outcomes"
          />

          <div className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-brand-muted">
                Scenario
              </label>

              <select
                value={scenario}
                onChange={(event) => handleScenarioChange(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-5 py-4 font-semibold text-brand-text outline-none transition focus:border-brand-primary"
              >
                {Object.entries(scenarios).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              label="Starting Monthly Income"
              value={startingMonthlyIncome}
              onChange={setStartingMonthlyIncome}
              prefix="$"
            />

            <InputField
              label="Monthly Contribution"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              prefix="$"
            />

            <InputField
              label="Annual Income Growth"
              value={annualIncomeGrowth}
              onChange={setAnnualIncomeGrowth}
              suffix="%"
            />

            <InputField
              label="Monthly Income Reinvested"
              value={reinvestPercent}
              onChange={setReinvestPercent}
              suffix="%"
            />

            <div>
              <label className="block text-sm font-semibold text-brand-muted">
                Projection Length
              </label>

              <select
                value={years}
                onChange={(event) => setYears(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-5 py-4 font-semibold text-brand-text outline-none transition focus:border-brand-primary"
              >
                <option value={1}>1 Year</option>
                <option value={3}>3 Years</option>
                <option value={5}>5 Years</option>
                <option value={10}>10 Years</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <CardTitle
          icon={CalendarClock}
          title="Projection Milestones"
          subtitle="Year-end snapshots from the current scenario"
        />

        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-surfaceHigh text-brand-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Month</th>
                <th className="px-4 py-3 font-semibold">Monthly Income</th>
                <th className="px-4 py-3 font-semibold">Annualized Income</th>
                <th className="px-4 py-3 font-semibold">Cumulative Income</th>
              </tr>
            </thead>

            <tbody>
              {projection
                .filter((row) => row.monthNumber % 12 === 0)
                .map((row) => (
                  <tr
                    key={row.monthNumber}
                    className="border-t border-brand-outline text-brand-muted"
                  >
                    <td className="px-4 py-4 font-semibold text-brand-text">
                      {row.label}
                    </td>

                    <td className="px-4 py-4">
                      {formatCurrency(row.monthlyIncome)}
                    </td>

                    <td className="px-4 py-4">
                      {formatCurrency(row.monthlyIncome * 12)}
                    </td>

                    <td className="px-4 py-4">
                      {formatCurrency(row.cumulativeIncome)}
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

function InputField({ label, value, onChange, prefix = "", suffix = "" }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-muted">
        {label}
      </label>

      <div className="mt-2 flex rounded-2xl border border-brand-outline bg-brand-surfaceHigh focus-within:border-brand-primary">
        {prefix && (
          <span className="flex items-center px-4 font-semibold text-brand-muted">
            {prefix}
          </span>
        )}

        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={(event) =>
            onChange(Number(event.target.value || 0).toFixed(2))
          }
          className="w-full bg-transparent px-5 py-4 font-semibold text-brand-text outline-none"
        />

        {suffix && (
          <span className="flex items-center px-4 font-semibold text-brand-muted">
            {suffix}
          </span>
        )}
      </div>
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

function buildProjection({
  startingMonthlyIncome,
  monthlyContribution,
  annualIncomeGrowth,
  reinvestPercent,
  years,
}) {
  const totalMonths = years * 12;
  const monthlyGrowthRate = Number(annualIncomeGrowth || 0) / 100 / 12;
  const contributionIncomeRate = 0.008;

  const reinvestMonthlyBoost = (Number(reinvestPercent || 0) / 100) * 0.01;

  let monthlyIncome = Number(startingMonthlyIncome || 0);
  let cumulativeIncome = 0;

  return Array.from({ length: totalMonths }, (_, index) => {
    const monthNumber = index + 1;

    monthlyIncome =
      monthlyIncome * (1 + monthlyGrowthRate + reinvestMonthlyBoost) +
      Number(monthlyContribution || 0) * contributionIncomeRate;

    cumulativeIncome += monthlyIncome;

    return {
      monthNumber,
      label: `Month ${monthNumber}`,
      monthlyIncome: Number(monthlyIncome.toFixed(2)),
      cumulativeIncome: Number(cumulativeIncome.toFixed(2)),
    };
  });
}

function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "$0.00";
  }

  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
