import { useEffect, useState } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getUserSignupStats } from "../../api/adminUsers";

const ranges = [
  {
    label: "1D",
    value: "1d",
  },
  {
    label: "7D",
    value: "7d",
  },
  {
    label: "30D",
    value: "30d",
  },
  {
    label: "90D",
    value: "90d",
  },
  {
    label: "1Y",
    value: "1y",
  },
  {
    label: "MAX",
    value: "max",
  },
];

export default function UserSignupChart() {
  const [range, setRange] = useState("1y");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);

      try {
        const response = await getUserSignupStats(range);

        setStats(response);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load user signup stats.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [range]);

  return (
    <section className="glass-card rounded-3xl p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
            User Telemetry
          </p>

          <h2 className="mt-3 font-display text-3xl font-bold">
            Signup Velocity
          </h2>

          <p className="mt-3 max-w-2xl text-brand-muted">
            Track new user registrations over time.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {ranges.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRange(item.value)}
              className={`rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition ${
                range === item.value
                  ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                  : "border-brand-outline text-brand-muted hover:border-brand-primary hover:text-brand-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 flex h-80 items-center justify-center rounded-2xl border border-brand-outline bg-black/20 text-brand-muted">
          Loading signup telemetry...
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-brand-outline bg-black/20 p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                Total Users
              </p>

              <p className="mt-3 font-display text-4xl font-bold">
                {stats.total_users}
              </p>
            </div>

            <div className="rounded-2xl border border-brand-outline bg-black/20 p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                Range Signups
              </p>

              <p className="mt-3 font-display text-4xl font-bold">
                {stats.range_total}
              </p>
            </div>
          </div>

          <div className="mt-8 h-80 rounded-2xl border border-brand-outline bg-black/20 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.data}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="signupGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#00d1ff" stopOpacity={0.45} />

                    <stop offset="95%" stopColor="#00d1ff" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#3c494e"
                  strokeDasharray="3 3"
                  opacity={0.35}
                />

                <XAxis
                  dataKey="label"
                  stroke="#bbc9cf"
                  tick={{
                    fill: "#bbc9cf",
                    fontSize: 12,
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#bbc9cf"
                  tick={{
                    fill: "#bbc9cf",
                    fontSize: 12,
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#191f31",
                    border: "1px solid #3c494e",
                    borderRadius: "12px",
                    color: "#dce1fb",
                  }}
                  labelStyle={{
                    color: "#a4e6ff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="signups"
                  stroke="#00d1ff"
                  strokeWidth={3}
                  fill="url(#signupGradient)"
                  activeDot={{
                    r: 5,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}
