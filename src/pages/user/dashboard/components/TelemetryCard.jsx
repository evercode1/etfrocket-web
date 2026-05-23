export default function TelemetryCard({
  icon: Icon,
  title,
  subtitle,
  children,
  className = "",
}) {
  return (
    <div className={`glass-card rounded-3xl p-6 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
            <Icon className="h-5 w-5" />
          </div>
        )}

        <div>
          <h3 className="font-display text-xl font-bold">{title}</h3>

          <p className="text-sm text-brand-muted">{subtitle}</p>
        </div>
      </div>

      {children}
    </div>
  );
}
