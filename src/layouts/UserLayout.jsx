import { Link, Outlet } from "react-router-dom";

export default function UserLayout() {
    return (
        <div className="min-h-screen bg-brand-background text-brand-text">
            <header className="border-b border-brand-outline bg-brand-surface">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link
                        to="/"
                        className="font-display text-2xl font-bold text-brand-primary"
                    >
                        ETF Rocket
                    </Link>

                    <nav className="flex gap-4 text-sm text-brand-muted">
                        <Link to="/">Dashboard</Link>
                        <Link to="/etfs">ETFs</Link>
                        <Link to="/etfs/compare">Compare</Link>
                        <Link to="/portfolios">Portfolios</Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}
