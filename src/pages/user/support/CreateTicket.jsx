import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createSupportTicket,
  getNewSupportTicketForm,
} from "../../../api/support";

import SubmitButton from "../../../components/forms/SubmitButton";

export default function CreateTicket() {
  const navigate = useNavigate();

  const [topics, setTopics] = useState({});
  const [form, setForm] = useState({
    support_topic_id: "",
    ticket_text: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFormConfig() {
      try {
        const response = await getNewSupportTicketForm();

        const topicConfig = response.form_config.find(
          (item) => item.name === "support_topic_id",
        );

        setTopics(topicConfig?.options || {});
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load support form.");
      } finally {
        setLoading(false);
      }
    }

    loadFormConfig();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const response = await createSupportTicket({
        support_topic_id: Number(form.support_topic_id),
        ticket_text: form.ticket_text,
      });

      navigate(`/dashboard/support/${response.support_ticket.id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create support ticket.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading support form...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Support Center
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold">
          New Support Ticket
        </h1>

        <p className="mt-3 max-w-2xl text-brand-muted">
          Tell us what you need help with and the support team will review your
          request.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="glass-card max-w-3xl space-y-6 rounded-3xl p-8"
      >
        <div>
          <label
            htmlFor="support_topic_id"
            className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brand-primary"
          >
            Support Topic
          </label>

          <select
            id="support_topic_id"
            name="support_topic_id"
            value={form.support_topic_id}
            onChange={handleChange}
            className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary"
          >
            <option value="">Choose a topic</option>

            {Object.entries(topics).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="ticket_text"
            className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-brand-primary"
          >
            Your Issue
          </label>

          <textarea
            id="ticket_text"
            name="ticket_text"
            value={form.ticket_text}
            onChange={handleChange}
            rows={7}
            placeholder="Describe the issue..."
            className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center gap-4">
          <SubmitButton loading={saving}>Create Ticket</SubmitButton>

          <Link
            to="/dashboard/support"
            className="text-sm text-brand-muted hover:text-brand-primary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
