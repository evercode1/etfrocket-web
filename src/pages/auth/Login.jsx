import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PasswordInput from "../../components/forms/PasswordInput";
import SubmitButton from "../../components/forms/SubmitButton";
import TextInput from "../../components/forms/TextInput";

import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

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

    try {
      await login(form);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Login</h1>

        <p className="mt-2 text-sm text-brand-muted">
          Access ETF Rocket Mission Control.
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
        placeholder="Enter your password"
      />

      <SubmitButton loading={loading}>Login</SubmitButton>

      <p className="text-center text-sm text-brand-muted">
        Need an account?{" "}
        <Link
          to="/auth/register"
          className="font-semibold text-brand-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
