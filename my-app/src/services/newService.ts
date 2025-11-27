import type { AppConfig, QueryParams, NewsProvider, NewsResponse } from "../types/news";

export async function fetchNews(
  provider: NewsProvider,
  config: AppConfig,
  qs: QueryParams,
  debouncedQ: string,
  signal?: AbortSignal
): Promise<NewsResponse> {
  if (!config.apiKey) {
    return { total: 0, articles: [] };
  }

  const url = provider.buildUrl({
    apiKey: config.apiKey,
    q: debouncedQ.trim(),
    category: debouncedQ ? undefined : qs.category,
    country: qs.country,
    page: qs.page,
    pageSize: qs.pageSize,
  });

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();

  if (json.status && json.status !== "ok") {
    throw new Error(json.message || "API error");
  }

  return provider.normalize(json);
}
