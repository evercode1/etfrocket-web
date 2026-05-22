import { useEffect, useState } from "react";

import {
  getMissionControl,
  getPortfolioSelects,
} from "../../../api/missionControl";

import { Rocket } from "lucide-react";

import PortfolioSnapshot from "./components/portfolioSnapshot/PortfolioSnapshot";
import RadarSection from "./components/RadarSection";
import SignalsSection from "./components/signals/SignalsSection";
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
