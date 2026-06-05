import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import {
  Archive,
  Building2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

const mockIssuers = [
  {
    id: 1,
    etf_issuer_name: "YieldMax",
    website_url: "https://yieldmaxetfs.com",
    status: "Active",
    updated_at: "2026-06-04",
  },
  {
    id: 2,
    etf_issuer_name: "Roundhill",
    website_url: "https://roundhillinvestments.com",
    status: "Active",
    updated_at: "2026-06-03",
  },
  {
    id: 3,
    etf_issuer_name: "NEOS",
    website_url: "https://neosfunds.com",
    status: "Retired",
    updated_at: "2026-05-15",
  },
];

export default function EtfIssuerManagement() {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [issuerToRetire, setIssuerToRetire] = useState(null);

  const filteredIssuers = useMemo(() => {
    return mockIssuers.filter((issuer) => {
      const matchesSearch =
        issuer.etf_issuer_name.toLowerCase().includes(search.toLowerCase()) ||
        issuer.website_url.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || issuer.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const activeCount = mockIssuers.filter(
    (issuer) => issuer.status === "Active",
  ).length;

  const retiredCount = mockIssuers.filter(
    (issuer) => issuer.status === "Retired",
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
            ETF Issuer Management
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold">ETF Issuers</h1>

          <p className="mt-3 max-w-3xl text-brand-muted">
            Manage ETF issuers used throughout ETF Rocket.
          </p>
        </div>

        <Link
          to="/admin/issuers/create"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 font-semibold text-black transition hover:opacity-90"
        >
          <Plus className="h-5 w-5" />
          Add ETF Issuer
        </Link>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard label="Total Issuers" value={mockIssuers.length} />

        <StatCard label="Active" value={activeCount} />

        <StatCard label="Retired" value={retiredCount} />
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-brand-muted" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search issuer name or website..."
              className="w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh py-3 pl-12 pr-4 text-brand-text outline-none transition placeholder:text-brand-muted focus:border-brand-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary"
          >
            <option value="all">All Statuses</option>

            <option value="active">Active</option>

            <option value="retired">Retired</option>
          </select>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-brand-surfaceHigh">
                <tr>
                  <TableHeading>Issuer</TableHeading>

                  <TableHeading>Website</TableHeading>

                  <TableHeading>Status</TableHeading>

                  <TableHeading>Updated</TableHeading>

                  <TableHeading>Actions</TableHeading>
                </tr>
              </thead>

              <tbody>
                {filteredIssuers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-brand-muted"
                    >
                      No issuers match your search.
                    </td>
                  </tr>
                ) : (
                  filteredIssuers.map((issuer) => (
                    <tr
                      key={issuer.id}
                      className="border-t border-brand-outline transition hover:bg-brand-surfaceHigh/60"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primaryStrong/10 text-brand-primary">
                            <Building2 className="h-5 w-5" />
                          </div>

                          <div>
                            <div className="font-semibold text-brand-text">
                              {issuer.etf_issuer_name}
                            </div>

                            <div className="text-xs text-brand-muted">
                              ID #{issuer.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-brand-muted">
                          {issuer.website_url}
                        </span>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={issuer.status} />
                      </TableCell>

                      <TableCell>{issuer.updated_at}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/admin/issuers/${issuer.id}/edit`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-outline bg-brand-surfaceHigh text-brand-primary transition hover:border-brand-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            disabled={issuer.status === "Retired"}
                            onClick={() => setIssuerToRetire(issuer)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 transition hover:bg-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-40"
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

          <div className="flex items-center justify-between border-t border-brand-outline bg-brand-surfaceHigh/20 px-6 py-5">
            <div className="text-sm text-brand-muted">
              Showing{" "}
              <span className="font-semibold text-brand-text">
                {filteredIssuers.length}
              </span>{" "}
              issuers
            </div>
          </div>
        </div>
      </section>

      <ConfirmDialog
        isOpen={Boolean(issuerToRetire)}
        title="Retire ETF Issuer?"
        message={
          issuerToRetire
            ? `This will retire ${issuerToRetire.etf_issuer_name}. Historical records will remain intact.`
            : ""
        }
        confirmLabel="Retire Issuer"
        onConfirm={() => {
          console.log("Retire issuer", issuerToRetire?.id);
        }}
        onCancel={() => setIssuerToRetire(null)}
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

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
        isActive
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
          : "border-red-400/30 bg-red-400/10 text-red-300"
      }`}
    >
      {isActive ? (
        <ShieldCheck className="h-3.5 w-3.5" />
      ) : (
        <ShieldOff className="h-3.5 w-3.5" />
      )}

      {status}
    </span>
  );
}
