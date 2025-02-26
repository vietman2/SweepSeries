import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { TextButton, Toggle } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { ErrorPage } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { CalloutSmall } from "@components/Texts";
import { useCalendar } from "@contexts/calendar";
import { useTheme } from "@contexts/theme";
import { ColorModal, NameModal } from "@fragments/Calendar";
import { alert } from "@services/alert";
import {
  toggleCalendarNotification,
  toggleCalendarDaily,
  switchCalendarScope,
} from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

export function CalendarSettings() {
  const [nameModalOpen, setNameModalOpen] = useState<boolean>(false);
  const [colorModalOpen, setColorModalOpen] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [openTimePicker, setOpenTimePicker] = useState<boolean>(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%"], []);

  const { selectedCalendar, reloadData } = useCalendar();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCloseModal = () => {
    router.back();
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || selectedTime;
    setSelectedTime(currentDate);
  };

  useEffect(() => {
    if (openTimePicker) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [openTimePicker]);

  if (!selectedCalendar) {
    return <ErrorPage />;
  }

  const openSettings = () => {
    if (
      selectedCalendar.role === "owner" &&
      selectedCalendar.type === "academy"
    ) {
      return true;
    }

    return false;
  };

  const handleSwitchScope = async (scope: number) => {
    const response = await switchCalendarScope(selectedCalendar.uuid, scope);

    if (response) {
      reloadData();
    } else {
      alert("오류 발생", "캘린더 공개 범위를 변경하는 중 오류가 발생했습니다.");
    }
  };

  const handleNotificationToggle = async () => {
    const response = await toggleCalendarNotification({
      type: selectedCalendar.type,
      uuid: selectedCalendar.uuid,
    });

    if (response) {
      reloadData();
    } else {
      alert("오류 발생", "알림 설정을 변경하는 중 오류가 발생했습니다.");
    }
  };

  const handleDailyToggle = async () => {
    if (selectedCalendar.notifications_today) {
      const response = await toggleCalendarDaily({
        type: selectedCalendar.type,
        uuid: selectedCalendar.uuid,
      });

      if (response) {
        reloadData();
      } else {
        alert("오류 발생", "알림 시간을 해제하는 중 오류가 발생했습니다.");
      }
    } else {
      setOpenTimePicker(true);
    }
  };

  const handleConfirmTime = async () => {
    const response = await toggleCalendarDaily({
      type: selectedCalendar.type,
      uuid: selectedCalendar.uuid,
      time: selectedTime.toTimeString().slice(0, 5),
    });

    if (response) {
      reloadData();
      bottomSheetRef.current?.close();
      setOpenTimePicker(false);
    } else {
      alert("오류 발생", "알림 시간을 변경하는 중 오류가 발생했습니다.");
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
          {openSettings() && (
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>레슨 공개 설정</Text>
              <CalloutSmall
                text={
                  "\u2022 아카데미 캘린더는 코치님들에게 시간, 수강생 정보 등 레슨 관련 내용이 모두 공유됩니다\n\n\u2022 수강생에게 공개할 내용을 설정해주세요!"
                }
                color={theme.primary}
              />
              <View style={styles.checkboxes}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleSwitchScope(1)}
                  testID="scope1"
                >
                  <Text>전체 공개 (시간, 수강생 이름, 코치)</Text>
                  <AppIcon
                    icon="check-circle"
                    size={20}
                    color={
                      selectedCalendar.scope === 1
                        ? theme.primary
                        : theme.lowEmphasis
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleSwitchScope(2)}
                  testID="scope2"
                >
                  <Text>부분 공개 (시간, 코치)</Text>
                  <AppIcon
                    icon="check-circle"
                    size={20}
                    color={
                      selectedCalendar.scope === 2
                        ? theme.primary
                        : theme.lowEmphasis
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleSwitchScope(3)}
                  testID="scope3"
                >
                  <Text>비공개</Text>
                  <AppIcon
                    icon="check-circle"
                    size={20}
                    color={
                      selectedCalendar.scope === 3
                        ? theme.primary
                        : theme.lowEmphasis
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {selectedCalendar.type === "personal" && (
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>캘린더 정보</Text>
              <View style={styles.options}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => setNameModalOpen(true)}
                  testID="open-name-modal"
                >
                  <Text style={styles.text}>{selectedCalendar.title}</Text>
                  <AppIcon
                    icon="chevron-right"
                    size={14}
                    color={theme.lowEmphasis}
                  />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => setColorModalOpen(true)}
                  testID="open-color-modal"
                >
                  <Text style={styles.text}>캘린더 색상</Text>
                  <View style={styles.horizontal}>
                    <View
                      style={[
                        styles.fill,
                        { backgroundColor: selectedCalendar.color },
                      ]}
                    />
                    <AppIcon
                      icon="chevron-right"
                      size={14}
                      color={theme.lowEmphasis}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
      </View>
      <NameModal
        initialName={selectedCalendar.title}
        nameModalOpen={nameModalOpen}
        setNameModalOpen={setNameModalOpen}
      />
      <ColorModal
        colorModalOpen={colorModalOpen}
        setColorModalOpen={setColorModalOpen}
        selectedColor={selectedCalendar.color}
      />
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
      gap: 32,
      backgroundColor: theme.background,
      borderBottomLeftRadius: 16,
      borderTopLeftRadius: 16,
    },
    wrapper: {
      gap: 12,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    options: {
      paddingHorizontal: 8,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: theme.border,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    text: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.highEmphasis,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 4,
      gap: 8,
    },
    fill: {
      width: 30,
      height: 20,
      borderRadius: 8,
    },
    checkboxes: {
      paddingLeft: 16,
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
