import dayjs, { Dayjs } from "dayjs";
import type { LessonTime, MkrEvent } from "../../shared/models";
import './GroupSchedule.css'
import { useTranslation } from "react-i18next";

const daysToShow = import.meta.env.VITE_SCHEDULE_DAYS_TO_SHOW ? parseInt(import.meta.env.VITE_SCHEDULE_DAYS_TO_SHOW) : 3;

function GroupSchedule({ schedule, lessonHours }: { schedule: MkrEvent[], lessonHours: LessonTime[] }) {
  const {t} = useTranslation();

  const displayDays: Dayjs[] = Array.from({ length: daysToShow }, (_, i) => {
    return dayjs().startOf('day').add(i, 'day');
  });  

  const lessons = schedule.map((event) => {
    const start = dayjs(event.start);
    const dayIndex = displayDays.findIndex(d => d.isSame(start, 'day'));
    const startHour = lessonHours.findIndex(h => h.time === start.format('HH:mm'));
    const passed = dayjs(event.end).add(-10, 'minute').isBefore(dayjs());

    return Object.assign({}, event, { day: dayIndex, time: startHour, passed});
  }).filter(lesson => lesson.day != -1); // Hide days outside of displayDays

  return (
    <div className="schedule" style={{ ["--days" as any]: displayDays.length }}>
    <div className="time-lines"></div>    
    <div className="empty-corner"></div>
    {
      displayDays.map((day, i) =>
        <div className="day" style={{ gridColumn: i + 2 }} key={i}>
          <h1>{day.format('D')}</h1>
          <h2>
            { t(`schedule.day_${day.format('d')}`)}   
          </h2>
          <small>|</small>
        </div>
      )
    }

      {
        lessonHours.map((h, i) => (
          <div className="hour" style={{ gridRow: i + 2 }} key={i}> 
          <span className="time"> {h.time} </span> 
          { h.name }
          </div>
        ))}

      {
        lessons.map((lesson, i) => (
        <div
          key={i}
          className={"lesson" + (lesson.type ? ` ls-${lesson.type}` : '') + (lesson.passed ? ' passed' : '')}
          style={{
            gridColumn: lesson.day + 2,
            gridRow: lesson.start,
          }}
        >
          <h3>{lesson.name}</h3>
          <h4>{lesson.place}</h4>
          <small>{lesson.teacher ?? ''}</small>
        </div>
      ))}
    </div>
  );
}

export default GroupSchedule;