// @ts-ignore We have no types for js-cache
import cache from "js-cache";
import type { LoaderFunctionArgs } from "react-router";
import type { InfoCard, Video } from "../../shared/models";
import config from "./config";

const localCache = new cache.Cache({
  max: 10,
  ttl: config.cacheTime
});

function infoCardsLoader(category: string): ({ params }: LoaderFunctionArgs) => Promise<InfoCard[]> {
  return async ({ params }: LoaderFunctionArgs) => loadCategory(category);
}

async function loadCategory(category: string): Promise<InfoCard[]> {
  const cached = localCache.get(category);
  if (cached) return cached as InfoCard[];
  
  const response = await fetch(`${config.baseUrl}api/info/${category}`);
  
  if (!response.ok) {
    throw new Error(`Помилка завантаження карток: ${category}`);
  }
  
  const data = await response.json() as InfoCard[];
  localCache.set(category, data);

  return data;
}

function videosLoader(): ({ params }: LoaderFunctionArgs) => Promise<Video[]> {
  return async ({ params }: LoaderFunctionArgs) => loadVideos();
}

async function loadVideos(): Promise<Video[]> {
  const cached = localCache.get('videos');
  if (cached) return cached as Video[];
  
  const response = await fetch(`${config.baseUrl}api/videos`);
  
  if (!response.ok) {
    throw new Error('Помилка завантаження відео');
  }
  
  const data = await response.json() as Video[];
  localCache.set('videos', data);
  return data;
}

export {
  infoCardsLoader, loadCategory, loadVideos, videosLoader
}