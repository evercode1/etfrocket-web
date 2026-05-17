import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { viewHelpArticle } from "../../../api/help";

export default function HelpArticle() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      setError(null);

      try {
        const response = await viewHelpArticle(slug);

        setArticle(response.article);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load help article.");
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          Loading help article...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-16">
        <div className="rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
          {error}
        </div>

        <Link
          to="/help"
          className="text-sm text-brand-muted hover:text-brand-primary"
        >
          Back to Help Center
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl space-y-8 px-6 py-16">
      <div>
        <Link
          to="/help"
          className="text-sm text-brand-muted hover:text-brand-primary"
        >
          ← Back to Help Center
        </Link>

        <p className="mt-8 font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          {article.category_name}
        </p>

        <h1 className="mt-4 font-display text-5xl font-bold">
          {article.title}
        </h1>

        {article.summary && (
          <p className="mt-4 text-lg leading-relaxed text-brand-muted">
            {article.summary}
          </p>
        )}
      </div>

      <section className="glass-card rounded-3xl p-8">
        <div
          className="prose prose-invert max-w-none text-brand-muted"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </section>
    </article>
  );
}
