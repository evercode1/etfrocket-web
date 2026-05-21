import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getDividendIntelligence } from "../../../../api/dividends";
import DividendSignalsSection from "./components/DividendSignalsSection";

export default function Dividends() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [dividendIntelligence, setDividendIntelligence] = useState(null);

  async function loadDividendIntelligence() {
    setIsLoading(true);

    try {
      const response = await getDividendIntelligence(portfolioId);

      setDividendIntelligence(response.data || null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    loadDividendIntelligence();
  }, [portfolioId]);

  const portfolioSelects = dividendIntelligence?.portfolio_selects || {};
  const summary = dividendIntelligence?.summary || {};
  const upcomingDividends =
    dividendIntelligence?.upcoming_weekly_dividends || [];
  const additionalWeeklyEventsCount =
    dividendIntelligence?.additional_weekly_events_count || 0;
  const dividendTimeline = dividendIntelligence?.income_timeline || [];
  const signals = dividendIntelligence?.signals || [];

  const timelineIncomeValues = dividendTimeline.map((item) =>
    Number(item.income || 0),
  );

  const maxTimelineIncome = Math.max(...timelineIncomeValues, 0);

  const minTimelineIncome = Math.min(
    ...timelineIncomeValues,
    maxTimelineIncome,
  );

  function getTimelineBarHeight(income) {
    if (!maxTimelineIncome || maxTimelineIncome === minTimelineIncome) {
      return 70;
    }

    const range = maxTimelineIncome - minTimelineIncome;
    const position = (Number(income || 0) - minTimelineIncome) / range;

    return 55 + position * 45;
  }

  const historyUrl = portfolioId
    ? `/dashboard/dividends/${portfolioId}/history`
    : "/dashboard/dividends/history";

  const calendarUrl = portfolioId
    ? `/dashboard/dividends/${portfolioId}/calendar`
    : "/dashboard/dividends/calendar";

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading dividend intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="glass-card overflow-hidden rounded-3xl p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
              Dividend Intelligence
            </p>

            <h1 className="mt-3 font-display text-5xl font-bold">
              Income Command Center
            </h1>

            <p className="mt-4 max-w-3xl text-brand-muted">
              Track declared weekly dividend events, expected weekly payout
              windows, projected monthly income, and ETF payout activity across
              your portfolio.
            </p>

            <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                Active Portfolio
              </span>

              <select
                value={String(
                  dividendIntelligence?.portfolio?.id || portfolioId || "",
                )}
                onChange={(event) => {
                  navigate(`/dashboard/dividends/${event.target.value}`);
                }}
                className="bg-transparent text-sm font-semibold text-brand-text outline-none"
              >
                {Object.entries(portfolioSelects).map(([id, name]) => (
                  <option
                    key={id}
                    value={id}
                    className="bg-brand-surface text-brand-text"
                  >
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-emerald-300">
              Projected Monthly Income
            </p>

            <p className="mt-3 font-display text-5xl font-bold text-white">
              {formatCurrency(summary.projected_monthly_income)}
            </p>

            <p className="mt-2 text-sm text-brand-muted">
              Based on current holdings and recent dividend history.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Projected Monthly Income"
          value={formatCurrency(summary.projected_monthly_income)}
          detail="Current portfolio run-rate"
        />

        <MetricCard
          label="Upcoming Weekly Events"
          value={String(summary.upcoming_weekly_events_count || 0)}
          detail="Declared and expected weekly payouts"
        />

        <MetricCard
          label="Forward Yield"
          value={formatPercent(summary.forward_yield_percentage)}
          detail="Annualized income on cost basis"
        />

        <MetricCard
          label="Dividend Growth"
          value={formatPercent(summary.dividend_growth_percentage)}
          detail="Compared to prior dividend month"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="glass-card rounded-3xl p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">
                Income Timeline
              </h2>

              <p className="mt-1 text-sm text-brand-muted">
                Estimated monthly dividend income trend
              </p>
            </div>

            <div className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-2 text-xs font-mono uppercase tracking-widest text-brand-primary">
              Projected
            </div>
          </div>

          {dividendTimeline.length > 0 ? (
            <div className="mt-8 grid h-80 grid-cols-5 items-end gap-4">
              {dividendTimeline.map((item) => (
                <div
                  key={item.month}
                  className="flex flex-1 flex-col items-center"
                >
                  <div className="mb-4 text-center">
                    <div className="whitespace-nowrap text-center text-sm font-bold text-white lg:text-base">
                      {formatCurrency(item.income)}
                    </div>
                  </div>

                  <div className="relative flex h-56 w-full min-w-0 items-end justify-center overflow-hidden rounded-t-3xl bg-brand-surfaceHigh">
                    <div
                      className="w-full rounded-t-3xl bg-gradient-to-t from-brand-primary/90 to-cyan-300/90 transition-all duration-500"
                      style={{
                        height: `${getTimelineBarHeight(item.income)}%`,
                      }}
                    />
                  </div>

                  <div className="mt-4 text-sm font-semibold text-brand-muted">
                    {item.month}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-8 text-center text-brand-muted">
              Dividend income timeline will appear once dividend history is
              available for this portfolio.
            </div>
          )}

          <div className="mt-10 flex items-center justify-center">
            <Link
              to={historyUrl}
              className="rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-6 py-3 text-sm font-semibold text-brand-muted transition hover:-translate-y-0.5 hover:border-brand-primary hover:text-brand-primary"
            >
              View All Dividend History
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 lg:col-span-2">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Upcoming Dividends
            </h2>

            <p className="mt-1 text-sm text-brand-muted">
              Next weekly dividend events only
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm text-brand-muted">
            Monthly payers are excluded because payment timing can vary.
            Expected weekly events show amounts as TBD until declared.
          </div>

          <div className="mt-6 space-y-4">
            {upcomingDividends.length > 0 ? (
              upcomingDividends.map((dividend) => (
                <DividendCard
                  key={`${dividend.symbol}-${dividend.ex_dividend_date || "unknown"}`}
                  dividend={dividend}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-6 text-center text-brand-muted">
                No upcoming weekly dividend events are available yet.
              </div>
            )}
          </div>

          {additionalWeeklyEventsCount > 0 && (
            <div className="mt-5 rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-4 text-center">
              <p className="text-sm font-semibold text-brand-muted">
                +{additionalWeeklyEventsCount} more weekly dividend events
              </p>

              <Link
                to={calendarUrl}
                className="mt-3 inline-flex rounded-xl border border-brand-outline px-4 py-2 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
              >
                View Dividend Calendar
              </Link>
            </div>
          )}
        </div>
      </section>

      <DividendSignalsSection signals={signals} />
    </div>
  );
}

function MetricCard({ label, value, detail }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-brand-muted">{label}</p>

      <p className="mt-3 font-display text-4xl font-bold">{value}</p>

      <p className="mt-2 text-sm text-brand-muted">{detail}</p>
    </div>
  );
}

function DividendCard({ dividend }) {
  const isExpected = dividend.status === "Expected";
  const isUnknown = dividend.status === "Unknown";

  return (
    <div className="rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-5 transition hover:border-brand-primary/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-2xl font-bold text-brand-primary">
            {dividend.symbol}
          </p>

          <p className="mt-1 text-sm text-brand-muted">
            Ex-Date {dividend.ex_dividend_date || "TBD"}
          </p>
        </div>

        <div
          className={`rounded-full border px-3 py-1 text-xs font-mono uppercase tracking-widest ${
            isUnknown
              ? "border-brand-outline bg-brand-surface text-brand-muted"
              : isExpected
                ? "border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {dividend.status}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <MiniStat
          label="Distribution"
          value={
            dividend.distribution_amount === null ||
            dividend.distribution_amount === undefined
              ? "TBD"
              : formatCurrency(dividend.distribution_amount)
          }
        />

        <MiniStat label="Payment" value={dividend.payment_date || "TBD"} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-brand-muted">
        {dividend.note}
      </p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-brand-outline bg-brand-surface px-4 py-3">
      <p className="text-xs uppercase tracking-widest text-brand-muted">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-brand-text">{value}</p>
    </div>
  );
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatPercent(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${Number(value).toFixed(2)}%`;
}
