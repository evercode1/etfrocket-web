import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Bell } from "lucide-react";

import { getUnreadSupportResponses } from "../../api/support";

export default function SupportBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [tickets, setTickets] = useState([]);

  async function loadUnreadResponses() {
    try {
      const response = await getUnreadSupportResponses();

      setUnreadCount(response.unread_support_responses_count || 0);
      setTickets(response.tickets || []);
    } catch {
      setUnreadCount(0);
      setTickets([]);
    }
  }

  useEffect(() => {
    loadUnreadResponses();
  }, []);

  useEffect(() => {
    function refreshSupportBell() {
      loadUnreadResponses();
    }

    window.addEventListener("support-responses-read", refreshSupportBell);

    return () => {
      window.removeEventListener("support-responses-read", refreshSupportBell);
    };
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition ${
          unreadCount > 0
            ? "border-brand-primary bg-brand-primary/10 text-brand-primary shadow-glow"
            : "border-brand-outline bg-brand-surfaceHigh text-brand-muted hover:border-brand-primary hover:text-brand-primary"
        }`}
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-danger px-1.5 font-mono text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-brand-outline bg-brand-surface p-2 shadow-glow">
          <div className="border-b border-brand-outline px-3 py-3">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
              Support Alerts
            </p>

            <p className="mt-1 text-sm text-brand-muted">
              {unreadCount > 0
                ? `${unreadCount} unread support response${
                    unreadCount === 1 ? "" : "s"
                  }`
                : "No unread support responses"}
            </p>
          </div>

          {tickets.length === 0 && (
            <div className="px-3 py-4 text-sm text-brand-muted">
              You are all caught up.
            </div>
          )}

          {tickets.length > 0 && (
            <div className="max-h-80 overflow-y-auto py-2">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.latest_response_id}
                  to={`/dashboard/support/${ticket.ticket_id}`}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-3 transition hover:bg-brand-surfaceHighest"
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                    {ticket.topic}
                  </p>

                  <p className="mt-1 line-clamp-2 text-sm text-brand-muted">
                    {ticket.message_preview}
                  </p>

                  <p className="mt-2 text-xs text-brand-muted/70">
                    Ticket #{ticket.ticket_id}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="border-t border-brand-outline p-2">
            <Link
              to="/dashboard/support"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-3 py-2 text-center text-sm font-semibold text-brand-primary transition hover:bg-brand-surfaceHighest"
            >
              View Support Center
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
