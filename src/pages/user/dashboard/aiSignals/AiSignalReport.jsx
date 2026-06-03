import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { ArrowLeft, Brain, Clock3, ShieldCheck, Sparkles } from "lucide-react";

import ReactMarkdown from "react-markdown";

import { getAiSignal } from "../../../../api/aiSignals";

export default function AiSignalReport() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [signal, setSignal] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await getAiSignal(id);

        setSignal(response.data);
      } catch (error) {
        console.error(
          "Failed to load AI signal",

          error,
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center text-brand-muted">
        Loading AI report...
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center text-brand-muted">
        AI report not found.
      </div>
    );
  }

  const relatedSymbols = extractSymbols(signal);

  function extractSymbols(signal) {
    if (!signal?.payload_json?.signal_payload) {
      return [];
    }

    const markdown = signal.markdown_content ?? "";

    const payload = signal.payload_json.signal_payload;

    const candidates = [
      ...(payload.top_performers ?? []),
      ...(payload.price_movers ?? []),
      ...(payload.aum_growth ?? []),
      ...(payload.nav_health ?? []),
    ];

    const seen = new Set();

    return candidates
      .map((item) => item.symbol)
      .filter(Boolean)
      .filter((symbol) => {
        if (seen.has(symbol)) {
          return false;
        }

        seen.add(symbol);

        const escapedSymbol = symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const regex = new RegExp(
          `(^|[^A-Z0-9])${escapedSymbol}([^A-Z0-9]|$)`,
          "i",
        );

        return regex.test(markdown);
      });
  }

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <Link
          to="/dashboard/ai-insights"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to AI Insights
        </Link>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
              AI Market Signals
            </p>

            <h1 className="mt-4 font-display text-5xl font-black">
              {signal.title}
            </h1>

            <p className="mt-4 max-w-3xl text-lg text-brand-muted">
              {signal.subtitle}
            </p>
          </div>

          <div className="glass-card min-w-[280px] rounded-3xl border border-brand-outline p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                <Brain className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                  Market Mood
                </p>

                <p className="mt-1 font-display text-2xl font-bold text-brand-primary">
                  {signal.market_mood}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <TelemetryRow
                icon={ShieldCheck}
                label="AI Confidence"
                value={`${signal.confidence_score}%`}
              />

              <TelemetryRow
                icon={Clock3}
                label="Generated"
                value={
                  signal.generated_at
                    ? new Date(signal.generated_at).toLocaleDateString()
                    : "-"
                }
              />

              <TelemetryRow
                icon={Sparkles}
                label="Model"
                value={signal.ai_model}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="glass-card rounded-3xl p-8">
          <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-brand-muted prose-strong:text-brand-primary prose-li:text-brand-muted">
            <ReactMarkdown>{signal.markdown_content}</ReactMarkdown>
          </div>
        </div>

        <div className="space-y-6">
          {relatedSymbols.length > 0 && (
            <div className="glass-card rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                ETFs Mentioned
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {relatedSymbols.map((symbol) => (
                  <Link
                    key={symbol}
                    to={`/dashboard/securities/${symbol}`}
                    className="rounded-xl border border-brand-primary/30 bg-brand-primary/10 px-3 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary/20"
                  >
                    {symbol}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <SignalCard
            title="Signal Type"
            value={signal.signal_type?.signal_type_name ?? "Unknown"}
            subtitle="Historical AI report"
          />

          <SignalCard
            title="Generated"
            value={
              signal.generated_at
                ? new Date(signal.generated_at).toLocaleDateString()
                : "-"
            }
            subtitle="Report generation date"
          />

          <SignalCard
            title="Model"
            value={signal.ai_model}
            subtitle="AI model used"
          />
        </div>
      </section>
    </div>
  );
}

function extractSymbols(signal) {
  if (!signal?.payload_json?.signal_payload) {
    return [];
  }

  const markdown = signal.markdown_content ?? "";

  const payload = signal.payload_json.signal_payload;

  const symbols = new Set();

  [
    payload.top_performers,
    payload.price_movers,
    payload.aum_growth,
    payload.nav_health,
  ]
    .filter(Boolean)
    .forEach((group) => {
      group.forEach((item) => {
        if (item.symbol && markdown.includes(item.symbol)) {
          symbols.add(item.symbol);
        }
      });
    });

  return [...symbols];
}

function TelemetryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-brand-primary" />

        <span className="text-sm text-brand-muted">{label}</span>
      </div>

      <span className="text-sm font-semibold text-brand-text">{value}</span>
    </div>
  );
}

function SignalCard({ title, value, subtitle }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
        {title}
      </p>

      <p className="mt-3 font-display text-3xl font-bold text-brand-primary">
        {value}
      </p>

      <p className="mt-2 text-sm text-brand-muted">{subtitle}</p>
    </div>
  );
}
