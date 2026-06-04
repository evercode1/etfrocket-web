import { useState } from "react";

import { Link } from "react-router-dom";

import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";

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
      name: "Dividend",
    },
    {
      id: 2,
      name: "Fund Data",
    },
  ],
};

export default function CreateSecurity() {
  const [form, setForm] = useState({
    symbol: "",

    security_type_id: 1,

    status_id: 1,

    security_name: "",

    etf_issuer_id: "",

    etf_strategy_type_id: "",

    distribution_frequency_id: "",

    expense_ratio: "",

    website_url: "",

    notes: "",
  });

  const [schedules, setSchedules] = useState([
    {
      security_update_type_id: 1, // Dividend History
      run_day: 5,
      run_hour: 4,
      status_id: 1,
    },

    {
      security_update_type_id: 2, // Fund Data
      run_day: 1,
      run_hour: 5,
      status_id: 1,
    },
  ]);

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
        security_update_type_id: 1,
        run_day: 1,
        run_hour: 0,
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
      security: form,
      schedules,
    });

    // TODO:
    // POST /admin/securities
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Security */}

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

        {/* Security Details */}

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

        {/* Update Schedules */}

        <section className="glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">
              Update Schedules
            </h2>

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
            <table className="w-full">
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
                {schedules.map((schedule, index) => (
                  <tr key={index} className="border-t border-brand-outline">
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
                      <button
                        type="button"
                        onClick={() => removeSchedule(index)}
                        className="text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 font-semibold text-black"
          >
            <Save className="h-4 w-4" />
            Save Security
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
  return <td className="px-4 py-4">{children}</td>;
}
