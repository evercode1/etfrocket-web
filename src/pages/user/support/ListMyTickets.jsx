import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listMySupportTickets } from "../../../api/support";

import DataTable from "../../../components/tables/DataTable";
import Pagination from "../../../components/tables/Pagination";

const statusFilters = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Open",
    value: "open",
  },
  {
    label: "Closed",
    value: "closed",
  },
];

export default function ListMyTickets() {
  const [tickets, setTickets] = useState([]);
  const [meta, setMeta] = useState(null);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadTickets(page = 1, currentStatus = status) {
    setLoading(true);
    setError(null);

    try {
      const response = await listMySupportTickets({
        status: currentStatus,
        page,
      });

      setTickets(response.tickets.data);
      setMeta(response.tickets);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your support tickets.",
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
      key: "topic",
      label: "Topic",
    },
    {
      key: "issue",
      label: "Issue",
      render: (row) => <span className="line-clamp-1">{row.issue}</span>,
    },
    {
      key: "created_at",
      label: "Created",
    },
    {
      key: "response_count",
      label: "Responses",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Link
          to={`/dashboard/support/${row.id}`}
          className="text-brand-primary hover:underline"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
            Support Center
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold">
            My Support Tickets
          </h1>

          <p className="mt-3 max-w-2xl text-brand-muted">
            View your support history and continue conversations with ETF Rocket
            support.
          </p>
        </div>

        <Link to="/dashboard/support/create" className="rocket-button-primary">
          New Ticket
        </Link>
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
