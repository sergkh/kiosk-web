// @ts-ignore We have no types for js-cache
import cache from "js-cache";
import type { AbiturientInfo } from "../../shared/models";
import config from "./config";

const localCache = new cache.Cache({
  max: 10,
  ttl: config.cacheTime
});

async function fetchInfo(): Promise<AbiturientInfo[]> {
  const cached = localCache.get('abiturient-info');
  if (cached) return cached as AbiturientInfo[];
  
  const response = await fetch('/api/abiturient-info');
  
  if (!response.ok) {
    throw new Error('Failed to fetch student info');
  }
  
  const data = await response.json() as AbiturientInfo[];
  localCache.set('abiturient-info', data);
  return data;
}

export { fetchInfo };