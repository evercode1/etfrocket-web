import { Link } from "react-router-dom";

import { ArrowLeft, Brain, Clock3, ShieldCheck, Sparkles } from "lucide-react";

import ReactMarkdown from "react-markdown";

const mockSignals = {
  snapshot: {
    title: "AI Market Snapshot",

    subtitle:
      "Daily AI-generated overview of market sentiment and macro positioning.",

    mood: "Risk-On",

    confidence: 82,

    updated_at: "Updated 12 minutes ago",

    markdown: `
# Market Snapshot

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
`,
  },

  conditions: {
    title: "AI Market Conditions",

    subtitle: "AI interpretation of volatility, momentum, and market behavior.",

    mood: "Neutral",

    confidence: 74,

    updated_at: "Updated 18 minutes ago",

    markdown: `
# Current Conditions

The market remains in a transitional phase between defensive positioning and renewed risk appetite.

## Current Readings

- Volatility declining
- Bond market stabilizing
- Momentum breadth improving
- Defensive sectors weakening

## AI Interpretation

Current conditions suggest:
- selective bullish continuation
- moderate risk appetite
- improving momentum participation
`,
  },

  events: {
    title: "AI Market Events",

    subtitle:
      "Upcoming catalysts and macro events impacting financial markets.",

    mood: "Event Driven",

    confidence: 91,

    updated_at: "Updated 6 minutes ago",

    markdown: `
# Upcoming Events

Several major macro catalysts are approaching.

## This Week

- Federal Reserve commentary
- Treasury auctions
- Large-cap earnings
- Employment data release

## AI Interpretation

The AI system expects elevated market sensitivity surrounding:
- interest rates
- growth expectations
- liquidity conditions
`,
  },
};

export default function AiSignalsPage({ type = "snapshot" }) {
  const signal = mockSignals[type] || mockSignals.snapshot;

  return (
    <div className="space-y-8">
      {/* Header */}

      <section className="glass-card rounded-3xl p-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
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

          {/* Status Card */}

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
                  {signal.mood}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <TelemetryRow
                icon={ShieldCheck}
                label="AI Confidence"
                value={`${signal.confidence}%`}
              />

              <TelemetryRow
                icon={Clock3}
                label="Last Updated"
                value={signal.updated_at}
              />

              <TelemetryRow
                icon={Sparkles}
                label="Signal Source"
                value="AI Telemetry"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Markdown Content */}

        <div className="glass-card rounded-3xl p-8">
          <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-brand-muted prose-strong:text-brand-primary prose-li:text-brand-muted">
            <ReactMarkdown>{signal.markdown}</ReactMarkdown>
          </div>
        </div>

        {/* Sidebar */}

        <div className="space-y-6">
          <SignalCard
            title="AI Signal Status"
            value="ONLINE"
            subtitle="Telemetry feed active"
          />

          <SignalCard
            title="Macro Bias"
            value="Moderately Bullish"
            subtitle="Momentum participation improving"
          />

          <SignalCard
            title="Risk Environment"
            value="Elevated"
            subtitle="Event volatility expected"
          />
        </div>
      </section>
    </div>
  );
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
