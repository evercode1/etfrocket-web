import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  BarChart3,
  Eye,
  EyeOff,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  X,
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

const availableEtfs = [
  {
    symbol: "CHPY",
    fund_name: "YieldMax Semiconductor Portfolio Option Income ETF",
    latest_price: 73.5,
    monthly_income: 2.855,
    nav_health: "Stable",
    aum_flow_percentage: 12.5,
    total_return_percentage_90_day: 24.82,
  },
  {
    symbol: "AMDY",
    fund_name: "YieldMax AMD Option Income Strategy ETF",
    latest_price: 50.43,
    monthly_income: 3.059,
    nav_health: "Stable",
    aum_flow_percentage: 8.3,
    total_return_percentage_90_day: 18.12,
  },
  {
    symbol: "NVII",
    fund_name: "REX NVDA Growth & Income ETF",
    latest_price: 28.58,
    monthly_income: 1.514,
    nav_health: "Mixed",
    aum_flow_percentage: -4.2,
    total_return_percentage_90_day: -6.35,
  },
  {
    symbol: "QQQI",
    fund_name: "NEOS Nasdaq-100 High Income ETF",
    latest_price: 56.14,
    monthly_income: 0.618,
    nav_health: "Unknown",
    aum_flow_percentage: 2.1,
    total_return_percentage_90_day: 9.44,
  },
];

const chartRows = [
  { date: "Jan", CHPY: 48, AMDY: 42, NVII: 35, QQQI: 52 },
  { date: "Feb", CHPY: 52, AMDY: 45, NVII: 33, QQQI: 53 },
  { date: "Mar", CHPY: 58, AMDY: 49, NVII: 31, QQQI: 54 },
  { date: "Apr", CHPY: 64, AMDY: 47, NVII: 29, QQQI: 55 },
  { date: "May", CHPY: 73.5, AMDY: 50.43, NVII: 28.58, QQQI: 56.14 },
];

const chartColors = {
  CHPY: "#4f7cff",
  AMDY: "#9357ff",
  NVII: "#ff8738",
  QQQI: "#00d4ff",
};

export default function CompareSymbols() {
  const [selectedSymbols, setSelectedSymbols] = useState(["CHPY", "AMDY"]);

  const [mutedSymbols, setMutedSymbols] = useState([]);

  const [symbolInput, setSymbolInput] = useState("");

  const [selectedMetric, setSelectedMetric] = useState("price");

  const [selectedRange, setSelectedRange] = useState("90d");

  const selectedEtfs = useMemo(() => {
    return availableEtfs.filter((etf) => selectedSymbols.includes(etf.symbol));
  }, [selectedSymbols]);

  const visibleEtfs = selectedEtfs.filter(
    (etf) => !mutedSymbols.includes(etf.symbol),
  );

  const bestReturn = [...visibleEtfs].sort(
    (a, b) =>
      Number(b.total_return_percentage_90_day || 0) -
      Number(a.total_return_percentage_90_day || 0),
  )[0];

  const strongestNav =
    visibleEtfs.find((etf) => etf.nav_health === "Stable") || visibleEtfs[0];

  function handleAddSymbol() {
    const normalized = symbolInput.trim().toUpperCase();

    if (!normalized || selectedSymbols.includes(normalized)) {
      setSymbolInput("");
      return;
    }

    const exists = availableEtfs.some((etf) => etf.symbol === normalized);

    if (!exists) {
      setSymbolInput("");
      return;
    }

    setSelectedSymbols([...selectedSymbols, normalized]);

    setSymbolInput("");
  }

  function handleRemoveSymbol(symbol) {
    setSelectedSymbols(
      selectedSymbols.filter((selectedSymbol) => selectedSymbol !== symbol),
    );

    setMutedSymbols(mutedSymbols.filter((item) => item !== symbol));
  }

  function toggleMuted(symbol) {
    if (mutedSymbols.includes(symbol)) {
      setMutedSymbols(mutedSymbols.filter((item) => item !== symbol));

      return;
    }

    setMutedSymbols([...mutedSymbols, symbol]);
  }

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <div className="flex flex-col gap-8">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
              ETF Radar
            </p>

            <h1 className="mt-3 font-display text-5xl font-bold">
              Compare Symbols
            </h1>

            <p className="mt-4 max-w-3xl text-brand-muted">
              Compare ETFs directly by symbol before adding them to a portfolio
              or watchlist.
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />

                <input
                  value={symbolInput}
                  onChange={(event) => setSymbolInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleAddSymbol();
                    }
                  }}
                  placeholder="Add symbol..."
                  className="h-14 w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh pl-11 pr-4 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary sm:w-64"
                />
              </div>

              <button
                type="button"
                onClick={handleAddSymbol}
                className="rocket-button-primary inline-flex h-14 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold"
              >
                <Plus className="h-4 w-4" />
                Add Symbol
              </button>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <MetricCard
          icon={BarChart3}
          label="Compared Symbols"
          value={visibleEtfs.length}
          detail={
            visibleEtfs.map((etf) => etf.symbol).join(", ") ||
            "No visible symbols"
          }
        />

        <MetricCard
          icon={TrendingUp}
          label="Best 90D Return"
          value={bestReturn?.symbol || "—"}
          detail={formatPercent(bestReturn?.total_return_percentage_90_day)}
        />

        <MetricCard
          icon={ShieldCheck}
          label="Strongest NAV"
          value={strongestNav?.symbol || "—"}
          detail={strongestNav?.nav_health || "Unknown"}
        />
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Symbol Trend Comparison
            </h2>

            <p className="mt-1 text-sm text-brand-muted">
              Mock trend view for validating layout before wiring the API.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {selectedEtfs.map((etf) => (
                <div
                  key={etf.symbol}
                  className={`inline-flex items-center gap-3 rounded-full border border-brand-outline bg-brand-surfaceHigh px-4 py-2 text-sm font-semibold transition ${
                    mutedSymbols.includes(etf.symbol)
                      ? "opacity-40"
                      : "text-brand-text"
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: chartColors[etf.symbol],
                    }}
                  />

                  <span>{etf.symbol}</span>

                  <button
                    type="button"
                    onClick={() => toggleMuted(etf.symbol)}
                    className="transition hover:text-brand-primary"
                  >
                    {mutedSymbols.includes(etf.symbol) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveSymbol(etf.symbol)}
                    className="transition hover:text-brand-danger"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(220px,1fr)]">
            <label>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                Metric to Compare
              </span>

              <select
                value={selectedMetric}
                onChange={(event) => setSelectedMetric(event.target.value)}
                className="mt-2 w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary"
              >
                <option value="price" className="bg-brand-surface">
                  Price
                </option>

                <option value="income" className="bg-brand-surface">
                  Monthly Income
                </option>

                <option value="return" className="bg-brand-surface">
                  Total Return
                </option>

                <option value="aum" className="bg-brand-surface">
                  AUM Flow
                </option>
              </select>
            </label>

            <div className="mt-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                Time Range
              </span>

              <div className="mt-2 flex overflow-hidden rounded-xl border border-brand-outline bg-brand-surfaceHigh">
                {[
                  { label: "5D", value: "5d" },
                  { label: "30D", value: "30d" },
                  { label: "90D", value: "90d" },
                  { label: "1Y", value: "1y" },
                  { label: "MAX", value: "max" },
                ].map((range) => (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => setSelectedRange(range.value)}
                    className={`px-4 py-3 text-xs font-bold transition ${
                      selectedRange === range.value
                        ? "bg-brand-primary/20 text-brand-primary"
                        : "text-brand-muted hover:text-brand-primary"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartRows} margin={{ top: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis dataKey="date" tick={{ fontSize: 12 }} />

              <YAxis tick={{ fontSize: 12 }} />

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
              />

              {visibleEtfs.map((etf) => (
                <Line
                  key={etf.symbol}
                  type="monotone"
                  dataKey={etf.symbol}
                  stroke={chartColors[etf.symbol]}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div>
          <h2 className="font-display text-2xl font-bold">
            Symbol Comparison Table
          </h2>

          <p className="mt-1 text-sm text-brand-muted">
            Static comparison rows for UI validation.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-surfaceHigh text-brand-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">ETF</th>
                <th className="px-4 py-3 font-semibold">Fund</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Monthly Income</th>
                <th className="px-4 py-3 font-semibold">NAV Health</th>
                <th className="px-4 py-3 font-semibold">AUM Flow</th>
                <th className="px-4 py-3 font-semibold">90D Return</th>
              </tr>
            </thead>

            <tbody>
              {visibleEtfs.map((etf) => (
                <tr
                  key={etf.symbol}
                  className="border-t border-brand-outline text-brand-muted"
                >
                  <td className="px-4 py-4 font-display text-xl font-bold text-brand-primary">
                    {etf.symbol}
                  </td>

                  <td className="px-4 py-4">{etf.fund_name}</td>

                  <td className="px-4 py-4 font-semibold text-brand-text">
                    {formatCurrency(etf.latest_price)}
                  </td>

                  <td className="px-4 py-4">
                    {formatCurrency(etf.monthly_income)}
                  </td>

                  <td className="px-4 py-4">{etf.nav_health}</td>

                  <td className="px-4 py-4">
                    {formatPercent(etf.aum_flow_percentage)}
                  </td>

                  <td className="px-4 py-4">
                    {formatPercent(etf.total_return_percentage_90_day)}
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

function formatCurrency(value) {
  if (value === null || value === undefined) {
    return "—";
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
