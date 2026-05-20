import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function SignalCard({ type, title, message, to = null }) {
  const content = (
    <div className="glass-card rounded-3xl p-6 transition hover:-translate-y-1 hover:border-brand-primary/40">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
          {type}
        </p>
      </div>

      <h3 className="mt-5 font-display text-2xl font-bold">{title}</h3>

      <p className="mt-3 leading-relaxed text-brand-muted">{message}</p>
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
