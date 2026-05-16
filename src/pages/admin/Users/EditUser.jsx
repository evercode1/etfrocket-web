import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import SubmitButton from "../../../components/forms/SubmitButton";
import TextInput from "../../../components/forms/TextInput";

import { updateUser, viewUser } from "../../../api/adminUsers";

export default function EditUser() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    is_admin: false,
    is_active: false,
    is_subscriber: false,
    is_influencer: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await viewUser(id);

        setForm({
          name: response.user.name || "",
          email: response.user.email || "",
          is_admin: Boolean(response.user.is_admin),
          is_active: Boolean(response.user.is_active),
          is_subscriber: Boolean(response.user.is_subscriber),
          is_influencer: Boolean(response.user.is_influencer),
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load user.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError(null);

    try {
      await updateUser(id, {
        ...form,
        is_admin: form.is_admin ? 1 : 0,
        is_active: form.is_active ? 1 : 0,
        is_subscriber: form.is_subscriber ? 1 : 0,
        is_influencer: form.is_influencer ? 1 : 0,
      });

      navigate(`/admin/users/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update user.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading user...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Edit User
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold">Update User</h1>
      </div>

      {error && (
        <div className="rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="glass-card max-w-2xl space-y-6 rounded-3xl p-8"
      >
        <TextInput
          id="name"
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
        />

        <TextInput
          id="email"
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["is_admin", "Admin"],
            ["is_active", "Active"],
            ["is_subscriber", "Subscriber"],
            ["is_influencer", "Influencer"],
          ].map(([name, label]) => (
            <label
              key={name}
              className="flex items-center gap-3 rounded-xl border border-brand-outline bg-black/20 p-4 text-sm text-brand-muted"
            >
              <input
                type="checkbox"
                name={name}
                checked={form[name]}
                onChange={handleChange}
                className="h-4 w-4 rounded border-brand-outline bg-brand-surface"
              />

              {label}
            </label>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <SubmitButton loading={saving}>Save User</SubmitButton>

          <Link
            to="/admin/users"
            className="text-sm text-brand-muted hover:text-brand-primary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
