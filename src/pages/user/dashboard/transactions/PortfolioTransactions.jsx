import { useEffect, useRef, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowUpDown,
  Edit,
  Plus,
  Rocket,
  Settings,
  Trash2,
  Upload,
} from "lucide-react";

import ConfirmDialog from "../../../../components/ui/ConfirmDialog";

import { listEtfsOwnedByUser } from "../../../../api/etfs";
import { viewPortfolio } from "../../../../api/portfolios";

import {
  csvUploadPortfolioTransactions,
  deletePortfolioTransaction,
  listPortfolioTransactions,
} from "../../../../api/portfolioTransactions";

import { setStoredPortfolioId } from "../../../../utils/portfolioContext";

export default function PortfolioTransactions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [portfolio, setPortfolio] = useState(null);
  const [portfolioSelects, setPortfolioSelects] = useState({});

  const [transactions, setTransactions] = useState([]);
  const [etfs, setEtfs] = useState([]);
  const [selectedEtfId, setSelectedEtfId] = useState("");

  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    sortBy: 1,
    sortOrder: "desc",
  });

  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState("");

  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function loadPortfolio() {
    const response = await viewPortfolio(id);
    const data = response.data || null;

    setPortfolio(data);
    setPortfolioSelects(data?.portfolio_selects || {});
  }

  async function loadEtfs() {
    const response = await listEtfsOwnedByUser(id);

    setEtfs(response.data || []);
  }

  async function loadTransactions(
    page = currentPage,
    sorting = sortConfig,
    etfId = selectedEtfId,
  ) {
    const response = await listPortfolioTransactions(id, {
      page,
      per_page: 25,
      sortBy: sorting.sortBy,
      sortOrder: sorting.sortOrder,
      etf_id: etfId || undefined,
    });

    const paginatedData = response.data || {};

    setTransactions(paginatedData.data || []);
    setPagination(paginatedData);
    setCurrentPage(paginatedData.current_page || page);
  }

  useEffect(() => {
    async function loadPage() {
      setIsLoading(true);

      try {
        if (id) {
          setStoredPortfolioId(id);
        }

        setSelectedEtfId("");
        setCurrentPage(1);

        await Promise.all([loadPortfolio(), loadEtfs(), loadTransactions(1)]);
      } finally {
        setIsLoading(false);
      }
    }

    loadPage();
  }, [id]);

  function handlePortfolioChange(event) {
    const nextPortfolioId = event.target.value;

    setStoredPortfolioId(nextPortfolioId);

    navigate(`/dashboard/portfolios/${nextPortfolioId}/transactions`);
  }

  function handleSort(sortBy) {
    const nextSort = {
      sortBy,
      sortOrder:
        sortConfig.sortBy === sortBy && sortConfig.sortOrder === "asc"
          ? "desc"
          : "asc",
    };

    setSortConfig(nextSort);
    loadTransactions(1, nextSort, selectedEtfId);
  }

  function handleEtfFilterChange(event) {
    const etfId = event.target.value;

    setSelectedEtfId(etfId);
    loadTransactions(1, sortConfig, etfId);
  }

  async function handleImportCsv(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsImporting(true);
    setImportMessage("");
    setImportError("");

    try {
      const response = await csvUploadPortfolioTransactions(id, file);

      const data = response.data;

      setImportMessage(
        `Import complete. Imported: ${data.imported_rows}, Duplicates: ${data.duplicate_rows}, Failed: ${data.failed_rows}.`,
      );

      await loadEtfs();
      await loadTransactions(currentPage, sortConfig, selectedEtfId);
    } catch (error) {
      setImportError(
        error.response?.data?.message ||
          "Unable to import portfolio transactions.",
      );
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  }

  async function handleDeleteTransaction() {
    if (!transactionToDelete) {
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deletePortfolioTransaction(transactionToDelete.id);

      setTransactionToDelete(null);

      await loadEtfs();
      await loadTransactions(currentPage, sortConfig, selectedEtfId);
    } catch (error) {
      setDeleteError(
        error.response?.data?.message ||
          "Unable to delete this portfolio transaction.",
      );

      setTransactionToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading portfolio transactions...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Link
                to={`/dashboard/portfolios/${id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition hover:text-brand-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Portfolio
              </Link>

              <p className="mt-8 font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
                Transaction Ledger
              </p>

              <h1 className="mt-3 font-display text-5xl font-bold">
                Portfolio Transactions
              </h1>

              <p className="mt-4 max-w-3xl text-brand-muted">
                Review, sort, import, edit, delete, and filter buy/sell records
                for the selected portfolio. Defaults to All.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleImportCsv}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Upload className="h-4 w-4" />
                {isImporting ? "Importing..." : "Import CSV"}
              </button>

              <Link
                to={`/dashboard/portfolios/${id}/transactions/create`}
                className="rocket-button-primary inline-flex h-14 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold"
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="inline-flex h-14 items-center gap-3 rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                Active Portfolio
              </span>

              <select
                value={String(portfolio?.id || id)}
                onChange={handlePortfolioChange}
                className="bg-transparent text-sm font-semibold text-brand-text outline-none"
              >
                {Object.entries(portfolioSelects).map(([portfolioId, name]) => (
                  <option
                    key={portfolioId}
                    value={portfolioId}
                    className="bg-brand-surface text-brand-text"
                  >
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {importMessage && (
        <div className="glass-card rounded-3xl border border-brand-primary/40 bg-brand-primary/10 p-5 text-sm font-semibold text-brand-primary">
          {importMessage}
        </div>
      )}

      {importError && (
        <div className="glass-card rounded-3xl border border-brand-danger/40 bg-brand-danger/10 p-5 text-sm font-semibold text-brand-danger">
          {importError}
        </div>
      )}

      {deleteError && (
        <div className="glass-card rounded-3xl border border-brand-danger/40 bg-brand-danger/10 p-5 text-sm font-semibold text-brand-danger">
          {deleteError}
        </div>
      )}

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
              <Rocket className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold">
                All Transactions
              </h2>

              <p className="text-sm text-brand-muted">
                {pagination?.total ?? transactions.length} transaction
                {(pagination?.total ?? transactions.length) === 1
                  ? ""
                  : "s"}{" "}
                found.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="etf_filter"
              className="mb-2 block text-sm font-semibold text-brand-muted"
            >
              Filter by ETF
            </label>

            <select
              id="etf_filter"
              value={selectedEtfId}
              onChange={handleEtfFilterChange}
              className="w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary lg:w-64"
            >
              <option value="">All ETFs</option>

              {etfs.map((etf) => (
                <option key={etf.id} value={etf.id}>
                  {etf.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-brand-outline bg-brand-surfaceHigh p-8 text-center text-brand-muted">
            No transactions found for the selected filter.
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-surfaceHigh text-brand-muted">
                <tr>
                  <SortableHeader
                    label="Date"
                    sortBy={1}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="ETF"
                    sortBy={2}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Type"
                    sortBy={3}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Shares"
                    sortBy={4}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Price"
                    sortBy={5}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <SortableHeader
                    label="Value"
                    sortBy={6}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />

                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-brand-outline text-brand-muted"
                  >
                    <td className="px-4 py-4">
                      {formatDate(transaction.transaction_date)}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold text-brand-text">
                        {transaction.symbol || "—"}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <TransactionTypeBadge
                        transactionTypeId={transaction.transaction_type_id}
                      />
                    </td>

                    <td className="px-4 py-4">
                      {Number(transaction.shares || 0).toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      {formatCurrency(transaction.price_per_share)}
                    </td>

                    <td className="px-4 py-4 font-semibold text-brand-text">
                      {formatCurrency(
                        transaction.transaction_value ??
                          getTransactionValue(transaction),
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/dashboard/portfolios/${id}/transactions/${transaction.id}/edit`,
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-3 py-2 text-xs font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setTransactionToDelete(transaction)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-danger/50 px-3 py-2 text-xs font-semibold text-brand-danger transition hover:bg-brand-danger/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination && pagination.last_page > 1 && (
              <div className="flex flex-col gap-3 border-t border-brand-outline bg-brand-surfaceHigh px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-brand-muted">
                  Showing {pagination.from} to {pagination.to} of{" "}
                  {pagination.total} transactions
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      loadTransactions(
                        currentPage - 1,
                        sortConfig,
                        selectedEtfId,
                      )
                    }
                    disabled={currentPage <= 1}
                    className="rounded-xl border border-brand-outline px-4 py-2 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="text-sm font-semibold text-brand-muted">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      loadTransactions(
                        currentPage + 1,
                        sortConfig,
                        selectedEtfId,
                      )
                    }
                    disabled={currentPage >= pagination.last_page}
                    className="rounded-xl border border-brand-outline px-4 py-2 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={Boolean(transactionToDelete)}
        title="Delete Transaction"
        message={
          transactionToDelete
            ? `Are you sure you want to delete this ${getTransactionTypeLabel(
                transactionToDelete.transaction_type_id,
              ).toLowerCase()} transaction for ${
                transactionToDelete.symbol || "this ETF"
              }? This action cannot be undone.`
            : ""
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete Transaction"}
        cancelLabel="Cancel"
        loading={isDeleting}
        variant="danger"
        onConfirm={handleDeleteTransaction}
        onCancel={() => setTransactionToDelete(null)}
      />
    </div>
  );
}

function SortableHeader({ label, sortBy, sortConfig, onSort }) {
  const isActive = Number(sortConfig.sortBy) === Number(sortBy);

  return (
    <th className="px-4 py-3 font-semibold">
      <button
        type="button"
        onClick={() => onSort(sortBy)}
        className={`inline-flex items-center gap-2 transition hover:text-brand-primary ${
          isActive ? "text-brand-primary" : "text-brand-muted"
        }`}
      >
        {label}
        <ArrowUpDown className="h-3.5 w-3.5" />
        {isActive && (
          <span className="text-xs">
            {sortConfig.sortOrder === "asc" ? "ASC" : "DESC"}
          </span>
        )}
      </button>
    </th>
  );
}

function TransactionTypeBadge({ transactionTypeId }) {
  const isBuy = Number(transactionTypeId) === 1;

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
        isBuy
          ? "bg-brand-primary/10 text-brand-primary"
          : "bg-brand-danger/10 text-brand-danger"
      }`}
    >
      {getTransactionTypeLabel(transactionTypeId)}
    </span>
  );
}

function getTransactionValue(transaction) {
  return (
    Number(transaction.shares || 0) * Number(transaction.price_per_share || 0)
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
