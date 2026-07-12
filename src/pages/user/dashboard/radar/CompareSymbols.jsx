import { useEffect, useMemo, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import SecuritySymbol from "../../../../components/ui/SecuritySymbol";

import {
  AlertTriangle,
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

import { getCompareSymbols } from "../../../../api/comparisons";

const chartColors = [
  "#4f7cff",

  "#9357ff",

  "#ff8738",

  "#00d4ff",

  "#22c55e",

  "#f43f5e",
];

export default function CompareSymbols() {
  const [searchParams] = useSearchParams();

  const startingSymbol = searchParams.get("symbol");

  const [selectedSymbols, setSelectedSymbols] = useState([]);

  useEffect(() => {
    if (startingSymbol && !selectedSymbols.includes(startingSymbol)) {
      setSelectedSymbols([startingSymbol.toUpperCase()]);
    }
  }, [startingSymbol]);

  const [mutedSymbols, setMutedSymbols] = useState([]);

  const [symbolInput, setSymbolInput] = useState("");

  const [selectedMetric, setSelectedMetric] = useState("price");

  const [selectedRange, setSelectedRange] = useState("90d");

  const [comparisonData, setComparisonData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [dismissedInvalidSymbols, setDismissedInvalidSymbols] = useState([]);

  const [maxSymbolsWarning, setMaxSymbolsWarning] = useState(false);

  const MAX_SYMBOLS = 10;

  async function loadComparisonData() {
    if (selectedSymbols.length === 0) {
      setComparisonData(null);

      return;
    }

    setIsLoading(true);

    try {
      const response = await getCompareSymbols(
        selectedSymbols,

        {
          metric: selectedMetric,

          range: selectedRange,
        },
      );

      const data = response.data || null;

      setComparisonData(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadComparisonData();
  }, [selectedSymbols, selectedMetric, selectedRange]);

  const summary = comparisonData?.summary || {};

  const tableRows = comparisonData?.table_rows || [];

  const chartRows = comparisonData?.chart_rows || [];

  const metricOptions = comparisonData?.options?.metrics || [];

  const rangeOptions = comparisonData?.options?.ranges || [];

  const invalidSymbols = (comparisonData?.invalid_symbols || []).filter(
    (symbol) => !dismissedInvalidSymbols.includes(symbol),
  );

  const visibleRows = useMemo(() => {
    return tableRows.filter((row) => !mutedSymbols.includes(row.symbol));
  }, [tableRows, mutedSymbols]);

  const bestReturn = [...visibleRows].sort(
    (a, b) =>
      Number(b.total_return_percentage || 0) -
      Number(a.total_return_percentage || 0),
  )[0];

  const strongestNav =
    visibleRows.find((row) => row.nav_health === "Stable") || visibleRows[0];

  function handleAddSymbol() {
    const normalized = symbolInput

      .trim()

      .toUpperCase();

    if (!normalized || selectedSymbols.includes(normalized)) {
      setSymbolInput("");

      return;
    }

    if (selectedSymbols.length >= MAX_SYMBOLS) {
      setMaxSymbolsWarning(true);

      return;
    }

    setMaxSymbolsWarning(false);

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

      {invalidSymbols.length > 0 && (
        <div className="glass-card rounded-3xl border border-amber-400/30 bg-amber-400/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />

              <div>
                <p className="font-semibold text-amber-200">
                  Some symbols could not be found
                </p>

                <p className="mt-1 text-sm text-amber-100">
                  {invalidSymbols.join(", ")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setDismissedInvalidSymbols([
                  ...dismissedInvalidSymbols,

                  ...invalidSymbols,
                ])
              }
              className="text-amber-200 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {maxSymbolsWarning && (
        <div className="glass-card rounded-3xl border border-brand-danger/30 bg-brand-danger/10 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-brand-danger">
                Maximum symbol limit reached
              </p>

              <p className="mt-1 text-sm text-brand-muted">
                You can compare up to {MAX_SYMBOLS} symbols at a time.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMaxSymbolsWarning(false)}
              className="text-brand-danger transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <section className="grid gap-5 md:grid-cols-3">
        <MetricCard
          icon={BarChart3}
          label="Compared Symbols"
          value={summary.compared_securities_count || 0}
          detail={
            visibleRows

              .map((row) => row.symbol)

              .join(", ") || "No visible symbols"
          }
        />

        <MetricCard
          icon={TrendingUp}
          label="Best Return"
          value={
            bestReturn?.symbol ? (
              <SecuritySymbol symbol={bestReturn.symbol} />
            ) : (
              "—"
            )
          }
          detail={formatPercent(bestReturn?.total_return_percentage)}
        />

        <MetricCard
          icon={ShieldCheck}
          label="Strongest NAV"
          value={
            strongestNav?.symbol ? (
              <SecuritySymbol symbol={strongestNav.symbol} />
            ) : (
              "—"
            )
          }
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
              Compare symbol performance across multiple metrics and time
              ranges.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {tableRows.map((row, index) => (
                <div
                  key={row.symbol}
                  className={`inline-flex items-center gap-3 rounded-full border border-brand-outline bg-brand-surfaceHigh px-4 py-2 text-sm font-semibold transition ${
                    mutedSymbols.includes(row.symbol)
                      ? "opacity-40"
                      : "text-brand-text"
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: chartColors[index % chartColors.length],
                    }}
                  />

                  <span>{row.symbol}</span>

                  <button
                    type="button"
                    onClick={() => toggleMuted(row.symbol)}
                    className="transition hover:text-brand-primary"
                  >
                    {mutedSymbols.includes(row.symbol) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveSymbol(row.symbol)}
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
                {metricOptions.map((metric) => (
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

            <div className="mt-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                Time Range
              </span>

              <div className="mt-2 flex overflow-hidden rounded-xl border border-brand-outline bg-brand-surfaceHigh">
                {rangeOptions.map((range) => (
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
          {selectedSymbols.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-brand-outline bg-brand-surfaceHigh text-sm text-brand-muted">
              Add ETF symbols to begin comparison.
            </div>
          ) : isLoading ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-brand-outline bg-brand-surfaceHigh text-sm text-brand-muted">
              Loading chart data...
            </div>
          ) : chartRows.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-brand-outline bg-brand-surfaceHigh text-sm text-brand-muted">
              Chart history is not available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartRows}
                margin={{
                  top: 10,

                  right: 20,
                }}
              >
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
                  formatter={(value, name) => [
                    formatValue(value, selectedMetric),

                    name,
                  ]}
                />

                {visibleRows.map((row, index) => (
                  <Line
                    key={row.symbol}
                    type="monotone"
                    dataKey={row.symbol}
                    stroke={chartColors[index % chartColors.length]}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div>
          <h2 className="font-display text-2xl font-bold">
            Symbol Comparison Table
          </h2>

          <p className="mt-1 text-sm text-brand-muted">
            ETF comparison metrics across selected symbols.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-surfaceHigh text-brand-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">ETF</th>

                <th className="px-4 py-3 font-semibold">Fund</th>

                <th className="px-4 py-3 font-semibold">Price</th>

                <th className="px-4 py-3 font-semibold">NAV Health</th>

                <th className="px-4 py-3 font-semibold">AUM Flow</th>

                <th className="px-4 py-3 font-semibold">Total Return</th>

                <th className="px-4 py-3 font-semibold">Chart Value</th>
              </tr>
            </thead>

            <tbody>
              {visibleRows.map((row) => (
                <tr
                  key={row.symbol}
                  className="border-t border-brand-outline text-brand-muted"
                >
                  <td className="px-4 py-4 font-display text-xl font-bold text-brand-primary">
                    <SecuritySymbol symbol={row.symbol} />
                  </td>

                  <td className="px-4 py-4">{row.security_name}</td>

                  <td className="px-4 py-4 font-semibold text-brand-text">
                    {formatCurrency(row.latest_price)}
                  </td>

                  <td className="px-4 py-4">{row.nav_health}</td>

                  <td className="px-4 py-4">
                    {formatPercent(row.aum_change_percentage)}
                  </td>

                  <td className="px-4 py-4">
                    {formatPercent(row.total_return_percentage)}
                  </td>

                  <td className="px-4 py-4 font-semibold text-brand-text">
                    {formatValue(
                      row.chart_value,

                      selectedMetric,
                    )}
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

function MetricCard({
  icon: Icon,

  label,

  value,

  detail,
}) {
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

  return Number(value).toLocaleString(
    "en-US",

    {
      style: "currency",

      currency: "USD",
    },
  );
}

function formatPercent(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${Number(value).toFixed(2)}%`;
}

function formatValue(value, metric) {
  if (value === null || value === undefined) {
    return "—";
  }

  switch (metric) {
    case "price":
      return formatCurrency(value);

    case "dividend":
      return formatCurrency(value);

    case "aum":
      return formatAum(value);

    default:
      return formatPercent(value);
  }
}

function formatAum(value) {
  const number = Number(value);

  if (number >= 1_000_000_000_000) {
    return `${(number / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(2)}B`;
  }

  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1)}M`;
  }

  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(0)}K`;
  }

  return number.toLocaleString("en-US");
}
