import { useEffect, useMemo, useRef, useState } from "react";

import { Link } from "react-router-dom";

import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import { getAumLeaderboard } from "../../api/aum";
import EtfSearch from "../../components/search/EtfSearch";
import {
  formatCompact,
  formatDate,
  formatSignedCompact,
} from "../../utils/aumFormat";

import heroVideo from "../../assets/vid.mp4";

export default function LandingPage() {
  const [stage, setStage] = useState(1);

  const [videoReady, setVideoReady] = useState(false);

  const transitionStarted = useRef(false);

  useEffect(() => {
    if (!videoReady || transitionStarted.current) {
      return;
    }

    transitionStarted.current = true;

    const timers = [
      // Let title settle before ignition

      setTimeout(() => {
        setStage(2);
      }, 5200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [videoReady]);

  // Live numbers for the hero; the page renders fine without them.
  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getAumLeaderboard()
      .then((response) => {
        if (!cancelled) {
          setLeaderboard(response.data);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => buildStats(leaderboard), [leaderboard]);
  const movers = useMemo(() => buildMovers(leaderboard), [leaderboard]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020817] text-white">
      {/* Background Glow */}

      <div className="absolute inset-0 -z-30">
        <div className="absolute left-[-300px] top-[-300px] h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[180px]" />

        <div className="absolute bottom-[-300px] right-[-300px] h-[700px] w-[700px] rounded-full bg-blue-500/10 blur-[180px]" />
      </div>

      {/* Video Layer */}

      <div
        className={`absolute inset-0 transition-all duration-[3000ms] ${
          stage === 2 ? "opacity-20" : "scale-100 opacity-100"
        }`}
      >
        <video
          autoPlay
          muted
          playsInline
          onCanPlayThrough={() => setVideoReady(true)}
          className={`h-full w-full object-cover transition-opacity duration-[1800ms] ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Cinematic Overlay */}

        <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/10 via-[#020817]/30 to-[#020817]" />

        {/* Glow */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_60%)]" />
      </div>

      {/* Stage 1 */}

      <div
        className={`absolute inset-0 z-20 flex items-start justify-center px-6 pt-40 text-center transition-all duration-[1800ms] md:pt-52 ${
          stage === 1 ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
        }`}
      >
        <div className="relative">
          {/* Glow */}

          <div className="absolute inset-0 blur-[140px]">
            <div className="h-full w-full rounded-full bg-cyan-400/20" />
          </div>

          <div className="relative">
            <h1 className="mt-8 font-display text-7xl font-black tracking-[0.08em] text-white md:text-[10rem]">
              RIDE
            </h1>

            <h1 className="rocket-gradient-text font-display text-7xl font-black tracking-[0.08em] md:text-[10rem]">
              THE
            </h1>

            <h1 className="rocket-gradient-text font-display text-7xl font-black tracking-[0.08em] md:text-[10rem]">
              ROCKET
            </h1>
          </div>
        </div>
      </div>

      {/* Stage 2 Hero */}

      <section
        className={`relative z-30 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-start px-6 pt-40 transition-all duration-[1600ms] md:pt-52 ${
          stage === 2 ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}
      >
        <div className="max-w-5xl text-center">
          <h1 className="mt-10 font-display text-6xl font-black leading-[0.95] text-white md:text-8xl">
            See Which ETFs
            <div>
              <span className="rocket-gradient-text">Are Taking Off</span>
            </div>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
            Daily assets under management and estimated fund flows for{" "}
            {stats ? stats.etfCount : "180+"} income ETFs from YieldMax,
            Roundhill, REX and more, collected straight from issuer websites.
            Free, no account needed.
          </p>

          <div className="mx-auto mt-12 flex max-w-2xl flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <Link
              to="/aum"
              className="rocket-button-primary inline-flex shrink-0 items-center justify-center gap-3"
            >
              View AUM Leaderboard
              <ArrowRight className="h-4 w-4" />
            </Link>

            <EtfSearch
              size="lg"
              hotkey={false}
              placeholder="Search an ETF…"
              className="w-full text-left sm:w-80"
            />
          </div>

          {/* Live stats (hidden until loaded so nothing jumps) */}

          <div
            className={`mt-14 flex min-h-[2.5rem] flex-wrap items-center justify-center gap-3 transition-opacity duration-700 ${
              stats ? "opacity-100" : "opacity-0"
            }`}
            aria-live="polite"
          >
            {stats && (
              <>
                <StatPill value={formatCompact(stats.totalAum)} label="Tracked" />
                <StatPill value={stats.etfCount} label="ETFs" />
                <StatPill value={stats.issuerCount} label="Issuers" />
                <StatPill
                  label="Updated"
                  value={formatDate(stats.asOf, { year: undefined })}
                  labelFirst
                />
              </>
            )}
          </div>
        </div>

        {movers && <WeeklyMovers movers={movers} />}
      </section>

      {/* Footer */}

      <footer className="relative z-30 mx-auto max-w-7xl px-6 pb-12">
        <div className="glass-card rounded-3xl border border-white/10 bg-[#071225]/60 p-10 backdrop-blur-xl">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="font-display text-4xl font-bold text-cyan-100">
                ETF Rocket
              </h3>

              <p className="mt-6 max-w-sm leading-relaxed text-slate-300">
                Daily AUM and fund-flow tracking for income ETFs, collected
                straight from issuer websites.
              </p>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">
                Resources
              </p>

              <div className="mt-6 flex flex-col gap-4 text-slate-300">
                <Link to="/help" className="transition hover:text-cyan-300">
                  Help Center
                </Link>

                <Link to="/aum" className="transition hover:text-cyan-300">
                  AUM Leaderboard
                </Link>
              </div>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">
                Legal
              </p>

              <div className="mt-6 flex flex-col gap-4 text-slate-300">
                <Link
                  to="/privacy-policy"
                  className="transition hover:text-cyan-300"
                >
                  Privacy Policy
                </Link>

                <Link
                  to="/terms-of-service"
                  className="transition hover:text-cyan-300"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright + disclaimer: SiteDisclaimer (rendered by PublicLayout) */}
      </footer>
    </main>
  );
}

function buildStats(leaderboard) {
  if (!leaderboard?.as_of || !leaderboard.securities.length) {
    return null;
  }

  return {
    totalAum: leaderboard.totals.aum,
    etfCount: leaderboard.totals.security_count,
    issuerCount: new Set(
      leaderboard.securities.map((row) => row.issuer_id).filter(Boolean),
    ).size,
    asOf: leaderboard.as_of,
  };
}

const MOVERS_PER_SIDE = 3;

// Biggest estimated 1-week inflows and outflows.
function buildMovers(leaderboard) {
  if (!leaderboard?.securities?.length) {
    return null;
  }

  const withFlow = leaderboard.securities.filter(
    (row) => row.changes["1w"]?.estimated_flow != null,
  );

  const inflows = withFlow
    .filter((row) => row.changes["1w"].estimated_flow > 0)
    .sort((a, b) => b.changes["1w"].estimated_flow - a.changes["1w"].estimated_flow)
    .slice(0, MOVERS_PER_SIDE);

  const outflows = withFlow
    .filter((row) => row.changes["1w"].estimated_flow < 0)
    .sort((a, b) => a.changes["1w"].estimated_flow - b.changes["1w"].estimated_flow)
    .slice(0, MOVERS_PER_SIDE);

  if (!inflows.length && !outflows.length) {
    return null;
  }

  return { inflows, outflows };
}

function StatPill({ value, label, labelFirst = false }) {
  const valueEl = <span className="font-bold text-white">{value}</span>;
  const labelEl = <span className="text-slate-400">{label}</span>;

  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.2em] text-slate-300 backdrop-blur-xl">
      {labelFirst ? labelEl : valueEl} {labelFirst ? valueEl : labelEl}
    </div>
  );
}

function WeeklyMovers({ movers }) {
  return (
    <div className="mt-16 w-full max-w-5xl pb-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">
            This week&apos;s movers
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Largest estimated net flows over the past week
          </p>
        </div>

        <Link
          to="/aum?period=1w&sort=flow"
          className="shrink-0 text-sm text-cyan-300 transition hover:text-cyan-200"
        >
          See all →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MoverList title="Top inflows" rows={movers.inflows} direction="in" />
        <MoverList title="Top outflows" rows={movers.outflows} direction="out" />
      </div>
    </div>
  );
}

function MoverList({ title, rows, direction }) {
  const Icon = direction === "in" ? ArrowUpRight : ArrowDownRight;
  const tone = direction === "in" ? "text-emerald-300" : "text-brand-danger";

  return (
    <div className="glass-card min-w-0 rounded-3xl border border-white/10 bg-[#071225]/60 p-5 text-left backdrop-blur-xl">
      <p className="flex items-center gap-2 text-sm font-semibold text-white">
        <Icon className={`h-4 w-4 ${tone}`} aria-hidden="true" />
        {title}
      </p>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">None this week.</p>
      ) : (
        <ul className="mt-3 divide-y divide-white/5">
          {rows.map((row) => (
            <li key={row.security_id}>
              <Link
                to={`/aum/${row.symbol}`}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-white/5"
              >
                <span className="w-14 shrink-0 font-mono font-bold text-brand-primary">
                  {row.symbol}
                </span>

                <span className="min-w-0 flex-1 truncate text-sm text-slate-300">
                  {row.name}
                </span>

                <span className={`shrink-0 font-mono text-sm font-semibold ${tone}`}>
                  {formatSignedCompact(row.changes["1w"].estimated_flow)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
