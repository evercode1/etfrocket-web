import { Link } from "react-router-dom";

import { LineChart as LineChartIcon } from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CardTitle from "./CardTitle";

export default function PortfolioFlightPathChart({
  flightPath,
  detailPortfolioId,
}) {
  const portfolioDetailUrl = detailPortfolioId
    ? `/dashboard/portfolios/${detailPortfolioId}`
    : "#";

  return (
    <Link
      to={portfolioDetailUrl}
      className="glass-card block rounded-3xl p-6 transition hover:-translate-y-1 hover:border-brand-primary/50 lg:col-span-3"
    >
      <CardTitle
        icon={LineChartIcon}
        title="Portfolio Flight Path"
        subtitle="Monthly portfolio value based on transactions and ETF prices"
      />

      <div className="mt-6 h-72 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={flightPath}>
            <defs>
              <linearGradient id="portfolioValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.35} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

            <XAxis dataKey="date" tick={{ fontSize: 12 }} />

            <YAxis />

            <Tooltip
              contentStyle={{
                backgroundColor: "#131c35",
                border: "1px solid rgba(94, 234, 212, 0.2)",
                borderRadius: "16px",
                color: "#f8fafc",
              }}
              labelStyle={{
                color: "#f8fafc",
                fontWeight: 600,
              }}
              itemStyle={{
                color: "#f8fafc",
              }}
              formatter={(value) =>
                Number(value).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })
              }
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="currentColor"
              fill="url(#portfolioValue)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Link>
  );
}
