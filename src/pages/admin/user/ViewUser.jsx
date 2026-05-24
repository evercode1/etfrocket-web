import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { viewUser } from "../../../api/adminUsers";

export default function ViewUser() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await viewUser(id);

        setUser(response.user);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load user.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading user...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
            User Details
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold">{user.name}</h1>
        </div>

        <Link
          to={`/admin/users/${user.id}/edit`}
          className="rocket-button-primary"
        >
          Edit User
        </Link>
      </div>

      <section className="glass-card rounded-3xl p-8">
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(user).map(([key, value]) => (
            <div
              key={key}
              className="rounded-xl border border-brand-outline bg-black/20 p-4"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                {key.replaceAll("_", " ")}
              </p>

              <p className="mt-2 break-words text-brand-muted">
                {value === null
                  ? "—"
                  : typeof value === "boolean"
                    ? value
                      ? "Yes"
                      : "No"
                    : String(value)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Link
        to="/admin/users"
        className="inline-block text-sm text-brand-muted hover:text-brand-primary"
      >
        Back to Users
      </Link>
    </div>
  );
}
