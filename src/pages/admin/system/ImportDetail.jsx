import ReactMarkdown from "react-markdown";

import {
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  FileWarning,
  Server,
} from "lucide-react";

const generatedMarkdown = `
# AI Market Snapshot

Markets continued higher today as treasury yields stabilized and volatility remained muted.

## Key Signals

- Nasdaq leadership remains strong
- Bitcoin momentum continues above breakout levels
- Treasury yields softened slightly
- Small caps showed improving participation

## AI Interpretation

Current market conditions favor:

- momentum continuation
- growth exposure
- income strategy participation

The AI system currently identifies improving breadth and elevated speculative appetite while defensive positioning continues to weaken.
`;

export default function ImportDetail() {
  return (
    <div className="space-y-8">
      {/* Header */}

      <section className="glass-card rounded-3xl p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
            <Database className="h-7 w-7" />
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">
              Import Telemetry
            </p>

            <h1 className="mt-2 font-display text-5xl font-black text-white">
              ETF Price Import
            </h1>
          </div>
        </div>

        <p className="mt-8 max-w-4xl text-lg leading-relaxed text-slate-300">
          Detailed operational telemetry and processing diagnostics for import
          execution activity.
        </p>
      </section>

      {/* Overview */}

      <section className="grid gap-6 lg:grid-cols-4">
        <DetailCard
          icon={CheckCircle2}
          label="Status"
          value="COMPLETED"
          color="text-emerald-300"
        />

        <DetailCard
          icon={Clock3}
          label="Runtime"
          value="12s"
          color="text-cyan-300"
        />

        <DetailCard
          icon={Database}
          label="Rows Processed"
          value="1,900"
          color="text-violet-300"
        />

        <DetailCard
          icon={Server}
          label="Provider"
          value="Manual Seed"
          color="text-amber-300"
        />
      </section>

      {/* Execution Details */}

      <section className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Left */}

        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-8">
            <h2 className="font-display text-2xl font-bold text-white">
              Execution Summary
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <SummaryItem label="Import Started" value="2026-05-24 08:00:01" />

              <SummaryItem
                label="Import Completed"
                value="2026-05-24 08:00:13"
              />

              <SummaryItem label="Records Created" value="1,480" />

              <SummaryItem label="Records Updated" value="420" />

              <SummaryItem label="Import Type" value="ETF Price Import" />

              <SummaryItem label="Status" value="Completed" />
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-3">
              <FileWarning className="h-5 w-5 text-cyan-300" />

              <h2 className="font-display text-2xl font-bold text-white">
                Processing Notes
              </h2>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0a1424] p-6 font-mono text-sm leading-relaxed text-slate-300">
              Import completed successfully.
              <br />
              <br />
              No duplicate records detected.
              <br />
              <br />
              Historical ETF price synchronization completed without provider
              interruption.
            </div>
          </div>

          {/* Generated Content */}

          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-cyan-300" />

              <h2 className="font-display text-2xl font-bold text-white">
                Generated Content
              </h2>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Markdown content generated during import processing and AI
              telemetry execution.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#0a1424] p-8">
              <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-slate-300 prose-strong:text-cyan-300 prose-li:text-slate-300">
                <ReactMarkdown>{generatedMarkdown}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}

        <div className="space-y-6">
          <SidebarCard
            label="Failure Count"
            value="0"
            subtitle="No processing failures detected"
          />

          <SidebarCard
            label="Duplicate Rows"
            value="0"
            subtitle="No duplicate entries detected"
          />

          <SidebarCard
            label="Data Integrity"
            value="PASSED"
            subtitle="Validation checks completed successfully"
          />
        </div>
      </section>
    </div>
  );
}

function DetailCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">
            {label}
          </p>

          <p className={`mt-4 font-display text-3xl font-black ${color}`}>
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

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a1424] p-5">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function SidebarCard({ label, value, subtitle }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">
        {label}
      </p>

      <p className="mt-4 font-display text-4xl font-black text-cyan-300">
        {value}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-slate-300">{subtitle}</p>
    </div>
  );
}
