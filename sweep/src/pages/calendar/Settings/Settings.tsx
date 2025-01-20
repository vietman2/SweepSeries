import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { SvgIconButton, TextButton, Toggle } from "@components/Buttons";
import { useCalendar } from "@contexts/calendar";
import { useTheme } from "@contexts/theme";
import { CalendarMembers, CalendarOptions } from "@fragments/Calendar";
import { CalendarType } from "@models/calendar";
import { alert } from "@services/alert";
import {
  getCalendar,
  toggleCalendarNotification,
  toggleCalendarDaily,
  deleteCalendar,
} from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

export function Settings() {
  const [calendar, setCalendar] = useState<CalendarType>();
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const { calendarId } = useLocalSearchParams<{ calendarId: string }>();
  const [isNotificationOn, setIsNotificationOn] = useState<boolean>(false);
  const [isDailyOn, setIsDailyOn] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);
  const { setSelectedCalendar } = useCalendar();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const handleNotificationToggle = async () => {
    const response = await toggleCalendarNotification(calendarId);

    if (response) {
      setIsNotificationOn((prev) => !prev);
      setSelectedCalendar(response);
      handleRefresh();
    } else {
      alert("오류 발생", "알림 설정을 변경하는 중 오류가 발생했습니다.");
    }
  };

  const handleDailyToggle = async () => {
    if (isDailyOn) {
      const response = await toggleCalendarDaily(calendarId, "");

      if (response) {
        setIsDailyOn(false);
        setSelectedCalendar(response);
        handleRefresh();
      } else {
        alert("오류 발생", "알림 시간을 해제하는 중 오류가 발생했습니다.");
      }
    } else {
      setIsDailyOn(true);
    }
  };

  const handleCloseModal = () => {
    router.back();
  };

  const handleConfirmTime = async () => {
    const response = await toggleCalendarDaily(
      calendarId,
      selectedTime.toTimeString()
    );

    if (response) {
      setIsDailyOn(true);
      handleRefresh();
      bottomSheetRef.current?.close();
    } else {
      alert("오류 발생", "알림 시간을 변경하는 중 오류가 발생했습니다.");
    }
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || selectedTime;
    setSelectedTime(currentDate);
  };

  const handleDeleteCalendar = async () => {
    const response = await deleteCalendar(calendarId);

    if (response) {
      router.back();
    } else {
      alert("오류 발생", "캘린더 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (isDailyOn) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isDailyOn]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCalendar(calendarId);

      if (response) {
        setCalendar(response);
        setIsNotificationOn(response.notifications);
        setIsDailyOn(response.notifications_today);
      } else {
        alert(
          "오류 발생",
          "캘린더 정보를 불러오는 중 오류가 발생했습니다.",
          router.back
        );
      }
    };

    fetchData();
  }, [calendarId, refreshCount]);

  if (!calendar) {
    return null;
  }

  return (
    <>
      <View style={styles.backdrop}>
        <Pressable
          onPress={handleCloseModal}
          style={StyleSheet.absoluteFill}
          testID="close-modal"
        />
        <View style={styles.modal}>
          <View style={styles.content}>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>공유하는 멤버</Text>
              <CalendarMembers calendar={calendar} />
              <SvgIconButton
                icon="person-add"
                text="멤버 추가하기"
                onPress={() => {}}
                color={theme.background}
                backgroundColor={theme.primary}
                align="center"
              />
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>캘린더 정보</Text>
              <CalendarOptions calendar={calendar} onRefresh={handleRefresh} />
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>알림</Text>
              <View style={styles.horizontal}>
                <Text>알림 받기</Text>
                <Toggle
                  isOn={isNotificationOn}
                  onToggle={handleNotificationToggle}
                />
              </View>
              {isNotificationOn && (
                <View style={styles.horizontal}>
                  <Text>
                    오늘 알림 받기{" "}
                    {calendar.daily_time && `(${calendar.daily_time})`}
                  </Text>
                  <Toggle isOn={isDailyOn} onToggle={handleDailyToggle} />
                </View>
              )}
            </View>
          </View>
          <View>
            <TextButton
              text={calendar.is_owner ? "캘린더 삭제하기" : "캘린더 연동해제"}
              onPress={handleDeleteCalendar}
              color={theme.lowEmphasis}
              backgroundColor={theme.background}
            />
          </View>
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableHandlePanningGesture={false}
        enablePanDownToClose={false}
      >
        <BottomSheetView style={styles.sheetContainer}>
          <View style={styles.timepickerwrapper}>
            <Text style={styles.sheetTitle}>알림 시간을 설정하세요.</Text>
            <DateTimePicker
              mode="time"
              value={selectedTime}
              onChange={handleTimeChange}
              display="spinner"
              locale="ko-KR"
            />
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <TextButton text="확인" onPress={handleConfirmTime} />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000060",
    },
    modal: {
      flex: 1,
      position: "absolute",
      top: 0,
      right: 0,
      width: "80%",
      height: "100%",
      paddingTop: 72,
      paddingBottom: 32,
      paddingHorizontal: 24,
      backgroundColor: theme.background,
      borderBottomLeftRadius: 16,
      borderTopLeftRadius: 16,
    },
    content: {
      flex: 1,
      gap: 32,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    wrapper: {
      gap: 12,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sheetContainer: {
      flex: 1,
      alignItems: "center",
      marginBottom: 32,
      paddingTop: 8,
      paddingHorizontal: 24,
    },
    timepickerwrapper: {
      flex: 1,
    },
    sheetTitle: {
      fontSize: 20,
      color: theme.highEmphasis,
    },
    buttonContainer: {
      flexDirection: "row",
    },
    buttonWrapper: {
      flex: 1,
    },
  });
