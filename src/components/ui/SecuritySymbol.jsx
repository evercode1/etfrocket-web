import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import { getSecurityHoverCard } from "../../api/securities";

const cache = {};

export default function SecuritySymbol({ symbol, className = "" }) {
  const triggerRef = useRef(null);

  const [data, setData] = useState(cache[symbol] || null);

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  async function handleMouseEnter() {
    setIsOpen(true);

    if (!symbol) {
      return;
    }

    if (cache[symbol]) {
      setData(cache[symbol]);
      return;
    }

    try {
      setLoading(true);

      const result = await getSecurityHoverCard(symbol);

      cache[symbol] = result;

      setData(result);
    } catch (error) {
      console.error("Failed to load hover card", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <span
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        to={`/dashboard/securities/${symbol}`}
        className={`cursor-pointer font-semibold text-brand-primary hover:underline ${className}`}
      >
        {symbol}
      </Link>

      {isOpen &&
        createPortal(
          <HoverCard triggerRef={triggerRef} loading={loading} data={data} />,
          document.body,
        )}
    </span>
  );
}

function HoverCard({ triggerRef, loading, data }) {
  const rect = triggerRef.current?.getBoundingClientRect();

  if (!rect) {
    return null;
  }

  return (
    <div
      className="fixed z-[99999] w-80 rounded-2xl border border-brand-outline bg-brand-surface p-4 shadow-2xl"
      style={{
        left: rect.left,
        top: rect.bottom + 8,
      }}
    >
      {loading && <div className="text-sm text-brand-muted">Loading...</div>}

      {!loading && data && (
        <>
          <div>
            <div className="font-display text-xl font-bold text-brand-primary">
              {data.symbol}
            </div>

            <div className="mt-1 text-sm text-brand-muted">
              {data.security_name}
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-sm">
            <InfoRow label="Type" value={data.security_type_name} />

            <InfoRow label="Issuer" value={data.issuer_name} />

            <InfoRow
              label="Frequency"
              value={data.distribution_frequency_name}
            />

            <InfoRow
              label="Last Close"
              value={formatCurrency(data.last_close_price)}
            />

            <InfoRow
              label="Last Dividend"
              value={
                data.last_dividend_amount
                  ? formatCurrency(data.last_dividend_amount)
                  : "—"
              }
            />

            <InfoRow
              label="Ex Date"
              value={data.last_ex_dividend_date || "—"}
            />
          </div>
        </>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-brand-muted">{label}</span>

      <span className="font-medium text-brand-text">{value}</span>
    </div>
  );
}

function formatCurrency(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
