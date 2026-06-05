import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { AlertTriangle, ArrowLeft, Building2, Save } from "lucide-react";

import ConfirmDialog from "../../../components/ui/ConfirmDialog";

import {
  etfIssuerSelects,
  showEtfIssuer,
  updateEtfIssuer,
  retireEtfIssuer,
} from "../../../api/adminEtfIssuers";

const emptyForm = {
  id: "",
  etf_issuer_name: "",
  website_url: "",
  status_id: "",
  notes: "",
  created_at: "",
  updated_at: "",
};

export default function EditEtfIssuer() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);

  const [statuses, setStatuses] = useState([]);

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

      const [selectsResponse, issuerResponse] = await Promise.all([
        etfIssuerSelects(),
        showEtfIssuer(id),
      ]);

      const normalizedStatuses = normalizeSelects(
        selectsResponse.data?.statuses,
      );

      const filteredStatuses = normalizedStatuses.filter((status) =>
        ["Active", "Retired"].includes(status.name),
      );

      setStatuses(filteredStatuses);

      const issuer = issuerResponse.data;

      setForm({
        id: issuer.id ?? "",
        etf_issuer_name: issuer.etf_issuer_name ?? "",
        website_url: issuer.website_url ?? "",
        status_id: String(issuer.status_id ?? ""),
        notes: issuer.notes ?? "",
        created_at: issuer.created_at ?? "",
        updated_at: issuer.updated_at ?? "",
      });
    } catch (error) {
      console.error(error);

      setError("Unable to load ETF issuer.");
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

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      setError("");

      await updateEtfIssuer(id, {
        etf_issuer_name: form.etf_issuer_name.trim(),

        website_url: nullableValue(form.website_url),

        status_id: Number(form.status_id),

        notes: nullableValue(form.notes),
      });

      navigate("/admin/issuers");
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message ?? "Unable to update ETF issuer.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRetire() {
    try {
      setRetiring(true);

      setError("");

      await retireEtfIssuer(id);

      navigate("/admin/issuers");
    } catch (error) {
      console.error(error);

      setError("Unable to retire ETF issuer.");
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
            to="/admin/issuers"
            className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Issuers
          </Link>

          <h1 className="mt-4 font-display text-4xl font-bold">
            Edit ETF Issuer
          </h1>

          <p className="mt-3 text-brand-muted">Loading issuer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/admin/issuers"
          className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Issuers
        </Link>

        <h1 className="mt-4 font-display text-4xl font-bold">
          Edit ETF Issuer
        </h1>

        <p className="mt-3 text-brand-muted">{form.etf_issuer_name}</p>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-brand-muted">
          <span className="rounded-full border border-brand-outline px-4 py-2">
            Issuer ID: {form.id}
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
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-brand-primary" />

            <h2 className="font-display text-2xl font-bold">
              ETF Issuer Details
            </h2>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Field
              label="ETF Issuer Name"
              value={form.etf_issuer_name}
              onChange={(value) => update("etf_issuer_name", value)}
              required
            />

            <Field
              label="Website URL"
              value={form.website_url}
              onChange={(value) => update("website_url", value)}
              type="url"
            />

            <SelectField
              label="Status"
              value={form.status_id}
              options={statuses}
              onChange={(value) => update("status_id", value)}
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold">Notes</label>

            <textarea
              rows={8}
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-brand-outline bg-brand-surfaceHigh px-4 py-3 outline-none transition focus:border-brand-primary"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-yellow-500/30 bg-yellow-500/5 p-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />

            <h2 className="font-display text-2xl font-bold text-yellow-400">
              Danger Zone
            </h2>
          </div>

          <p className="mt-3 text-brand-muted">
            Retiring an ETF issuer preserves historical records while preventing
            future use.
          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowRetireConfirm(true)}
              disabled={form.status_id === findOptionId(statuses, "Retired")}
              className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 font-semibold text-yellow-400 transition hover:bg-yellow-500/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Retire ETF Issuer
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
        title="Retire ETF Issuer?"
        message={`This will retire ${form.etf_issuer_name}. Historical records will remain intact.`}
        confirmLabel="Retire ETF Issuer"
        loading={retiring}
        onConfirm={handleRetire}
        onCancel={() => setShowRetireConfirm(false)}
      />
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-sm font-semibold">{label}</label>

      <input
        type={type}
        value={value}
        required={required}
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

function normalizeSelects(selects) {
  if (!selects) {
    return [];
  }

  return Object.entries(selects).map(([id, name]) => ({
    id: String(id),
    name,
  }));
}

function nullableValue(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return value;
}

function findOptionId(options, name) {
  return options.find((option) => option.name === name)?.id;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString();
}
