import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getDividendCalendar } from "../../../../api/dividends";

export default function DividendCalendar() {
  const { portfolioId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);

  async function loadDividendCalendar() {
    setIsLoading(true);

    try {
      const response = await getDividendCalendar(portfolioId);

      setEvents(response.data?.events || []);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    loadDividendCalendar();
  }, [portfolioId]);

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading dividend calendar...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <Link
          to={`/dashboard/dividends/${portfolioId}`}
          className="text-sm font-semibold text-brand-muted transition hover:text-brand-primary"
        >
          ← Back to Dividend Intelligence
        </Link>

        <p className="mt-8 font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Dividend Calendar
        </p>

        <h1 className="mt-3 font-display text-5xl font-bold">
          Upcoming Weekly Payouts
        </h1>

        <p className="mt-4 max-w-3xl text-brand-muted">
          Track declared and expected weekly dividend events for ETFs currently
          held in this portfolio.
        </p>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="grid gap-5 lg:grid-cols-3">
          {events.map((event) => (
            <DividendCalendarCard
              key={`${event.symbol}-${event.ex_dividend_date || "unknown"}`}
              event={event}
            />
          ))}
        </div>

        {events.length === 0 && (
          <div className="rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-8 text-center text-brand-muted">
            No upcoming weekly dividend events are available yet.
          </div>
        )}
      </section>
    </div>
  );
}

function DividendCalendarCard({ event }) {
  const isExpected = event.status === "Expected";
  const isUnknown = event.status === "Unknown";

  return (
    <div className="rounded-3xl border border-brand-outline bg-brand-surfaceHigh p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-3xl font-bold text-brand-primary">
            {event.symbol}
          </p>

          <p className="mt-1 text-sm text-brand-muted">{event.fund_name}</p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-mono uppercase tracking-widest ${
            isUnknown
              ? "border-brand-outline bg-brand-surface text-brand-muted"
              : isExpected
                ? "border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {event.status}
        </span>
      </div>

      <div className="mt-6 grid gap-3">
        <MiniStat label="Ex-Date" value={event.ex_dividend_date || "TBD"} />
        <MiniStat label="Payment" value={event.payment_date || "TBD"} />
        <MiniStat
          label="Distribution"
          value={
            event.distribution_amount === null ||
            event.distribution_amount === undefined
              ? "TBD"
              : formatCurrency(event.distribution_amount)
          }
        />
        <MiniStat
          label="Estimated Payment"
          value={
            event.estimated_payment_amount === null ||
            event.estimated_payment_amount === undefined
              ? "TBD"
              : formatCurrency(event.estimated_payment_amount)
          }
        />
      </div>

      <p className="mt-5 text-sm leading-relaxed text-brand-muted">
        {event.note}
      </p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-brand-outline bg-brand-surface px-4 py-3">
      <span className="text-sm text-brand-muted">{label}</span>
      <span className="font-semibold text-brand-text">{value}</span>
    </div>
  );
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
