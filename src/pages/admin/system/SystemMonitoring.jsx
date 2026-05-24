import { Link } from "react-router-dom";

import { Activity, ArrowRight, Clock3, Database, Server } from "lucide-react";

export default function SystemMonitoring() {
  return (
    <div className="space-y-8">
      {/* Header */}

      <section className="glass-card rounded-3xl p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
            <Activity className="h-7 w-7" />
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">
              System Operations
            </p>

            <h1 className="mt-2 font-display text-5xl font-black text-white">
              System Monitoring
            </h1>
          </div>
        </div>

        <p className="mt-8 max-w-4xl text-lg leading-relaxed text-slate-300">
          Monitor cron execution, AI processing activity, import systems,
          operational telemetry, and platform infrastructure health.
        </p>
      </section>

      {/* Monitoring Cards */}

      <section className="grid gap-6 lg:grid-cols-3">
        <MonitoringCard
          to="/admin/cron-reports"
          icon={Clock3}
          title="Cron Reports"
          description="Track cron execution history, runtime telemetry, failures, and operational status."
          status="ACTIVE"
        />

        <MonitoringCard
          to="#"
          icon={Database}
          title="Import Activity"
          description="Monitor ETF imports, NAV synchronization, AUM ingestion, and data pipeline activity."
          status="COMING SOON"
          disabled
        />

        <MonitoringCard
          to="#"
          icon={Server}
          title="System Health"
          description="Review API health, queue processing, cache systems, and infrastructure telemetry."
          status="COMING SOON"
          disabled
        />
      </section>
    </div>
  );
}

function MonitoringCard({
  to,
  icon: Icon,
  title,
  description,
  status,
  disabled = false,
}) {
  const content = (
    <div
      className={`group glass-card relative flex h-full flex-col rounded-3xl border border-white/10 p-8 transition-all duration-300 ${
        disabled
          ? "cursor-not-allowed opacity-70"
          : "hover:border-cyan-400/30 hover:bg-[#0c1729]"
      }`}
    >
      {/* Glow */}

      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
            <Icon className="h-6 w-6" />
          </div>

          <div
            className={`rounded-full border px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${
              disabled
                ? "border-white/10 text-slate-500"
                : "border-cyan-400/20 text-cyan-300"
            }`}
          >
            {status}
          </div>
        </div>

        <h2 className="mt-8 font-display text-3xl font-bold text-white">
          {title}
        </h2>

        <p className="mt-5 flex-1 leading-relaxed text-slate-300">
          {description}
        </p>

        <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-cyan-300">
          Open Monitoring
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );

  if (disabled) {
    return content;
  }

  return <Link to={to}>{content}</Link>;
}
