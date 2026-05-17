import ReactMarkdown from "react-markdown";

import terms from "../../../content/legal/terms-of-service.md?raw";

export default function TermsOfService() {
  return (
    <article className="mx-auto max-w-4xl space-y-8 px-6 py-16">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          Legal
        </p>

        <h1 className="mt-4 font-display text-5xl font-bold">
          Terms of Service
        </h1>

        <p className="mt-4 text-brand-muted">
          Please review the terms that govern your use of ETF Rocket.
        </p>
      </div>

      <section className="glass-card rounded-3xl p-8">
        <div
          className="
    prose
    prose-invert
    max-w-none

    prose-headings:font-display
    prose-headings:text-brand-text
    prose-headings:tracking-tight

    prose-h1:text-5xl
    prose-h2:mt-16
    prose-h2:text-3xl
    prose-h2:border-b
    prose-h2:border-brand-outline
    prose-h2:pb-3

    prose-h3:mt-10
    prose-h3:text-2xl

    prose-p:text-brand-muted
    prose-p:leading-8

    prose-li:text-brand-muted
    prose-li:leading-8

    prose-strong:text-brand-text

    prose-a:text-brand-primary

    prose-ul:space-y-2
    prose-ol:space-y-2

    prose-hr:border-brand-outline
  "
        >
          <ReactMarkdown>{terms}</ReactMarkdown>
        </div>
      </section>
    </article>
  );
}
