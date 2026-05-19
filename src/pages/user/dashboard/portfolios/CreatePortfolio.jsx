import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { ArrowLeft, CheckCircle2, Plus, Rocket } from "lucide-react";

import { createPortfolio } from "../../../../api/portfolios";

export default function CreatePortfolio() {
  const navigate = useNavigate();

  const [portfolioName, setPortfolioName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await createPortfolio({
        portfolio_name: portfolioName,
        is_default: isDefault,
      });

      const portfolioId = response.data?.id;

      navigate(
        portfolioId
          ? `/dashboard/portfolios/${portfolioId}`
          : "/dashboard/portfolios",
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create portfolio. Please check your entry and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <Link
          to="/dashboard/portfolios"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolios
        </Link>

        <div className="mt-6 flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary shadow-glow">
            <Rocket className="h-7 w-7" />
          </div>

          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
              New Portfolio
            </p>

            <h1 className="mt-3 font-display text-4xl font-bold">
              Create Portfolio
            </h1>

            <p className="mt-3 max-w-3xl text-brand-muted">
              Start a new ETF portfolio for Mission Control, income tracking,
              and future Dividend Snowball projections.
            </p>
          </div>
        </div>
      </section>

      <section className="glass-card max-w-3xl rounded-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-2xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
              {error}
            </div>
          )}

          <label className="block">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-muted">
              Portfolio Name
            </span>

            <input
              type="text"
              value={portfolioName}
              onChange={(event) => setPortfolioName(event.target.value)}
              placeholder="Income Rocket"
              required
              className="mt-2 w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-brand-text outline-none transition placeholder:text-brand-muted/60 focus:border-brand-primary"
            />
          </label>

          <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-4 transition hover:border-brand-primary">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(event) => setIsDefault(event.target.checked)}
              className="mt-1 h-4 w-4"
            />

            <span>
              <span className="flex items-center gap-2 font-semibold text-brand-text">
                <CheckCircle2 className="h-4 w-4 text-brand-primary" />
                Make this my default portfolio
              </span>

              <span className="mt-1 block text-sm leading-relaxed text-brand-muted">
                Mission Control will use your default portfolio automatically.
                If this is your first portfolio, it will become default even if
                this is unchecked.
              </span>
            </span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/dashboard/portfolios"
              className="rounded-xl border border-brand-outline px-5 py-3 text-center text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rocket-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Portfolio"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
