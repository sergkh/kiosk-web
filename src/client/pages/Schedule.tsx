import { useEffect, useState } from "react";
import type { Faculty, MkrApiDictionary, MkrGroup } from "../../shared/models";
import FacultyCardButton from "../components/cards/Faculty";
import './Schedule.css';

const API_URL = 'https://mkr.sergkh.com'

// TODO: Add more faculties
const facultyImages: Map<string, string> = new Map([
  ['1', '/img/faculties/agro.png'],
  ['5', '/img/faculties/economics.png'],
  ['57', '/img/faculties/veterinarian.png'],
  ['7', '/img/faculties/itf.png'],
  ['6', '/img/faculties/management.png'],
  ['42', '/img/faculties/finances.png'],
]);


async function getFaculties(): Promise<Faculty[]> {
  const facultiesResp = await fetch(`${API_URL}/structures/0/faculties`)
  const faculties: [MkrApiDictionary] = await facultiesResp.json()
  
  const facultiesWithImages = faculties
    .filter((f) => facultyImages.has(f.id))
    .map((faculty: MkrApiDictionary) => {
      return ({...faculty, image: facultyImages.get(faculty.id)}) as Faculty;
    });
  
  return facultiesWithImages;
}


function FacultiesList({ faculties, onSelect }: { faculties: Faculty[], onSelect: (faculty: Faculty) => void }) {
  return <>
    <div className="faculties">
      {
        faculties.map((faculty) => (
          <FacultyCardButton key={faculty.id} faculty={faculty} onClick={() => onSelect(faculty)} />
        ))
      }
    </div>
  </>
}

function FacultyGroups({ faculty, onBack }: { faculty: Faculty, onBack?: () => void }) {
  const [groups, setGroups] = useState<MkrGroup[]>([]);
  
  useEffect(() => {
    const loadAllGroups = async () => {
      const resp = await fetch(`https://mkr.sergkh.com/structures/0/faculties/${faculty.id}/groups`);
      
      if (!resp.ok) {
        throw new Error(`Failed to fetch groups for faculty ${faculty.id}`);
      }

      return await resp.json() as MkrGroup[];
    }

    loadAllGroups().then(setGroups).catch(console.error);
  }, [faculty]);

  return (
    <div>
      <h2><a onClick={onBack}>←</a> Факультет {faculty.name}. Оберіть групу:</h2>
      {
        groups.length > 0 ? (
          <div className=".groups">
            {groups.map((group) => (              
              <div>
                <h3>{group.name}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p>Групи не знайдено.</p>
        )
      }
    </div>
  );
}

export function DynamicSchedule({faculties} : {faculties: Faculty[]}) {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  return (
      <div>
        { 
          !selectedFaculty ?
            <FacultiesList faculties={faculties} onSelect={setSelectedFaculty} /> :
            <FacultyGroups faculty={selectedFaculty} onBack={() => setSelectedFaculty(null)} />        
        }
      </div>
  )
}

function Schedule() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  useEffect(() => {
    getFaculties().then(setFaculties).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Розклад занять</h1>
      <DynamicSchedule faculties={faculties} />
    </div>
  );
}

export default Schedule;