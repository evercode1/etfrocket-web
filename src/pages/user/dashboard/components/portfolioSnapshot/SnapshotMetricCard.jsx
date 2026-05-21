import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function SnapshotMetricCard({
  icon: Icon,
  label,
  value,
  detail,
  to = null,
}) {
  const content = (
    <div className="glass-card h-full rounded-3xl p-6 transition hover:-translate-y-1 hover:border-brand-primary/50">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand-primary">
          <span>Live</span>
          {to && <ArrowUpRight className="h-4 w-4" />}
        </div>
      </div>

      <p className="mt-5 text-sm text-brand-muted">{label}</p>

      <p className="mt-2 font-display text-3xl font-bold">{value}</p>

      <p className="mt-2 text-sm text-brand-muted">{detail}</p>
    </div>
  );

  if (!to) {
    return content;
  }

  return (
    <Link to={to} className="block h-full">
      {content}
    </Link>
  );
}
