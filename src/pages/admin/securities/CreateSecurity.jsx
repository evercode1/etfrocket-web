import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";

import {
  securityDataSelects,
  storeSecurityData,
} from "../../../api/adminSecurities";

const emptyForm = {
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
};

export default function CreateSecurity() {
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

  const [error, setError] = useState("");

  useEffect(() => {
    loadSelects();
  }, []);

  async function loadSelects() {
    try {
      setLoading(true);
      setError("");

      const response = await securityDataSelects();

      const normalizedLookups = {
        securityTypes: normalizeSelects(response.data?.security_types),
        statuses: normalizeSelects(response.data?.statuses),
        etfIssuers: normalizeSelects(response.data?.etf_issuers),
        etfStrategyTypes: normalizeSelects(response.data?.etf_strategy_types),
        distributionFrequencies: normalizeSelects(
          response.data?.distribution_frequencies,
        ),
        securityUpdateTypes: normalizeSelects(
          response.data?.security_update_types,
        ),
      };

      setLookups(normalizedLookups);

      const activeStatusId =
        findOptionId(normalizedLookups.statuses, "Active") ??
        normalizedLookups.statuses[0]?.id ??
        "";

      const defaultSecurityTypeId =
        findOptionId(normalizedLookups.securityTypes, "ETF") ??
        normalizedLookups.securityTypes[0]?.id ??
        "";

      setForm((previous) => ({
        ...previous,
        security_type_id: defaultSecurityTypeId,
        status_id: activeStatusId,
      }));

      setSchedules([
        {
          security_update_type_id:
            findOptionId(normalizedLookups.securityUpdateTypes, "Dividend") ??
            findOptionId(
              normalizedLookups.securityUpdateTypes,
              "Dividend History",
            ) ??
            normalizedLookups.securityUpdateTypes[0]?.id ??
            "",
          run_day: 5,
          run_hour: 4,
          status_id: activeStatusId,
        },
        {
          security_update_type_id:
            findOptionId(normalizedLookups.securityUpdateTypes, "Fund Data") ??
            normalizedLookups.securityUpdateTypes[1]?.id ??
            normalizedLookups.securityUpdateTypes[0]?.id ??
            "",
          run_day: 1,
          run_hour: 5,
          status_id: activeStatusId,
        },
      ]);
    } catch (error) {
      console.error(error);
      setError("Unable to load security form options.");
    } finally {
      setLoading(false);
    }
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
        security_update_type_id: lookups.securityUpdateTypes[0]?.id ?? "",
        run_day: 1,
        run_hour: 0,
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

      await storeSecurityData({
        ...form,
        symbol: form.symbol.trim().toUpperCase(),
        security_type_id: nullableNumber(form.security_type_id),
        status_id: nullableNumber(form.status_id),
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

      const message =
        error.response?.data?.message ??
        "Unable to create security. Please review the form and try again.";

      setError(message);
    } finally {
      setSaving(false);
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
            Create Security
          </h1>

          <p className="mt-3 text-brand-muted">
            Loading security form options...
          </p>
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

        <h1 className="mt-4 font-display text-4xl font-bold">
          Create Security
        </h1>

        <p className="mt-3 text-brand-muted">
          Create a new security, security detail record, and update schedules.
        </p>
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
                Most securities should have dividend and fund data schedules.
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
              <table className="w-full min-w-[780px]">
                <thead className="bg-brand-surfaceHigh">
                  <tr>
                    <TableHeading>Update Type</TableHeading>
                    <TableHeading>Run Day</TableHeading>
                    <TableHeading>Run Hour</TableHeading>
                    <TableHeading>Status</TableHeading>
                    <TableHeading>Actions</TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {schedules.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-brand-muted"
                      >
                        No update schedules configured.
                      </td>
                    </tr>
                  ) : (
                    schedules.map((schedule, index) => (
                      <tr key={index} className="border-t border-brand-outline">
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Security"}
          </button>
        </div>
      </form>
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
