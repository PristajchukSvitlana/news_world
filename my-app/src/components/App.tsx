import Modal from "../ui/Modal.tsx"
import ArticleCard from "./ArticleCard.jsx";
import Pagination from "./Pagination.jsx";
import Badge from "./Badge.jsx";
import Spinner from "./Spinner.jsx";
import EmptyState from "./EmptyState.jsx";
import { formatDate } from "../utils/formatDate";
import { useNewsSearch } from "../hooks/useNewsSearch";

export default function App() {
  const {
    provider,
    config,
    qs,
    setQs,
    data,
    loading,
    error,
    selected,
    setSelected,
    totalPages,
    setCategory,
    setCountry,
    setSearch,
    switchProvider,
  } = useNewsSearch();

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <header className="header">
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginRight: 8,
            }}
          >
            <span style={{ fontSize: 24 }}>🌍</span>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                margin: 0,
              }}
            >
              Новини світу
            </h1>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn" onClick={switchProvider}>
            Провайдер: <strong>{provider.name}</strong>
          </button>
          <a
            className="btn"
            href="https://newsapi.org/"
            target="_blank"
            rel="noreferrer"
          >
            Документація
          </a>
        </div>
      </header>

      <main className="container" style={{ padding: "24px 0" }}>
        {!config.apiKey && (
          <div
            className="card"
            style={{
              padding: 12,
              borderColor: "#f59e0b",
              background: "#fffbeb",
              color: "#78350f",
            }}
          >
            Додайте API ключ у URL як <code>?apiKey=YOUR_KEY</code> або у Vite
            змінну <code>VITE_NEWS_API_KEY</code>. Інакше додаток
            використовуватиме обмежений загальнодоступний ключ.
          </div>
        )}

        <section className="grid" style={{ gap: 12, marginTop: 12 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <input
              className="input"
              value={qs.q}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук новин…"
            />

            <div style={{ display: "flex", gap: 8 }}>
              <select
                className="select"
                value={qs.country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {provider.countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                className="select"
                value={qs.pageSize}
                onChange={(e) =>
                  setQs((s) => ({
                    ...s,
                    pageSize: Number(e.target.value),
                    page: 1,
                  }))
                }
              >
                {[12, 18, 24, 36].map((n) => (
                  <option key={n} value={n}>
                    {n}/стор
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {provider.categories.map((c) => (
              <Badge
                key={c} // не index – це правильно
                active={qs.category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </Badge>
            ))}
          </div>
        </section>

        <section style={{ minHeight: 200, marginTop: 16 }}>
          {loading ? (
            <Spinner />
          ) : error ? (
            <EmptyState title="Помилка завантаження" subtitle={error} />
          ) : data.articles.length === 0 ? (
            <EmptyState subtitle="Спробуйте інший пошук або категорію." />
          ) : (
            <div
              className="grid"
              style={{
                gap: 16,
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              }}
            >
              {data.articles.map((a) => (
                <ArticleCard key={a.id} a={a} onOpen={setSelected} />
              ))}
            </div>
          )}
        </section>

        {data.articles.length > 0 && (
          <Pagination
            page={qs.page}
            totalPages={totalPages}
            onPrev={() =>
              setQs((s) => ({ ...s, page: Math.max(1, s.page - 1) }))
            }
            onNext={() => setQs((s) => ({ ...s, page: s.page + 1 }))}
          />
        )}
      </main>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div style={{ display: "grid", gap: 12 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              {selected.title}
            </h2>

            {selected.image && (
              <div className="card" style={{ overflow: "hidden" }}>
                <img
                  src={selected.image}
                  alt=""
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            )}

            <div style={{ fontSize: 14, color: "#6b7280" }}>
              <span>{selected.source}</span>
              {selected.publishedAt && (
                <>
                  <span> • </span>
                  <time>{formatDate(selected.publishedAt)}</time>
                </>
              )}
              {selected.author && (
                <>
                  <span> • </span>
                  <span>Автор: {selected.author}</span>
                </>
              )}
            </div>

            {selected.description && (
              <p style={{ color: "#111827" }}>{selected.description}</p>
            )}
            {selected.content && (
              <p style={{ color: "#111827" }}>{selected.content}</p>
            )}

            <div style={{ paddingTop: 8 }}>
              <a
                className="btn btn-primary"
                href={selected.url}
                target="_blank"
                rel="noreferrer"
              >
                Відкрити джерело ↗
              </a>
            </div>
          </div>
        )}
      </Modal>

      <footer className="footer">
        Зроблено з ❤️ · Джерела: {provider.name}
      </footer>
    </div>
  );
}

 