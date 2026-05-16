export default function FormLabel({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brand-primary"
    >
      {children}
    </label>
  );
}
