// @ts-ignore We have no types for js-cache
import cache from "js-cache";
import type { AbiturientInfo } from "../../shared/models";

const localCache = new cache.Cache({
  max: 10,
  ttl: 1000 * 60 * 60 // 1 hour
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