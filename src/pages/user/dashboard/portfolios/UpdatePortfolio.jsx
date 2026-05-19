import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Save, WalletCards } from "lucide-react";

import { updatePortfolio, viewPortfolio } from "../../../../api/portfolios";

export default function UpdatePortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState({
    portfolio_name: "",
    is_default: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadPortfolio() {
    setIsLoading(true);

    try {
      const response = await viewPortfolio(id);

      setPortfolio({
        portfolio_name: response.data?.portfolio_name || "",
        is_default: Boolean(response.data?.is_default),
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPortfolio();
  }, [id]);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setPortfolio((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSaving(true);
    setError("");

    try {
      await updatePortfolio(id, portfolio);

      navigate(`/dashboard/portfolios/${id}`);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to update this portfolio.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading portfolio...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <Link
          to={`/dashboard/portfolios/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>

        <div className="mt-6">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
            Update Portfolio
          </p>

          <h1 className="mt-3 font-display text-5xl font-bold">
            Edit Portfolio
          </h1>

          <p className="mt-4 max-w-3xl text-brand-muted">
            Update the portfolio name and default portfolio setting.
          </p>

          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-brand-muted">
            Portfolio ID: {id}
          </p>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
            <WalletCards className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold">
              Portfolio Settings
            </h2>

            <p className="text-sm text-brand-muted">
              Manage the basic details for this portfolio.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-brand-danger/40 bg-brand-danger/10 p-4 text-sm font-semibold text-brand-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="portfolio_name"
              className="block text-sm font-semibold text-brand-muted"
            >
              Portfolio Name
            </label>

            <input
              id="portfolio_name"
              name="portfolio_name"
              type="text"
              value={portfolio.portfolio_name}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-5 py-4 font-semibold text-brand-text outline-none transition placeholder:text-brand-muted focus:border-brand-primary"
              placeholder="Enter portfolio name"
              required
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-5">
            <input
              name="is_default"
              type="checkbox"
              checked={portfolio.is_default}
              onChange={handleChange}
              className="h-5 w-5 rounded border-brand-outline"
            />

            <div>
              <p className="font-semibold text-brand-text">
                Set as default portfolio
              </p>

              <p className="mt-1 text-sm text-brand-muted">
                This portfolio will be used as the primary dashboard portfolio.
              </p>
            </div>
          </label>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="rocket-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <Link
              to={`/dashboard/portfolios/${id}`}
              className="inline-flex items-center justify-center rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
