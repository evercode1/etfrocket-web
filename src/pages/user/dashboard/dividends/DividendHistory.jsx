import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getDividendHistory } from "../../../../api/dividends";

export default function DividendHistory() {
  const { portfolioId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [historyResponse, setHistoryResponse] = useState(null);
  const [frequencyFilter, setFrequencyFilter] = useState("All");
  const [tickerFilter, setTickerFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  async function loadDividendHistory() {
    setIsLoading(true);

    try {
      const params = {
        per_page: 25,
        page,
      };

      if (tickerFilter) {
        params.symbol = tickerFilter;
      }

      if (frequencyFilter !== "All") {
        params.frequency_id = frequencyFilter;
      }

      if (dateFrom) {
        params.date_from = dateFrom;
      }

      if (dateTo) {
        params.date_to = dateTo;
      }

      const response = await getDividendHistory(portfolioId, params);

      setHistoryResponse(response.data || null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    loadDividendHistory();
  }, [portfolioId, frequencyFilter, page]);

  const dividends = historyResponse?.dividends || null;
  const dividendRows = dividends?.data || [];

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading dividend history...
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
          Dividend History
        </p>

        <h1 className="mt-3 font-display text-5xl font-bold">
          Paid Dividend Ledger
        </h1>

        <p className="mt-4 max-w-3xl text-brand-muted">
          Review completed dividend payments for ETFs currently held in this
          portfolio.
        </p>
      </section>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Paid Records"
          value={dividends?.total || 0}
          detail="Completed dividend events"
        />

        <MetricCard
          label="Total Paid"
          value={formatCurrency(historyResponse?.total_paid)}
          detail="Shares owned × distributions"
        />

        <MetricCard
          label="Month To Date Earnings"
          value={formatCurrency(historyResponse?.month_to_date_paid)}
          detail="Paid dividends this month"
        />

        <MetricCard
          label="Last Month Earnings"
          value={formatCurrency(historyResponse?.last_month_paid)}
          detail="Paid dividends from prior month"
        />
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Dividend Records
            </h2>

            <p className="mt-1 text-sm text-brand-muted">
              Filter paid dividend history by ticker, distribution frequency,
              and ex-dividend date range.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-5">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                Ticker
              </span>

              <input
                value={tickerFilter}
                onChange={(event) => {
                  setTickerFilter(event.target.value);
                  setPage(1);
                }}
                placeholder="NVII"
                className="mt-2 w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary"
              />
            </label>

            <FilterSelect
              label="Frequency"
              value={frequencyFilter}
              onChange={(value) => {
                setFrequencyFilter(value);
                setPage(1);
              }}
              options={[
                { label: "All", value: "All" },
                { label: "Weekly", value: "2" },
                { label: "Monthly", value: "4" },
              ]}
            />

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                From
              </span>

              <input
                type="date"
                value={dateFrom}
                onChange={(event) => {
                  setDateFrom(event.target.value);
                  setPage(1);
                }}
                className="mt-2 w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                To
              </span>

              <input
                type="date"
                value={dateTo}
                onChange={(event) => {
                  setDateTo(event.target.value);
                  setPage(1);
                }}
                className="mt-2 w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setPage(1);
                loadDividendHistory();
              }}
              className="mt-6 rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-surfaceHigh text-brand-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">ETF</th>
                <th className="px-4 py-3 font-semibold">Frequency</th>
                <th className="px-4 py-3 font-semibold">Ex-Date</th>
                <th className="px-4 py-3 font-semibold">Payment Date</th>
                <th className="px-4 py-3 font-semibold">Distribution</th>
                <th className="px-4 py-3 font-semibold">Shares</th>
                <th className="px-4 py-3 font-semibold">Payment Amount</th>
              </tr>
            </thead>

            <tbody>
              {dividendRows.map((event) => (
                <tr
                  key={event.id}
                  className="border-t border-brand-outline text-brand-muted"
                >
                  <td className="px-4 py-4 font-display text-xl font-bold text-brand-primary">
                    {event.symbol}
                  </td>

                  <td className="px-4 py-4">
                    {event.distribution_frequency_name || "Unknown"}
                  </td>

                  <td className="px-4 py-4 font-semibold text-brand-text">
                    {event.ex_dividend_date}
                  </td>

                  <td className="px-4 py-4">{event.payment_date}</td>

                  <td className="px-4 py-4 font-semibold text-brand-text">
                    {formatCurrency(event.dividend_amount)}
                  </td>
                  <td className="px-4 py-4 font-semibold text-brand-text">
                    {Number(event.shares_owned || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 4,
                    })}
                  </td>

                  <td className="px-4 py-4 font-semibold text-brand-text">
                    {formatCurrency(event.estimated_payment_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {dividendRows.length === 0 && (
          <div className="mt-6 rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-8 text-center text-brand-muted">
            No paid dividend records match the selected filters.
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-brand-muted">
            Page {dividends?.current_page || 1} of {dividends?.last_page || 1}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={(dividends?.current_page || 1) <= 1}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              className="rounded-xl border border-brand-outline px-4 py-2 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                (dividends?.current_page || 1) >= (dividends?.last_page || 1)
              }
              onClick={() => setPage((current) => current + 1)}
              className="rounded-xl border border-brand-outline px-4 py-2 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
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

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
