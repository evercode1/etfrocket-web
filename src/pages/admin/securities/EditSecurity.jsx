import { useState } from "react";

import { Link, useParams } from "react-router-dom";

import { AlertTriangle, ArrowLeft, Plus, Save, Trash2 } from "lucide-react";

const mockLookups = {
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
  ],

  etfStrategyTypes: [
    {
      id: 1,
      name: "Covered Call",
    },
    {
      id: 2,
      name: "Option Income",
    },
    {
      id: 3,
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

  securityUpdateTypes: [
    {
      id: 1,
      name: "Dividend History",
    },
    {
      id: 2,
      name: "Fund Data",
    },
  ],
};

const mockSecurity = {
  id: 1,

  symbol: "CHPY",

  security_type_id: 1,

  status_id: 1,

  security_name: "YieldMax Semiconductor Portfolio Option Income ETF",

  etf_issuer_id: 1,

  etf_strategy_type_id: 2,

  distribution_frequency_id: 2,

  expense_ratio: "0.9900",

  website_url: "https://www.yieldmaxetfs.com",

  notes: "Semiconductor-focused option income ETF.",

  created_at: "2026-05-31 10:15:00",

  updated_at: "2026-06-02 14:20:00",

  schedules: [
    {
      id: 1,
      security_update_type_id: 1,
      run_day: 5,
      run_hour: 4,
      last_run_at: "2026-06-01 04:00:00",
      status_id: 1,
    },
    {
      id: 2,
      security_update_type_id: 2,
      run_day: 1,
      run_hour: 5,
      last_run_at: "2026-06-02 05:00:00",
      status_id: 1,
    },
  ],
};

export default function EditSecurity() {
  const { id } = useParams();

  const [form, setForm] = useState({
    id: mockSecurity.id,

    symbol: mockSecurity.symbol,

    security_type_id: mockSecurity.security_type_id,

    status_id: mockSecurity.status_id,

    security_name: mockSecurity.security_name,

    etf_issuer_id: mockSecurity.etf_issuer_id,

    etf_strategy_type_id: mockSecurity.etf_strategy_type_id,

    distribution_frequency_id: mockSecurity.distribution_frequency_id,

    expense_ratio: mockSecurity.expense_ratio,

    website_url: mockSecurity.website_url,

    notes: mockSecurity.notes,
  });

  const [schedules, setSchedules] = useState(mockSecurity.schedules);

  function update(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function addSchedule() {
    setSchedules((previous) => [
      ...previous,
      {
        id: null,
        security_update_type_id: 1,
        run_day: 5,
        run_hour: 4,
        last_run_at: null,
        status_id: 1,
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

  function handleSubmit(event) {
    event.preventDefault();

    console.log({
      id,
      security: form,
      schedules,
    });

    // TODO:
    // PUT /admin/securities/:id
  }

  function handleRetire() {
    console.log("Retire security", id);

    // TODO:
    // PATCH /admin/securities/:id/retire
  }

  function handleDelete() {
    console.log("Delete security", id);

    // TODO:
    // DELETE /admin/securities/:id
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
            Created: {formatDate(mockSecurity.created_at)}
          </span>

          <span className="rounded-full border border-brand-outline px-4 py-2">
            Updated: {formatDate(mockSecurity.updated_at)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="glass-card rounded-3xl p-8">
          <h2 className="font-display text-2xl font-bold">Core Security</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Field
              label="Symbol"
              value={form.symbol}
              onChange={(value) => update("symbol", value)}
            />

            <SelectField
              label="Security Type"
              value={form.security_type_id}
              options={mockLookups.securityTypes}
              onChange={(value) => update("security_type_id", value)}
            />

            <SelectField
              label="Status"
              value={form.status_id}
              options={mockLookups.statuses}
              onChange={(value) => update("status_id", value)}
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
            />

            <SelectField
              label="ETF Issuer"
              value={form.etf_issuer_id}
              options={mockLookups.etfIssuers}
              onChange={(value) => update("etf_issuer_id", value)}
            />

            <SelectField
              label="ETF Strategy Type"
              value={form.etf_strategy_type_id}
              options={mockLookups.etfStrategyTypes}
              onChange={(value) => update("etf_strategy_type_id", value)}
            />

            <SelectField
              label="Distribution Frequency"
              value={form.distribution_frequency_id}
              options={mockLookups.distributionFrequencies}
              onChange={(value) => update("distribution_frequency_id", value)}
            />

            <Field
              label="Expense Ratio"
              value={form.expense_ratio}
              onChange={(value) => update("expense_ratio", value)}
            />

            <Field
              label="Website URL"
              value={form.website_url}
              onChange={(value) => update("website_url", value)}
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold">Notes</label>

            <textarea
              rows={6}
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3"
            />
          </div>
        </section>

        <section className="glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between">
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
              className="inline-flex items-center gap-2 rounded-2xl border border-brand-primary/30 bg-brand-primary/10 px-4 py-2 text-sm font-semibold text-brand-primary"
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
                  {schedules.map((schedule, index) => (
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
                              Number(event.target.value),
                            )
                          }
                          className="w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-3 py-2"
                        >
                          {mockLookups.securityUpdateTypes.map((type) => (
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
                              Number(event.target.value),
                            )
                          }
                          className="w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-3 py-2"
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
                              Number(event.target.value),
                            )
                          }
                          className="w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-3 py-2"
                        />
                      </TableCell>

                      <TableCell>
                        <select
                          value={schedule.status_id}
                          onChange={(event) =>
                            updateSchedule(
                              index,
                              "status_id",
                              Number(event.target.value),
                            )
                          }
                          className="w-full rounded-xl border border-brand-outline bg-brand-surfaceHigh px-3 py-2"
                        >
                          {mockLookups.statuses.map((status) => (
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
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </tr>
                  ))}
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
            Retire or permanently delete this security. Retiring a security
            keeps historical records intact while disabling future updates.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleRetire}
              className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 font-semibold text-yellow-400"
            >
              Retire Security
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-semibold text-red-400"
            >
              Delete Security
            </button>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 font-semibold text-black"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold">{label}</label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3"
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold">{label}</label>

      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3"
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

function formatDate(value) {
  return new Date(value).toLocaleString();
}
