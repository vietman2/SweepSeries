import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { CalendarType } from "@models/calendar";
import { getCalendars } from "@services/calendar";
import { getStorage } from "@services/storage";

interface CalendarContextType {
  calendars: CalendarType[];
  selectedCalendar: CalendarType | null;
  setSelectedCalendar: (calendar: CalendarType) => void;
  reloadData: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [calendars, setCalendars] = useState<CalendarType[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarType | null>(
    null
  );
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const reloadData = () => {
    setRefreshCount((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCalendars();
      const selectedCalendarId = await getStorage("selectedCalendarId");

      if (response) {
        setCalendars(response);

        if (selectedCalendarId) {
          const selected = response.find(
            (calendar: CalendarType) =>
              calendar.id === Number(selectedCalendarId)
          );
          setSelectedCalendar(selected || response[0]);
        } else {
          setSelectedCalendar(response[0]);
        }
      }
    };

    fetchData();
  }, [refreshCount]);

  const value = useMemo(
    () => ({ calendars, selectedCalendar, setSelectedCalendar, reloadData }),
    [calendars, selectedCalendar, setSelectedCalendar, reloadData]
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }

  return context;
};
