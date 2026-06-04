import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import {
  Pencil,
  Plus,
  Search,
  Trash2,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

const mockLookups = {
  statuses: [
    {
      id: 1,
      name: "Active",
    },
    {
      id: 2,
      name: "Retired",
    },
    {
      id: 3,
      name: "Pending",
    },
  ],

  securityTypes: [
    {
      id: 1,
      name: "ETF",
    },
    {
      id: 2,
      name: "Stock",
    },
  ],

  etfIssuers: [
    {
      id: 1,
      name: "YieldMax",
    },
    {
      id: 2,
      name: "Roundhill",
    },
    {
      id: 3,
      name: "NEOS",
    },
    {
      id: 4,
      name: "REX Shares",
    },
  ],

  etfStrategyTypes: [
    {
      id: 1,
      name: "Option Income",
    },
    {
      id: 2,
      name: "Covered Call",
    },
    {
      id: 3,
      name: "High Income",
    },
    {
      id: 4,
      name: "Growth Income",
    },
  ],

  distributionFrequencies: [
    {
      id: 1,
      name: "Weekly",
    },
    {
      id: 2,
      name: "Monthly",
    },
    {
      id: 3,
      name: "Quarterly",
    },
  ],
};

const mockSecurities = [
  {
    id: 1,
    security_type_id: 1,
    status_id: 1,
    symbol: "CHPY",

    detail: {
      security_name: "YieldMax Semiconductor Portfolio Option Income ETF",
      etf_issuer_id: 1,
      etf_strategy_type_id: 1,
      distribution_frequency_id: 2,
      expense_ratio: "0.9900",
      website_url: "https://www.yieldmaxetfs.com",
      notes: "Semiconductor-focused option income ETF.",
    },

    schedules: [
      {
        id: 1,
        security_update_type_name: "Price History",
        run_day: 1,
        run_hour: 2,
        status_id: 1,
        last_run_at: "2026-06-02 02:00:00",
      },
      {
        id: 2,
        security_update_type_name: "Dividend History",
        run_day: 5,
        run_hour: 4,
        status_id: 1,
        last_run_at: "2026-06-01 04:00:00",
      },
    ],
  },

  {
    id: 2,
    security_type_id: 1,
    status_id: 1,
    symbol: "AAPW",

    detail: {
      security_name: "Roundhill AAPL WeeklyPay ETF",
      etf_issuer_id: 2,
      etf_strategy_type_id: 2,
      distribution_frequency_id: 1,
      expense_ratio: "0.9900",
      website_url: "https://www.roundhillinvestments.com",
      notes: "Weekly income strategy linked to AAPL.",
    },

    schedules: [
      {
        id: 3,
        security_update_type_name: "Price History",
        run_day: 1,
        run_hour: 2,
        status_id: 1,
        last_run_at: "2026-06-02 02:00:00",
      },
    ],
  },

  {
    id: 3,
    security_type_id: 1,
    status_id: 1,
    symbol: "NVII",

    detail: {
      security_name: "NEOS Nasdaq-100 High Income ETF",
      etf_issuer_id: 3,
      etf_strategy_type_id: 3,
      distribution_frequency_id: 2,
      expense_ratio: "0.6800",
      website_url: "https://neosfunds.com",
      notes: "Nasdaq-focused income ETF.",
    },

    schedules: [
      {
        id: 4,
        security_update_type_name: "Price History",
        run_day: 1,
        run_hour: 3,
        status_id: 1,
        last_run_at: "2026-06-02 03:00:00",
      },
      {
        id: 5,
        security_update_type_name: "AUM History",
        run_day: 1,
        run_hour: 5,
        status_id: 1,
        last_run_at: "2026-06-01 05:00:00",
      },
    ],
  },

  {
    id: 4,
    security_type_id: 1,
    status_id: 2,
    symbol: "FEAT",

    detail: {
      security_name: "Future ETF",
      etf_issuer_id: null,
      etf_strategy_type_id: null,
      distribution_frequency_id: null,
      expense_ratio: null,
      website_url: "",
      notes: "Candidate for retirement.",
    },

    schedules: [],
  },
];

export default function SecurityManagement() {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredSecurities = useMemo(() => {
    return mockSecurities.filter((security) => {
      const statusName = getLookupName(
        mockLookups.statuses,
        security.status_id,
      );

      const issuerName = getLookupName(
        mockLookups.etfIssuers,
        security.detail.etf_issuer_id,
      );

      const strategyName = getLookupName(
        mockLookups.etfStrategyTypes,
        security.detail.etf_strategy_type_id,
      );

      const distributionName = getLookupName(
        mockLookups.distributionFrequencies,
        security.detail.distribution_frequency_id,
      );

      const searchableText = [
        security.symbol,
        security.detail.security_name,
        issuerName,
        strategyName,
        distributionName,
        statusName,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || statusName.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const activeCount = mockSecurities.filter(
    (security) =>
      getLookupName(mockLookups.statuses, security.status_id) === "Active",
  ).length;

  const retiredCount = mockSecurities.filter(
    (security) =>
      getLookupName(mockLookups.statuses, security.status_id) === "Retired",
  ).length;

  const scheduledCount = mockSecurities.filter(
    (security) => security.schedules.length > 0,
  ).length;

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
        <StatCard label="Total Securities" value={mockSecurities.length} />

        <StatCard label="Active" value={activeCount} />

        <StatCard label="Retired" value={retiredCount} />

        <StatCard label="Scheduled Updates" value={scheduledCount} />
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-brand-muted" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by symbol, name, issuer, strategy, distribution, or status..."
              className="w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh py-3 pl-12 pr-4 text-brand-text outline-none transition placeholder:text-brand-muted focus:border-brand-primary"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="retired">Retired</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

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
                {filteredSecurities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-brand-muted"
                    >
                      No securities match your search.
                    </td>
                  </tr>
                ) : (
                  filteredSecurities.map((security) => {
                    const statusName = getLookupName(
                      mockLookups.statuses,
                      security.status_id,
                    );

                    return (
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
                            {security.detail.security_name}
                          </div>

                          {security.detail.website_url && (
                            <div className="mt-1 truncate text-xs text-brand-muted">
                              {security.detail.website_url}
                            </div>
                          )}
                        </TableCell>

                        <TableCell>
                          {getLookupName(
                            mockLookups.etfIssuers,
                            security.detail.etf_issuer_id,
                          )}
                        </TableCell>

                        <TableCell>
                          {getLookupName(
                            mockLookups.etfStrategyTypes,
                            security.detail.etf_strategy_type_id,
                          )}
                        </TableCell>

                        <TableCell>
                          {getLookupName(
                            mockLookups.distributionFrequencies,
                            security.detail.distribution_frequency_id,
                          )}
                        </TableCell>

                        <TableCell>
                          <StatusBadge status={statusName} />
                        </TableCell>

                        <TableCell>
                          <ScheduleSummary schedules={security.schedules} />
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
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                              title="Delete security"
                              onClick={() => {
                                console.log("Delete security", security.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
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

      {status}
    </span>
  );
}

function ScheduleSummary({ schedules }) {
  if (!schedules.length) {
    return <span className="text-brand-muted">No schedules</span>;
  }

  return (
    <div className="space-y-1">
      <div className="font-semibold text-brand-text">
        {schedules.length} configured
      </div>

      <div className="text-xs text-brand-muted">
        {schedules
          .slice(0, 2)
          .map((schedule) => schedule.security_update_type_name)
          .join(", ")}
        {schedules.length > 2 ? "..." : ""}
      </div>
    </div>
  );
}

function getLookupName(options, id) {
  if (!id) {
    return "—";
  }

  return options.find((option) => option.id === id)?.name ?? "Unknown";
}
