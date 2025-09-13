import dayjs, { Dayjs } from "dayjs";
import type { MkrEvent } from "../../shared/models";
import './GroupSchedule.css'

function GroupSchedule({ schedule }: { schedule: MkrEvent[] }) {
  const displayDays: Dayjs[] = [dayjs(), dayjs().add(1, 'day'), dayjs().add(2, 'day')];
  return (
    <div className="schedule">

      {
        displayDays.map((day) =>
          <div className="day">
            <h1>{day.format('D')}</h1>
            <h2>{day.format('ddd')}</h2>

          </div>
        )
      }

      {
      /*  schedule.length > 0 ? (
          <ul>
            {schedule.map((event, index) => (
              <li key={index}>
                {dayjs(event.start).format('HH:mm')} / {dayjs(event.end).format('HH:mm')} <strong>{event.name}</strong> {event.place}
              </li>
            ))}
          </ul>
        ) : <></> */
      }    
    </div>
  );
}

export default GroupSchedule;