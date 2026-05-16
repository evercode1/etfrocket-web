export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Background Effects */}

      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-brand-primaryStrong/10 blur-[120px]" />

        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-brand-secondary/10 blur-[120px]" />
      </div>

      {/* Hero */}

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-32 text-center">
        <div className="glass-card max-w-5xl rounded-[32px] p-12 shadow-glow">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
            Mission Control
          </p>

          <h1 className="mt-8 font-display text-6xl font-extrabold leading-tight md:text-7xl">
            Track Your ETF{" "}
            <span className="rocket-gradient-text">Momentum</span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-brand-muted">
            ETF Rocket helps investors monitor momentum, dividends, and
            portfolio telemetry through a precision-engineered financial command
            center.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rocket-button-primary">Launch Dashboard</button>

            <button className="rocket-button-secondary">Explore ETFs</button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-32 md:grid-cols-3">
        {/* Momentum */}

        <div className="glass-card rounded-3xl p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primaryStrong/10">
            <span className="text-2xl text-brand-primary">🚀</span>
          </div>

          <h2 className="font-display text-3xl font-bold text-brand-primary">
            Momentum Engine
          </h2>

          <p className="mt-4 leading-relaxed text-brand-muted">
            Identify high-momentum ETFs using advanced telemetry and historical
            trend analysis.
          </p>
        </div>

        {/* Dividends */}

        <div className="glass-card rounded-3xl p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-secondary/10">
            <span className="text-2xl text-brand-secondary">❄️</span>
          </div>

          <h2 className="font-display text-3xl font-bold text-brand-secondary">
            Dividend Snowball
          </h2>

          <p className="mt-4 leading-relaxed text-brand-muted">
            Monitor yield generation, distributions, and compounding income
            growth over time.
          </p>
        </div>

        {/* Portfolio */}

        <div className="glass-card rounded-3xl p-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10">
            <span className="text-2xl text-brand-primary">📡</span>
          </div>

          <h2 className="font-display text-3xl font-bold text-brand-primary">
            Mission Control
          </h2>

          <p className="mt-4 leading-relaxed text-brand-muted">
            Centralized portfolio analytics, comparisons, and transaction
            tracking in one dashboard.
          </p>
        </div>
      </section>
    </main>
  );
}
