import { Link } from "react-router-dom";

import { ArrowUpRight } from "lucide-react";

export default function RadarCard({
  title,
  description,
  badge,
  stats = [],
  to,
  disabled = false,
}) {
  const content = (
    <div
      className={`glass-card h-full rounded-3xl p-6 transition ${
        disabled
          ? "opacity-60"
          : "hover:-translate-y-1 hover:border-brand-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-brand-primary">
            {badge}
          </div>

          <h3 className="mt-4 font-display text-3xl font-bold text-brand-text">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-brand-muted">
            {disabled
              ? "Add ETF transactions to this portfolio to unlock this comparison tool."
              : description}
          </p>
        </div>

        {!disabled && <ArrowUpRight className="h-5 w-5 text-brand-primary" />}
      </div>

      <div className="mt-6 grid gap-3">
        {stats.map((stat) => (
          <MiniStat key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  );

  if (disabled || !to) {
    return content;
  }

  return (
    <Link to={to} className="block h-full">
      {content}
    </Link>
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
