export interface Country {
  code: string;
  label: string;
}

export interface Article {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  url: string;
  image?: string | null;
  source: string;
  author?: string | null;
  publishedAt?: string | null;
}

export interface NewsResponse {
  total: number;
  articles: Article[];
}

export interface NewsProvider {
  id: string;
  name: string;
  base: string;
  categories: string[];
  countries: Country[];
  buildUrl(params: {
    apiKey: string;
    q?: string;
    category?: string;
    country?: string;
    page: number;
    pageSize: number;
  }): string;
  normalize(json: any): NewsResponse;
}

export interface AppConfig {
  provider: string;
  apiKey: string;
}

export interface QueryParams {
  q: string;
  category: string;
  country: string;
  page: number;
  pageSize: number;
}
