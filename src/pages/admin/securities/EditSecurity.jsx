import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { AlertTriangle, ArrowLeft, Plus, Save, Trash2 } from "lucide-react";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import {
  retireSecurityData,
  securityDataSelects,
  showSecurityData,
  updateSecurityData,
} from "../../../api/adminSecurities";

const emptyForm = {
  id: "",
  symbol: "",
  security_type_id: "",
  status_id: "",
  security_name: "",
  etf_issuer_id: "",
  etf_strategy_type_id: "",
  distribution_frequency_id: "",
  expense_ratio: "",
  website_url: "",
  notes: "",
  created_at: "",
  updated_at: "",
};

export default function EditSecurity() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);

  const [schedules, setSchedules] = useState([]);

  const [lookups, setLookups] = useState({
    securityTypes: [],
    statuses: [],
    etfIssuers: [],
    etfStrategyTypes: [],
    distributionFrequencies: [],
    securityUpdateTypes: [],
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [retiring, setRetiring] = useState(false);

  const [error, setError] = useState("");

  const [showRetireConfirm, setShowRetireConfirm] = useState(false);

  useEffect(() => {
    loadPageData();
  }, [id]);

  async function loadPageData() {
    try {
      setLoading(true);
      setError("");

      const [selectsResponse, securityResponse] = await Promise.all([
        securityDataSelects(),
        showSecurityData(id),
      ]);

      setLookups({
        securityTypes: normalizeSelects(selectsResponse.data?.security_types),
        statuses: normalizeSelects(selectsResponse.data?.statuses),
        etfIssuers: normalizeSelects(selectsResponse.data?.etf_issuers),
        etfStrategyTypes: normalizeSelects(
          selectsResponse.data?.etf_strategy_types,
        ),
        distributionFrequencies: normalizeSelects(
          selectsResponse.data?.distribution_frequencies,
        ),
        securityUpdateTypes: normalizeSelects(
          selectsResponse.data?.security_update_types,
        ),
      });

      hydrateForm(securityResponse.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load security.");
    } finally {
      setLoading(false);
    }
  }

  function hydrateForm(security) {
    setForm({
      id: security.id ?? "",
      symbol: security.symbol ?? "",
      security_type_id: stringValue(security.security_type_id),
      status_id: stringValue(security.status_id),
      security_name: security.detail?.security_name ?? "",
      etf_issuer_id: stringValue(security.detail?.etf_issuer_id),
      etf_strategy_type_id: stringValue(security.detail?.etf_strategy_type_id),
      distribution_frequency_id: stringValue(
        security.detail?.distribution_frequency_id,
      ),
      expense_ratio: security.detail?.expense_ratio ?? "",
      website_url: security.detail?.website_url ?? "",
      notes: security.detail?.notes ?? "",
      created_at: security.created_at ?? "",
      updated_at: security.updated_at ?? "",
    });

    setSchedules(
      (security.update_schedules ?? []).map((schedule) => ({
        id: schedule.id ?? null,
        security_update_type_id: stringValue(schedule.security_update_type_id),
        run_day: schedule.run_day ?? 1,
        run_hour: schedule.run_hour ?? 0,
        last_run_at: schedule.last_run_at ?? null,
        status_id: stringValue(schedule.status_id),
      })),
    );
  }

  function update(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function addSchedule() {
    const activeStatusId =
      findOptionId(lookups.statuses, "Active") ?? lookups.statuses[0]?.id ?? "";

    setSchedules((previous) => [
      ...previous,
      {
        id: null,
        security_update_type_id: lookups.securityUpdateTypes[0]?.id ?? "",
        run_day: 1,
        run_hour: 0,
        last_run_at: null,
        status_id: activeStatusId,
      },
    ]);
  }

  function removeSchedule(index) {
    setSchedules((previous) => previous.filter((_, i) => i !== index));
  }

  function updateSchedule(index, field, value) {
    setSchedules((previous) =>
      previous.map((schedule, i) =>
        i === index
          ? {
              ...schedule,
              [field]: value,
            }
          : schedule,
      ),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await updateSecurityData(id, {
        symbol: form.symbol.trim().toUpperCase(),
        security_type_id: nullableNumber(form.security_type_id),
        status_id: nullableNumber(form.status_id),
        security_name: form.security_name,
        etf_issuer_id: nullableNumber(form.etf_issuer_id),
        etf_strategy_type_id: nullableNumber(form.etf_strategy_type_id),
        distribution_frequency_id: nullableNumber(
          form.distribution_frequency_id,
        ),
        expense_ratio: nullableValue(form.expense_ratio),
        website_url: nullableValue(form.website_url),
        notes: nullableValue(form.notes),
        schedules: schedules.map((schedule) => ({
          security_update_type_id: Number(schedule.security_update_type_id),
          run_day: Number(schedule.run_day),
          run_hour: Number(schedule.run_hour),
          status_id: Number(schedule.status_id),
        })),
      });

      navigate("/admin/securities");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ??
          "Unable to update security. Please review the form and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRetire() {
    try {
      setRetiring(true);
      setError("");

      await retireSecurityData(id);

      navigate("/admin/securities");
    } catch (error) {
      console.error(error);

      setError("Unable to retire security.");
    } finally {
      setRetiring(false);
      setShowRetireConfirm(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Link
            to="/admin/securities"
            className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Securities
          </Link>

          <h1 className="mt-4 font-display text-4xl font-bold">
            Edit Security
          </h1>

          <p className="mt-3 text-brand-muted">Loading security...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/admin/securities"
          className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Securities
        </Link>

        <h1 className="mt-4 font-display text-4xl font-bold">Edit Security</h1>

        <p className="mt-3 text-brand-muted">
          {form.symbol} · {form.security_name}
        </p>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-brand-muted">
          <span className="rounded-full border border-brand-outline px-4 py-2">
            Security ID: {form.id}
          </span>

          <span className="rounded-full border border-brand-outline px-4 py-2">
            Created: {formatDate(form.created_at)}
          </span>

          <span className="rounded-full border border-brand-outline px-4 py-2">
            Updated: {formatDate(form.updated_at)}
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="glass-card rounded-3xl p-8">
          <h2 className="font-display text-2xl font-bold">Core Security</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Field
              label="Symbol"
              value={form.symbol}
              onChange={(value) => update("symbol", value)}
              required
            />

            <SelectField
              label="Security Type"
              value={form.security_type_id}
              options={lookups.securityTypes}
              onChange={(value) => update("security_type_id", value)}
              required
            />

            <SelectField
              label="Status"
              value={form.status_id}
              options={lookups.statuses}
              onChange={(value) => update("status_id", value)}
              required
            />
          </div>
        </section>

        <section className="glass-card rounded-3xl p-8">
          <h2 className="font-display text-2xl font-bold">Security Details</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Field
              label="Security Name"
              value={form.security_name}
              onChange={(value) => update("security_name", value)}
              required
            />

            <SelectField
              label="ETF Issuer"
              value={form.etf_issuer_id}
              options={lookups.etfIssuers}
              onChange={(value) => update("etf_issuer_id", value)}
            />

            <SelectField
              label="ETF Strategy Type"
              value={form.etf_strategy_type_id}
              options={lookups.etfStrategyTypes}
              onChange={(value) => update("etf_strategy_type_id", value)}
            />

            <SelectField
              label="Distribution Frequency"
              value={form.distribution_frequency_id}
              options={lookups.distributionFrequencies}
              onChange={(value) => update("distribution_frequency_id", value)}
            />

            <Field
              label="Expense Ratio"
              value={form.expense_ratio}
              onChange={(value) => update("expense_ratio", value)}
              type="number"
              step="0.0001"
              min="0"
            />

            <Field
              label="Website URL"
              value={form.website_url}
              onChange={(value) => update("website_url", value)}
              type="url"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold">Notes</label>

            <textarea
              rows={6}
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 outline-none transition focus:border-brand-primary"
            />
          </div>
        </section>

        <section className="glass-card rounded-3xl p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">
                Update Schedules
              </h2>

              <p className="mt-2 text-sm text-brand-muted">
                Configure recurring dividend and fund data update jobs.
              </p>
            </div>

            <button
              type="button"
              onClick={addSchedule}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-primary/30 bg-brand-primary/10 px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary/15"
            >
              <Plus className="h-4 w-4" />
              Add Schedule
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-brand-outline">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-brand-surfaceHigh">
                  <tr>
                    <TableHeading>Update Type</TableHeading>
                    <TableHeading>Run Day</TableHeading>
                    <TableHeading>Run Hour</TableHeading>
                    <TableHeading>Status</TableHeading>
                    <TableHeading>Last Run</TableHeading>
                    <TableHeading>Actions</TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {schedules.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-brand-muted"
                      >
                        No update schedules configured.
                      </td>
                    </tr>
                  ) : (
                    schedules.map((schedule, index) => (
                      <tr
                        key={`${schedule.id ?? "new"}-${index}`}
                        className="border-t border-brand-outline"
                      >
                        <TableCell>
                          <select
                            value={schedule.security_update_type_id}
                            onChange={(event) =>
                              updateSchedule(
                                index,
                                "security_update_type_id",
                                event.target.value,
                              )
                            }
                            className="w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-3 py-2 outline-none transition focus:border-brand-primary"
                            required
                          >
                            <option value="">Select...</option>

                            {lookups.securityUpdateTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </TableCell>

                        <TableCell>
                          <input
                            type="number"
                            min="0"
                            max="7"
                            value={schedule.run_day}
                            onChange={(event) =>
                              updateSchedule(
                                index,
                                "run_day",
                                event.target.value,
                              )
                            }
                            className="w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-3 py-2 outline-none transition focus:border-brand-primary"
                            required
                          />
                        </TableCell>

                        <TableCell>
                          <input
                            type="number"
                            min="0"
                            max="23"
                            value={schedule.run_hour}
                            onChange={(event) =>
                              updateSchedule(
                                index,
                                "run_hour",
                                event.target.value,
                              )
                            }
                            className="w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-3 py-2 outline-none transition focus:border-brand-primary"
                            required
                          />
                        </TableCell>

                        <TableCell>
                          <select
                            value={schedule.status_id}
                            onChange={(event) =>
                              updateSchedule(
                                index,
                                "status_id",
                                event.target.value,
                              )
                            }
                            className="w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-3 py-2 outline-none transition focus:border-brand-primary"
                            required
                          >
                            <option value="">Select...</option>

                            {lookups.statuses.map((status) => (
                              <option key={status.id} value={status.id}>
                                {status.name}
                              </option>
                            ))}
                          </select>
                        </TableCell>

                        <TableCell>
                          <span className="text-sm text-brand-muted">
                            {schedule.last_run_at
                              ? formatDate(schedule.last_run_at)
                              : "Never"}
                          </span>
                        </TableCell>

                        <TableCell>
                          <button
                            type="button"
                            onClick={() => removeSchedule(index)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                            title="Remove schedule"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-red-500/30 bg-red-500/5 p-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />

            <h2 className="font-display text-2xl font-bold text-red-400">
              Danger Zone
            </h2>
          </div>

          <p className="mt-3 text-brand-muted">
            Retiring a security keeps historical records intact while disabling
            future updates and related update schedules.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowRetireConfirm(true)}
              disabled={
                form.status_id === findOptionId(lookups.statuses, "Retired")
              }
              className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 font-semibold text-yellow-400 transition hover:bg-yellow-500/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Retire Security
            </button>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showRetireConfirm}
        title="Retire Security?"
        message={`This will retire ${form.symbol} and disable its related update schedules. Historical records will remain intact.`}
        confirmLabel="Retire Security"
        loading={retiring}
        onConfirm={handleRetire}
        onCancel={() => setShowRetireConfirm(false)}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  step,
  min,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold">{label}</label>

      <input
        type={type}
        value={value}
        required={required}
        step={step}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 outline-none transition focus:border-brand-primary"
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange, required = false }) {
  return (
    <div>
      <label className="block text-sm font-semibold">{label}</label>

      <select
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 outline-none transition focus:border-brand-primary"
      >
        <option value="">Select...</option>

        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function TableHeading({ children }) {
  return (
    <th className="px-4 py-4 text-left font-mono text-xs uppercase tracking-widest text-brand-muted">
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return <td className="px-4 py-4 align-top">{children}</td>;
}

function normalizeSelects(selects) {
  if (!selects) {
    return [];
  }

  if (Array.isArray(selects)) {
    return selects.map((option) => ({
      id: String(option.id),
      name: option.name,
    }));
  }

  return Object.entries(selects).map(([id, name]) => ({
    id: String(id),
    name,
  }));
}

function findOptionId(options, name) {
  return options.find((option) => option.name === name)?.id;
}

function nullableNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

function nullableValue(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return value;
}

function stringValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString();
}
