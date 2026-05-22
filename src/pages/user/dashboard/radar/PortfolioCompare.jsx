import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  BarChart3,
  Eye,
  Settings,
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

import { getPortfolioCompare } from "../../../../api/comparisons";
import { setStoredPortfolioId } from "../../../../utils/portfolioContext";

const chartColors = [
  "#4f7cff",
  "#9357ff",
  "#ff8738",
  "#00d4ff",
  "#22c55e",
  "#f43f5e",
];

export default function PortfolioCompare() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [comparisonData, setComparisonData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("price");
  const [selectedRange, setSelectedRange] = useState("1y");
  const comparisonLimit = comparisonData?.comparison_limit || {};

  async function loadPortfolioCompare() {
    if (!portfolioId) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await getPortfolioCompare(portfolioId, {
        metric: selectedMetric,
        range: selectedRange,
      });

      setComparisonData(response.data || null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (portfolioId) {
      setStoredPortfolioId(portfolioId);
    }

    loadPortfolioCompare();
  }, [portfolioId, selectedMetric, selectedRange]);

  const portfolio = comparisonData?.portfolio || {};
  const portfolioSelects = comparisonData?.portfolio_selects || {};
  const summary = comparisonData?.summary || {};
  const metricOptions = comparisonData?.options?.metrics || [];
  const rangeOptions = comparisonData?.options?.ranges || [];
  const tableRows = comparisonData?.table_rows || [];
  const chartRows = comparisonData?.chart_rows || [];

  function handlePortfolioChange(nextPortfolioId) {
    setStoredPortfolioId(nextPortfolioId);

    navigate(`/dashboard/radar/portfolio-compare/${nextPortfolioId}`);
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading portfolio comparison...
      </div>
    );
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
              Compare My ETFs
            </h1>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center"></div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <PortfolioSelector
                value={String(portfolio.id || portfolioId || "")}
                portfolios={portfolioSelects}
                onChange={handlePortfolioChange}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <MetricCard
          icon={BarChart3}
          label="Compared ETFs"
          value={summary.compared_etfs_count || 0}
          detail="ETFs included in this comparison"
        />

        <MetricCard
          icon={TrendingUp}
          label="Best 90D Return"
          value={summary.best_total_return_symbol || "—"}
          detail={formatPercent(summary.best_total_return_percentage)}
        />

        <MetricCard
          icon={ShieldCheck}
          label="Strongest NAV"
          value={summary.strongest_nav_symbol || "—"}
          detail={formatPercent(summary.strongest_nav_change_percentage)}
        />
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Trend Comparison
            </h2>

            <p className="mt-1 text-sm text-brand-muted">
              See how your top ETFs compare over time for the selected metric.
            </p>

            {comparisonLimit.total_holdings_count >
              comparisonLimit.included_holdings_count && (
              <div className="mt-4 rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm text-brand-muted">
                Showing top {comparisonLimit.included_holdings_count} of{" "}
                {comparisonLimit.total_holdings_count} ETFs by current market
                value.
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-5">
              {tableRows.map((row, index) => (
                <div
                  key={row.symbol}
                  className="flex items-center gap-2 text-sm font-semibold text-brand-text"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: chartColors[index % chartColors.length],
                    }}
                  />

                  <span>{row.symbol}</span>

                  <span className="text-brand-muted">
                    {formatPercent(row.total_return_percentage_90_day)}
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

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                Range
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

        <div className="mt-8 h-80 min-w-0">
          {chartRows.length > 0 && tableRows.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartRows} margin={{ top: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

                <XAxis dataKey="date" tick={{ fontSize: 12 }} />

                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    formatChartAxisValue(value, selectedMetric)
                  }
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
                  formatter={(value) => formatChartTooltipValue(value)}
                />

                {tableRows.map((row, index) => (
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
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-brand-outline bg-brand-surfaceHigh text-sm text-brand-muted">
              Comparison chart data will appear once metric history is
              available.
            </div>
          )}
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div>
          <h2 className="font-display text-2xl font-bold">
            Holdings Comparison
          </h2>

          <p className="mt-1 text-sm text-brand-muted">
            Portfolio ETFs compared across current holdings, price, NAV, AUM,
            and total return metrics.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-surfaceHigh text-brand-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">ETF</th>
                <th className="px-4 py-3 font-semibold">Shares</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Market Value</th>
                <th className="px-4 py-3 font-semibold">Monthly Income</th>
                <th className="px-4 py-3 font-semibold">NAV Stability</th>
                <th className="px-4 py-3 font-semibold">AUM Flow 30D</th>
                <th className="px-4 py-3 font-semibold">Total Return 90D</th>
              </tr>
            </thead>

            <tbody>
              {tableRows.map((row, index) => (
                <tr
                  key={row.etf_id}
                  className="border-t border-brand-outline text-brand-muted"
                >
                  <td className="px-4 py-4 font-display text-xl font-bold text-brand-primary">
                    <span
                      className="mr-2 inline-block h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                    />
                    {row.symbol}
                  </td>

                  <td className="px-4 py-4">{formatNumber(row.shares)}</td>

                  <td className="px-4 py-4 font-semibold text-brand-text">
                    {formatCurrency(row.latest_price)}
                  </td>

                  <td className="px-4 py-4">
                    {formatCurrency(row.market_value)}
                  </td>

                  <td className="px-4 py-4">
                    {formatCurrency(row.monthly_income)}
                  </td>

                  <td className="px-4 py-4">{row.nav_health || "Unknown"}</td>

                  <td className="px-4 py-4">
                    {formatPercent(row.aum_change_percentage_30_day)}
                  </td>

                  <td className="px-4 py-4">
                    {formatPercent(row.total_return_percentage_90_day)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tableRows.length === 0 && (
          <div className="mt-6 rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-8 text-center text-brand-muted">
            Add ETF transactions to this portfolio to unlock comparison data.
          </div>
        )}
      </section>
    </div>
  );
}

function PortfolioSelector({ value, portfolios, onChange }) {
  return (
    <div className="inline-flex h-14 items-center gap-3 rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4">
      <span className="font-mono text-xs uppercase tracking-widest text-brand-primary">
        Active Portfolio
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

function formatNumber(value) {
  return Math.round(Number(value || 0)).toLocaleString("en-US");
}

function formatPercent(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${Number(value).toFixed(2)}%`;
}

function formatChartAxisValue(value, metric) {
  if (metric === "price" || metric === "nav" || metric === "dividends") {
    return `$${Number(value).toFixed(0)}`;
  }

  if (metric === "aum") {
    return Number(value).toLocaleString("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    });
  }

  return Number(value).toFixed(0);
}

function formatChartTooltipValue(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 4,
  });
}
