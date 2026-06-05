import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { ListChecks, ArrowRight } from "lucide-react";

import { getAdminSelects } from "../../../api/adminSelects";

export default function ManageSelects() {
  const [selects, setSelects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const response = await getAdminSelects();

      setSelects(response.data ?? []);
    } catch (error) {
      console.error(error);

      setError("Unable to load select configurations.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Select Management
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold">
          Select Management
        </h1>

        <p className="mt-3 max-w-3xl text-brand-muted">
          Manage lookup values and reference data used throughout ETF Rocket.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
          {error}
        </div>
      )}

      <section className="glass-card rounded-3xl p-6">
        {loading ? (
          <div className="py-10 text-center text-brand-muted">
            Loading select configurations...
          </div>
        ) : (
          <div className="space-y-4">
            {selects.map((select) => (
              <Link
                key={select.key}
                to={`/admin/selects/${select.key}`}
                className="flex items-center justify-between rounded-2xl border border-brand-outline p-5 transition hover:border-brand-primary"
              >
                <div>
                  <div className="font-display text-xl font-bold">
                    {select.label}
                  </div>

                  <div className="mt-2 text-sm text-brand-muted">
                    {select.description}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-brand-primary">
                  <ListChecks className="h-5 w-5" />

                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
