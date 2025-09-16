import type { Faculty, LessonTime, MkrApiDictionary, MkrEvent, MkrGroup } from "../../shared/models";
// @ts-ignore We have no types for js-cache
import cache from "js-cache";
import agro from '../assets/faculties/agro.png';
import ecology from '../assets/faculties/ecology.png';
import veterinarian from '../assets/faculties/veterinarian.png';
import economics from '../assets/faculties/economics.png';
import itf from '../assets/faculties/itf.png';
import management from '../assets/faculties/management.png';
import finances from '../assets/faculties/finances.png';

const API_URL = import.meta.env.VITE_MKR_API_URL || 'https://mkr.sergkh.com';

const localCache = new cache.Cache({
  max: 100,
  ttl: 1000 * 60 * 60 // 1 hour
});

const facultyImages: Map<string, string> = new Map([
  ['1',  agro],
  ['5',  economics],
  ['57', veterinarian],
  ['7',  itf],
  ['6',  management],
  ['42', finances],
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
      // dirty hack to fix IT faculty name to fit into the layout
      faculty.name = faculty.name.replace('інформаційних технологій', 'ІТ');
      return ({...faculty, image: facultyImages.get(faculty.id)}) as Faculty;
    });
  
  localCache.set('faculties', facultiesWithImages);

  return facultiesWithImages;
}

async function getFacutlyGroups(facultyId: string): Promise<Map<number, MkrGroup[]>> {
    const cached = localCache.get(`faculty-${facultyId}-groups`);
    if (cached) return cached as Map<number, MkrGroup[]>;

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

    localCache.set(`faculty-${facultyId}-groups`, groupsByCourse);

    return groupsByCourse;
}

async function getGroupSchedule(facultyId: string, course: number, groupId: string): Promise<MkrEvent[]> {
  const cached = localCache.get(`faculty-${facultyId}-course-${course}-group-${groupId}-schedule`);
  if (cached) return cached as MkrEvent[];

  const resp = await fetch(`${API_URL}/structures/0/faculties/${facultyId}/courses/${course}/groups/${groupId}/schedule`);
  if (!resp.ok) {
    throw new Error(`Failed to fetch schedule for group ${groupId}`);
  }

  const data = await resp.json() as MkrEvent[];
  localCache.set(`faculty-${facultyId}-course-${course}-group-${groupId}-schedule`, data);
  
  return data;
}

function getCourseName(course: number): string {
  return course < 6 ? `${course}-й курс` : course === 6 ? 'Магістратура' : 'Магістратура (2й рік)';
}

const lessonHours: Array<LessonTime> = [
    { time: "8:00",  end: "9:20", name: '1 Пара' },
    { time: "9:30",  end: "10:50", name: '2 Пара' },
    { time: "11:30", end: "12:50", name: '3 Пара' },
    { time: "13:10", end: "14:30", name: '4 Пара' },
    { time: "14:40", end: "16:00", name: '5 Пара' },
    { time: "16:10", end: "17:30", name: '6 Пара' },
    { time: "17:40", end: "19:00", name: '7 Пара' },
    { time: "19:30", end: "20:50", name: '8 Пара' },
  ]

function getLessonHours(): Array<LessonTime> {
  return lessonHours;
}

export { getFaculties, getFacutlyGroups, getGroupSchedule, getCourseName, getLessonHours };