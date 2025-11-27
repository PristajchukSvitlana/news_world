import { useEffect, useMemo, useState } from "react";
import PROVIDERS, { DEFAULT_API_KEY, DEFAULT_PROVIDER } from "../lib/providers";
import useDebouncedValue from "./useDebouncedValue";
import useQueryParamsState from "./useQueryParamsState";
import { fetchNews } from "../services/newsService";
import type { AppConfig, QueryParams, NewsResponse, Article } from "../types/news";

function initConfig(): AppConfig {
  const url = new URL(window.location.href);
  const urlApiKey = url.searchParams.get("apiKey") || "";
  const envApiKey = import.meta?.env?.VITE_NEWS_API_KEY || "";
  const provider = url.searchParams.get("provider") || DEFAULT_PROVIDER;

  return {
    provider: PROVIDERS[provider] ? provider : DEFAULT_PROVIDER,
    apiKey: urlApiKey || envApiKey || DEFAULT_API_KEY,
  };
}

const defaultQuery: QueryParams = {
  q: "",
  category: "general",
  country: "us",
  page: 1,
  pageSize: 12,
};

export function useNewsSearch() {
  const [config, setConfig] = useState<AppConfig>(() => initConfig());
  const provider = PROVIDERS[config.provider];

  const [qs, setQs] = useQueryParamsState<QueryParams>(defaultQuery);
  const debouncedQ = useDebouncedValue(qs.q, 600);

  const [data, setData] = useState<NewsResponse>({ total: 0, articles: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selected, setSelected] = useState<Article | null>(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data.total || 0) / (qs.pageSize || 12))),
    [data.total, qs.pageSize]
  );

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function run() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchNews(provider, config, qs, debouncedQ, controller.signal);
        if (ignore) return;
        setData(result);
      } catch (e: any) {
        if (ignore) return;
        if (e?.name === "AbortError") return; // ігноруємо відмінені запити
        setError(e?.message || "Unexpected error");
        setData({ total: 0, articles: [] });
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (config.apiKey) {
      run();
    }

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [config.apiKey, provider, debouncedQ, qs.category, qs.country, qs.page, qs.pageSize]);

  const setCategory = (category: string) => setQs((s) => ({ ...s, page: 1, category }));
  const setCountry = (country: string) => setQs((s) => ({ ...s, page: 1, country }));
  const setSearch = (value: string) => setQs((s) => ({ ...s, page: 1, q: value }));

  const switchProvider = () => {
    setConfig((c) => {
      const next = c.provider === "newsapi" ? "gnews" : "newsapi";
      const has = PROVIDERS[next].categories.includes(qs.category) ? qs.category : "general";
      setQs((s) => ({ ...s, category: has, page: 1 }));
      return { ...c, provider: next };
    });
  };

  return {
    config,
    provider,
    qs,
    setQs,
    debouncedQ,
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
  };
}
