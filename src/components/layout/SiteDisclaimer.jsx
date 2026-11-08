import { Link } from "react-router-dom";

/*
| Site-wide disclaimer, rendered at the bottom of every layout
| (public, auth, user, admin). The full legal terms live in
| src/content/legal/terms-of-service.md; keep the two consistent.
*/
export default function SiteDisclaimer() {
  return (
    <footer
      className="relative z-30 border-t border-brand-outline/70 bg-brand-background/90"
      aria-labelledby="site-disclaimer-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 text-xs leading-relaxed text-brand-muted sm:px-6">
        <h2
          id="site-disclaimer-heading"
          className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-text"
        >
          Important Disclaimer
        </h2>

        <div className="mt-3 space-y-3">
          <p>
            <strong className="text-brand-text">Not financial advice.</strong>{" "}
            ETF Rocket is an informational and educational service only.
            Nothing on this site is investment, financial, legal, tax, or
            trading advice, or a recommendation, offer, or solicitation to buy,
            sell, or hold any security. ETF Rocket is not a registered
            investment adviser, broker-dealer, or fiduciary, and does not
            consider your personal financial situation, objectives, or risk
            tolerance.
          </p>

          <p>
            <strong className="text-brand-text">
              No guarantee of accuracy.
            </strong>{" "}
            All information is provided “as is” and “as available,” without
            warranties of any kind. Assets under management, NAV, shares
            outstanding, and other fund data are collected automatically from
            third-party sources, including ETF issuer websites, and may be
            delayed, incomplete, or incorrect. Estimated flows, rankings, and
            other derived figures are approximations calculated by ETF Rocket
            and are not official fund data. Always verify information with the
            fund issuer and the fund’s prospectus before making any decision.
          </p>

          <p>
            <strong className="text-brand-text">Investing involves risk.</strong>{" "}
            You may lose some or all of your investment. Past performance and
            historical asset levels do not guarantee future results. You are
            solely responsible for your investment decisions and should consult
            a licensed financial professional. ETF Rocket and its operators are
            not liable for any loss or damage arising from use of, or reliance
            on, this site or its data.
          </p>

          <p>
            ETF Rocket is not affiliated with, endorsed by, or sponsored by any
            ETF issuer or fund named on this site. Fund names and trademarks
            belong to their respective owners. Use of this site is subject to
            our{" "}
            <Link
              to="/terms-of-service"
              className="text-brand-primary underline-offset-2 hover:underline"
            >
              Terms of Service
            </Link>
            .
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-brand-outline/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ETF Rocket. All rights reserved.</p>

          <nav aria-label="Legal" className="flex gap-4">
            <Link
              to="/terms-of-service"
              className="transition hover:text-brand-primary"
            >
              Terms of Service
            </Link>

            <Link
              to="/privacy-policy"
              className="transition hover:text-brand-primary"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
