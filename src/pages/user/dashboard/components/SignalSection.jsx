import { BellRing } from "lucide-react";

import SignalCard from "./SignalCard";

const fallbackSignals = [
  {
    type: "Income",
    title: "Dividend activity",
    message:
      "Track upcoming weekly dividend events, payout history, income trends, and distribution growth signals across your ETF portfolio.",
    to: "/dashboard/dividends",
  },
  {
    type: "Opportunity",
    title: "Momentum improving",
    message: "NVII total return trend is strengthening over recent data.",
    to: null,
  },
  {
    type: "Risk",
    title: "NAV pressure detected",
    message: "AMDY shows short-term NAV erosion across the latest range.",
    to: null,
  },
];

export default function SignalSection({
  portfolioId,
  hasPortfolio,
  hasHoldings,
}) {
  if (!hasPortfolio) {
    return (
      <section className="space-y-5">
        <SectionHeader
          icon={BellRing}
          eyebrow="Risk & Opportunity Alerts"
          title="Signals Worth Watching"
          description="Create a portfolio to unlock dividend, momentum, and NAV signals."
        />

        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          Portfolio signals will appear here once you create your first
          portfolio and add transaction data.
        </div>
      </section>
    );
  }

  if (!hasHoldings) {
    return (
      <section className="space-y-5">
        <SectionHeader
          icon={BellRing}
          eyebrow="Risk & Opportunity Alerts"
          title="Signals Worth Watching"
          description="Add ETFs to your portfolio to unlock dividend, momentum, and NAV signals."
        />

        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          Add ETF transactions to this portfolio to track dividend activity,
          momentum shifts, NAV pressure, and other risk or opportunity signals.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <SectionHeader
        icon={BellRing}
        eyebrow="Risk & Opportunity Alerts"
        title="Signals Worth Watching"
        description="Future alerts generated from dividend activity, momentum shifts, NAV erosion, and unusual ETF behavior."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {fallbackSignals.map((signal) => (
          <SignalCard
            key={signal.title}
            type={signal.type}
            title={signal.title}
            message={signal.message}
            to={
              signal.type === "Income" && portfolioId
                ? `/dashboard/dividends/${portfolioId}`
                : null
            }
          />
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ icon: Icon, eyebrow, title, description }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <Icon className="h-5 w-5" />
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
          {eyebrow}
        </p>
      </div>

      <h2 className="mt-3 font-display text-3xl font-bold">{title}</h2>

      <p className="mt-2 max-w-3xl text-brand-muted">{description}</p>
    </div>
  );
}
