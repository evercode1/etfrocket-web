import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-brand-background text-brand-text">
            <header className="border-b border-brand-outline bg-brand-surface">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-6">
                        <Link
                            to="/admin"
                            className="font-display text-2xl font-bold text-brand-primary"
                        >
                            ETF Rocket Admin
                        </Link>

                        <nav className="flex gap-4 text-sm text-brand-muted">
                            <Link to="/admin">Dashboard</Link>
                        </nav>
                    </div>

                    <Link
                        to="/"
                        className="text-sm text-brand-muted hover:text-brand-primary"
                    >
                        Return to App
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}
