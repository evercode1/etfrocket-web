import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock3,
  Database,
  Download,
  ShieldCheck,
} from "lucide-react";

import { getImportLogs } from "../../../api/monitoring";

export default function ImportList() {
  const [imports, setImports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadImports() {
      try {
        const response = await getImportLogs();

        setImports(response.logs.data);
      } catch (err) {
        setError("Failed to load import activity.");
      } finally {
        setLoading(false);
      }
    }

    loadImports();
  }, []);

  const telemetry = useMemo(() => {
    const successfulImports = imports.filter(
      (item) => item.status_name === "COMPLETED",
    ).length;

    const failedImports = imports.filter(
      (item) => item.status_name === "FAILED",
    ).length;

    const totalProcessed = imports.reduce(
      (total, item) => total + item.rows_processed,

      0,
    );

    const averageRuntime = imports.length
      ? Math.round(
          imports.reduce(
            (total, item) => total + item.run_time,

            0,
          ) / imports.length,
        )
      : 0;

    return {
      successfulImports,

      failedImports,

      totalProcessed,

      averageRuntime,
    };
  }, [imports]);

  return (
    <div className="space-y-8">
      {/* Header */}

      <section className="glass-card rounded-3xl p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
            <Download className="h-7 w-7" />
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">
              Data Pipeline Monitoring
            </p>

            <h1 className="mt-2 font-display text-5xl font-black text-white">
              Import Activity
            </h1>
          </div>
        </div>

        <p className="mt-8 max-w-4xl text-lg leading-relaxed text-slate-300">
          Monitor ETF imports, dividend synchronization, NAV telemetry, AUM
          ingestion, and external provider pipeline activity.
        </p>
      </section>

      {/* Telemetry */}

      <section className="grid gap-6 lg:grid-cols-4">
        <TelemetryCard
          icon={ShieldCheck}
          label="Successful Imports"
          value={telemetry.successfulImports}
          color="text-emerald-300"
        />

        <TelemetryCard
          icon={AlertTriangle}
          label="Failed Imports"
          value={telemetry.failedImports}
          color="text-amber-300"
        />

        <TelemetryCard
          icon={Database}
          label="Records Processed"
          value={telemetry.totalProcessed.toLocaleString()}
          color="text-cyan-300"
        />

        <TelemetryCard
          icon={Clock3}
          label="Average Runtime"
          value={`${telemetry.averageRuntime}s`}
          color="text-violet-300"
        />
      </section>

      {/* Table */}

      <section className="glass-card overflow-hidden rounded-3xl">
        <div className="border-b border-white/10 px-8 py-6">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-cyan-300" />

            <h2 className="font-display text-2xl font-bold text-white">
              Recent Import Activity
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-slate-300">Loading import activity...</div>
        ) : error ? (
          <div className="p-8 text-red-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-white/10 bg-[#0a1424]">
                <tr className="text-left">
                  <TableHeading>Import Type</TableHeading>

                  <TableHeading>Status</TableHeading>

                  <TableHeading>Runtime</TableHeading>

                  <TableHeading>Created</TableHeading>

                  <TableHeading>Updated</TableHeading>

                  <TableHeading>Started</TableHeading>

                  <TableHeading>Details</TableHeading>
                </tr>
              </thead>

              <tbody>
                {imports.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >
                    <TableCell className="font-mono text-cyan-300">
                      {item.import_type_name}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={item.status_name} />
                    </TableCell>

                    <TableCell>{item.run_time}s</TableCell>

                    <TableCell>{item.records_created}</TableCell>

                    <TableCell>{item.records_updated}</TableCell>

                    <TableCell>{formatDate(item.started_at)}</TableCell>

                    <TableCell>
                      <Link
                        to={`/admin/import-detail/${item.id}`}
                        className="flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                      >
                        View
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function TelemetryCard({
  icon: Icon,

  label,

  value,

  color,
}) {
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

function TableCell({
  children,

  className = "",
}) {
  return (
    <td
      className={`whitespace-nowrap px-8 py-5 text-sm text-slate-300 ${className}`}
    >
      {children}
    </td>
  );
}

function StatusBadge({ status }) {
  const isCompleted = status === "COMPLETED";

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
        isCompleted
          ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : "border border-amber-400/20 bg-amber-400/10 text-amber-300"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}
