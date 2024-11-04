import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  Calendar as CalendarComponent,
  DateData,
} from "react-native-calendars";

import { CustomDay, CustomHeader } from "@components/Calendars";
import { Scroll } from "@components/ScrollView";
import { useTheme } from "@contexts/theme";
import { ScheduleResponseType } from "@models/calendar";
import { sampleScheduleResponse } from "@testdata/calendar";
import { ThemeColorType } from "@themes/colors";

export function Calendar() {
  const [schedules, setSchedules] = useState<ScheduleResponseType>();
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    // TODO: Fetch data from API
    setSchedules(sampleScheduleResponse);
  }, [selectedMonth]);

  useEffect(() => {
    const getCurrentMonth = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      return `${year}-${month < 10 ? `0${month}` : month}`;
    };

    setSelectedMonth(getCurrentMonth());
  }, []);

  const dayComponent = ({ date }: { date: DateData }) => {
    const schedule = schedules?.[date.dateString];

    return <CustomDay date={date} schedules={schedule} />;
  };

  return (
    <Scroll style={styles.container}>
      <CalendarComponent
        customHeader={CustomHeader}
        dayComponent={dayComponent}
        hideExtraDays
      />
    </Scroll>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });
