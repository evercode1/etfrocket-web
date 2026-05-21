import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Search } from "lucide-react";

const symbols = ["NVII", "CHPY", "AMDY", "QDTE"];

export default function SymbolCompare() {
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
          Compare Symbols
        </h1>

        <p className="mt-4 max-w-3xl text-brand-muted">
          Enter ETF symbols and compare them side-by-side before adding them to
          a portfolio.
        </p>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
              ETF Symbols
            </span>

            <div className="mt-2 flex rounded-2xl border border-brand-outline bg-brand-surfaceHigh">
              <div className="flex items-center px-4 text-brand-muted">
                <Search className="h-5 w-5" />
              </div>

              <input
                placeholder="NVII, CHPY, AMDY"
                className="w-full bg-transparent px-2 py-4 text-sm font-semibold text-brand-text outline-none"
              />
            </div>
          </label>

          <button
            type="button"
            className="rocket-button-primary flex items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-bold"
          >
            <Plus className="h-4 w-4" />
            Compare
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {symbols.map((symbol) => (
            <span
              key={symbol}
              className="rounded-full border border-brand-outline bg-brand-surface px-4 py-2 text-sm font-semibold text-brand-text"
            >
              {symbol}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-4">
        {symbols.map((symbol) => (
          <SymbolCard key={symbol} symbol={symbol} />
        ))}
      </section>
    </div>
  );
}

function SymbolCard({ symbol }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="font-display text-3xl font-bold text-brand-primary">
        {symbol}
      </p>

      <p className="mt-2 text-sm text-brand-muted">Mock comparison profile</p>

      <div className="mt-6 space-y-3">
        <MiniStat label="Forward Yield" value="42.8%" />
        <MiniStat label="NAV Stability" value="Stable" />
        <MiniStat label="30D AUM Flow" value="+12.4%" />
        <MiniStat label="Total Return" value="+8.9%" />
      </div>
    </div>
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
