import { useRef, useState } from "react";

import { Upload } from "lucide-react";

import { csvUploadPortfolioTransactions } from "../../api/portfolioTransactions";

export default function ImportTransactionsButton({
  portfolioId,
  label = "Import CSV",
  onImportComplete = null,
}) {
  const fileInputRef = useRef(null);

  const [isImporting, setIsImporting] = useState(false);

  async function handleImportCsv(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsImporting(true);

    try {
      await csvUploadPortfolioTransactions(portfolioId, file);

      if (onImportComplete) {
        await onImportComplete();
      }
    } catch (error) {
      console.error("Failed to import transactions", error);

      alert(
        error.response?.data?.message ||
          "Unable to import portfolio transactions.",
      );
    } finally {
      setIsImporting(false);

      event.target.value = "";
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleImportCsv}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Upload className="h-4 w-4" />

        {isImporting ? "Importing..." : label}
      </button>
    </>
  );
}
