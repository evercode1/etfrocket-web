import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ArrowLeft, Filter, Trophy } from "lucide-react";

import { getMetricExplorer } from "../../../../api/comparisons";

export default function MetricExplorer() {
  const [metric, setMetric] = useState("total_return");

  const [range, setRange] = useState("90d");

  const [sortDirection, setSortDirection] = useState("desc");

  const [data, setData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    setIsLoading(true);

    try {
      const response = await getMetricExplorer({
        metric,

        range,

        sort_direction: sortDirection,
      });

      setData(response.data || null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [metric, range, sortDirection]);

  const summary = data?.summary || {};

  const tableRows = data?.table_rows || [];

  const metricOptions = data?.options?.metrics || [];

  const rangeOptions = data?.options?.ranges || [];

  const spotlight = useMemo(() => {
    return tableRows.slice(0, 3);
  }, [tableRows]);

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

        <h1 className="mt-3 font-display text-5xl font-bold">ETF Rankings</h1>

        <p className="mt-4 max-w-3xl text-brand-muted">
          Discover ETFs ranked by yield, NAV stability, AUM growth, dividend
          trends, total return, and risk signals.
        </p>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Explore by Metric
            </h2>

            <p className="mt-1 text-sm text-brand-muted">
              Screen and rank ETFs across key analytics categories.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <FilterSelect
              label="Metric"
              value={metric}
              onChange={setMetric}
              options={metricOptions}
            />

            <FilterSelect
              label="Range"
              value={range}
              onChange={setRange}
              options={rangeOptions}
            />

            <label>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                Direction
              </span>

              <button
                type="button"
                onClick={() =>
                  setSortDirection(sortDirection === "desc" ? "asc" : "desc")
                }
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-outline bg-brand-surfaceHigh px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
              >
                <Filter className="h-4 w-4" />

                {sortDirection === "desc" ? "Sort Desc" : "Sort Asc"}
              </button>
            </label>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          Loading ETF rankings...
        </div>
      ) : (
        <>
          <section className="grid gap-5 lg:grid-cols-3">
            {spotlight.map((etf) => (
              <RankCard key={etf.symbol} etf={etf} metric={metric} />
            ))}
          </section>

          <section className="glass-card rounded-3xl p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  Full Metric Rankings
                </h2>

                <p className="mt-1 text-sm text-brand-muted">
                  {summary.results_count || 0} ETFs ranked by{" "}
                  {summary.metric?.replaceAll("_", " ") || "metric"}.
                </p>
              </div>
            </div>

            {tableRows.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-8 text-center text-brand-muted">
                No ETFs available for this metric selection.
              </div>
            ) : (
              <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-surfaceHigh text-brand-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Rank</th>

                      <th className="px-4 py-3 font-semibold">ETF</th>

                      <th className="px-4 py-3 font-semibold">Metric</th>

                      <th className="px-4 py-3 font-semibold">Value</th>

                      <th className="px-4 py-3 font-semibold">NAV</th>

                      <th className="px-4 py-3 font-semibold">AUM Flow</th>

                      <th className="px-4 py-3 font-semibold">Total Return</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tableRows.map((etf, index) => (
                      <tr
                        key={etf.symbol}
                        className="border-t border-brand-outline text-brand-muted"
                      >
                        <td className="px-4 py-4 font-semibold text-brand-primary">
                          #
                          {sortDirection === "desc"
                            ? index + 1
                            : tableRows.length - index}
                        </td>

                        <td className="px-4 py-4 font-display text-xl font-bold text-brand-primary">
                          {etf.symbol}
                        </td>

                        <td className="px-4 py-4">{etf.metric_label}</td>

                        <td className="px-4 py-4 font-semibold text-brand-text">
                          {formatMetricValue(etf.metric_value, metric)}
                        </td>

                        <td className="px-4 py-4">{etf.nav_health}</td>

                        <td className="px-4 py-4">
                          {formatPercent(etf.aum_change_percentage)}
                        </td>

                        <td className="px-4 py-4">
                          {formatPercent(etf.total_return_percentage)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function RankCard({ etf, metric }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <Trophy className="h-6 w-6" />
        </div>

        <span className="font-mono text-sm uppercase tracking-widest text-brand-primary">
          Rank #{etf.rank}
        </span>
      </div>

      <p className="mt-5 font-display text-4xl font-bold text-brand-primary">
        {etf.symbol}
      </p>

      <div className="mt-6 space-y-3">
        <MiniStat label="Metric" value={etf.metric_label} />

        <MiniStat
          label="Value"
          value={formatMetricValue(etf.metric_value, metric)}
        />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-brand-surface text-brand-text"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
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

function formatPercent(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${Number(value).toFixed(2)}%`;
}

function formatMetricValue(value, metric) {
  if (value === null || value === undefined) {
    return "—";
  }

  if (
    [
      "price_growth",
      "total_return",
      "nav_stability",
      "aum_growth",
      "forward_yield",
    ].includes(metric)
  ) {
    return `${Number(value).toFixed(2)}%`;
  }

  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}
