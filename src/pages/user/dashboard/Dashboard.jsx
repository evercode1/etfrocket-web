import { useEffect, useState } from "react";

import {
  getMissionControl,
  getPortfolioSelects,
} from "../../../api/missionControl";

import PortfolioSnapshot from "./components/portfolioSnapshot/PortfolioSnapshot";
import RadarSection from "./components/RadarSection";
import SignalsSection from "./components/signals/SignalsSection";
import TelemetrySection from "./components/TelemetrySection";

import {
  getStoredPortfolioId,
  setStoredPortfolioId,
} from "../../../utils/portfolioContext";

export default function Dashboard() {
  const [missionControl, setMissionControl] = useState(null);
  const [portfolioSelects, setPortfolioSelects] = useState({});
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(() => {
    return getStoredPortfolioId();
  });
  const [isLoading, setIsLoading] = useState(true);

  async function loadDashboard(portfolioId = null) {
    setIsLoading(true);

    try {
      const selectsResponse = await getPortfolioSelects();
      const selects = selectsResponse.data || {};

      setPortfolioSelects(selects);

      const resolvedPortfolioId = portfolioId || getStoredPortfolioId() || null;

      const missionResponse = await getMissionControl(resolvedPortfolioId);
      const missionData = missionResponse.data || null;

      setMissionControl(missionData);

      if (missionData?.selected_portfolio?.id) {
        const nextPortfolioId = String(missionData.selected_portfolio.id);

        setStoredPortfolioId(nextPortfolioId);
        setSelectedPortfolioId(nextPortfolioId);
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
      <PortfolioSnapshot
        missionControl={missionControl}
        portfolioSelects={portfolioSelects}
        selectedPortfolioId={selectedPortfolioId}
        setSelectedPortfolioId={setSelectedPortfolioId}
        isLoading={isLoading}
      />

      <SignalsSection
        signals={missionControl?.signals || []}
        portfolioId={
          selectedPortfolioId || missionControl?.selected_portfolio?.id
        }
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
