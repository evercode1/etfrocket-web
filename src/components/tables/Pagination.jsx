export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-brand-outline bg-brand-surface/70 px-4 py-3">
      <p className="text-sm text-brand-muted">
        Page {meta.current_page} of {meta.last_page}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={meta.current_page <= 1}
          onClick={() => onPageChange(meta.current_page - 1)}
          className="rounded-xl border border-brand-outline px-4 py-2 text-sm text-brand-muted transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}
          className="rounded-xl border border-brand-outline px-4 py-2 text-sm text-brand-muted transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
