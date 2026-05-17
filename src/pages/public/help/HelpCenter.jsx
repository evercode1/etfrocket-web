import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listHelpArticles } from "../../../api/help";
import Pagination from "../../../components/tables/Pagination";

export default function HelpCenter() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadArticles(
    page = 1,
    currentSearch = activeSearch,
    currentCategory = category,
  ) {
    setLoading(true);
    setError(null);

    try {
      const response = await listHelpArticles({
        page,
        search: currentSearch || undefined,
        category: currentCategory || undefined,
      });

      setArticles(response.articles.data);
      setMeta(response.articles);
      setCategories(response.categories);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load help articles.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();

    setActiveSearch(search);
    await loadArticles(1, search, category);
  }

  async function handleCategoryChange(nextCategory) {
    setCategory(nextCategory);
    await loadArticles(1, activeSearch, nextCategory);
  }

  async function handleClear() {
    setSearch("");
    setActiveSearch("");
    setCategory("");
    await loadArticles(1, "", "");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-16">
      <div className="text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand-primary">
          ETF Rocket Help Center
        </p>

        <h1 className="mt-4 font-display text-5xl font-bold">
          How can we help?
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-brand-muted">
          Search guides, troubleshooting notes, and ETF Rocket support articles.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="glass-card mx-auto flex max-w-4xl flex-col gap-3 rounded-3xl p-4 md:flex-row"
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search help articles..."
          className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-brand-text outline-none transition focus:border-brand-primary"
        />

        <button type="submit" className="rocket-button-primary">
          Search
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="rocket-button-secondary"
        >
          Clear
        </button>
      </form>

      <section className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => handleCategoryChange("")}
          className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition ${
            category === ""
              ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
              : "border-brand-outline text-brand-muted hover:border-brand-primary hover:text-brand-primary"
          }`}
        >
          All
        </button>

        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleCategoryChange(item.slug)}
            className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition ${
              category === item.slug
                ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                : "border-brand-outline text-brand-muted hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            {item.category_name}
          </button>
        ))}
      </section>

      {error && (
        <div className="rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass-card rounded-3xl p-8 text-brand-muted">
          Loading help articles...
        </div>
      ) : (
        <>
          <section className="grid gap-6 md:grid-cols-3">
            {articles.length === 0 && (
              <div className="glass-card rounded-3xl p-8 text-brand-muted md:col-span-3">
                No help articles found.
              </div>
            )}

            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/help/${article.slug}`}
                className="glass-card group rounded-3xl p-6 transition hover:-translate-y-1 hover:border-brand-primary/40"
              >
                <p className="font-mono text-xs uppercase tracking-widest text-brand-primary">
                  {article.category_name}
                </p>

                <h2 className="mt-4 font-display text-2xl font-bold transition group-hover:text-brand-primary">
                  {article.title}
                </h2>

                <p className="mt-4 line-clamp-3 text-brand-muted">
                  {article.summary}
                </p>

                <p className="mt-6 font-mono text-xs uppercase tracking-widest text-brand-primary">
                  Read Article →
                </p>
              </Link>
            ))}
          </section>

          <Pagination meta={meta} onPageChange={(page) => loadArticles(page)} />
        </>
      )}
    </div>
  );
}
