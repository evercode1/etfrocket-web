const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const navCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function isMissing(value) {
  return value === null || value === undefined || Number.isNaN(value);
}

function sign(value) {
  return value > 0 ? "+" : value < 0 ? "−" : "";
}

export function formatCompact(value) {
  return isMissing(value) ? "—" : compactCurrency.format(value);
}

export function formatCompactNumber(value) {
  return isMissing(value) ? "—" : compactNumber.format(value);
}

export function formatSignedCompact(value) {
  if (isMissing(value)) {
    return "—";
  }

  return `${sign(value)}${compactCurrency.format(Math.abs(value))}`;
}

export function formatPercent(value) {
  if (isMissing(value)) {
    return "—";
  }

  return `${sign(value)}${Math.abs(value).toFixed(2)}%`;
}

export function formatNav(value) {
  return isMissing(value) ? "—" : navCurrency.format(value);
}

export function formatDate(value, options = {}) {
  if (!value) {
    return "";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });
}

export function trendClass(value) {
  if (isMissing(value) || value === 0) {
    return "text-brand-muted";
  }

  return value > 0 ? "text-emerald-300" : "text-brand-danger";
}
