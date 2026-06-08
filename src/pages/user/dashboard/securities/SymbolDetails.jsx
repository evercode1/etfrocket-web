import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { getSecurityDetails } from "../../../../api/securities";

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

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const today = new Date();

        const rangeConfig = {
          "30d": {
            performanceRangeTypeId: 2,
            startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          },

          "90d": {
            performanceRangeTypeId: 3,
            startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          },

          YTD: {
            performanceRangeTypeId: 4,
            startDate: `${today.getFullYear()}-01-01`,
          },

          "1y": {
            performanceRangeTypeId: 5,
            startDate: new Date(
              today.getFullYear() - 1,
              today.getMonth(),
              today.getDate(),
            )
              .toISOString()
              .split("T")[0],
          },

          max: {
            performanceRangeTypeId: 6,
            startDate: "1900-01-01",
          },
        };

        const config = rangeConfig[selectedRange];

        const response = await getSecurityDetails(
          symbol,
          config.performanceRangeTypeId,
          config.startDate,
        );

        setData(response.data);
      } catch (error) {
        console.error("Failed to load security details", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [symbol, selectedRange]);

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-8">
        Loading security details...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-card rounded-3xl p-8">
        Unable to load security details.
      </div>
    );
  }

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
              <Pill
                label={data.security.security_type_name || "Unknown Type"}
              />

              <Pill label={data.security.issuer_name || "Unknown Issuer"} />

              <Pill
                label={
                  data.security.distribution_frequency_name ||
                  "Unknown Frequency"
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to={`/dashboard/radar/compare-symbols?symbol=${data.security.symbol}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Compare This ETF
            </Link>

            <a
              href={data.security.yahoo_finance_url}
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
          label="Last Close Price"
          value={`$${data.metrics.current_price ?? "-"}`}
        />

        <MetricCard
          icon={TrendingUp}
          label="Total Return"
          value={`${data.metrics.total_return ?? "-"}%`}
        />

        <MetricCard
          icon={ShieldCheck}
          label="NAV Health"
          value={data.metrics.nav_health ?? "-"}
        />

        <MetricCard
          icon={LineChart}
          label="AUM Flow"
          value={`${data.metrics.aum_flow ?? "-"}%`}
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
              {["30d", "90d", "YTD", "1y", "max"].map((range) => (
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
            <RechartsLineChart data={data.chart_rows || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
                connectNulls
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <SignalCard
          signal={{
            title: "Distribution Growth",
            observation: data.signals?.distribution_growth?.label ?? "No Data",
          }}
        />

        <SignalCard
          signal={{
            title: "AUM Growth",
            observation: data.signals?.aum_growth?.label ?? "No Data",
          }}
        />

        <SignalCard
          signal={{
            title: "NAV Stability",
            observation: data.signals?.nav_stability?.label ?? "No Data",
          }}
        />
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
                {(data.dividend_history || []).map((row) => (
                  <tr key={row.id} className="border-t border-brand-outline">
                    <td className="px-4 py-4">${row.dividend_amount}</td>

                    <td className="px-4 py-4">{row.ex_dividend_date}</td>

                    <td className="px-4 py-4">{row.payment_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-2xl font-bold">ETF Details</h2>

          <div className="mt-6 space-y-4">
            <DetailRow
              label="Issuer"
              value={data.security.issuer_name || "-"}
            />

            <DetailRow
              label="Frequency"
              value={data.security.distribution_frequency_name || "-"}
            />

            <DetailRow
              label="Expense Ratio"
              value={
                data.security.expense_ratio
                  ? `${data.security.expense_ratio}%`
                  : "-"
              }
            />

            <div className="flex justify-between border-b border-brand-outline pb-3">
              <span className="text-brand-muted">Website</span>

              <a
                href={data.security.website_url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-brand-primary"
              >
                Visit
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
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
