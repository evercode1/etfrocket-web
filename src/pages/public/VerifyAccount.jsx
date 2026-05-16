import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { verifyAccount } from "../../api/auth";

export default function VerifyAccount() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function verify() {
      try {
        const response = await verifyAccount(token);

        setMessage(
          response.message ||
            "Your email has been verified. You may now login.",
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to verify your account. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [token]);

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
      <div className="glass-card w-full rounded-3xl p-10 shadow-glow">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Account Verification
        </p>

        <h1 className="mt-6 font-display text-4xl font-bold">
          Mission Clearance
        </h1>

        {loading && (
          <p className="mt-6 text-brand-muted">Verifying your account...</p>
        )}

        {!loading && message && (
          <div className="mt-8 rounded-xl border border-brand-primary/40 bg-brand-primary/10 px-5 py-4 text-brand-primary">
            {message}
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-5 py-4 text-brand-danger">
            {error}
          </div>
        )}

        {!loading && (
          <div className="mt-8">
            <Link
              to="/auth/login"
              className="rocket-button-primary inline-block"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
