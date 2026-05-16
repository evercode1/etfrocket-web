import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-brand-background text-brand-text">
            <div className="flex min-h-screen items-center justify-center p-6">
                <div className="glass-card w-full max-w-md rounded-3xl p-10">
                    <div className="mb-8 text-center">
                        <Link
                            to="/"
                            className="font-display text-4xl font-bold text-brand-primary"
                        >
                            ETF Rocket
                        </Link>

                        <p className="mt-4 text-sm text-brand-muted">
                            Mission Control Access
                        </p>
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    );
}
