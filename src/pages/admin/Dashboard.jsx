import { Link } from "react-router-dom";

import { Database, LifeBuoy, UsersRound } from "lucide-react";

import UserSignupChart from "../../components/charts/UserSignupChart";

const adminSections = [
  {
    title: "User Management",
    description: "Search, inspect, edit, and manage ETF Rocket user accounts.",
    href: "/admin/users",
    icon: UsersRound,
    status: "Active",
  },
  {
    title: "Support",
    description:
      "Review support tickets, respond to users, and manage open issues.",
    href: "/admin/support",
    icon: LifeBuoy,
    status: "Active",
  },
  {
    title: "Data Management",
    description:
      "Monitor ETF imports, price history, dividend history, and data operations.",
    href: "/admin/data",
    icon: Database,
    status: "Active",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Admin Mission Control
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-brand-muted">
          Manage users, support activity, and ETF Rocket data operations from
          one command hub.
        </p>
      </div>

      <UserSignupChart />

      <section className="grid gap-6 md:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.title}
              to={section.href}
              className="glass-card group rounded-3xl p-8 transition hover:-translate-y-1 hover:border-brand-primary/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primaryStrong/10 text-brand-primary">
                  <Icon className="h-7 w-7" />
                </div>

                <span className="rounded-full border border-brand-outline px-3 py-1 font-mono text-xs uppercase tracking-widest text-brand-muted">
                  {section.status}
                </span>
              </div>

              <h2 className="mt-8 font-display text-2xl font-bold text-brand-text transition group-hover:text-brand-primary">
                {section.title}
              </h2>

              <p className="mt-4 leading-relaxed text-brand-muted">
                {section.description}
              </p>

              <div className="mt-8 font-mono text-xs uppercase tracking-widest text-brand-primary">
                Open Module →
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
