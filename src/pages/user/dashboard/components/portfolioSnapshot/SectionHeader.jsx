export default function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <Icon className="h-5 w-5" />
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
          {eyebrow}
        </p>
      </div>

      <h2 className="mt-3 font-display text-3xl font-bold">{title}</h2>

      <p className="mt-2 max-w-3xl text-brand-muted">{description}</p>
    </div>
  );
}
