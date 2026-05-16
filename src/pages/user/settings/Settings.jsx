import { useEffect, useState } from "react";

import PasswordInput from "../../../components/forms/PasswordInput";
import SubmitButton from "../../../components/forms/SubmitButton";
import TextInput from "../../../components/forms/TextInput";

import {
  getMySettings,
  updateMyEmail,
  updateMyUserName,
  updatePassword,
} from "../../../api/settings";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [nameForm, setNameForm] = useState({
    name: "",
  });

  const [emailForm, setEmailForm] = useState({
    email: "",
    email_confirmation: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    password: "",
    password_confirmation: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getMySettings();

        setSettings(data);

        setNameForm({
          name: data.name || "",
        });

        setEmailForm({
          email: data.email || "",
          email_confirmation: data.email || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load settings.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function clearFeedback() {
    setMessage(null);
    setError(null);
  }

  async function handleNameSubmit(event) {
    event.preventDefault();

    clearFeedback();
    setSaving(true);

    try {
      const response = await updateMyUserName(nameForm);

      setMessage(response.message || "Your name has been updated.");
      setSettings({
        ...settings,
        name: nameForm.name,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update name.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();

    clearFeedback();
    setSaving(true);

    try {
      const response = await updateMyEmail(emailForm);

      setMessage(response.message || "Your email has been updated.");

      setSettings({
        ...settings,
        email: emailForm.email,
      });

      setEmailForm({
        email: emailForm.email,
        email_confirmation: emailForm.email,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update email.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    clearFeedback();
    setSaving(true);

    try {
      const response = await updatePassword(passwordForm);

      setMessage(response.message || "Your password has been updated.");

      setPasswordForm({
        password: "",
        password_confirmation: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update password.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-8">
        <h1 className="font-display text-3xl font-bold">Settings</h1>

        <p className="mt-4 text-brand-muted">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Mission Profile
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold">Settings</h1>

        <p className="mt-3 text-brand-muted">
          Manage your ETF Rocket account details.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-brand-primary/40 bg-brand-primary/10 px-4 py-3 text-sm text-brand-primary">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
          {error}
        </div>
      )}

      <section className="glass-card rounded-3xl p-8">
        <h2 className="font-display text-2xl font-bold">Current Account</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-brand-outline bg-black/20 p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
              Name
            </p>

            <p className="mt-2 text-brand-muted">{settings?.name}</p>
          </div>

          <div className="rounded-xl border border-brand-outline bg-black/20 p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
              Email
            </p>

            <p className="mt-2 text-brand-muted">{settings?.email}</p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-8">
        <h2 className="font-display text-2xl font-bold">Update Name</h2>

        <form onSubmit={handleNameSubmit} className="mt-6 max-w-xl space-y-6">
          <TextInput
            id="name"
            name="name"
            label="Name"
            value={nameForm.name}
            onChange={(event) =>
              setNameForm({
                ...nameForm,
                name: event.target.value,
              })
            }
            placeholder="Mission Pilot"
          />

          <SubmitButton loading={saving}>Update Name</SubmitButton>
        </form>
      </section>

      <section className="glass-card rounded-3xl p-8">
        <h2 className="font-display text-2xl font-bold">Update Email</h2>

        <form onSubmit={handleEmailSubmit} className="mt-6 max-w-xl space-y-6">
          <TextInput
            id="email"
            name="email"
            label="Email"
            type="email"
            value={emailForm.email}
            onChange={(event) =>
              setEmailForm({
                ...emailForm,
                email: event.target.value,
              })
            }
            placeholder="you@example.com"
          />

          <TextInput
            id="email_confirmation"
            name="email_confirmation"
            label="Confirm Email"
            type="email"
            value={emailForm.email_confirmation}
            onChange={(event) =>
              setEmailForm({
                ...emailForm,
                email_confirmation: event.target.value,
              })
            }
            placeholder="Confirm email"
          />

          <SubmitButton loading={saving}>Update Email</SubmitButton>
        </form>
      </section>

      <section className="glass-card rounded-3xl p-8">
        <h2 className="font-display text-2xl font-bold">Update Password</h2>

        <form
          onSubmit={handlePasswordSubmit}
          className="mt-6 max-w-xl space-y-6"
        >
          <PasswordInput
            id="password"
            name="password"
            label="New Password"
            value={passwordForm.password}
            onChange={(event) =>
              setPasswordForm({
                ...passwordForm,
                password: event.target.value,
              })
            }
            placeholder="Enter new password"
          />

          <PasswordInput
            id="password_confirmation"
            name="password_confirmation"
            label="Confirm Password"
            value={passwordForm.password_confirmation}
            onChange={(event) =>
              setPasswordForm({
                ...passwordForm,
                password_confirmation: event.target.value,
              })
            }
            placeholder="Confirm new password"
          />

          <SubmitButton loading={saving}>Update Password</SubmitButton>
        </form>
      </section>
    </div>
  );
}
