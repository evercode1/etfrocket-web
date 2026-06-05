import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import {
  getAdminSelect,
  createAdminSelectValue,
  updateAdminSelectValue,
  deleteAdminSelectValue,
} from "../../../api/adminSelects";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";

export default function ManageSelectValues() {
  const [showModal, setShowModal] = useState(false);

  const [editingRow, setEditingRow] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [name, setName] = useState("");

  const [saving, setSaving] = useState(false);
  const { key } = useParams();

  const [config, setConfig] = useState(null);

  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  useEffect(() => {
    loadData();
  }, [key]);

  async function loadData() {
    try {
      setLoading(true);

      setError("");

      const response = await getAdminSelect(key);

      setConfig(response.config);

      setRows(response.rows ?? []);
    } catch (error) {
      console.error(error);

      setError("Unable to load select values.");
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setEditingRow(null);

    setName("");

    setShowModal(true);
  }

  function handleEdit(row) {
    setEditingRow(row);

    setName(row.name);

    setShowModal(true);
  }

  async function handleSave() {
    try {
      setSaving(true);

      if (editingRow) {
        await updateAdminSelectValue(key, editingRow.id, {
          name,
        });
      } else {
        await createAdminSelectValue(key, {
          name,
        });
      }

      setShowModal(false);

      await loadData();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      setSaving(true);

      await deleteAdminSelectValue(key, deleteTarget.id);

      setDeleteTarget(null);

      await loadData();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

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

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Values" value={rows.length} />

        <StatCard label="Create" value={config?.allow_create ? "Yes" : "No"} />

        <StatCard label="Update" value={config?.allow_update ? "Yes" : "No"} />

        <StatCard label="Delete" value={config?.allow_delete ? "Yes" : "No"} />
      </section>

      <section className="glass-card rounded-3xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Values</h2>

            <p className="mt-2 text-sm text-brand-muted">
              Configure the available values for this select list.
            </p>
          </div>

          {config?.allow_create && (
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-5 py-3 font-semibold text-black transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Value
            </button>
          )}
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
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-brand-muted"
                  >
                    Loading values...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-brand-muted"
                  >
                    No values configured.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-brand-outline">
                    <td className="px-5 py-5">{row.id}</td>

                    <td className="px-5 py-5">{row.name}</td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(row)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-outline bg-brand-surfaceHigh text-brand-primary transition hover:border-brand-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {config?.allow_delete && (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(row)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-3xl border border-brand-outline bg-brand-surface p-6">
            <h3 className="font-display text-2xl font-bold">
              <h3 className="font-display text-2xl font-bold">
                {editingRow
                  ? `Edit ${config?.label?.slice(0, -1) ?? "Value"}`
                  : `Add ${config?.label?.slice(0, -1) ?? "Value"}`}
              </h3>
            </h3>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-6 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-2xl border border-brand-outline px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-2xl bg-brand-primary px-4 py-2 font-semibold text-black"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title={`Delete ${config?.label?.slice(0, -1) ?? "Value"}?`}
        message={deleteTarget ? `Delete "${deleteTarget.name}"?` : ""}
        confirmLabel="Delete"
        loading={saving}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
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

function formatTitle(value) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
