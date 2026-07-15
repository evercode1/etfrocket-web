import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Hash,
  Plus,
  Rocket,
} from "lucide-react";

import { getSecuritySelects } from "../../../../api/securities";

import { createPortfolioTransaction } from "../../../../api/portfolioTransactions";

import ConfirmDialog from "../../../../components/ui/ConfirmDialog";

import ImportTransactionsButton from "../../../../components/portfolios/ImportTransactionsButton";

const transactionTypes = [
  { id: 1, name: "Buy" },
  { id: 2, name: "Sell" },
];

export default function AddPortfolioTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [securities, setSecurities] = useState([]);
  const [isLoadingSecurities, setIsLoadingSecurities] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [form, setForm] = useState({
    security_id: "",
    transaction_type_id: 1,
    shares: "",
    price_per_share: "",
    transaction_date: new Date().toISOString().slice(0, 10),
  });

  async function loadSecurities() {
    setIsLoadingSecurities(true);

    try {
      const response = await getSecuritySelects();

      setSecurities(response.data || []);
    } catch (error) {
      setError("Unable to load security options.");
    } finally {
      setIsLoadingSecurities(false);
    }
  }

  useEffect(() => {
    loadSecurities();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    setError("");

    setShowConfirmDialog(true);
  }

  async function handleConfirmTransaction() {
    setIsSaving(true);

    setError("");

    try {
      await createPortfolioTransaction(id, {
        security_id: Number(form.security_id),

        transaction_type_id: Number(form.transaction_type_id),

        shares: form.shares,

        price_per_share: form.price_per_share,

        transaction_date: form.transaction_date,
      });

      navigate(`/dashboard/portfolios/${id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create this portfolio transaction.",
      );

      setShowConfirmDialog(false);
    } finally {
      setIsSaving(false);
    }
  }

  const estimatedValue =
    Number(form.shares || 0) * Number(form.price_per_share || 0);

  const selectedSymbol =
    securities.find(
      (security) => Number(security.id) === Number(form.security_id),
    )?.symbol || "selected security";

  const selectedTransactionType =
    transactionTypes.find(
      (type) => Number(type.id) === Number(form.transaction_type_id),
    )?.name || "transaction";

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link
              to={`/dashboard/portfolios/${id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition hover:text-brand-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Link>

            <div className="mt-6">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
                Portfolio Transaction
              </p>

              <h1 className="mt-3 font-display text-5xl font-bold">
                Add Transaction
              </h1>

              <p className="mt-4 max-w-3xl text-brand-muted">
                Record a buy or sell transaction for this portfolio.
              </p>

              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-brand-muted">
                Portfolio ID: {id}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <ImportTransactionsButton portfolioId={id} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-3xl p-8 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
              <Rocket className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold">
                Transaction Details
              </h2>

              <p className="text-sm text-brand-muted">
                Choose an ETF, transaction type, share count, price, and date.
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
                htmlFor="security_id"
                className="block text-sm font-semibold text-brand-muted"
              >
                Security
              </label>

              <select
                id="security_id"
                name="security_id"
                value={form.security_id}
                onChange={handleChange}
                required
                disabled={isLoadingSecurities}
                className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-5 py-4 font-semibold text-brand-text outline-none transition focus:border-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {isLoadingSecurities
                    ? "Loading securities..."
                    : "Select a security"}
                </option>

                {securities.map((security) => (
                  <option key={security.id} value={security.id}>
                    {security.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="transaction_type_id"
                className="block text-sm font-semibold text-brand-muted"
              >
                Transaction Type
              </label>

              <select
                id="transaction_type_id"
                name="transaction_type_id"
                value={form.transaction_type_id}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-5 py-4 font-semibold text-brand-text outline-none transition focus:border-brand-primary"
              >
                {transactionTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="shares"
                  className="block text-sm font-semibold text-brand-muted"
                >
                  Shares
                </label>

                <input
                  id="shares"
                  name="shares"
                  type="number"
                  min="0"
                  step="0.0001"
                  value={form.shares}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-5 py-4 font-semibold text-brand-text outline-none transition placeholder:text-brand-muted focus:border-brand-primary"
                  placeholder="0.0000"
                />
              </div>

              <div>
                <label
                  htmlFor="price_per_share"
                  className="block text-sm font-semibold text-brand-muted"
                >
                  Price Per Share
                </label>

                <input
                  id="price_per_share"
                  name="price_per_share"
                  type="number"
                  min="0"
                  step="0.0001"
                  value={form.price_per_share}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-5 py-4 font-semibold text-brand-text outline-none transition placeholder:text-brand-muted focus:border-brand-primary"
                  placeholder="0.0000"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="transaction_date"
                className="block text-sm font-semibold text-brand-muted"
              >
                Transaction Date
              </label>

              <input
                id="transaction_date"
                name="transaction_date"
                type="date"
                value={form.transaction_date}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-5 py-4 font-semibold text-brand-text outline-none transition focus:border-brand-primary"
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={isSaving || isLoadingSecurities}
                className="rocket-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {isSaving ? "Saving..." : "Add Transaction"}
              </button>

              <Link
                to={`/dashboard/portfolios/${id}`}
                className="inline-flex items-center justify-center rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <h2 className="font-display text-2xl font-bold">
            Transaction Preview
          </h2>

          <p className="mt-2 text-sm text-brand-muted">
            Estimated transaction value based on shares and price per share.
          </p>

          <div className="mt-6 space-y-4">
            <PreviewRow
              icon={Hash}
              label="Shares"
              value={form.shares || "0.0000"}
            />

            <PreviewRow
              icon={CircleDollarSign}
              label="Price"
              value={formatCurrency(form.price_per_share)}
            />

            <PreviewRow
              icon={CalendarDays}
              label="Date"
              value={form.transaction_date || "—"}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-5">
            <p className="text-sm font-semibold text-brand-muted">
              Estimated Value
            </p>

            <p className="mt-2 font-display text-4xl font-bold text-brand-text">
              {formatCurrency(estimatedValue)}
            </p>
          </div>
        </div>
      </section>
      <ConfirmDialog
        variant="primary"
        isOpen={showConfirmDialog}
        title="Confirm Transaction"
        message={`${selectedTransactionType} ${form.shares} shares of ${selectedSymbol} at ${formatCurrency(form.price_per_share)} per share on ${form.transaction_date}? Estimated value: ${formatCurrency(estimatedValue)}.`}
        confirmLabel="Confirm Transaction"
        cancelLabel="Review"
        loading={isSaving}
        onConfirm={handleConfirmTransaction}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </div>
  );
}

function PreviewRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-sm font-semibold text-brand-muted">{label}</span>
      </div>

      <span className="text-sm font-bold text-brand-text">{value}</span>
    </div>
  );
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "$0.00";
  }

  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
