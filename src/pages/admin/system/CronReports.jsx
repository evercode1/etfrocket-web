import {
  Activity,
  AlertTriangle,
  Clock3,
  Database,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

const mockCronData = [
  {
    id: 1,

    cron_name: "ai:generate-signals",

    status: "COMPLETED",

    runtime: "4s",

    interval: "Hourly",

    started_at: "2026-05-24 10:00 AM",

    notification_status: "Nothing To Send",
  },

  {
    id: 2,

    cron_name: "etfs:calculate-metrics",

    status: "COMPLETED",

    runtime: "19s",

    interval: "Daily",

    started_at: "2026-05-24 09:00 AM",

    notification_status: "Nothing To Send",
  },

  {
    id: 3,

    cron_name: "app:trim-cron-logs",

    status: "COMPLETED",

    runtime: "1s",

    interval: "Weekly",

    started_at: "2026-05-24 04:00 AM",

    notification_status: "Nothing To Send",
  },
];

export default function CronReports() {
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
              Cron Reports
            </h1>
          </div>
        </div>

        <p className="mt-8 max-w-4xl text-lg leading-relaxed text-slate-300">
          Monitor scheduled task execution, cron runtime telemetry, failure
          tracking, and operational scheduling activity across ETF Rocket.
        </p>
      </section>

      {/* Telemetry */}

      <section className="grid gap-6 lg:grid-cols-4">
        <TelemetryCard
          icon={ShieldCheck}
          label="Successful Runs"
          value="148"
          color="text-emerald-300"
        />

        <TelemetryCard
          icon={AlertTriangle}
          label="Failed Runs"
          value="0"
          color="text-amber-300"
        />

        <TelemetryCard
          icon={Clock3}
          label="Average Runtime"
          value="6s"
          color="text-cyan-300"
        />

        <TelemetryCard
          icon={RefreshCcw}
          label="Active Crons"
          value="3"
          color="text-violet-300"
        />
      </section>

      {/* Table */}

      <section className="glass-card overflow-hidden rounded-3xl">
        <div className="border-b border-white/10 px-8 py-6">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-cyan-300" />

            <h2 className="font-display text-2xl font-bold text-white">
              Recent Cron Activity
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-white/10 bg-[#0a1424]">
              <tr className="text-left">
                <TableHeading>Cron</TableHeading>

                <TableHeading>Status</TableHeading>

                <TableHeading>Runtime</TableHeading>

                <TableHeading>Interval</TableHeading>

                <TableHeading>Started</TableHeading>

                <TableHeading>Notification</TableHeading>
              </tr>
            </thead>

            <tbody>
              {mockCronData.map((cron) => (
                <tr
                  key={cron.id}
                  className="border-b border-white/5 transition hover:bg-white/[0.02]"
                >
                  <TableCell className="font-mono text-cyan-300">
                    {cron.cron_name}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={cron.status} />
                  </TableCell>

                  <TableCell>{cron.runtime}</TableCell>

                  <TableCell>{cron.interval}</TableCell>

                  <TableCell>{cron.started_at}</TableCell>

                  <TableCell>{cron.notification_status}</TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function TelemetryCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">
            {label}
          </p>

          <p className={`mt-4 font-display text-4xl font-black ${color}`}>
            {value}
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/5">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}

function TableHeading({ children }) {
  return (
    <th className="px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] text-slate-400">
      {children}
    </th>
  );
}

function TableCell({ children, className = "" }) {
  return (
    <td
      className={`whitespace-nowrap px-8 py-5 text-sm text-slate-300 ${className}`}
    >
      {children}
    </td>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
      {status}
    </span>
  );
}
