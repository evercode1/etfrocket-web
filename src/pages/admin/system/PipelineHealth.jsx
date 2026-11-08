import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { getPipelineHealth } from "../../../api/monitoring";
import { formatDate } from "../../../utils/aumFormat";

const REFRESH_MS = 5 * 60 * 1000;

/*
| Status tokens (reserved for state; always paired with an icon + label).
*/
const TONES = {
  good: {
    text: "text-emerald-300",
    chip: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
    icon: CheckCircle2,
  },
  warning: {
    text: "text-amber-300",
    chip: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    icon: AlertTriangle,
  },
  critical: {
    text: "text-brand-danger",
    chip: "border-red-400/40 bg-red-400/10 text-red-100",
    icon: AlertOctagon,
  },
  neutral: {
    text: "text-brand-muted",
    chip: "border-brand-outline bg-brand-surfaceHigh text-brand-muted",
    icon: Clock,
  },
};

const OVERALL = {
  healthy: { tone: "good", title: "All systems normal" },
  warning: { tone: "warning", title: "Needs attention" },
  critical: { tone: "critical", title: "Action required" },
};

function parseTime(value) {
  if (!value) {
    return null;
  }

  // API timestamps without a zone are UTC ("2026-11-08 19:57:18").
  const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(iso);

  return Number.isNaN(date.getTime()) ? null : date;
}

function relativeTime(value) {
  const date = parseTime(value);

  if (!date) {
    return "—";
  }

  const minutes = Math.round((Date.now() - date.getTime()) / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);

  if (hours < 48) return `${hours} hr ago`;

  return `${Math.round(hours / 24)} days ago`;
}

function absoluteTime(value) {
  const date = parseTime(value);

  return date ? date.toLocaleString() : "";
}

export default function PipelineHealth() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State is only set from the promise callbacks (never synchronously in the effect).
  const fetchHealth = useCallback(
    () =>
      getPipelineHealth()
        .then((response) => {
          setData(response.data);
          setError(null);
        })
        .catch((err) => {
          setError(
            err.response?.data?.message || "Unable to load pipeline health.",
          );
        })
        .finally(() => setLoading(false)),
    [],
  );

  const load = useCallback(() => {
    setLoading(true);
    fetchHealth();
  }, [fetchHealth]);

  useEffect(() => {
    fetchHealth();

    const timer = setInterval(load, REFRESH_MS);

    return () => clearInterval(timer);
  }, [fetchHealth, load]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
            Admin
          </p>

          <h1 className="mt-2 font-display text-4xl font-bold text-white">
            Pipeline Health
          </h1>

          <p className="mt-2 text-sm text-brand-muted">
            Is AUM data flowing? Scrapers, crons and coverage at a glance.
            {data && (
              <>
                {" "}
                Checked {relativeTime(data.generated_at)}; refreshes every 5
                minutes.
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-brand-outline px-4 py-2 text-sm text-brand-text transition hover:bg-brand-surfaceHigh disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          Refresh
        </button>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {!data && loading && (
        <p className="font-mono text-sm uppercase tracking-widest text-brand-primary">
          Loading…
        </p>
      )}

      {data && (
        <div
          className={`space-y-8 transition-opacity ${loading ? "opacity-60" : "opacity-100"}`}
        >
          <OverallBanner overall={data.overall} />

          <CoverageCards
            coverage={data.coverage}
            staleAfterDays={data.stale_after_days}
          />

          <CronTable crons={data.crons} />

          <IssuerTable
            issuers={data.issuers}
            windowDays={data.issuer_window_days}
          />

          <ProblemTable problems={data.problems} />
        </div>
      )}
    </div>
  );
}

function OverallBanner({ overall }) {
  const config = OVERALL[overall.status] ?? OVERALL.warning;
  const tone = TONES[config.tone];
  const Icon = tone.icon;

  return (
    <section
      role="status"
      className={`flex gap-4 rounded-3xl border px-6 py-5 ${tone.chip}`}
    >
      <Icon className={`mt-0.5 h-6 w-6 shrink-0 ${tone.text}`} aria-hidden="true" />

      <div>
        <p className="font-display text-xl font-bold text-white">
          {config.title}
        </p>

        {overall.reasons.length > 0 ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {overall.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm">
            Scrapers and crons are running on schedule and all covered ETFs
            have current data.
          </p>
        )}
      </div>
    </section>
  );
}

function CoverageCards({ coverage, staleAfterDays }) {
  const cards = [
    {
      label: "Covered ETFs",
      value: coverage.covered,
      detail: "Issuer has a scraper + active schedule",
    },
    {
      label: "Scraped in last 24h",
      value: `${coverage.updated_last_24h} / ${coverage.covered}`,
      detail: "Successful scrape attempts",
      tone: coverage.updated_last_24h < coverage.covered ? "warning" : null,
    },
    {
      label: "Current",
      value: coverage.current,
      detail: `AUM within ${staleAfterDays} days`,
    },
    {
      label: "Stale",
      value: coverage.stale,
      detail: `No new AUM in ${staleAfterDays}+ days`,
      tone: coverage.stale > 0 ? "warning" : null,
    },
    {
      label: "Awaiting first data",
      value: coverage.pending,
      detail: "Covered, never scraped successfully",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="glass-card rounded-3xl p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-muted">
            {card.label}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${
              card.tone ? TONES[card.tone].text : "text-white"
            }`}
          >
            {card.value}
          </p>

          <p className="mt-1 text-xs text-brand-muted">{card.detail}</p>
        </div>
      ))}
    </section>
  );
}

function StatusChip({ tone, label }) {
  const config = TONES[tone];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.chip}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

function Card({ title, subtitle, action, children }) {
  return (
    <section className="glass-card overflow-hidden rounded-3xl">
      <div className="flex flex-col gap-1 border-b border-brand-outline px-6 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white">{title}</h2>

          {subtitle && <p className="text-sm text-brand-muted">{subtitle}</p>}
        </div>

        {action}
      </div>

      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-muted ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function cronStatus(cron) {
  if (!cron.last_run_at) return { tone: "critical", label: "Never run" };
  if (cron.is_overdue) return { tone: "critical", label: "Overdue" };
  if (cron.last_status === "failed") return { tone: "critical", label: "Failed" };
  if (cron.failures_last_24h > 0) return { tone: "warning", label: "Recent failures" };

  return { tone: "good", label: "OK" };
}

function CronTable({ crons }) {
  return (
    <Card
      title="Scheduled jobs"
      subtitle="Last run of each cron. Overdue means it missed its schedule."
      action={
        <Link
          to="/admin/cron-reports"
          className="text-sm text-brand-primary hover:underline"
        >
          All cron runs →
        </Link>
      }
    >
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-brand-surfaceLow/80">
          <tr>
            <Th>Job</Th>
            <Th>Schedule</Th>
            <Th>Status</Th>
            <Th>Last run</Th>
            <Th align="right">Runs (24h)</Th>
            <Th align="right">Failures (24h)</Th>
          </tr>
        </thead>

        <tbody className="divide-y divide-brand-outline/60">
          {crons.map((cron) => {
            const status = cronStatus(cron);

            return (
              <tr key={cron.command}>
                <td className="px-4 py-3">
                  <div className="font-semibold text-white">{cron.label}</div>
                  <div className="font-mono text-xs text-brand-muted">
                    {cron.command}
                  </div>
                  {cron.last_fail_details && (
                    <div className="mt-1 max-w-md truncate text-xs text-red-200" title={cron.last_fail_details}>
                      {cron.last_fail_details}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-brand-muted">{cron.schedule}</td>
                <td className="px-4 py-3">
                  <StatusChip tone={status.tone} label={status.label} />
                </td>
                <td className="px-4 py-3 text-brand-text" title={absoluteTime(cron.last_run_at)}>
                  {relativeTime(cron.last_run_at)}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-brand-text">
                  {cron.runs_last_24h}
                </td>
                <td
                  className={`px-4 py-3 text-right font-mono tabular-nums ${
                    cron.failures_last_24h > 0 ? "text-brand-danger" : "text-brand-muted"
                  }`}
                >
                  {cron.failures_last_24h}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function issuerStatus(issuer) {
  if (issuer.covered > 0 && issuer.failing_now === issuer.covered) {
    return { tone: "critical", label: "Scraper failing" };
  }

  if (issuer.success_rate === null) return { tone: "neutral", label: "No attempts" };

  // Same thresholds as the API's overall status: one transient failure is
  // not "degraded"; those still appear in the ETF problem list.
  const failingShare = issuer.covered > 0 ? issuer.failing_now / issuer.covered : 0;

  if (issuer.success_rate < 80 || failingShare >= 0.25) {
    return { tone: "warning", label: "Degraded" };
  }

  return { tone: "good", label: "Healthy" };
}

function SuccessMeter({ rate }) {
  if (rate === null) {
    return <span className="text-brand-muted">—</span>;
  }

  const tone = rate >= 95 ? "bg-emerald-300" : rate >= 80 ? "bg-amber-300" : "bg-red-400";

  return (
    <div className="flex items-center justify-end gap-3">
      <span className="font-mono tabular-nums text-brand-text">{rate}%</span>
      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-brand-surfaceHighest" aria-hidden="true">
        <span className={`block h-full rounded-full ${tone}`} style={{ width: `${rate}%` }} />
      </span>
    </div>
  );
}

function IssuerTable({ issuers, windowDays }) {
  return (
    <Card
      title="Scrapers by issuer"
      subtitle={`Scrape success over the last ${windowDays} days. A whole issuer failing usually means its website changed.`}
    >
      <table className="w-full min-w-[860px] text-sm">
        <thead className="bg-brand-surfaceLow/80">
          <tr>
            <Th>Issuer</Th>
            <Th>Status</Th>
            <Th align="right">ETFs</Th>
            <Th align="right">Failing now</Th>
            <Th align="right">Success ({windowDays}d)</Th>
            <Th align="right">Attempts</Th>
            <Th>Last success</Th>
            <Th align="right">Stale</Th>
          </tr>
        </thead>

        <tbody className="divide-y divide-brand-outline/60">
          {issuers.map((issuer) => {
            const status = issuerStatus(issuer);

            return (
              <tr key={issuer.issuer_id}>
                <td className="px-4 py-3 font-semibold text-white">{issuer.issuer_name}</td>
                <td className="px-4 py-3">
                  <StatusChip tone={status.tone} label={status.label} />
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-brand-text">{issuer.covered}</td>
                <td
                  className={`px-4 py-3 text-right font-mono tabular-nums ${
                    issuer.failing_now > 0 ? "text-brand-danger" : "text-brand-muted"
                  }`}
                >
                  {issuer.failing_now}
                </td>
                <td className="px-4 py-3">
                  <SuccessMeter rate={issuer.success_rate} />
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-brand-muted">
                  {issuer.successes}/{issuer.attempts}
                </td>
                <td className="px-4 py-3 text-brand-text" title={absoluteTime(issuer.last_success_at)}>
                  {relativeTime(issuer.last_success_at)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-mono tabular-nums ${
                    issuer.stale > 0 ? "text-amber-300" : "text-brand-muted"
                  }`}
                >
                  {issuer.stale}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function problemStatus(problem) {
  if (problem.status === "stale") return { tone: "warning", label: "Stale" };
  if (problem.status === "pending") return { tone: "neutral", label: "Awaiting data" };

  return { tone: "critical", label: "Scrape failing" };
}

function ProblemTable({ problems }) {
  return (
    <Card
      title="ETFs needing attention"
      subtitle="Stale, awaiting first data, or failing on the latest scrape attempt."
      action={
        <Link to="/admin/import-list" className="text-sm text-brand-primary hover:underline">
          Import activity →
        </Link>
      }
    >
      {problems.length === 0 ? (
        <p className="flex items-center gap-2 px-6 py-8 text-sm text-emerald-200">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Every covered ETF has current data and its latest scrape succeeded.
        </p>
      ) : (
        <table className="w-full min-w-[960px] text-sm">
          <thead className="bg-brand-surfaceLow/80">
            <tr>
              <Th>ETF</Th>
              <Th>Issuer</Th>
              <Th>Status</Th>
              <Th>Latest AUM</Th>
              <Th>Last success</Th>
              <Th>Last failure</Th>
              <Th>Last error</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-outline/60">
            {problems.map((problem) => {
              const status = problemStatus(problem);

              return (
                <tr key={problem.security_id}>
                  <td className="px-4 py-3">
                    <Link
                      to={`/aum/${problem.symbol}`}
                      className="font-mono font-bold text-brand-primary hover:underline"
                    >
                      {problem.symbol}
                    </Link>
                    <div className="max-w-[14rem] truncate text-xs text-brand-muted">{problem.name}</div>
                  </td>
                  <td className="px-4 py-3 text-brand-muted">{problem.issuer_name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <StatusChip tone={status.tone} label={status.label} />
                      {problem.status !== "current" && problem.latest_attempt_failed && (
                        <StatusChip tone="critical" label="Scrape failing" />
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-brand-text">
                    {problem.latest_aum_date ? formatDate(problem.latest_aum_date) : "—"}
                  </td>
                  <td className="px-4 py-3 text-brand-text" title={absoluteTime(problem.last_success_at)}>
                    {relativeTime(problem.last_success_at)}
                  </td>
                  <td className="px-4 py-3 text-brand-text" title={absoluteTime(problem.last_failure_at)}>
                    {relativeTime(problem.last_failure_at)}
                  </td>
                  <td className="px-4 py-3">
                    {problem.last_error ? (
                      <span className="flex max-w-xs items-start gap-1.5 text-xs text-red-200" title={problem.last_error}>
                        <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="line-clamp-2">{problem.last_error}</span>
                      </span>
                    ) : (
                      <span className="text-brand-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Card>
  );
}
