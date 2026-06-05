import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  Archive,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import {
  listSecuritiesData,
  retireSecurityData,
  securityDataSelects,
} from "../../../api/adminSecurities";

export default function SecurityManagement() {
  const [securities, setSecurities] = useState([]);

  const [statuses, setStatuses] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

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
  }, [currentPage, perPage, search, statusFilter]);

  async function loadSelects() {
    try {
      const response = await securityDataSelects();

      setStatuses(normalizeSelects(response.data?.statuses));
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

  const scheduledCount = securities.filter(
    (security) => Number(security.schedule_count) > 0,
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

        <StatCard label="Scheduled On Page" value={scheduledCount} />
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
                  <TableHeading>Distribution</TableHeading>
                  <TableHeading>Status</TableHeading>
                  <TableHeading>Schedules</TableHeading>
                  <TableHeading>Actions</TableHeading>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-brand-muted"
                    >
                      Loading securities...
                    </td>
                  </tr>
                ) : securities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
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
                        {security.distribution_frequency ?? "—"}
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={security.status} />
                      </TableCell>

                      <TableCell>
                        <ScheduleSummary count={security.schedule_count} />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
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

function ScheduleSummary({ count }) {
  const scheduleCount = Number(count ?? 0);

  if (scheduleCount === 0) {
    return <span className="text-brand-muted">No schedules</span>;
  }

  return (
    <div className="space-y-1">
      <div className="font-semibold text-brand-text">
        {scheduleCount} configured
      </div>

      <div className="text-xs text-brand-muted">Update schedules active</div>
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
