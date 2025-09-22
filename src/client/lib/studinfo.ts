// @ts-ignore We have no types for js-cache
import cache from "js-cache";
import type { StudentInfo } from "../../shared/models";

const localCache = new cache.Cache({
  max: 10,
  ttl: 1000 * 60 * 60 // 1 hour
});

async function fetchInfo(): Promise<StudentInfo[]> {
  const cached = localCache.get('student-info');
  if (cached) return cached as StudentInfo[];
  
  const response = await fetch('/api/student-info');
  
  if (!response.ok) {
    throw new Error('Failed to fetch student info');
  }
  
  const data = await response.json() as StudentInfo[];
  localCache.set('student-info', data);
  return data;
}

export { fetchInfo };