import { useState } from "react";

import {
  AlertTriangle,
  BrainCircuit,
  Calculator,
  DatabaseZap,
  FileSpreadsheet,
  PencilLine,
} from "lucide-react";

import {
  backfillPriceHistory,
  calculateSecurityMetrics,
  runAiDataExtractions,
  truncateTables,
  updatePriceHistory,
} from "../../../api/adminData";

const initialOutputs = {
  priceHistory: null,
  metrics: null,
  aiExtraction: null,
  updatePriceHistory: null,
  truncate: null,
};

export default function DataManagement() {
  const [priceSymbol, setPriceSymbol] = useState("");
  const [metricsSymbol, setMetricsSymbol] = useState("");
  const [aiSymbol, setAiSymbol] = useState("");
  const [aiLimit, setAiLimit] = useState("");
  const [tables, setTables] = useState("");

  const [loadingKey, setLoadingKey] = useState(null);
  const [outputs, setOutputs] = useState(initialOutputs);
  const [confirmAction, setConfirmAction] = useState(null);

  const [updatePriceSymbol, setUpdatePriceSymbol] = useState("");
  const [updatePriceDate, setUpdatePriceDate] = useState("");
  const [updateClosePrice, setUpdateClosePrice] = useState("");

  function clearOutput(key) {
    setOutputs((current) => ({
      ...current,
      [key]: null,
    }));
  }

  async function runCommand(key, callback, onSuccess = null) {
    setLoadingKey(key);

    try {
      const response = await callback();

      setOutputs((current) => ({
        ...current,
        [key]: {
          status: response.status || "success",
          message: response.message || "Command completed successfully.",
        },
      }));

      onSuccess?.(response);
    } catch (error) {
      setOutputs((current) => ({
        ...current,
        [key]: {
          status: "error",
          message:
            error.response?.data?.message ||
            "Command failed. Check the server logs for details.",
        },
      }));
    } finally {
      setLoadingKey(null);
      setConfirmAction(null);
    }
  }

  function openConfirm(action) {
    setConfirmAction(action);
  }

  function openPriceHistoryUpdateConfirm() {
    const symbol = updatePriceSymbol.trim().toUpperCase();
    const price = Number(updateClosePrice);

    if (!symbol || !updatePriceDate || !updateClosePrice) {
      setOutputs((current) => ({
        ...current,
        updatePriceHistory: {
          status: "error",
          message: "ETF symbol, price date, and closing price are required.",
        },
      }));

      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setOutputs((current) => ({
        ...current,
        updatePriceHistory: {
          status: "error",
          message: "Closing price must be greater than zero.",
        },
      }));

      return;
    }

    clearOutput("updatePriceHistory");

    openConfirm({
      key: "updatePriceHistory",
      title: "Update Price History?",
      message: `This will change the closing price for ${symbol} on ${updatePriceDate} to $${price.toFixed(
        6,
      )}.`,
      confirmLabel: "Update Price History",
      onConfirm: () =>
        runCommand(
          "updatePriceHistory",
          () =>
            updatePriceHistory({
              symbol,
              price_date: updatePriceDate,
              close_price: price,
            }),
          () => {
            setUpdatePriceSymbol("");
            setUpdatePriceDate("");
            setUpdateClosePrice("");
          },
        ),
    });
  }

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-3xl p-8">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Data Operations
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold">
          Data Management
        </h1>

        <p className="mt-3 max-w-3xl text-brand-muted">
          Run ETF import, AI extraction, metric calculation, and cleanup tools
          from one controlled admin panel.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <CommandCard
          icon={FileSpreadsheet}
          title="Backfill Price History"
          description="Import price history and dividend history from the ETF text files in app/Imports/PriceData."
          warning="This replaces existing price and dividend history for the selected ETF."
          loading={loadingKey === "priceHistory"}
          output={outputs.priceHistory}
          clearOutput={() => clearOutput("priceHistory")}
          buttonLabel="Import History"
          onSubmit={() =>
            openConfirm({
              key: "priceHistory",
              title: "Import Price History?",
              message: `This will import price and dividend history for ${priceSymbol.toUpperCase()}. Existing records for this ETF will be replaced.`,
              confirmLabel: "Import History",
              onConfirm: () =>
                runCommand("priceHistory", () =>
                  backfillPriceHistory({
                    symbol: priceSymbol,
                  }),
                ),
            })
          }
        >
          <TextInput
            label="ETF Symbol"
            value={priceSymbol}
            onChange={setPriceSymbol}
            placeholder="NVII"
          />
        </CommandCard>

        <CommandCard
          icon={Calculator}
          title="Calculate ETF Metrics"
          description="Recalculate ETF metrics for all ETFs or a single ETF symbol."
          warning="This may update metric records used throughout the app."
          loading={loadingKey === "metrics"}
          output={outputs.metrics}
          clearOutput={() => clearOutput("metrics")}
          buttonLabel="Calculate Metrics"
          onSubmit={() =>
            openConfirm({
              key: "metrics",
              title: "Calculate ETF Metrics?",
              message: metricsSymbol
                ? `This will calculate metrics for ${metricsSymbol.toUpperCase()}.`
                : "This will calculate metrics for all active ETFs.",
              confirmLabel: "Calculate Metrics",
              onConfirm: () =>
                runCommand("metrics", () =>
                  calculateSecurityMetrics({
                    symbol: metricsSymbol || undefined,
                  }),
                ),
            })
          }
        >
          <TextInput
            label="ETF Symbol Optional"
            value={metricsSymbol}
            onChange={setMetricsSymbol}
            placeholder="Leave blank for all ETFs"
          />
        </CommandCard>

        <CommandCard
          icon={BrainCircuit}
          title="Run AI Data Extraction"
          description="Run AI ETF data extraction and process extracted ETF data."
          warning="This may call the OpenAI API and create/update ETF records."
          loading={loadingKey === "aiExtraction"}
          output={outputs.aiExtraction}
          clearOutput={() => clearOutput("aiExtraction")}
          buttonLabel="Run AI Extraction"
          onSubmit={() =>
            openConfirm({
              key: "aiExtraction",
              title: "Run AI Extraction?",
              message: aiSymbol
                ? `This will run AI extraction for ${aiSymbol.toUpperCase()}.`
                : "This will run AI extraction using the provided limit or command defaults.",
              confirmLabel: "Run Extraction",
              onConfirm: () =>
                runCommand("aiExtraction", () =>
                  runAiDataExtractions({
                    symbol: aiSymbol || undefined,
                    limit: aiLimit || undefined,
                  }),
                ),
            })
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="ETF Symbol Optional"
              value={aiSymbol}
              onChange={setAiSymbol}
              placeholder="NVII"
            />

            <TextInput
              label="Limit Optional"
              value={aiLimit}
              onChange={setAiLimit}
              placeholder="5"
              type="number"
            />
          </div>
        </CommandCard>

        <CommandCard
          icon={PencilLine}
          title="Update Price History"
          description="Correct the closing price for a specific ETF and trading date."
          warning="This changes an existing price history record and may affect charts, returns, and calculated metrics."
          loading={loadingKey === "updatePriceHistory"}
          output={outputs.updatePriceHistory}
          clearOutput={() => clearOutput("updatePriceHistory")}
          buttonLabel="Update Price History"
          onSubmit={openPriceHistoryUpdateConfirm}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="ETF Symbol"
              value={updatePriceSymbol}
              onChange={setUpdatePriceSymbol}
              placeholder="NVII"
            />

            <TextInput
              label="Price Date"
              value={updatePriceDate}
              onChange={setUpdatePriceDate}
              type="date"
            />

            <div className="md:col-span-2">
              <TextInput
                label="Closing Price"
                value={updateClosePrice}
                onChange={setUpdateClosePrice}
                placeholder="18.425000"
                type="number"
                min="0"
                step="0.000001"
              />
            </div>
          </div>
        </CommandCard>

        <CommandCard
          icon={DatabaseZap}
          title="Truncate Tables"
          description="Truncate one or more database tables using a comma-separated table list."
          warning="Danger zone. This permanently deletes all records from the listed tables."
          danger
          loading={loadingKey === "truncate"}
          output={outputs.truncate}
          clearOutput={() => clearOutput("truncate")}
          buttonLabel="Truncate Tables"
          onSubmit={() =>
            openConfirm({
              key: "truncate",
              title: "Truncate Tables?",
              message: `This will permanently truncate: ${tables}`,
              confirmLabel: "Truncate Tables",
              danger: true,
              onConfirm: () =>
                runCommand("truncate", () =>
                  truncateTables({
                    tables,
                  }),
                ),
            })
          }
        >
          <TextInput
            label="Tables"
            value={tables}
            onChange={setTables}
            placeholder="etf_price_histories,etf_dividend_histories"
          />
        </CommandCard>
      </section>

      {confirmAction && (
        <ConfirmationModal
          action={confirmAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}

function CommandCard({
  icon: Icon,
  title,
  description,
  warning,
  danger = false,
  loading,
  output,
  clearOutput,
  buttonLabel,
  onSubmit,
  children,
  className = "",
}) {
  return (
    <div className={`glass-card rounded-3xl p-7 ${className}`}>
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            danger
              ? "bg-brand-danger/10 text-brand-danger"
              : "bg-brand-primary/10 text-brand-primary"
          }`}
        >
          <Icon className="h-7 w-7" />
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>

          <p className="mt-2 leading-relaxed text-brand-muted">{description}</p>
        </div>
      </div>

      {warning && (
        <div
          className={`mt-6 flex gap-3 rounded-2xl border px-4 py-3 text-sm ${
            danger
              ? "border-brand-danger/40 bg-brand-danger/10 text-brand-danger"
              : "border-brand-outline bg-brand-surfaceHigh text-brand-muted"
          }`}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      <div className="mt-6 space-y-4">{children}</div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className={`mt-6 w-full rounded-xl px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          danger
            ? "border border-brand-danger/50 text-brand-danger hover:bg-brand-danger/10"
            : "rocket-button-primary"
        }`}
      >
        {loading ? "Running..." : buttonLabel}
      </button>

      {output && (
        <div
          className={`mt-6 rounded-2xl border p-4 ${
            output.status === "success"
              ? "border-brand-primary/40 bg-brand-primary/10"
              : "border-brand-danger/40 bg-brand-danger/10"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
              Command Output
            </p>

            <button
              type="button"
              onClick={clearOutput}
              className="rounded-full px-2 text-sm text-brand-muted transition hover:bg-brand-surfaceHighest hover:text-brand-primary"
              aria-label="Hide command output"
            >
              ✕
            </button>
          </div>

          <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap text-sm leading-relaxed text-brand-muted">
            {output.message}
          </pre>
        </div>
      )}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  step,
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-widest text-brand-muted">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        step={step}
        className="mt-2 w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-brand-text outline-none transition placeholder:text-brand-muted/60 focus:border-brand-primary"
      />
    </label>
  );
}

function ConfirmationModal({ action, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
      <div className="glass-card max-w-lg rounded-3xl p-8">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            action.danger
              ? "bg-brand-danger/10 text-brand-danger"
              : "bg-brand-primary/10 text-brand-primary"
          }`}
        >
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h2 className="mt-6 font-display text-3xl font-bold">{action.title}</h2>

        <p className="mt-4 leading-relaxed text-brand-muted">
          {action.message}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onCancel();

              action.onConfirm();
            }}
            className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
              action.danger
                ? "bg-brand-danger text-white hover:opacity-90"
                : "bg-brand-primaryStrong text-brand-background shadow-glow hover:scale-105"
            }`}
          >
            {action.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
