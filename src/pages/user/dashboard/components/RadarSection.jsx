import { Eye } from "lucide-react";

import RadarCard from "./RadarCard";

export default function RadarSection({
  portfolioId,
  hasPortfolio = true,
  hasHoldings = false,
}) {
  console.log("Radar portfolioId", portfolioId);
  const radarTools = [
    {
      title: "Compare My ETFs",
      description:
        "Compare ETFs you already own across income, return, NAV stability, and AUM trends.",
      badge: "Portfolio",
      stats: [
        { label: "Source", value: "Current Holdings" },
        { label: "Best For", value: "Allocation Review" },
      ],
      to: portfolioId
        ? `/dashboard/radar/portfolio-compare/${portfolioId}`
        : null,
      disabled: !hasHoldings,
    },
    {
      title: "Compare Symbols",
      description:
        "Enter a small group of ETF symbols and compare them side-by-side before adding to a portfolio.",
      badge: "Custom",
      stats: [
        { label: "Input", value: "ETF Symbols" },
        { label: "Limit", value: "Up to 10" },
      ],
      to: "/dashboard/radar/compare-symbols",
      disabled: false,
    },
    {
      title: "ETF Rankings",
      description:
        "Rank ETFs by yield, NAV stability, AUM growth, total return, dividend trends, and risk signals.",
      badge: "Research",
      stats: [
        { label: "Mode", value: "Screener" },
        { label: "Sort By", value: "ETF Metrics" },
      ],
      to: "/dashboard/radar/metric-explorer",
      disabled: false,
    },
  ];

  if (!hasPortfolio) {
    return (
      <section className="space-y-5">
        <SectionHeader
          icon={Eye}
          eyebrow="ETF Radar"
          title="Research Command Center"
          description="Create a portfolio to unlock ETF research and comparison tools."
        />

        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          ETF research tools will appear here once portfolio data is available.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <SectionHeader
        icon={Eye}
        eyebrow="ETF Radar"
        title="Research Command Center"
        description="Compare your holdings, test ETF ideas, and explore the strongest opportunities by metric."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {radarTools.map((tool) => (
          <RadarCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            badge={tool.badge}
            stats={tool.stats}
            to={tool.to}
            disabled={tool.disabled}
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
