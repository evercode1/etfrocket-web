import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import SecuritySymbol from "../../../../components/ui/SecuritySymbol";

import {
  BarChart3,
  Edit,
  Eye,
  PieChart as PieChartIcon,
  Plus,
  Rocket,
  ShieldCheck,
  Snowflake,
  Trash2,
  WalletCards,
} from "lucide-react";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import ConfirmDialog from "../../../../components/ui/ConfirmDialog";

import { deletePortfolio, viewPortfolio } from "../../../../api/portfolios";

import { listPortfolioTransactions } from "../../../../api/portfolioTransactions";

import { setStoredPortfolioId } from "../../../../utils/portfolioContext";

import ImportTransactionsButton from "../../../../components/portfolios/ImportTransactionsButton";

export default function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function loadPortfolio() {
    setIsLoading(true);

    try {
      const response = await viewPortfolio(id);

      setPortfolio(response.data || null);

      const transactionsResponse = await listPortfolioTransactions(id, {
        limit: 10,
      });

      setRecentTransactions(transactionsResponse.data || []);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      setStoredPortfolioId(id);
    }

    loadPortfolio();
  }, [id]);

  async function handleDeletePortfolio() {
    setIsDeleting(true);
    setDeleteError("");

    try {
      await deletePortfolio(portfolio.id);

      navigate("/dashboard/portfolios");
    } catch (error) {
      setDeleteError(
        error.response?.data?.message || "Unable to delete this portfolio.",
      );

      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading portfolio details...
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="glass-card rounded-3xl p-8">
        <h1 className="font-display text-3xl font-bold">Portfolio Not Found</h1>

        <p className="mt-3 text-brand-muted">
          This portfolio could not be loaded.
        </p>

        <Link
          to="/dashboard/portfolios"
          className="rocket-button-primary mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-bold"
        >
          Back to Portfolios
        </Link>
      </div>
    );
  }

  const holdings = portfolio.holdings || [];
  const topHoldings = holdings.slice(0, 6);

  const allocationData = holdings.map((holding) => ({
    name: holding.symbol,
    value: Number(holding.market_value || 0),
  }));

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
                  Portfolio Details
                </p>

                {portfolio.is_default && (
                  <span className="rounded-full border border-brand-primary/40 bg-brand-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-brand-primary">
                    Default
                  </span>
                )}
              </div>

              <h1 className="mt-3 font-display text-5xl font-bold">
                {portfolio.portfolio_name}
              </h1>

              <p className="mt-4 max-w-3xl text-brand-muted">
                Review allocation, holdings, income strength, NAV health, and
                transaction activity for this portfolio.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/dashboard/portfolios/${portfolio.id}/edit`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
              >
                <Edit className="h-4 w-4" />
                Update
              </Link>

              <button
                type="button"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-danger/50 px-5 py-3 text-sm font-semibold text-brand-danger transition hover:bg-brand-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link
              to={`/dashboard/portfolios/${portfolio.id}/holdings`}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Holdings
            </Link>

            <div className="inline-flex items-center gap-3 self-start rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 lg:self-auto">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                Active Portfolio
              </span>

              <select
                value={String(portfolio.id)}
                onChange={(event) => {
                  const nextPortfolioId = event.target.value;

                  setStoredPortfolioId(nextPortfolioId);

                  navigate(`/dashboard/portfolios/${nextPortfolioId}`);
                }}
                className="bg-transparent text-sm font-semibold text-brand-text outline-none"
              >
                {Object.entries(portfolio.portfolio_selects || {}).map(
                  ([portfolioSelectId, name]) => (
                    <option
                      key={portfolioSelectId}
                      value={portfolioSelectId}
                      className="bg-brand-surface text-brand-text"
                    >
                      {name}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>
      </section>

      {deleteError && (
        <div className="glass-card rounded-3xl border border-brand-danger/40 p-5 text-sm font-semibold text-brand-danger">
          {deleteError}
        </div>
      )}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={WalletCards}
          label="Portfolio Value"
          value={formatCurrency(portfolio.portfolio_value)}
          detail={`Cost basis: ${formatCurrency(portfolio.cost_basis)}`}
        />

        <MetricCard
          icon={Snowflake}
          label="Monthly Income"
          value={formatCurrency(portfolio.monthly_income)}
          detail="Projected from current holdings"
        />

        <MetricCard
          icon={BarChart3}
          label="Total Return"
          value={formatPercent(portfolio.total_return_percentage)}
          detail="Unrealized gain/loss"
        />

        <MetricCard
          icon={ShieldCheck}
          label="NAV Health"
          value={portfolio.nav_health}
          detail="Based on ETF metric signals"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="glass-card rounded-3xl p-6 lg:col-span-2">
          <CardTitle
            icon={PieChartIcon}
            title="ETF Allocation"
            subtitle="Portfolio weight by current market value"
          />

          {holdings.length === 0 ? (
            <EmptyPanel
              message="No holdings yet. Add transactions to build this allocation chart."
              to={`/dashboard/portfolios/${portfolio.id}/transactions/create`}
            />
          ) : (
            <>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={115}
                      paddingAngle={4}
                    >
                      {allocationData.map((entry) => (
                        <Cell key={entry.name} fill="currentColor" />
                      ))}
                    </Pie>

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
                      formatter={(value) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-5 grid gap-3">
                {holdings.map((holding) => (
                  <div
                    key={holding.security_id}
                    className="flex items-center justify-between rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3"
                  >
                    <SecuritySymbol symbol={holding.symbol} />

                    <span className="text-sm text-brand-muted">
                      {formatPercent(holding.allocation_percentage)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="glass-card rounded-3xl p-6 lg:col-span-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle
              icon={Rocket}
              title="Top Holdings"
              subtitle="Largest ETF positions by current market value"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <ImportTransactionsButton
                portfolioId={portfolio.id}
                onImportComplete={loadPortfolio}
              />

              <Link
                to={`/dashboard/portfolios/${portfolio.id}/transactions/create`}
                className="rocket-button-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </Link>
            </div>
          </div>

          {holdings.length === 0 ? (
            <EmptyPanel
              message="No holdings yet. Add a transaction or import a CSV to start tracking this portfolio."
              to={`/dashboard/portfolios/${portfolio.id}/transactions/create`}
            />
          ) : (
            <>
              <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-surfaceHigh text-brand-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">ETF</th>
                      <th className="px-4 py-3 font-semibold">Shares</th>
                      <th className="px-4 py-3 font-semibold">Value</th>
                      <th className="px-4 py-3 font-semibold">Income</th>
                      <th className="px-4 py-3 font-semibold">Allocation</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topHoldings.map((holding) => (
                      <tr
                        key={holding.security_id}
                        className="border-t border-brand-outline text-brand-muted"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <SecuritySymbol symbol={holding.symbol} />
                            <p className="text-xs text-brand-muted">
                              {holding.security_name}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          {Math.round(
                            Number(holding.shares || 0),
                          ).toLocaleString()}
                        </td>

                        <td className="px-4 py-4">
                          {formatCurrency(holding.market_value)}
                        </td>

                        <td className="px-4 py-4">
                          {formatCurrency(holding.estimated_monthly_income)}
                        </td>

                        <td className="px-4 py-4">
                          {formatPercent(holding.allocation_percentage)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-center">
                <Link
                  to={`/dashboard/portfolios/${portfolio.id}/holdings`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
                >
                  <BarChart3 className="h-4 w-4" />
                  View All Holdings
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle
            icon={BarChart3}
            title="Recent Transactions"
            subtitle="Latest 10 buys and sells for this portfolio"
          />

          <Link
            to={`/dashboard/portfolios/${portfolio.id}/transactions`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
          >
            <Eye className="h-4 w-4" />
            View All Transactions
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <EmptyPanel
            message="No transactions yet. Add a transaction or import a CSV to start building this portfolio."
            to={`/dashboard/portfolios/${portfolio.id}/transactions/create`}
          />
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-surfaceHigh text-brand-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">ETF</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Shares</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Value</th>
                </tr>
              </thead>

              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-brand-outline text-brand-muted"
                  >
                    <td className="px-4 py-4">
                      {formatDate(transaction.transaction_date)}
                    </td>

                    <td className="px-4 py-4">
                      {transaction.security?.symbol || transaction.symbol ? (
                        <SecuritySymbol
                          symbol={
                            transaction.security?.symbol || transaction.symbol
                          }
                        />
                      ) : (
                        <span>—</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                          Number(transaction.transaction_type_id) === 1
                            ? "bg-brand-primary/10 text-brand-primary"
                            : "bg-brand-danger/10 text-brand-danger"
                        }`}
                      >
                        {transaction.transaction_type?.transaction_type_name ||
                          transaction.transaction_type_name ||
                          getTransactionTypeLabel(
                            transaction.transaction_type_id,
                          )}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {Math.round(
                        Number(transaction.shares || 0),
                      ).toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      {formatCurrency(transaction.price_per_share)}
                    </td>

                    <td className="px-4 py-4 font-semibold text-brand-text">
                      {formatCurrency(
                        Number(transaction.shares || 0) *
                          Number(transaction.price_per_share || 0),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Portfolio"
        message={`Are you sure you want to delete "${portfolio.portfolio_name}"? This action cannot be undone.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete Portfolio"}
        cancelLabel="Cancel"
        loading={isDeleting}
        variant="danger"
        onConfirm={handleDeletePortfolio}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-5 text-sm text-brand-muted">{label}</p>

      <p className="mt-2 font-display text-3xl font-bold">{value}</p>

      <p className="mt-2 text-sm text-brand-muted">{detail}</p>
    </div>
  );
}

function CardTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <p className="text-sm text-brand-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function EmptyPanel({ message, to = null }) {
  const content = (
    <div className="mt-6 rounded-2xl border border-dashed border-brand-outline bg-brand-surfaceHigh p-8 text-center text-brand-muted transition hover:border-brand-primary hover:text-brand-primary">
      {message}
    </div>
  );

  if (!to) {
    return content;
  }

  return (
    <Link to={to} className="block">
      {content}
    </Link>
  );
}

function formatCurrency(value) {
  if (value === null || value === undefined) {
    return "$0.00";
  }

  return Number(value).toLocaleString("en-US", {
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

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTransactionTypeLabel(transactionTypeId) {
  if (Number(transactionTypeId) === 1) {
    return "Buy";
  }

  if (Number(transactionTypeId) === 2) {
    return "Sell";
  }

  return "Unknown";
}
