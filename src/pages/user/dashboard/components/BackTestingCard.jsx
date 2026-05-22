import { Link } from "react-router-dom";

export default function BackTestingCard({
  to = null,
  icon: Icon,
  title,
  subtitle,
  children,
  className = "",
}) {
  const Wrapper = to ? Link : "div";

  return (
    <Wrapper
      to={to}
      className={`glass-card block rounded-3xl p-6 transition-all duration-200 ${
        to
          ? "cursor-pointer hover:-translate-y-1 hover:border-brand-primary"
          : ""
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-display text-xl font-bold">{title}</h3>

          <p className="text-sm text-brand-muted">{subtitle}</p>
        </div>
      </div>

      {children}
    </Wrapper>
  );
}
