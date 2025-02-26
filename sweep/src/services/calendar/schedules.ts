import axios from "axios";

export async function createSchedule(
  scheduleType: string | undefined,
  title: string,
  description: string,
  schedule: {
    start: Date;
    end: Date;
    isAllDay: boolean;
  },
  alarm: {
    use: boolean;
    delta: number;
    unit: number;
  },
  color: string,
  repeat: {
    use: boolean;
    period: number;
    break: string;
  },
  uuid: string | undefined
) {
  if (!scheduleType || !uuid) return null;

  try {
    await axios.post("/v1/schedules/", {
      type: scheduleType,
      title,
      description,
      start_datetime: schedule.start.toISOString(),
      end_datetime: schedule.end.toISOString(),
      is_allday: schedule.isAllDay,
      alarm: {
        use: alarm.use,
        delta: alarm.delta,
        unit: alarm.unit,
      },
      color,
      repeat: {
        use: repeat.use,
        period: repeat.period,
        break: repeat.break,
      },
      uuid: uuid,
    });

    return true;
  } catch {
    return null;
  }
}
