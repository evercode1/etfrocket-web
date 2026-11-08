import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

import { getAumLeaderboard } from "../../../api/aum";
import {
  formatCompact,
  formatDate,
  formatNav,
  formatPercent,
  formatSignedCompact,
  trendClass,
} from "../../../utils/aumFormat";

const PERIOD_LABELS = {
  "1w": "1W",
  "1m": "1M",
  "3m": "3M",
  ytd: "YTD",
  "1y": "1Y",
};

const SORTERS = {
  rank: (row) => row.rank,
  symbol: (row) => row.symbol,
  issuer: (row) => row.issuer_name ?? "",
  aum: (row) => row.aum,
  change: (row, period) => row.changes[period]?.aum_change,
  pct: (row, period) => row.changes[period]?.aum_change_percentage,
  flow: (row, period) => row.changes[period]?.estimated_flow,
  nav: (row) => row.nav,
};

function compareRows(a, b, sortKey, direction, period) {
  const valueA = SORTERS[sortKey](a, period);
  const valueB = SORTERS[sortKey](b, period);

  // Missing values always sort last.
  if (valueA === null || valueA === undefined) return 1;
  if (valueB === null || valueB === undefined) return -1;

  const result =
    typeof valueA === "string"
      ? valueA.localeCompare(valueB)
      : valueA - valueB;

  return direction === "asc" ? result : -result;
}

export default function AumLeaderboard() {
  const [leaderboard, setLeaderboard] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [period, setPeriod] = useState("1m");
  const [issuer, setIssuer] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("rank");
  const [direction, setDirection] = useState("asc");

  useEffect(() => {
    async function load() {
      try {
        const response = await getAumLeaderboard();

        setLeaderboard(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load the AUM leaderboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const issuers = useMemo(() => {
    if (!leaderboard) {
      return [];
    }

    const names = new Map();

    leaderboard.securities.forEach((row) => {
      if (row.issuer_id) {
        names.set(row.issuer_id, row.issuer_name);
      }
    });

    return [...names.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [leaderboard]);

  const rows = useMemo(() => {
    if (!leaderboard) {
      return [];
    }

    const term = search.trim().toLowerCase();

    return leaderboard.securities
      .filter((row) => !issuer || String(row.issuer_id) === issuer)
      .filter(
        (row) =>
          !term ||
          row.symbol.toLowerCase().includes(term) ||
          (row.name ?? "").toLowerCase().includes(term),
      )
      .sort((a, b) => compareRows(a, b, sortKey, direction, period));
  }, [leaderboard, issuer, search, sortKey, direction, period]);

  const summary = useMemo(() => {
    if (!leaderboard) {
      return null;
    }

    // Totals for the current filter (issuer/search), comparable funds only.
    const comparable = rows.filter(
      (row) => row.changes[period]?.aum_change !== null,
    );

    const aum = rows.reduce((total, row) => total + row.aum, 0);
    const comparableAum = comparable.reduce((total, row) => total + row.aum, 0);
    const change = comparable.reduce(
      (total, row) => total + row.changes[period].aum_change,
      0,
    );
    const flow = comparable.reduce(
      (total, row) => total + (row.changes[period].estimated_flow ?? 0),
      0,
    );
    const startAum = comparableAum - change;

    return {
      aum,
      count: rows.length,
      change,
      changePercentage: startAum > 0 ? (change / startAum) * 100 : null,
      flow,
    };
  }, [leaderboard, rows, period]);

  function handleSort(key) {
    if (sortKey === key) {
      setDirection(direction === "asc" ? "desc" : "asc");

      return;
    }

    setSortKey(key);
    // Text and rank read naturally ascending; numbers biggest-first.
    setDirection(["rank", "symbol", "issuer"].includes(key) ? "asc" : "desc");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <p className="font-mono text-sm uppercase tracking-widest text-brand-primary">
          Loading leaderboard…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="glass-card rounded-3xl p-8 text-brand-danger">
          {error}
        </div>
      </div>
    );
  }

  if (!leaderboard?.as_of) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          AUM data is not available yet.
        </div>
      </div>
    );
  }

  const periodLabel = PERIOD_LABELS[period];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
          Assets Under Management
        </p>

        <h1 className="mt-3 font-display text-4xl font-black text-white md:text-5xl">
          AUM Leaderboard
        </h1>

        <p className="mt-3 max-w-2xl text-brand-muted">
          Daily assets under management for {leaderboard.totals.security_count}{" "}
          income ETFs, collected directly from issuer websites. As of{" "}
          <span className="text-brand-text">
            {formatDate(leaderboard.as_of)}
          </span>
          .
        </p>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label={issuer || search ? "Filtered AUM" : "Total AUM"}
          value={formatCompact(summary.aum)}
          detail={`${summary.count} ETFs`}
        />

        <StatCard
          label={`${periodLabel} Change`}
          value={formatSignedCompact(summary.change)}
          valueClass={trendClass(summary.change)}
          detail={formatPercent(summary.changePercentage)}
          detailClass={trendClass(summary.changePercentage)}
        />

        <StatCard
          label={`${periodLabel} Est. Net Flows`}
          value={formatSignedCompact(summary.flow)}
          valueClass={trendClass(summary.flow)}
          detail="Share creations − redemptions × NAV"
        />
      </section>

      <section className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="inline-flex w-full rounded-xl border border-brand-outline bg-brand-surfaceLow p-1 sm:w-auto"
          role="tablist"
          aria-label="Period"
        >
          {leaderboard.periods.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={period === key}
              onClick={() => setPeriod(key)}
              className={`flex-1 rounded-lg px-4 py-2 font-mono text-sm font-semibold transition sm:flex-none ${
                period === key
                  ? "bg-brand-primaryStrong text-brand-background shadow-glow"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {PERIOD_LABELS[key]}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={issuer}
            onChange={(event) => setIssuer(event.target.value)}
            className="rounded-xl border border-brand-outline bg-brand-surfaceLow px-4 py-2.5 text-sm text-brand-text focus:border-brand-primary focus:outline-none"
            aria-label="Filter by issuer"
          >
            <option value="">All issuers</option>

            {issuers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <label className="relative">
            <span className="sr-only">Search ETFs</span>

            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search symbol or name"
              className="w-full rounded-xl border border-brand-outline bg-brand-surfaceLow py-2.5 pl-9 pr-4 text-sm text-brand-text placeholder:text-brand-muted focus:border-brand-primary focus:outline-none sm:w-64"
            />
          </label>
        </div>
      </section>

      <section className="glass-card overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-brand-outline bg-brand-surfaceLow/80 text-left">
              <tr>
                <SortHeader label="#" sortName="rank" {...{ sortKey, direction, handleSort }} />
                <SortHeader label="ETF" sortName="symbol" {...{ sortKey, direction, handleSort }} />
                <SortHeader label="Issuer" sortName="issuer" className="hidden lg:table-cell" {...{ sortKey, direction, handleSort }} />
                <SortHeader label="AUM" sortName="aum" align="right" {...{ sortKey, direction, handleSort }} />
                <SortHeader label={`${periodLabel} Change`} sortName="change" align="right" className="hidden md:table-cell" {...{ sortKey, direction, handleSort }} />
                <SortHeader label={`${periodLabel} %`} sortName="pct" align="right" {...{ sortKey, direction, handleSort }} />
                <SortHeader label="Est. Flows" sortName="flow" align="right" {...{ sortKey, direction, handleSort }} />
                <SortHeader label="NAV" sortName="nav" align="right" className="hidden xl:table-cell" {...{ sortKey, direction, handleSort }} />
              </tr>
            </thead>

            <tbody className="divide-y divide-brand-outline/60">
              {rows.map((row) => {
                const change = row.changes[period];
                const isNew = change?.aum_change === null;

                return (
                  <tr
                    key={row.security_id}
                    onClick={() => navigate(`/aum/${row.symbol}`)}
                    className="cursor-pointer transition hover:bg-brand-surfaceHigh/60"
                  >
                    <td className="px-4 py-3 font-mono text-brand-muted">
                      {row.rank}
                    </td>

                    <td className="px-4 py-3">
                      <Link
                        to={`/aum/${row.symbol}`}
                        onClick={(event) => event.stopPropagation()}
                        className="font-mono font-bold text-brand-primary hover:underline focus:underline focus:outline-none"
                      >
                        {row.symbol}
                      </Link>

                      <div className="max-w-[16rem] truncate text-xs text-brand-muted">
                        {row.name}
                      </div>
                    </td>

                    <td className="hidden px-4 py-3 text-brand-muted lg:table-cell">
                      {row.issuer_name}
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-semibold text-white">
                      {formatCompact(row.aum)}

                      {row.aum_date !== leaderboard.as_of && (
                        <div className="text-[11px] font-normal text-brand-muted">
                          as of {formatDate(row.aum_date)}
                        </div>
                      )}
                    </td>

                    <td
                      className={`hidden px-4 py-3 text-right font-mono md:table-cell ${trendClass(change?.aum_change)}`}
                    >
                      {formatSignedCompact(change?.aum_change)}
                    </td>

                    <td
                      className={`px-4 py-3 text-right font-mono ${trendClass(change?.aum_change_percentage)}`}
                    >
                      {isNew ? (
                        <span
                          className="rounded-full bg-brand-secondary/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand-secondary"
                          title={`Launched ${formatDate(row.inception_date)}`}
                        >
                          New
                        </span>
                      ) : (
                        formatPercent(change?.aum_change_percentage)
                      )}
                    </td>

                    <td
                      className={`px-4 py-3 text-right font-mono ${trendClass(change?.estimated_flow)}`}
                    >
                      {formatSignedCompact(change?.estimated_flow)}
                    </td>

                    <td className="hidden px-4 py-3 text-right font-mono text-brand-muted xl:table-cell">
                      {formatNav(row.nav)}
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-brand-muted">
                    No ETFs match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-4 text-xs text-brand-muted">
        Estimated flows are derived from changes in shares outstanding (AUM /
        NAV) and are approximate. Funds marked “New” launched during the
        selected period.
      </p>
    </div>
  );
}

function StatCard({ label, value, valueClass = "text-white", detail, detailClass = "text-brand-muted" }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-muted">
        {label}
      </p>

      <p className={`mt-3 font-display text-3xl font-bold ${valueClass}`}>
        {value}
      </p>

      {detail && <p className={`mt-1 text-sm ${detailClass}`}>{detail}</p>}
    </div>
  );
}

function SortHeader({
  label,
  sortName,
  sortKey,
  direction,
  handleSort,
  align = "left",
  className = "",
}) {
  const active = sortKey === sortName;
  const Icon = direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <th
      scope="col"
      aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"}
      className={`px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-muted ${
        align === "right" ? "text-right" : ""
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => handleSort(sortName)}
        className={`inline-flex items-center gap-1 uppercase transition hover:text-brand-text ${
          align === "right" ? "flex-row-reverse" : ""
        } ${active ? "text-brand-primary" : ""}`}
      >
        {label}
        {active && <Icon className="h-3 w-3" />}
      </button>
    </th>
  );
}
