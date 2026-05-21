import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ChevronDown,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const mockPortfolioSelects = {
  1: "Main Portfolio",
  2: "Income Rocket",
  3: "Test Portfolio",
};

const comparisonMetrics = [
  { label: "Price", value: "price" },
  { label: "Price Change (%)", value: "priceChange" },
  { label: "NAV Change (%)", value: "navChange" },
  { label: "AUM Flow (%)", value: "aumFlow" },
  { label: "Total Return (%)", value: "totalReturn" },
];

const ranges = ["1M", "3M", "6M", "1Y", "YTD", "MAX"];

const holdings = [
  {
    symbol: "NVII",
    color: "#4f7cff",
    income: "$814.22",
    forwardYield: "41.37%",
    nav: "Mixed",
    aum: "+18.4%",
    totalReturn30: "+5.2%",
    totalReturn90: "+12.8%",
  },
  {
    symbol: "CHPY",
    color: "#9357ff",
    income: "$623.10",
    forwardYield: "38.92%",
    nav: "Stable",
    aum: "+24.6%",
    totalReturn30: "+8.1%",
    totalReturn90: "+19.4%",
  },
  {
    symbol: "AMDY",
    color: "#ff8738",
    income: "$511.88",
    forwardYield: "52.14%",
    nav: "Watch",
    aum: "-6.2%",
    totalReturn30: "-1.7%",
    totalReturn90: "-4.1%",
  },
];

const chartData = [
  { date: "Apr 14", NVII: -1.5, CHPY: -0.5, AMDY: -4.8 },
  { date: "Apr 21", NVII: 2.2, CHPY: 4.8, AMDY: -8.5 },
  { date: "Apr 28", NVII: 4.4, CHPY: 9.1, AMDY: -9.8 },
  { date: "May 05", NVII: 7.6, CHPY: 16.2, AMDY: -7.1 },
  { date: "May 12", NVII: 6.8, CHPY: 15.5, AMDY: -8.3 },
  { date: "May 19", NVII: 7.4, CHPY: 17.2, AMDY: -9.6 },
  { date: "May 26", NVII: 6.1, CHPY: 16.5, AMDY: -6.2 },
  { date: "Jun 02", NVII: 6.4, CHPY: 18.8, AMDY: -5.5 },
  { date: "Jun 09", NVII: 7.9, CHPY: 18.2, AMDY: -6.4 },
  { date: "Jun 16", NVII: 10.1, CHPY: 21.0, AMDY: -5.8 },
  { date: "Jun 23", NVII: 9.7, CHPY: 20.4, AMDY: -3.2 },
  { date: "Jun 30", NVII: 10.2, CHPY: 21.2, AMDY: -5.1 },
  { date: "Jul 07", NVII: 12.8, CHPY: 19.4, AMDY: -4.1 },
];

export default function PortfolioCompare() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();

  const [selectedMetric, setSelectedMetric] = useState("totalReturn");
  const [selectedRange, setSelectedRange] = useState("3M");

  const activePortfolioName =
    mockPortfolioSelects[portfolioId] || "Main Portfolio";

  function handlePortfolioChange(nextPortfolioId) {
    navigate(`/dashboard/radar/portfolio-compare/${nextPortfolioId}`);
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

        <p className="mt-8 font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          ETF Radar
        </p>

        <h1 className="mt-3 font-display text-5xl font-bold">
          Compare My ETFs
        </h1>

        <p className="mt-4 max-w-3xl text-brand-muted">
          Compare ETFs currently held in this portfolio across income, yield,
          NAV stability, AUM flow, and total return.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <MetricCard
          icon={BarChart3}
          label="Compared ETFs"
          value={holdings.length}
          detail={
            <PortfolioSelector
              value={String(portfolioId || 1)}
              portfolios={mockPortfolioSelects}
              onChange={handlePortfolioChange}
            />
          }
        />

        <MetricCard
          icon={TrendingUp}
          label="Highest Yield"
          value="AMDY"
          detail="52.14% estimated forward yield"
        />

        <MetricCard
          icon={ShieldCheck}
          label="Strongest NAV"
          value="CHPY"
          detail="Best current stability score"
        />
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Trend Comparison
            </h2>

            <p className="mt-1 text-sm text-brand-muted">
              See how your ETFs have performed over time for the selected
              metric.
            </p>

            <div className="mt-6 flex flex-wrap gap-5">
              {holdings.map((holding) => (
                <div
                  key={holding.symbol}
                  className="flex items-center gap-2 text-sm font-semibold text-brand-text"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: holding.color }}
                  />
                  <span>{holding.symbol}</span>
                  <span className="text-brand-muted">
                    {holding.totalReturn90}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_auto]">
            <label>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                Metric to Compare
              </span>

              <select
                value={selectedMetric}
                onChange={(event) => setSelectedMetric(event.target.value)}
                className="mt-2 w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary"
              >
                {comparisonMetrics.map((metric) => (
                  <option
                    key={metric.value}
                    value={metric.value}
                    className="bg-brand-surface text-brand-text"
                  >
                    {metric.label}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                Range
              </span>

              <div className="mt-2 flex overflow-hidden rounded-xl border border-brand-outline bg-brand-surfaceHigh">
                {ranges.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setSelectedRange(range)}
                    className={`px-4 py-3 text-xs font-bold transition ${
                      selectedRange === range
                        ? "bg-brand-primary/20 text-brand-primary"
                        : "text-brand-muted hover:text-brand-primary"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 h-80 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis dataKey="date" tick={{ fontSize: 12 }} />

              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#131c35",
                  border: "1px solid rgba(94, 234, 212, 0.2)",
                  borderRadius: "16px",
                  color: "#f8fafc",
                }}
                labelStyle={{
                  color: "#f8fafc",
                  fontWeight: 600,
                }}
                itemStyle={{
                  color: "#f8fafc",
                }}
                formatter={(value) => `${Number(value).toFixed(2)}%`}
              />

              {holdings.map((holding) => (
                <Line
                  key={holding.symbol}
                  type="monotone"
                  dataKey={holding.symbol}
                  stroke={holding.color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div>
          <h2 className="font-display text-2xl font-bold">
            Holdings Comparison
          </h2>

          <p className="mt-1 text-sm text-brand-muted">
            Mock layout for portfolio ETF comparison. Data will be wired from
            Laravel next.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-surfaceHigh text-brand-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">ETF</th>
                <th className="px-4 py-3 font-semibold">Monthly Income</th>
                <th className="px-4 py-3 font-semibold">Forward Yield</th>
                <th className="px-4 py-3 font-semibold">NAV Stability</th>
                <th className="px-4 py-3 font-semibold">AUM Flow</th>
                <th className="px-4 py-3 font-semibold">Total Return 30D</th>
                <th className="px-4 py-3 font-semibold">Total Return 90D</th>
              </tr>
            </thead>

            <tbody>
              {holdings.map((holding) => (
                <tr
                  key={holding.symbol}
                  className="border-t border-brand-outline text-brand-muted"
                >
                  <td className="px-4 py-4 font-display text-xl font-bold text-brand-primary">
                    <span
                      className="mr-2 inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: holding.color }}
                    />
                    {holding.symbol}
                  </td>

                  <td className="px-4 py-4 font-semibold text-brand-text">
                    {holding.income}
                  </td>

                  <td className="px-4 py-4">{holding.forwardYield}</td>
                  <td className="px-4 py-4">{holding.nav}</td>
                  <td className="px-4 py-4">{holding.aum}</td>
                  <td className="px-4 py-4">{holding.totalReturn30}</td>
                  <td className="px-4 py-4">{holding.totalReturn90}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-brand-muted">
          Mock data for UI demonstration. Real comparison data will come from
          Laravel.
        </p>
      </section>
    </div>
  );
}

function PortfolioSelector({ value, portfolios, onChange }) {
  return (
    <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-brand-outline bg-brand-surfaceHigh px-3 py-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
        Portfolio
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-sm font-semibold text-brand-text outline-none"
      >
        {Object.entries(portfolios).map(([id, name]) => (
          <option
            key={id}
            value={id}
            className="bg-brand-surface text-brand-text"
          >
            {name}
          </option>
        ))}
      </select>

      <ChevronDown className="h-4 w-4 text-brand-muted" />
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

      <p className="mt-2 font-display text-4xl font-bold">{value}</p>

      <div className="mt-2 text-sm text-brand-muted">{detail}</div>
    </div>
  );
}
