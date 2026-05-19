export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null;
  }

  const confirmButtonClass =
    variant === "primary"
      ? "rocket-button-primary"
      : "rounded-xl border border-brand-danger/40 px-6 py-3 font-bold text-brand-danger transition hover:bg-brand-danger/10 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 shadow-glow">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Confirmation Required
        </p>

        <h2 className="mt-4 font-display text-2xl font-bold">{title}</h2>

        <p className="mt-4 leading-relaxed text-brand-muted">{message}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rocket-button-secondary"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={confirmButtonClass}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
