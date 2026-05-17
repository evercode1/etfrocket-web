import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Bell } from "lucide-react";

import { getOpenSupportTicketCount } from "../../api/adminSupport";

export default function AdminSupportBell() {
  const [openTicketCount, setOpenTicketCount] = useState(0);

  async function loadOpenTicketCount() {
    try {
      const response = await getOpenSupportTicketCount();

      setOpenTicketCount(response.open_support_ticket_count || 0);
    } catch {
      setOpenTicketCount(0);
    }
  }

  useEffect(() => {
    loadOpenTicketCount();
  }, []);

  useEffect(() => {
    function refreshAdminSupportBell() {
      loadOpenTicketCount();
    }

    window.addEventListener(
      "admin-support-ticket-updated",
      refreshAdminSupportBell,
    );

    return () => {
      window.removeEventListener(
        "admin-support-ticket-updated",
        refreshAdminSupportBell,
      );
    };
  }, []);

  return (
    <Link
      to="/admin/support"
      className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition ${
        openTicketCount > 0
          ? "border-brand-primary bg-brand-primary/10 text-brand-primary shadow-glow"
          : "border-brand-outline bg-brand-surfaceHigh text-brand-muted hover:border-brand-primary hover:text-brand-primary"
      }`}
    >
      <Bell className="h-5 w-5" />

      {openTicketCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-danger px-1.5 font-mono text-[10px] font-bold text-white">
          {openTicketCount}
        </span>
      )}
    </Link>
  );
}
