import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listSupportTickets } from "../../../api/adminSupport";

import DataTable from "../../../components/tables/DataTable";
import Pagination from "../../../components/tables/Pagination";

const statusFilters = [
  {
    label: "All",
    value: 1,
  },
  {
    label: "Closed",
    value: 2,
  },
  {
    label: "Open",
    value: 3,
  },
];

export default function ListTickets() {
  const [tickets, setTickets] = useState([]);
  const [meta, setMeta] = useState(null);
  const [status, setStatus] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadTickets(page = 1, currentStatus = status) {
    setLoading(true);
    setError(null);

    try {
      const response = await listSupportTickets({
        status: currentStatus,
        page,
      });

      setTickets(response.tickets.data);
      setMeta(response.tickets);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load support tickets.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function handleStatusChange(nextStatus) {
    setStatus(nextStatus);

    await loadTickets(1, nextStatus);
  }

  const columns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "support_topic_name",
      label: "Topic",
    },
    {
      key: "status_name",
      label: "Status",
      render: (row) => (
        <span className="rounded-full border border-brand-outline px-3 py-1 font-mono text-xs uppercase tracking-widest text-brand-muted">
          {row.status_name}
        </span>
      ),
    },
    {
      key: "name",
      label: "User",
    },
    {
      key: "ticket_text",
      label: "Issue",
      render: (row) => <span className="line-clamp-1">{row.ticket_text}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Link
          to={`/admin/support/${row.id}`}
          className="text-brand-primary hover:underline"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Support Operations
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold">
          Support Tickets
        </h1>

        <p className="mt-3 max-w-2xl text-brand-muted">
          Review user support requests, inspect ticket details, and respond from
          the admin command center.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
          {error}
        </div>
      )}

      <section className="glass-card rounded-3xl p-4">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => handleStatusChange(filter.value)}
              className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition ${
                status === filter.value
                  ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                  : "border-brand-outline text-brand-muted hover:border-brand-primary hover:text-brand-primary"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          Loading support tickets...
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={tickets}
            emptyMessage="No support tickets found."
          />

          <Pagination meta={meta} onPageChange={(page) => loadTickets(page)} />
        </>
      )}
    </div>
  );
}
