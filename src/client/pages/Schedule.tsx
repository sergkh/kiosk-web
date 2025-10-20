import { useEffect, useState } from "react";
import type { Faculty, MkrEvent, MkrGroup } from "../../shared/models";
import './Schedule.css';
import { getFacutlyGroups, getFaculties, getGroupSchedule, getCourseName, getLessonHours } from "../lib/schedule";
import CardButton, { CardSize } from "../components/cards/CardButton";
import GroupSchedule from "../components/GroupSchedule";
import { Loader } from "../components/Loader";
import { ErrorOverlay } from "../components/ErrorOverlay";
import { useTranslation } from "react-i18next";

type FacultiesListProps = {
  faculties: Faculty[],
  active?: Faculty | null,
  onSelect: (faculty: Faculty) => void
};

const lessonHours = getLessonHours();

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

function FacultyGroups({ faculty }: { faculty: Faculty}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<Map<number, MkrGroup[]> | null>(null);
  const [activeCourse, setActiveCourse] = useState<number | null>(null);
  const [courseGroups, setCourseGroups] = useState<MkrGroup[] | null>(null);
  const [currentGroup, setCurrentGroup] = useState<MkrGroup | null>(null);
  const [currentSchedule, setCurrentSchedule] = useState<MkrEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setError(null);
    setLoading(true);
    
    getFacutlyGroups(faculty.id).then(t => {
      setGroups(t);
      setLoading(false);
    }).catch(e => {
      setLoading(false);
      console.error(e);
      setCurrentSchedule(null);
      setError(`Не вдалося завантажити розклад`);
    });

  }, [faculty]);

  useEffect(() => {
    setCurrentSchedule(null);    
    setError(null);

    if (currentGroup) {
      setLoading(true);
      getGroupSchedule(faculty.id, currentGroup.course, currentGroup.id).then(schedule => {
        setLoading(false);
        setCurrentSchedule(schedule);
      }).catch(e => {
        setLoading(false);
        console.error(e);
        setCurrentSchedule(null);
        setError(`Не вдалося завантажити розклад`);
      });
    } else {
      setLoading(false);
    }
  }, [currentGroup]);

  useEffect(() => {
    setError(null);
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
        ) : <></>
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

        <ErrorOverlay error={error} />        

        { loading ? <Loader /> : <></>}

        {
          currentSchedule != null ? <GroupSchedule schedule={currentSchedule} lessonHours={lessonHours} /> : <></>
        }
      </div>
    </div>
  );
}

function Schedule() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const {t} = useTranslation();

  useEffect(() => {
    setLoading(true);
    getFaculties().then((f) => {
      setFaculties(f);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="schedule-page">
      {selectedFaculty == null ? <h1>{t('title.schedule')}</h1> : <></> }
      
      {loading ? <Loader /> : <></>}
      <FacultiesList faculties={faculties} active={selectedFaculty} onSelect={setSelectedFaculty} />      
      {
        selectedFaculty != null ? <FacultyGroups faculty={selectedFaculty} /> : <></>
      }

    </div>
  );
}

export default Schedule;