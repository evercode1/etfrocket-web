import { useEffect, useState } from "react";

import { healthCheck } from "../../../api/health";

export default function Dashboard() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHealthCheck() {
      try {
        const data = await healthCheck();

        setHealth(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadHealthCheck();
  }, []);

  return (
    <div className="glass-card rounded-3xl p-8">
      <h1 className="font-display text-4xl font-bold">Mission Control</h1>

      <p className="mt-4 text-brand-muted">ETF Rocket dashboard.</p>

      <div className="mt-8 rounded-xl border border-brand-outline bg-black/20 p-4">
        <h2 className="font-display text-xl font-semibold">API Connection</h2>

        {error && <p className="mt-3 text-brand-danger">API Error: {error}</p>}

        {!error && !health && (
          <p className="mt-3 text-brand-muted">Checking API...</p>
        )}

        {health && (
          <pre className="mt-3 overflow-auto text-sm text-brand-primary">
            {JSON.stringify(health, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
