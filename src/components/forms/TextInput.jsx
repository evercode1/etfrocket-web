import FormError from "./FormError";
import FormLabel from "./FormLabel";

export default function TextInput({
  id,
  name,
  label,
  value,
  onChange,
  error,
  placeholder = "",
  type = "text",
}) {
  return (
    <div>
      <FormLabel htmlFor={id}>{label}</FormLabel>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary"
      />

      <FormError error={error} />
    </div>
  );
}
