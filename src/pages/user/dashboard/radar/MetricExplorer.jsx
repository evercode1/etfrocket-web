import { Link } from "react-router-dom";
import { ArrowLeft, Filter, Trophy } from "lucide-react";

const rankedEtfs = [
  {
    rank: 1,
    symbol: "CHPY",
    metric: "NAV Stability",
    value: "+44.88%",
    note: "Strongest NAV improvement",
  },
  {
    rank: 2,
    symbol: "QDTE",
    metric: "AUM Growth",
    value: "+31.20%",
    note: "Large recent inflow",
  },
  {
    rank: 3,
    symbol: "NVII",
    metric: "Distribution Growth",
    value: "+18.40%",
    note: "Recent payouts above baseline",
  },
];

export default function MetricExplorer() {
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
          Metric Explorer
        </h1>

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
              Mock controls for future ETF screening and ranking.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <FilterSelect
              label="Metric"
              options={["NAV Stability", "AUM Growth", "Forward Yield"]}
            />

            <FilterSelect label="Range" options={["30 Day", "90 Day", "Max"]} />

            <button
              type="button"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-brand-outline bg-brand-surfaceHigh px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              <Filter className="h-4 w-4" />
              Apply
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {rankedEtfs.map((etf) => (
          <RankCard key={etf.symbol} etf={etf} />
        ))}
      </section>
    </div>
  );
}

function RankCard({ etf }) {
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

      <p className="mt-2 text-sm text-brand-muted">{etf.note}</p>

      <div className="mt-6 space-y-3">
        <MiniStat label="Metric" value={etf.metric} />
        <MiniStat label="Value" value={etf.value} />
      </div>
    </div>
  );
}

function FilterSelect({ label, options }) {
  return (
    <label>
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
        {label}
      </span>

      <select className="mt-2 w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary">
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-brand-surface text-brand-text"
          >
            {option}
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
