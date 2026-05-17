import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  markSupportResponseAsRead,
  respondToSupport,
  viewMySupportTicket,
} from "../../../api/support";

import SubmitButton from "../../../components/forms/SubmitButton";

export default function ViewMyTicket() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function loadTicket() {
    setLoading(true);
    setError(null);

    try {
      const response = await viewMySupportTicket(id);

      const loadedTicket = response.data;

      const unreadSupportResponses =
        loadedTicket.ticket_responses?.filter(
          (ticketResponse) =>
            !ticketResponse.is_from_customer && !ticketResponse.is_read,
        ) || [];

      if (unreadSupportResponses.length > 0) {
        await Promise.all(
          unreadSupportResponses.map((ticketResponse) =>
            markSupportResponseAsRead({
              ticket_response_id: ticketResponse.id,
            }),
          ),
        );

        loadedTicket.ticket_responses = loadedTicket.ticket_responses.map(
          (ticketResponse) => {
            if (!ticketResponse.is_from_customer && !ticketResponse.is_read) {
              return {
                ...ticketResponse,
                is_read: 1,
              };
            }

            return ticketResponse;
          },
        );
      }

      setTicket(loadedTicket);
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
      const response = await respondToSupport({
        support_topic_id: ticket.support_topic_id,
        support_ticket_id: ticket.id,
        response_text: responseText,
      });

      setMessage(response.message || "Response added.");
      setResponseText("");

      await loadTicket();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send response.");
    } finally {
      setSaving(false);
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
          to="/dashboard/support"
          className="text-sm text-brand-muted hover:text-brand-primary"
        >
          Back to Support
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
            {ticket.topic} · {ticket.status_name}
          </p>
        </div>

        <Link to="/dashboard/support" className="rocket-button-secondary">
          Back
        </Link>
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
        <div className="grid gap-4 md:grid-cols-3">
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

            <p className="mt-2 text-brand-muted">{ticket.topic}</p>
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
            Your Issue
          </p>

          <p className="mt-4 whitespace-pre-wrap leading-relaxed text-brand-muted">
            {ticket.issue}
          </p>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-8">
        <h2 className="font-display text-2xl font-bold">Conversation</h2>

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
                <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                  {response.is_from_customer
                    ? "You replied"
                    : "Support replied"}
                </p>

                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-brand-muted">
                  {response.response_text}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="glass-card rounded-3xl p-8">
        <h2 className="font-display text-2xl font-bold">Add Response</h2>

        <form onSubmit={handleReplySubmit} className="mt-6 space-y-6">
          <textarea
            value={responseText}
            onChange={(event) => setResponseText(event.target.value)}
            rows={6}
            placeholder="Write your response..."
            className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary"
          />

          <SubmitButton loading={saving}>Send Response</SubmitButton>
        </form>
      </section>
    </div>
  );
}
