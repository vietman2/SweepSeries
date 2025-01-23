import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { SvgIconButton, TextButton, Toggle } from "@components/Buttons";
import { useCalendar } from "@contexts/calendar";
import { useTheme } from "@contexts/theme";
import { CalendarMembers, CalendarOptions } from "@fragments/Calendar";
import { alert } from "@services/alert";
import {
  toggleCalendarNotification,
  toggleCalendarDaily,
  deleteCalendar,
  leaveCalendar,
} from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

export function Settings() {
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [openTimePicker, setOpenTimePicker] = useState<boolean>(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);
  const { selectedCalendar, reloadData } = useCalendar();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleNotificationToggle = async () => {
    const response = await toggleCalendarNotification(selectedCalendar?.id);

    if (response) {
      reloadData();
    } else {
      alert("오류 발생", "알림 설정을 변경하는 중 오류가 발생했습니다.");
    }
  };

  const handleCloseModal = () => {
    router.back();
  };

  const handleConfirmTime = async () => {
    const response = await toggleCalendarDaily(
      selectedCalendar?.id,
      selectedTime.toTimeString()
    );

    if (response) {
      reloadData();
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
    const response = await deleteCalendar(selectedCalendar?.id);

    if (response) {
      router.back();
    } else {
      alert("오류 발생", "캘린더 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleLeaveCalendar = async () => {
    const response = await leaveCalendar(selectedCalendar?.id);

    if (response) {
      router.back();
    } else {
      alert("오류 발생", "캘린더 연동 해제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (openTimePicker) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [openTimePicker]);

  if (!selectedCalendar) {
    return null;
  }

  const handleDailyToggle = async () => {
    if (selectedCalendar.notifications_today) {
      const response = await toggleCalendarDaily(selectedCalendar.id, "");

      if (response) {
        reloadData();
      } else {
        alert("오류 발생", "알림 시간을 해제하는 중 오류가 발생했습니다.");
      }
    } else {
      setOpenTimePicker(true);
    }
  };

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
              <CalendarMembers calendar={selectedCalendar} />
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
              <CalendarOptions
                calendar={selectedCalendar}
                onRefresh={reloadData}
              />
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>알림</Text>
              <View style={styles.horizontal}>
                <Text>알림 받기</Text>
                <Toggle
                  isOn={selectedCalendar.notifications}
                  onToggle={handleNotificationToggle}
                />
              </View>
              {selectedCalendar.notifications && (
                <View style={styles.horizontal}>
                  <Text>
                    오늘 알림 받기{" "}
                    {selectedCalendar.daily_time &&
                      `(${selectedCalendar.daily_time})`}
                  </Text>
                  <Toggle
                    isOn={selectedCalendar.notifications_today}
                    onToggle={handleDailyToggle}
                  />
                </View>
              )}
            </View>
          </View>
          <View>
            <TextButton
              text={
                selectedCalendar.is_owner
                  ? "캘린더 삭제하기"
                  : "캘린더 연동해제"
              }
              onPress={
                selectedCalendar.is_owner
                  ? handleDeleteCalendar
                  : handleLeaveCalendar
              }
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
              <TextButton
                text="취소"
                onPress={() => setOpenTimePicker(false)}
                color={theme.background}
                backgroundColor={theme.lowEmphasis}
              />
            </View>
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
      gap: 8,
    },
    buttonWrapper: {
      flex: 1,
    },
  });
