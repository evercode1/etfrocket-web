import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  AlertOctagon,
  AlertTriangle,
  Archive,
  CheckCircle2,
  Clock,
  MinusCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import {
  listSecuritiesData,
  retireSecurityData,
  runSecurityFundDataUpdate,
  securityDataSelects,
} from "../../../api/adminSecurities";
import { formatCompact, formatDate, formatNav } from "../../../utils/aumFormat";

/*
| Data (fund data coverage) filter values match the API's `coverage` param.
*/
const COVERAGE_FILTERS = [
  { value: "all", label: "All Data" },
  { value: "current", label: "Current" },
  { value: "stale", label: "Stale" },
  { value: "failing", label: "Scrape failing" },
  { value: "pending", label: "Awaiting first data" },
  { value: "not_covered", label: "Not covered" },
];

export default function SecurityManagement() {
  const [securities, setSecurities] = useState([]);

  const [statuses, setStatuses] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [coverageFilter, setCoverageFilter] = useState("all");

  // security id -> "running" | { succeeded, data, error }
  const [updateResults, setUpdateResults] = useState({});

  const [perPage, setPerPage] = useState(25);

  const [currentPage, setCurrentPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [retireTarget, setRetireTarget] = useState(null);

  const [retiring, setRetiring] = useState(false);

  useEffect(() => {
    loadSelects();
  }, []);

  useEffect(() => {
    loadSecurities();
  }, [currentPage, perPage, search, statusFilter, coverageFilter]);

  async function loadSelects() {
    try {
      const response = await securityDataSelects();

      const normalizedStatuses = normalizeSelects(response.data?.statuses);

      const filteredStatuses = normalizedStatuses.filter((status) =>
        ["Active", "Retired"].includes(status.name),
      );

      setStatuses(filteredStatuses);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadSecurities() {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: currentPage,
        per_page: perPage,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (statusFilter !== "all") {
        params.status_id = statusFilter;
      }

      if (coverageFilter !== "all") {
        params.coverage = coverageFilter;
      }

      const response = await listSecuritiesData(params);

      const paginator = response.data;

      setSecurities(paginator.data ?? []);
      setCurrentPage(paginator.current_page ?? 1);
      setLastPage(paginator.last_page ?? 1);
      setTotal(paginator.total ?? 0);
    } catch (error) {
      console.error(error);
      setError("Unable to load securities.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRetire() {
    if (!retireTarget) {
      return;
    }

    try {
      setRetiring(true);

      await retireSecurityData(retireTarget.id);

      setRetireTarget(null);

      await loadSecurities();
    } catch (error) {
      console.error(error);
      setError("Unable to retire security.");
    } finally {
      setRetiring(false);
    }
  }

  async function handleRunUpdate(security) {
    setUpdateResults((results) => ({ ...results, [security.id]: "running" }));

    let result;

    try {
      const response = await runSecurityFundDataUpdate(security.id);

      result = response.data;
    } catch (err) {
      result = {
        succeeded: false,
        error: err.response?.data?.message || "Unable to run the update.",
      };
    }

    setUpdateResults((results) => ({ ...results, [security.id]: result }));

    // Refresh the row's data status (latest AUM date, last scrape).
    await loadSecurities();
  }

  function handleCoverageChange(value) {
    setCoverageFilter(value);
    setCurrentPage(1);
  }

  function handleSearchChange(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleStatusChange(value) {
    setStatusFilter(value);
    setCurrentPage(1);
  }

  function handlePerPageChange(value) {
    setPerPage(Number(value));
    setCurrentPage(1);
  }

  const activeCount = securities.filter(
    (security) => security.status === "Active",
  ).length;

  const retiredCount = securities.filter(
    (security) => security.status === "Retired",
  ).length;

  const attentionCount = securities.filter(
    (security) =>
      security.coverage_status === "stale" || security.last_scrape?.failed,
  ).length;

  const showingFrom = total === 0 ? 0 : (currentPage - 1) * perPage + 1;

  const showingTo = Math.min(currentPage * perPage, total);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
            Security Management
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold">Securities</h1>

          <p className="mt-3 max-w-3xl text-brand-muted">
            Manage ETF Rocket securities, detail records, issuer assignments,
            strategy classifications, distribution settings, and update
            schedules.
          </p>
        </div>

        <Link
          to="/admin/securities/create"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 font-semibold text-black transition hover:opacity-90"
        >
          <Plus className="h-5 w-5" />
          Add Security
        </Link>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Securities" value={total} />

        <StatCard label="Active On Page" value={activeCount} />

        <StatCard label="Retired On Page" value={retiredCount} />

        <StatCard label="Needs Attention (Page)" value={attentionCount} />
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-brand-muted" />

            <input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by symbol or security name..."
              className="w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh py-3 pl-12 pr-4 text-brand-text outline-none transition placeholder:text-brand-muted focus:border-brand-primary"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={coverageFilter}
              onChange={(event) => handleCoverageChange(event.target.value)}
              aria-label="Filter by data status"
              className="rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary"
            >
              {COVERAGE_FILTERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => handleStatusChange(event.target.value)}
              className="rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary"
            >
              <option value="all">All Statuses</option>

              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>

            <select
              value={perPage}
              onChange={(event) => handlePerPageChange(event.target.value)}
              className="rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary"
            >
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="bg-brand-surfaceHigh">
                <tr>
                  <TableHeading>Symbol</TableHeading>
                  <TableHeading>Security Name</TableHeading>
                  <TableHeading>Issuer</TableHeading>
                  <TableHeading>Strategy</TableHeading>
                  <TableHeading>Status</TableHeading>
                  <TableHeading>Data</TableHeading>
                  <TableHeading>Actions</TableHeading>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-brand-muted"
                    >
                      Loading securities...
                    </td>
                  </tr>
                ) : securities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-brand-muted"
                    >
                      No securities match your search.
                    </td>
                  </tr>
                ) : (
                  securities.map((security) => (
                    <tr
                      key={security.id}
                      className="border-t border-brand-outline transition hover:bg-brand-surfaceHigh/60"
                    >
                      <TableCell>
                        <div className="font-display text-xl font-bold text-brand-text">
                          {security.symbol}
                        </div>

                        <div className="mt-1 text-xs text-brand-muted">
                          ID #{security.id}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="max-w-md font-semibold text-brand-text">
                          {security.security_name ?? "—"}
                        </div>

                        <div className="mt-1 text-xs text-brand-muted">
                          {security.security_type ?? "—"}
                        </div>
                      </TableCell>

                      <TableCell>{security.issuer ?? "—"}</TableCell>

                      <TableCell>{security.strategy ?? "—"}</TableCell>

                      <TableCell>
                        <StatusBadge status={security.status} />
                      </TableCell>

                      <TableCell>
                        <DataStatus security={security} />

                        <UpdateResult result={updateResults[security.id]} />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={
                              !security.has_scraper ||
                              updateResults[security.id] === "running"
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-outline bg-brand-surfaceHigh text-brand-primary transition hover:border-brand-primary disabled:cursor-not-allowed disabled:opacity-40"
                            title={
                              security.has_scraper
                                ? "Update now: scrape AUM and NAV for this ETF"
                                : "No scraper for this issuer"
                            }
                            aria-label={`Update ${security.symbol} now`}
                            onClick={() => handleRunUpdate(security)}
                          >
                            <RefreshCw
                              className={`h-4 w-4 ${
                                updateResults[security.id] === "running"
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                          </button>

                          <Link
                            to={`/admin/securities/${security.id}/edit`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-outline bg-brand-surfaceHigh text-brand-primary transition hover:border-brand-primary"
                            title="Edit security"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            disabled={security.status === "Retired"}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 transition hover:bg-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Retire security"
                            onClick={() => setRetireTarget(security)}
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-brand-outline bg-brand-surfaceHigh/20 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-brand-muted">
              Showing{" "}
              <span className="font-semibold text-brand-text">
                {showingFrom}–{showingTo}
              </span>{" "}
              of <span className="font-semibold text-brand-text">{total}</span>{" "}
              securities
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                className="rounded-xl border border-brand-outline px-4 py-2 text-sm text-brand-muted transition hover:border-brand-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="rounded-xl border border-brand-primary bg-brand-primary/15 px-4 py-2 text-sm font-semibold text-brand-primary">
                {currentPage}
              </span>

              <button
                type="button"
                disabled={currentPage >= lastPage || loading}
                onClick={() =>
                  setCurrentPage((page) => Math.min(page + 1, lastPage))
                }
                className="rounded-xl border border-brand-outline px-4 py-2 text-sm text-brand-muted transition hover:border-brand-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <ConfirmDialog
        isOpen={Boolean(retireTarget)}
        title="Retire Security?"
        message={
          retireTarget
            ? `This will retire ${retireTarget.symbol} and disable its related update schedules. Historical records will remain intact.`
            : ""
        }
        confirmLabel="Retire Security"
        loading={retiring}
        onConfirm={handleRetire}
        onCancel={() => setRetireTarget(null)}
      />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-muted">
        {label}
      </p>

      <p className="mt-4 font-display text-4xl font-bold text-brand-text">
        {value}
      </p>
    </div>
  );
}

function TableHeading({ children }) {
  return (
    <th className="px-5 py-4 text-left font-mono text-xs uppercase tracking-widest text-brand-muted">
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return <td className="px-5 py-5 align-top text-sm">{children}</td>;
}

function StatusBadge({ status }) {
  const isActive = status === "Active";

  const isRetired = status === "Retired";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
        isActive
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
          : isRetired
            ? "border-red-400/30 bg-red-400/10 text-red-300"
            : "border-amber-400/30 bg-amber-400/10 text-amber-300"
      }`}
    >
      {isActive ? (
        <ShieldCheck className="h-3.5 w-3.5" />
      ) : (
        <ShieldOff className="h-3.5 w-3.5" />
      )}

      {status ?? "Unknown"}
    </span>
  );
}

const COVERAGE_CHIPS = {
  current: {
    label: "Current",
    icon: CheckCircle2,
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  },
  stale: {
    label: "Stale",
    icon: AlertTriangle,
    className: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
  pending: {
    label: "Awaiting data",
    icon: Clock,
    className: "border-brand-outline bg-brand-surfaceHigh text-brand-muted",
  },
  not_covered: {
    label: "Not covered",
    icon: MinusCircle,
    className: "border-brand-outline bg-brand-surfaceHigh text-brand-muted",
  },
};

function Chip({ icon: Icon, label, className }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

function DataStatus({ security }) {
  const chip = COVERAGE_CHIPS[security.coverage_status] ?? COVERAGE_CHIPS.not_covered;
  const scrape = security.last_scrape ?? {};

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1.5">
        <Chip {...chip} />

        {scrape.failed && (
          <Chip
            icon={AlertOctagon}
            label="Scrape failing"
            className="border-red-400/30 bg-red-400/10 text-red-300"
          />
        )}
      </div>

      <div className="text-xs text-brand-muted">
        {security.latest_aum_date
          ? `AUM as of ${formatDate(security.latest_aum_date)}`
          : "No AUM data yet"}
      </div>

      {scrape.failed && scrape.last_error && (
        <div
          className="max-w-xs truncate text-xs text-red-300"
          title={scrape.last_error}
        >
          {scrape.last_error}
        </div>
      )}
    </div>
  );
}

function UpdateResult({ result }) {
  if (!result) {
    return null;
  }

  if (result === "running") {
    return (
      <div className="mt-2 text-xs text-brand-primary" role="status">
        Updating…
      </div>
    );
  }

  if (result.succeeded) {
    const data = result.data ?? {};

    return (
      <div className="mt-2 max-w-xs text-xs text-emerald-300" role="status">
        Updated: AUM {formatCompact(data.assets_under_management)}
        {data.aum_date ? ` (${formatDate(data.aum_date)})` : ""}, NAV{" "}
        {formatNav(data.nav_per_share)}
      </div>
    );
  }

  return (
    <div
      className="mt-2 max-w-xs text-xs text-red-300"
      role="status"
      title={result.error}
    >
      Update failed: {result.error}
    </div>
  );
}

function normalizeSelects(selects) {
  if (!selects) {
    return [];
  }

  if (Array.isArray(selects)) {
    return selects.map((option) => ({
      id: option.id,
      name: option.name,
    }));
  }

  return Object.entries(selects).map(([id, name]) => ({
    id,
    name,
  }));
}
