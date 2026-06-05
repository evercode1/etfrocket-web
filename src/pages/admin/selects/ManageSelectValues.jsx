import { useParams, Link } from "react-router-dom";

import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";

export default function ManageSelectValues() {
  const { key } = useParams();

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/admin/selects"
          className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Select Management
        </Link>

        <p className="mt-6 font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Select Management
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold">
          {formatTitle(key)}
        </h1>

        <p className="mt-3 max-w-3xl text-brand-muted">
          Manage values for this select list. Add new options, update existing
          values, and maintain reference data used throughout ETF Rocket.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard label="Total Values" value="0" />

        <StatCard label="Editable" value="Yes" />

        <StatCard label="Deletable" value="No" />
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Values</h2>

            <p className="mt-2 text-sm text-brand-muted">
              Configure the available values for this select list.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-5 py-3 font-semibold text-black transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Value
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
          <table className="w-full">
            <thead className="bg-brand-surfaceHigh">
              <tr>
                <TableHeading>ID</TableHeading>

                <TableHeading>Value</TableHeading>

                <TableHeading>Actions</TableHeading>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-brand-muted"
                >
                  No values loaded yet.
                </td>
              </tr>
            </tbody>
          </table>
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

function formatTitle(value) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
