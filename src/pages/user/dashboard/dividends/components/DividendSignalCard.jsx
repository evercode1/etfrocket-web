import { useState } from "react";

export default function DividendSignalCard({
  title,
  message,
  details,
  topContributors = [],
  contributorType = "distribution",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-brand-outline bg-brand-surfaceHigh p-6 transition hover:border-brand-primary/40">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold">{title}</h3>

            <p className="mt-3 leading-relaxed text-brand-muted">{message}</p>
          </div>

          <span className="rounded-full border border-brand-outline bg-brand-surface px-3 py-1 text-xs font-semibold text-brand-muted">
            {isOpen ? "Hide" : "Details"}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 space-y-5 border-t border-brand-outline pt-5">
          {topContributors.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
                Top Contributors
              </p>

              <div className="mt-3 space-y-3">
                {topContributors.map((contributor) => (
                  <ContributorCard
                    key={contributor.symbol}
                    contributor={contributor}
                    contributorType={contributorType}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
              Affected ETFs
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {details.affectedEtfs.length > 0 ? (
                details.affectedEtfs.map((etf) => (
                  <span
                    key={etf}
                    className="rounded-full border border-brand-outline bg-brand-surface px-3 py-1 text-sm font-semibold text-brand-text"
                  >
                    {etf}
                  </span>
                ))
              ) : (
                <span className="text-sm text-brand-muted">None detected</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
              Observation
            </p>

            <p className="mt-2 text-sm leading-relaxed text-brand-muted">
              {details.observation || "No observation available yet."}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
              Possible Causes
            </p>

            <ul className="mt-3 space-y-2">
              {details.possibleCauses.map((cause) => (
                <li
                  key={cause}
                  className="rounded-2xl border border-brand-outline bg-brand-surface px-4 py-3 text-sm text-brand-muted"
                >
                  {cause}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function ContributorCard({ contributor, contributorType }) {
  if (contributorType === "aum") {
    return (
      <div className="rounded-2xl border border-brand-outline bg-brand-surface px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <span className="font-display text-lg font-bold text-brand-primary">
            {contributor.symbol}
          </span>

          <span className="text-sm font-semibold text-brand-text">
            {formatPercent(contributor.aum_change_percentage)}
          </span>
        </div>

        <p className="mt-2 text-sm text-brand-muted">
          AUM change: {formatLargeCurrency(contributor.aum_change)}
        </p>

        <p className="mt-1 text-sm text-brand-muted">
          {formatLargeCurrency(contributor.start_aum)} to{" "}
          {formatLargeCurrency(contributor.end_aum)}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-outline bg-brand-surface px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <span className="font-display text-lg font-bold text-brand-primary">
          {contributor.symbol}
        </span>

        <span className="text-sm font-semibold text-brand-text">
          {formatCurrency(contributor.estimated_income_impact)}
        </span>
      </div>

      <p className="mt-2 text-sm text-brand-muted">
        30-day avg {formatCurrency(contributor.recent_average_dividend)} vs.
        90-day avg {formatCurrency(contributor.baseline_average_dividend)}
      </p>

      <p className="mt-1 text-sm text-brand-muted">
        Growth: {formatPercent(contributor.growth_percentage)}
      </p>
    </div>
  );
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatLargeCurrency(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  });
}

function formatPercent(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${Number(value).toFixed(2)}%`;
}
