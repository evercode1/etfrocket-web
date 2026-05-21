import { useEffect, useState } from "react";

import {
  getMissionControl,
  getPortfolioSelects,
} from "../../../api/missionControl";

import { Rocket } from "lucide-react";

import PortfolioSnapshot from "./components/portfolioSnapshot/PortfolioSnapshot";
import RadarSection from "./components/RadarSection";
import SignalSection from "./components/SignalSection";
import TelemetrySection from "./components/TelemetrySection";

export default function Dashboard() {
  const [missionControl, setMissionControl] = useState(null);
  const [portfolioSelects, setPortfolioSelects] = useState({});
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadDashboard(portfolioId = null) {
    setIsLoading(true);

    try {
      const selectsResponse = await getPortfolioSelects();

      const selects = selectsResponse.data || {};

      setPortfolioSelects(selects);

      const missionResponse = await getMissionControl(portfolioId);

      const missionData = missionResponse.data || null;

      setMissionControl(missionData);

      if (!portfolioId && missionData?.selected_portfolio?.id) {
        setSelectedPortfolioId(missionData.selected_portfolio.id);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard(selectedPortfolioId);
  }, [selectedPortfolioId]);

  const hasPortfolio = Object.keys(portfolioSelects || {}).length > 0;

  const activePortfolioId =
    selectedPortfolioId || missionControl?.selected_portfolio?.id || null;

  const hasHoldings = Boolean(missionControl?.portfolio_snapshot?.has_holdings);

  return (
    <div className="space-y-8">
      <section className="glass-card overflow-hidden rounded-3xl p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
              Mission Control
            </p>

            <h1 className="mt-3 font-display text-5xl font-bold">
              ETF Command Center
            </h1>

            <p className="mt-4 max-w-3xl text-brand-muted">
              Monitor portfolio strength, ETF risk signals, watchlist movement,
              and system intelligence from one launch deck.
            </p>
          </div>

          <div className="rounded-3xl border border-brand-outline bg-brand-surfaceHigh p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary shadow-glow">
                <Rocket className="h-6 w-6" />
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                  Mission Status
                </p>

                <p className="mt-1 text-sm text-brand-muted">
                  {isLoading
                    ? "Syncing mission telemetry..."
                    : "Systems online. Portfolio module active."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PortfolioSnapshot
        missionControl={missionControl}
        portfolioSelects={portfolioSelects}
        selectedPortfolioId={selectedPortfolioId}
        setSelectedPortfolioId={setSelectedPortfolioId}
        isLoading={isLoading}
      />

      <SignalSection
        portfolioId={activePortfolioId}
        hasPortfolio={hasPortfolio}
        hasHoldings={hasHoldings}
      />

      <RadarSection
        portfolioId={activePortfolioId}
        hasPortfolio={hasPortfolio}
        hasHoldings={hasHoldings}
      />

      <TelemetrySection
        portfolioId={activePortfolioId}
        hasPortfolio={hasPortfolio}
        hasHoldings={hasHoldings}
      />
    </div>
  );
}
