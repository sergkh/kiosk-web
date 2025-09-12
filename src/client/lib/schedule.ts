import type { Faculty, MkrApiDictionary, MkrEvent, MkrGroup } from "../../shared/models";
// @ts-ignore We have no types for js-cache
import cache from "js-cache";

const API_URL = import.meta.env.VITE_MKR_API_URL || 'https://mkr.sergkh.com';
const baseUrl = import.meta.env.VITE_BASE_URL || '/';

const localCache = new cache.Cache({
  max: 100,
  ttl: 1000 * 60 * 60 // 1 hour
});

// TODO: Add more faculties
const facultyImages: Map<string, string> = new Map([
  ['1',  `${baseUrl}img/faculties/agro.png`],
  ['5',  `${baseUrl}img/faculties/economics.png`],
  ['57', `${baseUrl}img/faculties/veterinarian.png`],
  ['7',  `${baseUrl}img/faculties/itf.png`],
  ['6',  `${baseUrl}img/faculties/management.png`],
  ['42', `${baseUrl}img/faculties/finances.png`],
]);

async function getFaculties(): Promise<Faculty[]> {
  const cached = localCache.get('faculties');
  
  if (cached) return cached as Faculty[];

  const facultiesResp = await fetch(`${API_URL}/structures/0/faculties`)
  const faculties: [MkrApiDictionary] = await facultiesResp.json()
  
  // Show only faculties with images
  const facultiesWithImages = faculties
    .filter((f) => facultyImages.has(f.id))
    .map((faculty: MkrApiDictionary) => {
      return ({...faculty, image: facultyImages.get(faculty.id)}) as Faculty;
    });
  
  localCache.set('faculties', facultiesWithImages);

  return facultiesWithImages;
}

async function getFacutlyGroups(facultyId: string): Promise<Map<number, MkrGroup[]>> {
    const resp = await fetch(`https://mkr.sergkh.com/structures/0/faculties/${facultyId}/groups`);
      
    if (!resp.ok) {
      throw new Error(`Failed to fetch groups for faculty ${facultyId}`);
    }
    
    const groups = await resp.json() as MkrGroup[];

    // Group by year
    const groupsByCourse = groups.reduce((acc, group) => {
      const course = group.course;
      if(!acc.has(course)) acc.set(course, []);
      acc.get(course)!.push(group);
      return acc;
    }, new Map<number, MkrGroup[]>());

    groupsByCourse.forEach((groups, course) => {
      // Sort groups by name
      groups.sort((a, b) => a.name.localeCompare(b.name));
    });

    return groupsByCourse;
}

async function getGroupSchedule(facultyId: string, course: number, groupId: string): Promise<MkrEvent[]> {
  const resp = await fetch(`${API_URL}/structures/0/faculties/${facultyId}/courses/${course}/groups/${groupId}/schedule`);
  if (!resp.ok) {
    throw new Error(`Failed to fetch schedule for group ${groupId}`);
  }
  return await resp.json() as MkrEvent[];
}

export { getFaculties, getFacutlyGroups, getGroupSchedule };