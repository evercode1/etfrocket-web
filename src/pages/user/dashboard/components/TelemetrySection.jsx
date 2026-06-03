import { RadioTower, ArrowRight, TrendingUp } from "lucide-react";

import { Link } from "react-router-dom";

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
import BackTestingCard from "./BackTestingCard";

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
          eyebrow="AI Market Signals"
          title="Latest AI Market Signals"
          description="Create a portfolio to unlock AI-driven market insights and signals."
        />

        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          AI Market Signals will appear here once ETF and portfolio activity
          begins.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <SectionHeader
        icon={RadioTower}
        eyebrow="AI Market Signals"
        title="AI Market Signals"
        description="A stream of AI-driven market insights and signals."
      />

      <div className="grid gap-5 lg:grid-cols-5">
        {/* AI Signals */}

        <TelemetryCard
          title="Market Updates"
          subtitle="Daily AI generated market intelligence"
          className="lg:col-span-3"
        >
          <div className="mt-6 space-y-3">
            <Link
              to="/dashboard/signals/watchlist"
              className="group flex items-center justify-between rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-5 py-4 transition hover:border-brand-primary hover:bg-brand-surfaceHighest"
            >
              <div>
                <p className="font-semibold text-brand-text transition group-hover:text-brand-primary">
                  AI ETF Watchlist
                </p>

                <p className="mt-1 text-sm text-brand-muted">
                  Top ETFs based on AI analysis.
                </p>
              </div>

              <ArrowRight className="h-5 w-5 text-brand-muted transition group-hover:text-brand-primary" />
            </Link>
            <Link
              to="/dashboard/signals/market-snapshot"
              className="group flex items-center justify-between rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-5 py-4 transition hover:border-brand-primary hover:bg-brand-surfaceHighest"
            >
              <div>
                <p className="font-semibold text-brand-text transition group-hover:text-brand-primary">
                  AI Market Snapshot
                </p>

                <p className="mt-1 text-sm text-brand-muted">
                  Daily overview of market sentiment, flows, and macro
                  positioning.
                </p>
              </div>

              <ArrowRight className="h-5 w-5 text-brand-muted transition group-hover:text-brand-primary" />
            </Link>

            <Link
              to="/dashboard/signals/market-conditions"
              className="group flex items-center justify-between rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-5 py-4 transition hover:border-brand-primary hover:bg-brand-surfaceHighest"
            >
              <div>
                <p className="font-semibold text-brand-text transition group-hover:text-brand-primary">
                  AI Market Conditions
                </p>

                <p className="mt-1 text-sm text-brand-muted">
                  AI interpretation of volatility, momentum, and risk-on versus
                  risk-off conditions.
                </p>
              </div>

              <ArrowRight className="h-5 w-5 text-brand-muted transition group-hover:text-brand-primary" />
            </Link>
          </div>
        </TelemetryCard>

        {/* Back Testing */}

        <BackTestingCard
          to="/dashboard/backtesting"
          icon={TrendingUp}
          title="Back Testing"
          subtitle="Run historical ETF strategy simulations"
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

          <div className="mt-6 flex items-center justify-between border-t border-brand-outline pt-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                Strategy Preview
              </p>

              <p className="mt-1 text-sm text-brand-muted">
                Compare historical income, growth, and total return performance.
              </p>
            </div>

            <div className="rounded-xl border border-brand-primary/30 bg-brand-primary/10 px-4 py-2 text-sm font-semibold text-brand-primary">
              Open Back Tester →
            </div>
          </div>
        </BackTestingCard>
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
