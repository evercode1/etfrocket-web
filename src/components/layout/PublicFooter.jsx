import { Link } from "react-router-dom";

export default function PublicFooter() {
  return (
    <footer className="px-6 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="glass-card grid gap-8 rounded-3xl p-8 md:grid-cols-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-primary">
              ETF Rocket
            </h2>

            <p className="mt-4 leading-relaxed text-brand-muted">
              Mission control for ETF investors. Analyze yield sustainability,
              compare funds, and explore ETF analytics with clarity.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
              Resources
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/help"
                className="text-sm text-brand-muted transition hover:text-brand-primary"
              >
                Help Center
              </Link>

              <Link
                to="/dashboard/support"
                className="text-sm text-brand-muted transition hover:text-brand-primary"
              >
                Support
              </Link>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
              Legal
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/privacy-policy"
                className="text-sm text-brand-muted transition hover:text-brand-primary"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-of-service"
                className="text-sm text-brand-muted transition hover:text-brand-primary"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-center text-sm text-brand-muted">
          <p>© 2026 ETF Rocket. All rights reserved.</p>

          <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
            ETF Mission Control
          </p>
        </div>
      </div>
    </footer>
  );
}
