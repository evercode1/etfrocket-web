import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  closeSupportTicket,
  replyToSupportTicket,
  viewSupportTicket,
} from "../../../api/adminSupport";

import SubmitButton from "../../../components/forms/SubmitButton";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

export default function ViewTicket() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function loadTicket() {
    setLoading(true);
    setError(null);

    try {
      const response = await viewSupportTicket(id);

      setTicket(response.ticket);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load support ticket.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTicket();
  }, [id]);

  async function handleReplySubmit(event) {
    event.preventDefault();

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await replyToSupportTicket({
        support_topic_id: ticket.support_topic_id,
        support_ticket_id: ticket.id,
        user_id: ticket.user_id,
        response_text: responseText,
      });

      setMessage(response.message || "Reply sent.");
      setResponseText("");

      await loadTicket();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send reply.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCloseTicket() {
    setClosing(true);
    setMessage(null);
    setError(null);

    try {
      const response = await closeSupportTicket({
        id: ticket.id,
      });

      setMessage(response.message || "Ticket closed.");
      setIsCloseDialogOpen(false);

      await loadTicket();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to close ticket.");
    } finally {
      setClosing(false);
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-8 text-brand-muted">
        Loading support ticket...
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
          {error}
        </div>

        <Link
          to="/admin/support"
          className="text-sm text-brand-muted hover:text-brand-primary"
        >
          Back to Support Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
            Support Ticket
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold">
            Ticket #{ticket.id}
          </h1>

          <p className="mt-3 text-brand-muted">
            {ticket.support_topic_name} · submitted by {ticket.name}
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/admin/support" className="rocket-button-secondary">
            Back
          </Link>

          <button
            type="button"
            onClick={() => setIsCloseDialogOpen(true)}
            disabled={closing}
            className="rounded-xl border border-brand-danger/40 px-6 py-3 font-bold text-brand-danger transition hover:bg-brand-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {closing ? "Closing..." : "Close Ticket"}
          </button>
        </div>
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
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-brand-outline bg-black/20 p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
              Status
            </p>

            <p className="mt-2 text-brand-muted">{ticket.status_name}</p>
          </div>

          <div className="rounded-xl border border-brand-outline bg-black/20 p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
              Topic
            </p>

            <p className="mt-2 text-brand-muted">{ticket.support_topic_name}</p>
          </div>

          <div className="rounded-xl border border-brand-outline bg-black/20 p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
              User
            </p>

            <p className="mt-2 text-brand-muted">{ticket.name}</p>
          </div>

          <div className="rounded-xl border border-brand-outline bg-black/20 p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
              Created
            </p>

            <p className="mt-2 text-brand-muted">{ticket.created_at}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-brand-outline bg-black/20 p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
            User Issue
          </p>

          <p className="mt-4 whitespace-pre-wrap leading-relaxed text-brand-muted">
            {ticket.ticket_text}
          </p>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-8">
        <h2 className="font-display text-2xl font-bold">Ticket Responses</h2>

        {ticket.ticket_responses?.length === 0 && (
          <p className="mt-4 text-brand-muted">
            No responses have been added yet.
          </p>
        )}

        {ticket.ticket_responses?.length > 0 && (
          <div className="mt-6 space-y-4">
            {ticket.ticket_responses.map((response) => (
              <div
                key={response.id}
                className="rounded-2xl border border-brand-outline bg-black/20 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                    {response.is_from_customer
                      ? `${ticket.name} replied`
                      : "ETF Rocket Support replied"}
                  </p>

                  {!response.is_from_customer && (
                    <span
                      className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-widest ${
                        response.is_read
                          ? "border-brand-primary/40 bg-brand-primary/10 text-brand-primary"
                          : "border-brand-danger/40 bg-brand-danger/10 text-brand-danger"
                      }`}
                    >
                      {response.is_read ? "Read by user" : "Unread by user"}
                    </span>
                  )}
                </div>

                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-brand-muted">
                  {response.response_text}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="glass-card rounded-3xl p-8">
        <h2 className="font-display text-2xl font-bold">Reply To Ticket</h2>

        <form onSubmit={handleReplySubmit} className="mt-6 space-y-6">
          <textarea
            value={responseText}
            onChange={(event) => setResponseText(event.target.value)}
            rows={6}
            placeholder="Write your support reply..."
            className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary"
          />

          <SubmitButton loading={saving}>Send Reply</SubmitButton>
        </form>
      </section>

      <ConfirmDialog
        isOpen={isCloseDialogOpen}
        title={`Close ticket #${ticket.id}?`}
        message="This will mark the support ticket as closed. You can still view the ticket history afterward."
        confirmLabel="Close Ticket"
        loading={closing}
        onCancel={() => setIsCloseDialogOpen(false)}
        onConfirm={handleCloseTicket}
      />
    </div>
  );
}
