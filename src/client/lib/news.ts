// @ts-ignore We have no types for js-cache
import cache from "js-cache";
import type { Article } from "../../shared/models";
import config from "./config";

const baseUrl = import.meta.env.VITE_BASE_URL || '/';

const localNewsCache = new cache.Cache({
  max: 1,
  ttl: config.cacheTime
});

async function fetchNews(): Promise<Article[]> {
  const cached = localNewsCache.get('news');
  
  if (cached) return localNewsCache.get('news') as Article[];
  
  const result = await fetch(`${baseUrl}news`);
  
  if (!result.ok) {
    throw new Error('Failed to fetch news');
  }
  
  const news = await result.json() as Article[];
  localNewsCache.set('news', news);
  return news;
}

export { fetchNews };