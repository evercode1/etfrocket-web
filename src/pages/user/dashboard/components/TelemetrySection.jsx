import { RadioTower, TrendingUp } from "lucide-react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import TelemetryCard from "./TelemetryCard";

const activityData = [
  "Price history imported for NVII",
  "Dividend history updated for AMDY",
  "ETF metrics recalculated",
  "AI extraction queued for covered-call universe",
];

const momentumPulseData = [
  { date: "Jan", income: 220 },
  { date: "Feb", income: 245 },
  { date: "Mar", income: 238 },
  { date: "Apr", income: 271 },
  { date: "May", income: 292 },
];

export default function TelemetrySection({
  portfolioId,
  hasPortfolio = true,
  hasHoldings = false,
}) {
  if (!hasPortfolio) {
    return (
      <section className="space-y-5">
        <SectionHeader
          icon={RadioTower}
          eyebrow="Market & System Activity"
          title="Latest Telemetry"
          description="Create a portfolio to unlock activity and system telemetry."
        />

        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          Telemetry will appear here once ETF and portfolio activity begins.
        </div>
      </section>
    );
  }

  if (!hasHoldings) {
    return (
      <section className="space-y-5">
        <SectionHeader
          icon={RadioTower}
          eyebrow="Market & System Activity"
          title="Latest Telemetry"
          description="Add ETFs to your portfolio to unlock market and system telemetry."
        />

        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          Add ETF transactions to this portfolio to track imports, dividend
          updates, metric recalculations, and momentum activity.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <SectionHeader
        icon={RadioTower}
        eyebrow="Market & System Activity"
        title="Latest Telemetry"
        description="A future stream of imports, dividend updates, extraction events, and ETF data refreshes."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <TelemetryCard
          icon={RadioTower}
          title="Activity Feed"
          subtitle="Placeholder operational timeline"
          className="lg:col-span-3"
        >
          <div className="mt-6 space-y-4">
            {activityData.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3"
              >
                <div className="h-2.5 w-2.5 rounded-full bg-brand-primary shadow-glow" />

                <p className="text-sm text-brand-muted">{item}</p>
              </div>
            ))}
          </div>
        </TelemetryCard>

        <TelemetryCard
          icon={TrendingUp}
          title="Momentum Pulse"
          subtitle="Placeholder ETF momentum sample"
          className="lg:col-span-2"
        >
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={momentumPulseData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#94a3b8",
                    color: "#0f172a",
                  }}
                  labelStyle={{
                    color: "#0f172a",
                    fontWeight: 700,
                  }}
                  itemStyle={{
                    color: "#1e293b",
                    fontWeight: 600,
                  }}
                  formatter={(value) =>
                    Number(value).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="currentColor"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TelemetryCard>
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
