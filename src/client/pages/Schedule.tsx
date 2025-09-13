import { useEffect, useState } from "react";
import type { Faculty, MkrEvent, MkrGroup } from "../../shared/models";
import './Schedule.css';
import { getFacutlyGroups, getFaculties, getGroupSchedule, getCourseName } from "../lib/schedule";
import CardButton, { CardSize } from "../components/cards/CardButton";
import GroupSchedule from "../components/GroupSchedule";

type FacultiesListProps = {
  faculties: Faculty[],
  active?: Faculty | null,
  onSelect: (faculty: Faculty) => void
};

function FacultiesList({ faculties, active, onSelect }: FacultiesListProps) {
  const size = active == null ? CardSize.Full : CardSize.Minimized;
  return <>
    <div className={"faculties" + (size === CardSize.Minimized ? " minimized" : "")}>
      {
        faculties.map((faculty) => (
          <CardButton 
            key={faculty.id} 
            title={faculty.name}
            active={faculty.id === active?.id}
            size={size}
            image={faculty.image} 
            onClick={() => onSelect(faculty)} 
          />
        ))
      }
    </div>
  </>
}

function FacultyGroups({ faculty, onBack }: { faculty: Faculty, onBack?: () => void }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<Map<number, MkrGroup[]> | null>(null);
  const [activeCourse, setActiveCourse] = useState<number | null>(null);
  const [courseGroups, setCourseGroups] = useState<MkrGroup[] | null>(null);
  const [currentGroup, setCurrentGroup] = useState<MkrGroup | null>(null);
  const [currentSchedule, setCurrentSchedule] = useState<MkrEvent[] | null>(null);
  
  useEffect(() => {
    setLoading(true);
    
    getFacutlyGroups(faculty.id).then(t => {
      setGroups(t);
      setLoading(false);
    }).catch(console.error);

  }, [faculty]);

  useEffect(() => {
    setCurrentSchedule(null);

    if (currentGroup) {
      getGroupSchedule(faculty.id, currentGroup.course, currentGroup.id).then(schedule => {
        setCurrentSchedule(schedule);
      }).catch(console.error);
    }
  }, [currentGroup]);

  useEffect(() => {
    if (activeCourse !== null && groups) {
      setCourseGroups(groups.get(activeCourse) || null);
      setCurrentGroup(null);
    }
  }, [activeCourse, groups]);

  return (
    <div>
      {
        groups ? (
          <div className="courses">
            { 
              Array.from(groups.keys()).sort().map((course) => {
                return <CardButton 
                  title={getCourseName(course)} 
                  size={CardSize.Micro} 
                  key={course}
                  active={activeCourse === course}
                  onClick={() => setActiveCourse(course)}
                />
              })
            }
          </div>
        ) : (
          loading ? <p>Завантаження груп...</p> : <p>Немає даних</p>
        )
      }
      <div className="groups-schedule">
  {
          courseGroups ? (
            <div className="groups">
                {
                  courseGroups.map((group) => 
                    <CardButton 
                        title={group.name} 
                        size={CardSize.Micro} 
                        key={group.id}
                        active={currentGroup?.id === group.id}
                        onClick={() => setCurrentGroup(group)} 
                      />
                  )
                }
            </div>
          ) : <></>
        }

        {
          currentSchedule ? <GroupSchedule schedule={currentSchedule} /> : <></>
        }
      </div>
    </div>
  );
}

function Schedule() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  useEffect(() => {
    getFaculties().then(setFaculties).catch(console.error);
  }, []);

  return (
    <div>
      {selectedFaculty == null ? <h1>Розклад занять</h1> : <></> }
      
      <FacultiesList faculties={faculties} active={selectedFaculty} onSelect={setSelectedFaculty} />
      
      {
        selectedFaculty != null ? <FacultyGroups faculty={selectedFaculty} onBack={() => setSelectedFaculty(null)} /> : <></>
      }

    </div>
  );
}

export default Schedule;