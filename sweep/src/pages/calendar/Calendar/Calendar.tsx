import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import {
  Calendar as CalendarComponent,
  DateData,
} from "react-native-calendars";

import { CustomDay, CustomHeader } from "@components/Calendars";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import {
  CalendarButtons,
  CalendarTitle,
  CalendarSimple,
} from "@fragments/Calendar";
import { CalendarType, ScheduleResponseType } from "@models/calendar";
import { getCalendars } from "@services/calendar";
import { sampleScheduleResponse } from "@testdata/calendar";
import { ThemeColorType } from "@themes/colors";

export function Calendar() {
  const [schedules, setSchedules] = useState<ScheduleResponseType>();
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarType>();
  const [calendars, setCalendars] = useState<CalendarType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [buttonsOpen, setButtonsOpen] = useState<boolean>(false);
  const ref = useRef<BottomSheet>(null);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCalendarListPress = () => {
    ref.current?.expand();
  };

  const handleCalendarSelect = (calendar: CalendarType) => {
    setSelectedCalendar(calendar);
    ref.current?.close();
  };

  const handleSearchPress = () => {
    router.push("/calendar/search");
  };

  const handleSettingsPress = () => {
    router.push({
      pathname: "/calendar/settings",
      params: { calendarId: selectedCalendar?.id },
    });
  };

  useEffect(() => {
    // TODO: Fetch data from API
    setSchedules(sampleScheduleResponse);

    const fetchData = async () => {
      const response = await getCalendars();

      if (response) {
        setCalendars(response);
        setSelectedCalendar(response[0]);
      }
    };

    fetchData();
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

    const handleNavigation = () => {
      router.push({
        pathname: "/calendar/daily/[date]",
        params: { date: date.dateString },
      });
    };

    return (
      <TouchableOpacity
        onPress={handleNavigation}
        testID={`day-${date.dateString}`}
      >
        <CustomDay date={date} schedules={schedule} />
      </TouchableOpacity>
    );
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  if (!selectedCalendar) return null;

  return (
    <>
      <Pressable
        style={[
          StyleSheet.absoluteFill,
          buttonsOpen && { backgroundColor: "#00000040", zIndex: 1 },
        ]}
        onPress={() => setButtonsOpen(false)}
        testID="close-buttons"
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleCalendarListPress}
            testID="open-list"
          >
            <CalendarTitle calendar={selectedCalendar} />
          </TouchableOpacity>
          <View style={styles.wrapper}>
            <TouchableOpacity onPress={handleSearchPress} testID="search">
              <AppIcon icon="search" size={20} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSettingsPress}
              testID="open-settings"
            >
              <AppIcon icon="settings" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <CalendarButtons open={buttonsOpen} setOpen={setButtonsOpen} />
        <Scroll>
          <CalendarComponent
            initialDate={new Date().toISOString().split("T")[0]}
            customHeader={CustomHeader}
            dayComponent={dayComponent}
            hideExtraDays
          />
        </Scroll>
      </View>
      <BottomSheet
        ref={ref}
        index={-1}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        containerStyle={{ zIndex: 100 }}
      >
        <BottomSheetView style={styles.sheetContainer}>
          <Text style={styles.title}>캘린더 리스트</Text>
          <View style={styles.calendarList}>
            {calendars.map((calendar) => (
              <TouchableOpacity
                key={calendar.id}
                style={[
                  styles.calendar,
                  selectedCalendar.id === calendar.id && {
                    backgroundColor: theme.backgroundGray,
                  },
                ]}
                onPress={() => handleCalendarSelect(calendar)}
                testID={`calendar-${calendar.id}`}
              >
                <CalendarSimple calendar={calendar} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.calendar}>
              <CalendarSimple />
            </TouchableOpacity>
          </View>
          <View style={styles.void} />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 64,
      paddingBottom: 8,
      paddingHorizontal: 16,
      height: 100,
      backgroundColor: theme.background,
    },
    wrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    sheetContainer: {
      paddingTop: 8,
      paddingHorizontal: 24,
      gap: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.primary,
    },
    calendarList: {
      marginTop: 16,
      gap: 8,
    },
    void: {
      height: 24,
    },
    calendar: {
      padding: 8,
      borderRadius: 8,
    },
  });
