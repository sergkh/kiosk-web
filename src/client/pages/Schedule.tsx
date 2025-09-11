import { useEffect, useState } from "react";
import type { Faculty, MkrEvent, MkrGroup } from "../../shared/models";
import './Schedule.css';
import { getFacutlyGroups, getFaculties, getGroupSchedule } from "../lib/schedule";
import dayjs from "dayjs";
import CardButton from "../components/cards/CardButton";

function CourseButton({course, onClick}: {course: number, onClick: () => void}) {
  const name = course < 6 ? `${course}-й курс` : course === 6 ? 'Магістратура' : 'Магістратура (2й рік)';
  return (
    <CardButton title={name} onClick={onClick}/>
  );
}

function FacultiesList({ faculties, onSelect }: { faculties: Faculty[], onSelect: (faculty: Faculty) => void }) {
  return <>
    <div className="faculties">
      {
        faculties.map((faculty) => (
          <CardButton key={faculty.id} title={faculty.name} image={faculty.image} onClick={() => onSelect(faculty)} />
        ))
      }
    </div>
  </>
}

function GroupSchedule({ schedule }: { schedule: MkrEvent[] }) {
  return (
    <div>
      {
        schedule.length > 0 ? (
          <ul>
            {schedule.map((event, index) => (
              <li key={index}>
                {dayjs(event.start).format('HH:mm')} / {dayjs(event.end).format('HH:mm')} <strong>{event.name}</strong> {event.place}
              </li>
            ))}
          </ul>
        ) : <></>
      }    
    </div>
  );
}

function FacultyGroups({ faculty, onBack }: { faculty: Faculty, onBack?: () => void }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<Map<number, MkrGroup[]> | null>(null);
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

  return (
    <div>
      <h2><a onClick={onBack}>←</a> Факультет {faculty.name}. Оберіть групу:</h2>
      {
        groups ? (
          <div className="courses">
            { 
              Array.from(groups.keys()).sort().map((course) => {
                return <div key={course}>                  
                  <CourseButton course={course} onClick={ () => {
                    setCourseGroups(groups.get(course)!);
                    setCurrentGroup(null);
                  }} />
                </div>
              })
            }
          </div>
        ) : (
          loading ? <p>Завантаження груп...</p> : <p>Немає даних</p>
        )
      }

      {
        courseGroups ? (
          <div className="groups">
              {
                courseGroups.map((group) => (
                  <div key={group.id}>
                    <CardButton title={group.name} onClick={() => setCurrentGroup(group)} />
                  </div>
                ))
              }
          </div>
        ) : <></>
      }

      {
        currentSchedule ? <GroupSchedule schedule={currentSchedule} /> : <></>
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