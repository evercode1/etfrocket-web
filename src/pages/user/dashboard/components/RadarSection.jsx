import { Eye } from "lucide-react";

import RadarCard from "./RadarCard";

const fallbackRadarItems = [
  {
    ticker: "NVII",
    yield: "38.4%",
    nav: "Improving",
    momentum: "+8.7%",
  },
  {
    ticker: "CHPY",
    yield: "41.2%",
    nav: "Stable",
    momentum: "+4.1%",
  },
  {
    ticker: "AMDY",
    yield: "52.8%",
    nav: "Watch",
    momentum: "-2.6%",
  },
];

export default function RadarSection({
  portfolioId,
  hasPortfolio = true,
  hasHoldings = false,
}) {
  if (!hasPortfolio) {
    return (
      <section className="space-y-5">
        <SectionHeader
          icon={Eye}
          eyebrow="Watchlist Intelligence"
          title="Tracked ETF Radar"
          description="Create a portfolio to unlock ETF radar insights."
        />

        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          ETF radar cards will appear here once portfolio data is available.
        </div>
      </section>
    );
  }

  if (!hasHoldings) {
    return (
      <section className="space-y-5">
        <SectionHeader
          icon={Eye}
          eyebrow="Watchlist Intelligence"
          title="Tracked ETF Radar"
          description="Add ETFs to your portfolio to unlock ETF radar insights."
        />

        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          Add ETF transactions to this portfolio to track yield, NAV direction,
          and momentum signals.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <SectionHeader
        icon={Eye}
        eyebrow="Watchlist Intelligence"
        title="Tracked ETF Radar"
        description="A future snapshot of ETFs the user follows, with yield, NAV direction, and momentum signals."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {fallbackRadarItems.map((item) => (
          <RadarCard
            key={item.ticker}
            ticker={item.ticker}
            yieldValue={item.yield}
            nav={item.nav}
            momentum={item.momentum}
            portfolioId={portfolioId}
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
