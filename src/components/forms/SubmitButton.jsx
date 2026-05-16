export default function SubmitButton({ children, loading = false }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="rocket-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
