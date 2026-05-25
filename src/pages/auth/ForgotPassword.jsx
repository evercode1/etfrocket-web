import { useState } from "react";
import { Link } from "react-router-dom";

import SubmitButton from "../../components/forms/SubmitButton";
import TextInput from "../../components/forms/TextInput";

import { requestPasswordResetToken } from "../../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await requestPasswordResetToken({
        email,
      });

      setSuccessMessage(
        "Password reset email sent successfully. Please check your inbox and spam folder if it does not arrive within a few minutes.",
      );

      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to request password reset. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (successMessage) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
            Reset Link Sent
          </p>

          <h1 className="mt-4 font-display text-3xl font-bold">
            Check Your Email
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-brand-muted">
            {successMessage}
          </p>
        </div>

        <div className="rounded-xl border border-brand-primary/40 bg-brand-primary/10 px-4 py-4 text-sm text-brand-primary">
          Open the reset link we sent to your inbox to create a new password.
        </div>

        <Link to="/auth/login" className="rocket-button-primary inline-block">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Forgot Password</h1>

        <p className="mt-2 text-sm text-brand-muted">
          Enter your email and we’ll send reset instructions.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
          {error}
        </div>
      )}

      <TextInput
        id="email"
        name="email"
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
      />

      <SubmitButton loading={loading}>Send Reset Link</SubmitButton>

      <p className="text-center text-sm text-brand-muted">
        Remembered your password?{" "}
        <Link
          to="/auth/login"
          className="font-semibold text-brand-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
