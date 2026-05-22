import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Plus, Settings } from "lucide-react";

import { setStoredPortfolioId } from "../../../../../utils/portfolioContext";

export default function PortfolioControls({
  portfolioSelects,
  selectedPortfolioId,
  setSelectedPortfolioId,
  hasPortfolio,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const portfolioOptions = Object.entries(portfolioSelects || {}).map(
    ([id, name]) => ({
      id: Number(id),
      name,
    }),
  );

  const selectedPortfolio =
    portfolioOptions.find(
      (portfolio) => portfolio.id === Number(selectedPortfolioId),
    ) || portfolioOptions[0];

  if (!hasPortfolio) {
    return (
      <Link
        to="/dashboard/portfolios/create"
        className="rocket-button-primary inline-flex h-14 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold"
      >
        <Plus className="h-4 w-4" />
        Create Portfolio
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Link
        to="/dashboard/portfolios"
        className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
      >
        <Settings className="h-4 w-4" />
        Manage All
      </Link>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex h-14 items-center gap-3 rounded-xl border border-brand-outline bg-brand-surfaceHigh px-5 text-sm font-semibold text-brand-text transition hover:border-brand-primary"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-brand-primary">
            Active Portfolio
          </span>

          <span>{selectedPortfolio?.name}</span>

          <ChevronDown className="h-4 w-4 text-brand-muted" />
        </button>

        {isOpen && (
          <div
            onMouseLeave={() => setIsOpen(false)}
            className="absolute right-0 z-40 mt-3 w-64 rounded-2xl border border-brand-outline bg-brand-surface p-2 shadow-glow"
          >
            {portfolioOptions.map((portfolio) => (
              <button
                key={portfolio.id}
                type="button"
                onClick={() => {
                  setStoredPortfolioId(portfolio.id);
                  setSelectedPortfolioId(portfolio.id);
                  setIsOpen(false);
                }}
                className="block w-full rounded-xl px-3 py-2 text-left text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
              >
                {portfolio.name}
              </button>
            ))}

            <div className="mt-2 border-t border-brand-outline pt-2">
              <Link
                to="/dashboard/portfolios/create"
                className="block w-full rounded-xl px-3 py-2 text-left text-sm text-brand-primary transition hover:bg-brand-surfaceHighest"
              >
                + New Portfolio
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
