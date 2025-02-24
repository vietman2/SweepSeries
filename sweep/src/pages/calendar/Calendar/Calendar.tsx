import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
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
import {
  ErrorPage,
  LoadingComponent,
  LoginNeeded,
} from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useCalendar } from "@contexts/calendar";
import { useTheme } from "@contexts/theme";
import {
  CalendarButtons,
  CalendarTitle,
  CalendarSimple,
} from "@fragments/Calendar";
import { CalendarType, ScheduleResponseType } from "@models/calendar";
import { alert } from "@services/alert";
import { getMonthlyData } from "@services/calendar";
import { saveStorage } from "@services/storage";
import { ThemeColorType } from "@themes/colors";

export function Calendar() {
  const [schedules, setSchedules] = useState<ScheduleResponseType>();
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [buttonsOpen, setButtonsOpen] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const ref = useRef<BottomSheet>(null);

  const { selectedProfile } = useAuth();
  const { calendars, isReady, selectedCalendar, setSelectedCalendar } =
    useCalendar();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const handleCalendarListPress = () => {
    ref.current?.expand();
  };

  const handleCalendarSelect = (calendar: CalendarType) => {
    setSelectedCalendar(calendar);
    const storeSelectedCalendar = async () => {
      if (calendar.uuid) {
        await saveStorage("selectedCalendarId", calendar.uuid);
      }
    };
    storeSelectedCalendar();
    ref.current?.close();
  };

  const handleSearchPress = () => {
    router.push("/calendar/search");
  };

  const handleSettingsPress = () => {
    router.push("/calendar/settings");
  };

  const handleMonthChange = (date: DateData) => {
    const { year, month } = date;

    const monthText = month < 10 ? `0${month}` : month;

    setSelectedMonth(`${year}-${monthText}`);
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [])
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCalendar) return;

      const response = await getMonthlyData(
        selectedCalendar.uuid,
        selectedMonth,
        selectedCalendar.type
      );

      if (response) {
        setSchedules(response);
      } else {
        alert("오류 발생", "데이터를 불러오는 데 실패했습니다.");
      }
    };

    fetchData();
  }, [selectedMonth, selectedCalendar, refreshCount]);

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

  if (!selectedProfile) {
    return <LoginNeeded />;
  }

  if (!isReady) {
    return <LoadingComponent />;
  }

  if (!selectedCalendar) {
    return <ErrorPage onRefresh={handleRefresh} />;
  }

  return (
    <>
      <Pressable
        style={[
          StyleSheet.absoluteFill,
          buttonsOpen && { backgroundColor: "#FFFFFF99", zIndex: 1 },
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
            onMonthChange={handleMonthChange}
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
                key={calendar.uuid}
                style={[
                  styles.calendar,
                  selectedCalendar.uuid === calendar.uuid && {
                    backgroundColor: theme.backgroundGray,
                  },
                ]}
                onPress={() => handleCalendarSelect(calendar)}
                testID={`calendar-${calendar.uuid}`}
              >
                <CalendarSimple calendar={calendar} />
              </TouchableOpacity>
            ))}
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
