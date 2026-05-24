import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import PasswordInput from "../../components/forms/PasswordInput";
import SubmitButton from "../../components/forms/SubmitButton";

import { getPasswordResetForm, resetPassword } from "../../api/auth";

export default function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [userId, setUserId] = useState(null);
  const [formToken, setFormToken] = useState(token);
  const [loadingToken, setLoadingToken] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [form, setForm] = useState({
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    async function loadResetForm() {
      try {
        const response = await getPasswordResetForm(token);

        setUserId(response.user_id);
        setFormToken(response.token);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to validate password reset link.",
        );
      } finally {
        setLoadingToken(false);
      }
    }

    loadResetForm();
  }, [token]);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoadingSubmit(true);

    setError(null);

    setSuccessMessage(null);

    try {
      const response = await resetPassword({
        email,

        token,

        password: form.password,

        password_confirmation: form.password_confirmation,
      });

      setSuccessMessage(response.message || "Your password has been updated.");

      setForm({
        password: "",

        password_confirmation: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again.",
      );
    } finally {
      setLoadingSubmit(false);
    }
  }

  if (loadingToken) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl font-bold">Reset Password</h1>

        <p className="text-brand-muted">Validating password reset link...</p>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
            Password Updated
          </p>

          <h1 className="mt-4 font-display text-3xl font-bold">
            Mission Access Restored
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-brand-muted">
            {successMessage}
          </p>
        </div>

        <div className="rounded-xl border border-brand-primary/40 bg-brand-primary/10 px-4 py-4 text-sm text-brand-primary">
          Your password has been successfully updated. You may now login with
          your new credentials.
        </div>

        <Link to="/auth/login" className="rocket-button-primary inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Reset Password</h1>

        <p className="mt-2 text-sm text-brand-muted">
          Create a new password for your ETF Rocket account.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
          {error}
        </div>
      )}

      {!error && (
        <>
          <PasswordInput
            id="password"
            name="password"
            label="New Password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />

          <PasswordInput
            id="password_confirmation"
            name="password_confirmation"
            label="Confirm Password"
            value={form.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm new password"
          />

          <SubmitButton loading={loadingSubmit}>Reset Password</SubmitButton>
        </>
      )}

      <p className="text-center text-sm text-brand-muted">
        Back to{" "}
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
