import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getPortfolioAumGrowthSignal,
  getPortfolioDistributionGrowthSignal,
} from "../../../../../api/portfolioSignals";

import DividendSignalCard from "./DividendSignalCard";

export default function DividendSignalsSection({ signals }) {
  const { portfolioId } = useParams();

  const [distributionGrowthSignal, setDistributionGrowthSignal] =
    useState(null);

  const [aumGrowthSignal, setAumGrowthSignal] = useState(null);

  async function loadSignals() {
    if (!portfolioId) {
      return;
    }

    const [distributionGrowthResponse, aumGrowthResponse] = await Promise.all([
      getPortfolioDistributionGrowthSignal(portfolioId),
      getPortfolioAumGrowthSignal(portfolioId),
    ]);

    setDistributionGrowthSignal(distributionGrowthResponse.data || null);
    setAumGrowthSignal(aumGrowthResponse.data || null);
  }

  useEffect(() => {
    loadSignals();
  }, [portfolioId]);

  const enhancedSignals = buildSignals(
    signals,
    distributionGrowthSignal,
    aumGrowthSignal,
  );

  return (
    <section className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Dividend Signals</h2>

          <p className="mt-1 text-sm text-brand-muted">
            Rule-based payout observations and trend analysis
          </p>
        </div>

        <div className="rounded-full border border-brand-outline bg-brand-surfaceHigh px-4 py-2 text-xs font-mono uppercase tracking-widest text-brand-primary">
          Experimental
        </div>
      </div>

      {enhancedSignals.length > 0 ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {enhancedSignals.map((signal) => (
            <DividendSignalCard
              key={signal.title}
              title={signal.title}
              message={signal.message}
              topContributors={signal.topContributors || []}
              contributorType={signal.contributorType || "distribution"}
              details={{
                affectedEtfs: signal.affected_etfs || [],
                observation: signal.observation || "",
                possibleCauses: signal.possible_causes || [],
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-brand-outline bg-brand-surfaceHigh p-8 text-center text-brand-muted">
          Dividend signals will appear once this portfolio has dividend history
          to analyze.
        </div>
      )}
    </section>
  );
}

function buildSignals(
  signals = [],
  distributionGrowthSignal = null,
  aumGrowthSignal = null,
) {
  const existingSignals = Array.isArray(signals) ? signals : [];

  const remainingSignals = existingSignals.filter(
    (signal) =>
      signal.title !== "Distribution Growth" &&
      signal.title !== "Weekly Cadence Watch",
  );

  const signalCards = [];

  if (distributionGrowthSignal) {
    signalCards.push(buildDistributionGrowthCard(distributionGrowthSignal));
  }

  if (aumGrowthSignal) {
    signalCards.push(buildAumGrowthCard(aumGrowthSignal));
  }

  return [...signalCards, ...remainingSignals];
}

function buildDistributionGrowthCard(signalData) {
  if (!signalData.has_holdings) {
    return {
      title: "Distribution Growth",
      message:
        "No current holdings were detected for distribution growth analysis.",
      affected_etfs: [],
      observation:
        "Distribution growth is evaluated using current portfolio holdings.",
      possible_causes: [
        "Portfolio may not have any active positions",
        "Transactions may not have been added yet",
        "Holdings may have been fully sold",
      ],
      topContributors: [],
      contributorType: "distribution",
    };
  }

  if (!signalData.has_data) {
    return {
      title: "Distribution Growth",
      message:
        "No positive distribution growth was detected across current holdings.",
      affected_etfs: [],
      observation:
        "30-day average distributions are flat or lower than 90-day averages.",
      possible_causes: [
        "Recent payouts may be normalizing",
        "Options premium may have declined",
        "ETF metric history may still be incomplete",
      ],
      topContributors: [],
      contributorType: "distribution",
    };
  }

  const topSymbols = signalData.affected_etfs.slice(0, 3).join(", ");

  return {
    title: "Distribution Growth",
    message: `${signalData.growth_count} holding${
      signalData.growth_count === 1 ? "" : "s"
    } showed positive distribution growth.`,
    affected_etfs: signalData.affected_etfs || [],
    observation: `${topSymbols} contributed the strongest distribution growth, with an estimated portfolio income impact of ${formatCurrency(
      signalData.portfolio_income_impact,
    )}.`,
    possible_causes: [
      "Higher recent option premium",
      "Improved underlying volatility",
      "Recent distributions exceeding the 90-day baseline",
    ],
    topContributors: signalData.top_contributors || [],
    contributorType: "distribution",
  };
}

function buildAumGrowthCard(signalData) {
  if (!signalData.has_holdings) {
    return {
      title: "AUM Growth",
      message: "No current holdings were detected for AUM flow analysis.",
      affected_etfs: [],
      observation: "AUM growth is evaluated using current portfolio holdings.",
      possible_causes: [
        "Portfolio may not have any active positions",
        "Transactions may not have been added yet",
        "Holdings may have been fully sold",
      ],
      topContributors: [],
      contributorType: "aum",
    };
  }

  if (!signalData.has_data) {
    return {
      title: "AUM Growth",
      message: "No recent AUM flow data was detected across current holdings.",
      affected_etfs: [],
      observation:
        "30-day AUM change metrics are unavailable or incomplete for current holdings.",
      possible_causes: [
        "ETF metric history may still be incomplete",
        "AUM data may not have been imported yet",
        "Funds may not have enough historical AUM records",
      ],
      topContributors: [],
      contributorType: "aum",
    };
  }

  const inflowCount = Number(signalData.positive_flow_count || 0);
  const outflowCount = Number(signalData.negative_flow_count || 0);
  const strongestInflows = signalData.strongest_inflows || [];
  const strongestOutflows = signalData.strongest_outflows || [];

  if (inflowCount > 0) {
    const topSymbols = strongestInflows
      .map((row) => row.symbol)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");

    return {
      title: "AUM Growth",
      message: `${inflowCount} holding${
        inflowCount === 1 ? "" : "s"
      } showed positive 30-day AUM growth.`,
      affected_etfs: signalData.affected_etfs || [],
      observation: `${topSymbols} had the strongest recent asset inflows, suggesting increased investor demand.`,
      possible_causes: [
        "Investor demand may be increasing",
        "ETF liquidity may be improving",
        "Recent fund performance or yield may be attracting capital",
      ],
      topContributors: strongestInflows,
      contributorType: "aum",
    };
  }

  return {
    title: "AUM Growth",
    message:
      outflowCount > 0
        ? `${outflowCount} holding${
            outflowCount === 1 ? "" : "s"
          } showed negative 30-day AUM flow.`
        : "Current holdings showed flat 30-day AUM flow.",
    affected_etfs: signalData.affected_etfs || [],
    observation:
      outflowCount > 0
        ? "Recent AUM contraction may indicate lower investor demand or fund-level pressure."
        : "AUM levels were mostly unchanged over the recent 30-day window.",
    possible_causes:
      outflowCount > 0
        ? [
            "Investor demand may be weakening",
            "Recent distribution or NAV trends may be pressuring flows",
            "Capital may be rotating into competing ETFs",
          ]
        : [
            "Investor demand may be stable",
            "ETF flows may be balanced",
            "Recent fund activity may be neutral",
          ],
    topContributors: strongestOutflows,
    contributorType: "aum",
  };
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
