import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getAumHistory } from "../../../api/aum";
import {
  formatCompact,
  formatCompactNumber,
  formatDate,
  formatNav,
  formatPercent,
  formatSignedCompact,
  trendClass,
} from "../../../utils/aumFormat";

/*
| Chart colors (validated with the dataviz palette validator on the dark
| surface #191f31): inflow #0e9cc8 (cool) / outflow #e8693a (warm).
| The single-series line uses the brand accent.
*/
const COLORS = {
  line: "#00d1ff",
  inflow: "#0e9cc8",
  outflow: "#e8693a",
  grid: "#2e3447",
  axis: "#bbc9cf",
  surface: "#191f31",
};

const RANGES = [
  { key: "1m", label: "1M" },
  { key: "3m", label: "3M" },
  { key: "6m", label: "6M" },
  { key: "ytd", label: "YTD" },
  { key: "1y", label: "1Y" },
  { key: "max", label: "Max" },
];

const METRICS = {
  aum: {
    label: "AUM",
    title: "Assets under management",
    format: formatCompact,
    axisFormat: formatCompact,
  },
  shares: {
    label: "Shares",
    title: "Shares outstanding",
    format: (value) => formatCompactNumber(value),
    axisFormat: formatCompactNumber,
  },
  nav: {
    label: "NAV",
    title: "Net asset value per share",
    format: formatNav,
    axisFormat: formatNav,
  },
};

// Daily flow bars get too dense past ~3 months; aggregate weekly beyond that.
const WEEKLY_FLOW_RANGES = ["6m", "ytd", "1y", "max"];

function toIso(date) {
  return date.toISOString().slice(0, 10);
}

function rangeStartDate(latestIso, range) {
  const date = new Date(`${latestIso}T00:00:00Z`);

  switch (range) {
    case "1m":
      date.setUTCMonth(date.getUTCMonth() - 1);
      break;
    case "3m":
      date.setUTCMonth(date.getUTCMonth() - 3);
      break;
    case "6m":
      date.setUTCMonth(date.getUTCMonth() - 6);
      break;
    case "ytd":
      return `${date.getUTCFullYear() - 1}-12-31`;
    case "1y":
      date.setUTCFullYear(date.getUTCFullYear() - 1);
      break;
    default:
      return null;
  }

  return toIso(date);
}

function weekStart(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const day = date.getUTCDay() || 7;

  date.setUTCDate(date.getUTCDate() - (day - 1));

  return toIso(date);
}

function aggregateWeekly(rows) {
  const weeks = new Map();

  rows.forEach((row) => {
    if (row.flow === null) {
      return;
    }

    const key = weekStart(row.date);

    weeks.set(key, (weeks.get(key) ?? 0) + row.flow);
  });

  return [...weeks.entries()].map(([date, flow]) => ({ date, flow }));
}

// "Nov 10" - ticks land on arbitrary trading days, so month + day stays
// unambiguous where month + year would repeat. The tooltip shows the year.
function shortDateTick(value) {
  return formatDate(value, { year: undefined });
}

export default function AumSymbolDetail() {
  const { symbol } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("1y");
  const [metric, setMetric] = useState("aum");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await getAumHistory(symbol);

        if (!cancelled) {
          setData(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.status === 404
              ? { notCovered: true }
              : {
                  message:
                    err.response?.data?.message ||
                    "Unable to load AUM history.",
                },
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  const view = useMemo(() => {
    if (!data?.latest) {
      return null;
    }

    const history = data.history;
    const startDate = rangeStartDate(data.latest.date, range);

    // Baseline: the last observation on or before the range start (same rule
    // as the leaderboard). Funds younger than the range start at launch.
    let base = history[0];
    let sinceLaunch = startDate !== null;

    if (startDate) {
      for (let i = history.length - 1; i >= 0; i -= 1) {
        if (history[i].date <= startDate) {
          base = history[i];
          sinceLaunch = false;
          break;
        }
      }
    } else {
      sinceLaunch = false;
    }

    const rows = history.filter((row) => row.date >= base.date);
    const flowRows = rows.slice(1);

    const latest = data.latest;
    const aumChange = latest.aum - base.aum;
    const netFlow = flowRows.reduce((total, row) => total + (row.flow ?? 0), 0);

    return {
      rows,
      base,
      sinceLaunch,
      aumChange,
      aumChangePercentage: base.aum > 0 ? (aumChange / base.aum) * 100 : null,
      netFlow,
      navChangePercentage:
        base.nav > 0 && latest.nav !== null
          ? ((latest.nav - base.nav) / base.nav) * 100
          : null,
      weeklyFlows: WEEKLY_FLOW_RANGES.includes(range),
      flows: WEEKLY_FLOW_RANGES.includes(range)
        ? aggregateWeekly(flowRows)
        : flowRows.filter((row) => row.flow !== null),
    };
  }, [data, range]);

  if (loading && !data) {
    return (
      <PageFrame>
        <p className="font-mono text-sm uppercase tracking-widest text-brand-primary">
          Loading {symbol.toUpperCase()}…
        </p>
      </PageFrame>
    );
  }

  if (error?.notCovered) {
    return (
      <PageFrame>
        <NotCovered symbol={symbol} />
      </PageFrame>
    );
  }

  if (error) {
    return (
      <PageFrame>
        <div className="glass-card rounded-3xl p-8 text-brand-danger">
          {error.message}
        </div>
      </PageFrame>
    );
  }

  const security = data.security;

  if (!view) {
    // The API only returns 200 without data for covered ETFs ("pending").
    return (
      <PageFrame>
        <SecurityHeader security={security} />
        <AwaitingData symbol={security.symbol} />
      </PageFrame>
    );
  }

  const rangeLabel = RANGES.find((item) => item.key === range).label;
  const changeContext = view.sinceLaunch
    ? `since launch ${formatDate(view.base.date)}`
    : `since ${formatDate(view.base.date)}`;
  const metricConfig = METRICS[metric];

  return (
    <PageFrame>
      <SecurityHeader security={security} asOf={data.latest.date} />

      {data.coverage_status === "stale" && (
        <StaleNotice
          lastUpdated={data.latest.date}
          staleAfterDays={data.stale_after_days}
        />
      )}

      <div
        className={`transition-opacity ${loading ? "opacity-60" : "opacity-100"}`}
      >
        <div
          className="mb-6 inline-flex w-full rounded-xl border border-brand-outline bg-brand-surfaceLow p-1 sm:w-auto"
          role="tablist"
          aria-label="Time range"
        >
          {RANGES.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={range === item.key}
              onClick={() => setRange(item.key)}
              className={`flex-1 rounded-lg px-2 py-2 font-mono text-sm font-semibold transition sm:flex-none sm:px-4 ${
                range === item.key
                  ? "bg-brand-primaryStrong text-brand-background shadow-glow"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="AUM"
            value={formatCompact(data.latest.aum)}
            detail={`as of ${formatDate(data.latest.date)}`}
          />

          <StatCard
            label={`${rangeLabel} change`}
            value={formatSignedCompact(view.aumChange)}
            valueClass={trendClass(view.aumChange)}
            detail={`${formatPercent(view.aumChangePercentage)} ${changeContext}`}
          />

          <StatCard
            label={`${rangeLabel} est. net flows`}
            value={formatSignedCompact(view.netFlow)}
            valueClass={trendClass(view.netFlow)}
            detail="From changes in shares outstanding"
          />

          <StatCard
            label="NAV"
            value={formatNav(data.latest.nav)}
            detail={`${formatPercent(view.navChangePercentage)} over ${rangeLabel}`}
          />
        </section>

        <section className="glass-card mb-6 rounded-3xl p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-lg font-bold text-white">
              {metricConfig.title}
            </h2>

            <div
              className="inline-flex rounded-xl border border-brand-outline bg-brand-surfaceLow p-1"
              role="tablist"
              aria-label="Measure"
            >
              {Object.entries(METRICS).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={metric === key}
                  onClick={() => setMetric(key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    metric === key
                      ? "bg-brand-surfaceHighest text-white"
                      : "text-brand-muted hover:text-brand-text"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <MetricChart rows={view.rows} metric={metric} config={metricConfig} />
        </section>

        <section className="glass-card mb-6 rounded-3xl p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-lg font-bold text-white">
              Estimated net flows{" "}
              <span className="font-body text-sm font-normal text-brand-muted">
                ({view.weeklyFlows ? "weekly" : "daily"})
              </span>
            </h2>

            <div className="flex items-center gap-4 text-xs text-brand-muted">
              <LegendSwatch color={COLORS.inflow} label="Inflows" />
              <LegendSwatch color={COLORS.outflow} label="Outflows" />
            </div>
          </div>

          <FlowChart flows={view.flows} weekly={view.weeklyFlows} />
        </section>

        <DataTable rows={view.rows} />

        <p className="mt-4 text-xs text-brand-muted">
          Shares outstanding are derived as AUM / NAV. Estimated flows are the
          change in shares outstanding multiplied by NAV and are approximate.
        </p>
      </div>
    </PageFrame>
  );
}

function PageFrame({ children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <Link
        to="/aum"
        className="mb-6 inline-flex items-center gap-2 text-sm text-brand-muted transition hover:text-brand-text"
      >
        <ArrowLeft className="h-4 w-4" />
        AUM Leaderboard
      </Link>

      {children}
    </div>
  );
}

function NotCovered({ symbol }) {
  return (
    <div className="glass-card rounded-3xl p-8">
      <p className="font-display text-xl font-bold text-white">
        We don't currently provide coverage for {symbol.toUpperCase()}.
      </p>

      <p className="mt-2 text-brand-muted">
        Browse the ETFs we track on the{" "}
        <Link to="/aum" className="text-brand-primary hover:underline">
          AUM Leaderboard
        </Link>
        , or search for another fund above.
      </p>
    </div>
  );
}

function AwaitingData({ symbol }) {
  return (
    <div className="glass-card rounded-3xl p-8">
      <p className="font-display text-xl font-bold text-white">
        AUM data for {symbol} isn't available yet.
      </p>

      <p className="mt-2 text-brand-muted">
        We track {symbol} and collect its data daily from the issuer's
        website. Check back soon, or browse the ETFs with data on the{" "}
        <Link to="/aum" className="text-brand-primary hover:underline">
          AUM Leaderboard
        </Link>
        .
      </p>
    </div>
  );
}

function StaleNotice({ lastUpdated, staleAfterDays }) {
  return (
    <div
      role="status"
      className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100"
    >
      <AlertTriangle
        className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
        aria-hidden="true"
      />

      <p>
        <strong className="font-semibold">
          Last updated {formatDate(lastUpdated)}.
        </strong>{" "}
        We haven't been able to collect new data for this ETF in over{" "}
        {staleAfterDays} days, so the figures below may be out of date.
      </p>
    </div>
  );
}

function SecurityHeader({ security, asOf }) {
  return (
    <header className="mb-8">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
        {[security.issuer_name, security.strategy_name]
          .filter(Boolean)
          .join(" · ") || "ETF"}
      </p>

      <h1 className="mt-3 font-display text-4xl font-black text-white md:text-5xl">
        {security.symbol}
      </h1>

      {security.name && (
        <p className="mt-2 text-lg text-brand-text">{security.name}</p>
      )}

      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-muted">
        {security.inception_date && (
          <span>Tracking since {formatDate(security.inception_date)}</span>
        )}

        {asOf && <span>Updated {formatDate(asOf)}</span>}

        {security.website_url && (
          <a
            href={security.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-brand-primary hover:underline"
          >
            Issuer page
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </p>
    </header>
  );
}

function StatCard({ label, value, valueClass = "text-white", detail }) {
  return (
    <div className="glass-card rounded-3xl p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-muted">
        {label}
      </p>

      <p className={`mt-2 text-2xl font-bold ${valueClass}`}>{value}</p>

      {detail && <p className="mt-1 text-xs text-brand-muted">{detail}</p>}
    </div>
  );
}

function LegendSwatch({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

const axisProps = {
  stroke: COLORS.grid,
  tick: { fill: COLORS.axis, fontSize: 11 },
  tickLine: false,
  axisLine: false,
};

function MetricChart({ rows, metric, config }) {
  const common = {
    data: rows,
    margin: { top: 8, right: 8, bottom: 0, left: 0 },
  };

  const children = [
    <CartesianGrid key="grid" stroke={COLORS.grid} strokeWidth={1} vertical={false} />,
    <XAxis
      key="x"
      dataKey="date"
      tickFormatter={shortDateTick}
      minTickGap={48}
      {...axisProps}
    />,
    <YAxis
      key="y"
      width={72}
      tickFormatter={config.axisFormat}
      domain={metric === "nav" ? ["auto", "auto"] : [0, "auto"]}
      {...axisProps}
    />,
    <Tooltip
      key="tooltip"
      cursor={{ stroke: COLORS.axis, strokeWidth: 1 }}
      content={<ValueTooltip seriesLabel={config.label} format={config.format} />}
    />,
  ];

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        {metric === "nav" ? (
          <LineChart {...common}>
            {children}
            <Line
              type="monotone"
              dataKey="nav"
              stroke={COLORS.line}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: COLORS.surface, strokeWidth: 2 }}
              connectNulls
              isAnimationActive={false}
            />
          </LineChart>
        ) : (
          <AreaChart {...common}>
            {children}
            <Area
              type="monotone"
              dataKey={metric}
              stroke={COLORS.line}
              strokeWidth={2}
              fill={COLORS.line}
              fillOpacity={0.1}
              activeDot={{ r: 4, stroke: COLORS.surface, strokeWidth: 2 }}
              connectNulls
              isAnimationActive={false}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function FlowBar({ x, y, width, height, payload }) {
  if (!width || !height) {
    return null;
  }

  const top = Math.min(y, y + height);
  const barHeight = Math.abs(height);
  const radius = Math.min(4, width / 2, barHeight);
  const positive = payload.flow >= 0;
  const right = x + width;
  const bottom = top + barHeight;

  // Rounded at the data end, square at the zero baseline.
  const path = positive
    ? `M${x},${bottom} L${x},${top + radius} Q${x},${top} ${x + radius},${top} L${right - radius},${top} Q${right},${top} ${right},${top + radius} L${right},${bottom} Z`
    : `M${x},${top} L${right},${top} L${right},${bottom - radius} Q${right},${bottom} ${right - radius},${bottom} L${x + radius},${bottom} Q${x},${bottom} ${x},${bottom - radius} Z`;

  return (
    <path d={path} fill={positive ? COLORS.inflow : COLORS.outflow} />
  );
}

function FlowChart({ flows, weekly }) {
  if (flows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-brand-muted">
        Not enough data in this range to estimate flows.
      </p>
    );
  }

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={flows}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          barCategoryGap={2}
        >
          <CartesianGrid stroke={COLORS.grid} strokeWidth={1} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={shortDateTick}
            minTickGap={48}
            {...axisProps}
          />
          <YAxis width={72} tickFormatter={formatSignedCompact} {...axisProps} />
          <ReferenceLine y={0} stroke={COLORS.axis} strokeOpacity={0.5} />
          <Tooltip
            cursor={{ fill: "rgba(187, 201, 207, 0.08)" }}
            content={
              <ValueTooltip
                seriesLabel={weekly ? "Week net flow" : "Net flow"}
                format={formatSignedCompact}
                datePrefix={weekly ? "Week of " : ""}
                colorFor={(value) =>
                  value >= 0 ? COLORS.inflow : COLORS.outflow
                }
              />
            }
          />
          <Bar
            dataKey="flow"
            maxBarSize={24}
            shape={FlowBar}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ValueTooltip({
  active,
  payload,
  label: date,
  seriesLabel,
  format,
  datePrefix = "",
  colorFor,
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const value = payload[0].value;
  const keyColor = colorFor ? colorFor(value) : COLORS.line;

  return (
    <div className="rounded-xl border border-brand-outline bg-brand-surfaceHigh px-3 py-2 shadow-lg">
      <p className="text-xs text-brand-muted">
        {datePrefix}
        {formatDate(date)}
      </p>

      <p className="mt-1 flex items-center gap-2">
        <span
          className="inline-block h-0.5 w-3 rounded-full"
          style={{ backgroundColor: keyColor }}
        />
        <span className="font-mono text-sm font-bold text-white">
          {format(value)}
        </span>
        <span className="text-xs text-brand-muted">{seriesLabel}</span>
      </p>
    </div>
  );
}

function DataTable({ rows }) {
  const newestFirst = [...rows].reverse();

  return (
    <details className="glass-card group rounded-3xl">
      <summary className="cursor-pointer list-none px-6 py-4 text-sm font-semibold text-brand-text transition hover:text-white">
        <span className="group-open:hidden">Show data table</span>
        <span className="hidden group-open:inline">Hide data table</span>
        <span className="ml-2 text-brand-muted">({rows.length} days)</span>
      </summary>

      <div className="max-h-96 overflow-auto border-t border-brand-outline">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="sticky top-0 bg-brand-surfaceLow text-left">
            <tr className="font-mono text-xs uppercase tracking-wider text-brand-muted">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2 text-right">AUM</th>
              <th className="px-4 py-2 text-right">NAV</th>
              <th className="px-4 py-2 text-right">Shares</th>
              <th className="px-4 py-2 text-right">Est. flow</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-outline/60 font-mono tabular-nums">
            {newestFirst.map((row) => (
              <tr key={row.date}>
                <td className="px-4 py-2 text-brand-muted">
                  {formatDate(row.date)}
                </td>
                <td className="px-4 py-2 text-right text-white">
                  {formatCompact(row.aum)}
                </td>
                <td className="px-4 py-2 text-right text-brand-text">
                  {formatNav(row.nav)}
                </td>
                <td className="px-4 py-2 text-right text-brand-text">
                  {formatCompactNumber(row.shares)}
                </td>
                <td className={`px-4 py-2 text-right ${trendClass(row.flow)}`}>
                  {formatSignedCompact(row.flow)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
