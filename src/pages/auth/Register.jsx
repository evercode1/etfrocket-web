import { useState } from "react";
import { Link } from "react-router-dom";

import PasswordInput from "../../components/forms/PasswordInput";
import SubmitButton from "../../components/forms/SubmitButton";
import TextInput from "../../components/forms/TextInput";

import { register } from "../../api/auth";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await register(form);

      setSuccessMessage(
        response.message ||
          "Account created. Please check your email to verify your account before logging in.",
      );

      setForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to register. Please try again.",
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
            Verification Sent
          </p>

          <h1 className="mt-4 font-display text-3xl font-bold">
            Check Your Email
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-brand-muted">
            {successMessage}
          </p>
        </div>

        <div className="rounded-xl border border-brand-primary/40 bg-brand-primary/10 px-4 py-4 text-sm text-brand-primary">
          Open the verification link we sent to your inbox, then return here to
          login.
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
        <h1 className="font-display text-3xl font-bold">Create Account</h1>

        <p className="mt-2 text-sm text-brand-muted">
          Start your ETF Rocket mission.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
          {error}
        </div>
      )}

      <TextInput
        id="name"
        name="name"
        label="Name"
        value={form.name}
        onChange={handleChange}
        placeholder="Mission Pilot"
      />

      <TextInput
        id="email"
        name="email"
        label="Email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="you@example.com"
      />

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        value={form.password}
        onChange={handleChange}
        placeholder="Create a password"
      />

      <PasswordInput
        id="password_confirmation"
        name="password_confirmation"
        label="Confirm Password"
        value={form.password_confirmation}
        onChange={handleChange}
        placeholder="Confirm your password"
      />

      <SubmitButton loading={loading}>Create Account</SubmitButton>

      <div className="space-y-3 text-center text-sm">
        <Link
          to="/auth/forgot-password"
          className="block text-brand-muted hover:text-brand-primary hover:underline"
        >
          Forgot your password?
        </Link>

        <p className="text-brand-muted">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-brand-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}
