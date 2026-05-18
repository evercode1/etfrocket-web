import { Link, Outlet } from "react-router-dom";

import { Rocket } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-brand-background text-brand-text">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="glass-card w-full max-w-md rounded-3xl p-10">
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="flex items-center gap-3 font-display text-2xl font-bold text-brand-primary"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 shadow-glow">
                <Rocket className="h-5 w-5 text-brand-primary" />
              </div>

              <span>ETF Rocket</span>
            </Link>

            <p className="mt-4 text-sm text-brand-muted">
              Mission Control Access
            </p>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
