import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { CalendarType } from "@models/calendar";
import { getCalendars } from "@services/calendar";
import { getStorage } from "@services/storage";

interface CalendarContextType {
  calendars: CalendarType[];
  selectedCalendar: CalendarType | null;
  isReady: boolean;
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
  const [isReady, setIsReady] = useState<boolean>(false);

  const reloadData = () => {
    setRefreshCount((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCalendars();
      const selectedCalendarId = await getStorage("selectedCalendarId");

      if (response) {
        setCalendars(response.calendars);

        if (selectedCalendarId) {
          const selected = response.calendars.find(
            (calendar: CalendarType) => calendar.uuid === selectedCalendarId
          );
          setSelectedCalendar(selected || response.calendars[0]);
        } else {
          setSelectedCalendar(response.calendars[0]);
        }
      }

      setIsReady(true);
    };

    fetchData();
  }, [refreshCount]);

  const value = useMemo(
    () => ({
      calendars,
      selectedCalendar,
      isReady,
      setSelectedCalendar,
      reloadData,
    }),
    [calendars, selectedCalendar, isReady]
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
