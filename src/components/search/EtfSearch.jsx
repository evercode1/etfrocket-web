import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { getEtfSearchIndex } from "../../api/aum";

const MAX_RESULTS = 8;

/*
| The index is small (symbol, name, issuer per ETF), so it is fetched once
| per page load, shared by every EtfSearch instance, and filtered locally.
*/
let indexPromise = null;

function loadIndex() {
  if (!indexPromise) {
    indexPromise = getEtfSearchIndex()
      .then((response) => response.data ?? [])
      .catch((error) => {
        indexPromise = null;

        throw error;
      });
  }

  return indexPromise;
}

function rank(etf, query) {
  const symbol = etf.symbol.toLowerCase();
  const name = (etf.name ?? "").toLowerCase();
  const issuer = (etf.issuer_name ?? "").toLowerCase();

  if (symbol === query) return 0;
  if (symbol.startsWith(query)) return 1;
  if (name.split(/\s+/).some((word) => word.startsWith(query))) return 2;
  if (symbol.includes(query)) return 3;
  if (name.includes(query)) return 4;
  if (issuer.includes(query)) return 5;

  return null;
}

function search(index, rawQuery) {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return [];
  }

  return index
    .map((etf) => ({ etf, score: rank(etf, query) }))
    .filter((item) => item.score !== null)
    .sort(
      (a, b) => a.score - b.score || a.etf.symbol.localeCompare(b.etf.symbol),
    )
    .slice(0, MAX_RESULTS)
    .map((item) => item.etf);
}

// Ticker-like input ("tsla", "BRK.B") reads as a symbol; anything else
// (e.g. "tesla income") is treated as a name search.
function noCoverageMessage(rawQuery) {
  const query = rawQuery.trim();

  if (/^[A-Za-z0-9.-]{1,6}$/.test(query)) {
    return `We don't currently provide coverage for ${query.toUpperCase()}.`;
  }

  return `We don't currently cover any ETFs matching “${query}”.`;
}

function isTypingTarget(element) {
  return (
    element instanceof HTMLElement &&
    (element.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName))
  );
}

/*
| size: "md" (headers) or "lg" (landing hero).
| hotkey: whether "/" focuses this instance. Only one visible instance per
| page should claim it (the header's), so secondary instances pass false.
*/
export default function EtfSearch({
  className = "",
  size = "md",
  hotkey = true,
  placeholder = "Search ETFs",
}) {
  const large = size === "lg";
  const navigate = useNavigate();
  const listboxId = useId();
  const inputRef = useRef(null);

  const [index, setIndex] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const ensureIndex = useCallback(() => {
    if (index) {
      return;
    }

    loadIndex()
      .then((data) => {
        setIndex(data);
        setLoadError(false);
      })
      .catch(() => setLoadError(true));
  }, [index]);

  // "/" focuses the search from anywhere on the page (when not typing).
  useEffect(() => {
    if (!hotkey) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (
        event.key !== "/" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isTypingTarget(document.activeElement) ||
        !inputRef.current ||
        inputRef.current.offsetParent === null
      ) {
        return;
      }

      event.preventDefault();
      inputRef.current.focus();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hotkey]);

  const results = useMemo(
    () => (index ? search(index, query) : []),
    [index, query],
  );

  const showPanel = open && query.trim().length > 0;

  function choose(etf) {
    setQuery("");
    setOpen(false);
    setActiveIndex(0);
    inputRef.current?.blur();

    navigate(`/aum/${etf.symbol}`);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) =>
        results.length ? (current + 1) % results.length : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        results.length ? (current - 1 + results.length) % results.length : 0,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();

      if (results[activeIndex]) {
        choose(results[activeIndex]);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={`${listboxId}-input`} className="sr-only">
        Search ETFs
      </label>

      <Search
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-brand-muted ${
          large ? "left-4 h-5 w-5" : "left-3 h-4 w-4"
        }`}
        aria-hidden="true"
      />

      <input
        ref={inputRef}
        id={`${listboxId}-input`}
        type="text"
        role="combobox"
        autoComplete="off"
        spellCheck={false}
        aria-expanded={showPanel}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          showPanel && results[activeIndex]
            ? `${listboxId}-${results[activeIndex].symbol}`
            : undefined
        }
        value={query}
        placeholder={placeholder}
        onFocus={() => {
          ensureIndex();
          setOpen(true);
        }}
        onBlur={() => setOpen(false)}
        onChange={(event) => {
          ensureIndex();
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className={`w-full rounded-xl border border-brand-outline bg-brand-surfaceLow text-brand-text placeholder:text-brand-muted transition focus:border-brand-primary focus:outline-none ${
          large
            ? "py-3 pl-12 pr-4 text-base"
            : "py-2 pl-9 pr-9 text-sm"
        }`}
      />

      {hotkey && (
        <kbd
          className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-brand-outline px-1.5 font-mono text-[10px] text-brand-muted md:block"
          aria-hidden="true"
        >
          /
        </kbd>
      )}

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-brand-outline bg-brand-surface shadow-glow">
          {results.length > 0 ? (
            <ul id={listboxId} role="listbox" aria-label="ETFs">
              {results.map((etf, position) => (
                <li
                  key={etf.symbol}
                  id={`${listboxId}-${etf.symbol}`}
                  role="option"
                  aria-selected={position === activeIndex}
                  // Prevent the input blur from closing the panel before the click lands.
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(position)}
                  onClick={() => choose(etf)}
                  className={`flex cursor-pointer items-baseline gap-3 px-4 py-2.5 text-sm ${
                    position === activeIndex
                      ? "bg-brand-surfaceHighest"
                      : "bg-transparent"
                  }`}
                >
                  <span className="w-14 shrink-0 font-mono font-bold text-brand-primary">
                    {etf.symbol}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-brand-text">
                      {etf.name ?? etf.symbol}
                    </span>

                    {etf.issuer_name && (
                      <span className="block truncate text-xs text-brand-muted">
                        {etf.issuer_name}
                      </span>
                    )}
                  </span>

                  {etf.status === "pending" && (
                    <span className="shrink-0 self-center rounded-full bg-brand-secondary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-secondary">
                      Data coming soon
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p id={listboxId} className="px-4 py-3 text-sm text-brand-muted">
              {loadError
                ? "Search is unavailable right now."
                : index
                  ? noCoverageMessage(query)
                  : "Loading…"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
