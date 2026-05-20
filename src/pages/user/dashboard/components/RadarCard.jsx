import { ArrowUpRight } from "lucide-react";

export default function RadarCard({ ticker, yieldValue, nav, momentum }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-3xl font-bold text-brand-primary">
            {ticker}
          </p>

          <p className="mt-1 text-sm text-brand-muted">
            Placeholder ETF intelligence card
          </p>
        </div>

        <ArrowUpRight className="h-5 w-5 text-brand-primary" />
      </div>

      <div className="mt-6 grid gap-3">
        <MiniStat label="Yield" value={yieldValue} />
        <MiniStat label="NAV Trend" value={nav} />
        <MiniStat label="Momentum" value={momentum} />
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
