import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CardTitle from "./CardTitle";

export default function IncomeProjectionChart({
  incomeProjection,
  monthlyIncome,
  detailPortfolioId,
}) {
  const incomeProjectionPreview = (incomeProjection || []).filter(
    (_, index) => index % 2 === 1,
  );

  return (
    <Link
      to={`/dashboard/income-projection/${detailPortfolioId}`}
      className="glass-card block rounded-3xl p-6 transition hover:-translate-y-1 hover:border-brand-primary/50 lg:col-span-2"
    >
      <div className="flex items-start justify-between gap-4">
        <CardTitle
          icon={CalendarClock}
          title="Income Projection"
          subtitle="Base case monthly income path"
        />

        <span className="rounded-full border border-brand-primary/40 bg-brand-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-brand-primary">
          Base Case
        </span>
      </div>

      <div className="mt-6 h-64 min-h-[16rem] min-w-0">
        {incomeProjectionPreview.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={incomeProjectionPreview}
              margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                interval={0}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                hide
                domain={[
                  (dataMin) => dataMin * 0.97,
                  (dataMax) => dataMax * 1.01,
                ]}
              />

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
                formatter={(value) => formatCurrency(value)}
              />

              <ReferenceLine
                y={Number(monthlyIncome || 0)}
                stroke="currentColor"
                strokeDasharray="4 4"
                opacity={0.35}
              />

              <Bar
                dataKey="income"
                fill="currentColor"
                radius={[10, 10, 4, 4]}
                opacity={0.75}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-brand-outline bg-brand-surfaceHigh text-sm text-brand-muted">
            Income projection will appear once dividend history is available.
          </div>
        )}
      </div>
      <div className="mt-5">
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            window.location.href = `/dashboard/income-projection/${detailPortfolioId}`;
          }}
          className="flex w-full items-center justify-center rounded-xl border border-brand-outline px-5 py-3 text-sm font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary"
        >
          Change Assumptions
        </button>
      </div>
    </Link>
  );
}

function formatCurrency(value) {
  if (value === null || value === undefined) {
    return "$0.00";
  }

  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
