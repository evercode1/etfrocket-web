import { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import { ArrowRight, TrendingUp } from "lucide-react";

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
            Maximize Your
            <div>
              <span className="rocket-gradient-text">ETF Cash Flow</span>
            </div>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
            AI insights track total return, dividend income, monitor NAV health,
            run historical backtests. Explore AI-driven market intelligence from
            one powerful ETF command center.
          </p>

          <div className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link
              to="/auth/login"
              className="rocket-button-primary inline-flex items-center gap-3"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/auth/login"
              className="rocket-button-secondary inline-flex items-center gap-3"
            >
              <TrendingUp className="h-4 w-4" />
              Explore ETFs
            </Link>
          </div>

          {/* Telemetry Pills */}

          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            <TelemetryPill label="AI Market Signals" />

            <TelemetryPill label="Historical Backtesting" />

            <TelemetryPill label="Portfolio Telemetry" />

            <TelemetryPill label="Momentum Analytics" />
          </div>
        </div>
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
                Mission control for ETF investors. Analyze yield sustainability,
                compare funds, and explore ETF analytics with clarity.
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

                <Link
                  to="/dashboard/support"
                  className="transition hover:text-cyan-300"
                >
                  Support
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

        {/* Copyright */}

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            © 2026 ETF Rocket. All rights reserved.
          </p>

          <p className="mt-2 font-mono text-xs uppercase tracking-[0.35em] text-slate-500">
            ETF Mission Control
          </p>
        </div>
      </footer>
    </main>
  );
}

function TelemetryPill({ label }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 backdrop-blur-xl">
      {label}
    </div>
  );
}
