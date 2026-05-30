import { useMemo, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BarChart3,
  DollarSign,
  LineChart,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function SymbolDetails() {
  const { symbol } = useParams();

  const [selectedMetric, setSelectedMetric] = useState("price");

  const [selectedRange, setSelectedRange] = useState("1y");

  const data = useMemo(() => buildMockData(symbol), [symbol]);

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <Link
          to="/dashboard/radar/compare-symbols"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Compare Symbols
        </Link>

        <div className="mt-8 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
              Symbol Details
            </p>

            <h1 className="mt-3 font-display text-6xl font-bold text-brand-primary">
              {data.security.symbol}
            </h1>

            <p className="mt-3 text-xl text-brand-text">
              {data.security.security_name}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Pill label={data.security.security_type} />
              <Pill label={data.security.issuer} />
              <Pill label={data.security.frequency} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to={`/dashboard/radar/compare-symbols`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Compare This ETF
            </Link>

            <a
              href={`https://finance.yahoo.com/quote/${data.security.symbol}/`}
              target="_blank"
              rel="noreferrer"
              className="rocket-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
            >
              <ExternalLink className="h-4 w-4" />
              View Live Data
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={DollarSign}
          label="Current Price"
          value={`$${data.metrics.current_price}`}
        />

        <MetricCard
          icon={TrendingUp}
          label="Forward Yield"
          value={`${data.metrics.forward_yield}%`}
        />

        <MetricCard
          icon={ShieldCheck}
          label="NAV Health"
          value={data.metrics.nav_health}
        />

        <MetricCard
          icon={LineChart}
          label="AUM Flow"
          value={`${data.metrics.aum_flow}%`}
        />
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Historical Trends
            </h2>

            <p className="mt-1 text-sm text-brand-muted">
              Explore price, NAV, dividend, and AUM history.
            </p>
          </div>

          <div className="grid gap-4">
            <select
              value={selectedMetric}
              onChange={(event) => setSelectedMetric(event.target.value)}
              className="rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm font-semibold text-brand-text"
            >
              <option value="price">Price</option>

              <option value="nav">NAV</option>

              <option value="aum">AUM</option>

              <option value="dividend">Dividend</option>
            </select>

            <div className="flex overflow-hidden rounded-xl border border-brand-outline bg-brand-surfaceHigh">
              {["30d", "90d", "1y", "3y", "max"].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`px-4 py-3 text-xs font-bold transition ${
                    selectedRange === range
                      ? "bg-brand-primary/20 text-brand-primary"
                      : "text-brand-muted"
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data.chart_rows}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="currentColor"
                strokeWidth={3}
                dot={false}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {data.signals.map((signal) => (
          <SignalCard key={signal.title} signal={signal} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-2xl font-bold">
            Distribution History
          </h2>

          <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-surfaceHigh">
                <tr>
                  <th className="px-4 py-3">Dividend</th>
                  <th className="px-4 py-3">Ex Date</th>
                  <th className="px-4 py-3">Pay Date</th>
                </tr>
              </thead>

              <tbody>
                {data.dividend_history.map((row) => (
                  <tr
                    key={row.ex_date}
                    className="border-t border-brand-outline"
                  >
                    <td className="px-4 py-4">${row.dividend}</td>

                    <td className="px-4 py-4">{row.ex_date}</td>

                    <td className="px-4 py-4">{row.pay_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-2xl font-bold">ETF Details</h2>

          <div className="mt-6 space-y-4">
            <DetailRow label="Issuer" value={data.security.issuer} />

            <DetailRow label="Frequency" value={data.security.frequency} />

            <DetailRow
              label="Expense Ratio"
              value={`${data.security.expense_ratio}%`}
            />

            <DetailRow label="Sector" value={data.security.sector} />

            <DetailRow label="Website" value={data.security.website} />
          </div>
        </div>
      </section>
    </div>
  );
}

function buildMockData(symbol) {
  return {
    security: {
      symbol: symbol || "ABNY",
      security_name: "YieldMax ABNB Option Income Strategy ETF",
      security_type: "ETF",
      issuer: "YieldMax",
      frequency: "Weekly",
      expense_ratio: 0.99,
      sector: "Technology",
      website: "yieldmaxetfs.com",
    },

    metrics: {
      current_price: 39.76,
      forward_yield: 42.15,
      nav_health: "Stable",
      aum_flow: 6.72,
    },

    chart_rows: Array.from({ length: 24 }, (_, i) => ({
      date: `M${i + 1}`,
      price: 30 + i * 0.5,
      nav: 28 + i * 0.4,
      aum: 100 + i * 10,
      dividend: 0.25 + i * 0.01,
    })),

    signals: [
      {
        title: "Distribution Growth",
        observation: "Recent payouts increased.",
      },
      {
        title: "Weekly Cadence",
        observation: "Weekly schedule appears stable.",
      },
      {
        title: "Income Stability",
        observation: "Income variance remains healthy.",
      },
    ],

    dividend_history: [
      {
        dividend: 0.42,
        ex_date: "2026-05-23",
        pay_date: "2026-05-30",
      },
      {
        dividend: 0.39,
        ex_date: "2026-05-16",
        pay_date: "2026-05-23",
      },
    ],
  };
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-5 text-sm text-brand-muted">{label}</p>

      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

function SignalCard({ signal }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <h3 className="font-display text-xl font-bold">{signal.title}</h3>

      <p className="mt-3 text-brand-muted">{signal.observation}</p>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-brand-outline pb-3">
      <span className="text-brand-muted">{label}</span>

      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Pill({ label }) {
  return (
    <span className="rounded-full border border-brand-outline bg-brand-surfaceHigh px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-primary">
      {label}
    </span>
  );
}
