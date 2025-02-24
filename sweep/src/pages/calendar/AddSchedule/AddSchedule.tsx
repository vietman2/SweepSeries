import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { TextButton } from "@components/Buttons";
import { LoadingComponent } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useCalendar } from "@contexts/calendar";
import { useTheme } from "@contexts/theme";
import { AlarmModal, ColorModal, RepeatModal } from "@fragments/Calendar";
import { DateTimeHeader, ScheduleInput } from "@fragments/Schedule";
import { alert } from "@services/alert";
import { createSchedule } from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

const periodOptions = ["매일", "매주", "매월", "매년"];

export function AddSchedule() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedStartDateTime, setSelectedStartDateTime] = useState<Date>(
    new Date()
  );
  const [selectedEndDateTime, setSelectedEndDateTime] = useState<Date>(
    new Date()
  );
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#FF6B6B");
  const [useAlarm, setUseAlarm] = useState<boolean>(false);
  const [delta, setDelta] = useState<number>(0);
  const [unit, setUnit] = useState<number>(0);
  const [useRepeat, setUseRepeat] = useState<boolean>(false);
  const [repeatPeriod, setRepeatPeriod] = useState<number>(0);
  const [repeatBreak, setRepeatBreak] = useState<string>("");

  const [mode, setMode] = useState<"start" | "end">("start");
  const [alarmModalOpen, setAlarmModalOpen] = useState<boolean>(false);
  const [colorModalOpen, setColorModalOpen] = useState<boolean>(false);
  const [repeatModalOpen, setRepeatModalOpen] = useState<boolean>(false);

  const { date } = useLocalSearchParams<{ date: string }>();
  const { selectedCalendar } = useCalendar();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleEndMode = () => {
    setMode("end");
  };

  const handleStartMode = () => {
    setMode("start");
  };

  const toggleAllDay = () => {
    setIsAllDay((prev) => !prev);
  };

  const toggleAlarmModal = () => {
    setAlarmModalOpen((prev) => !prev);
  };

  const toggleColorModal = () => {
    setColorModalOpen((prev) => !prev);
  };

  const toggleRepeatModal = () => {
    setRepeatModalOpen((prev) => !prev);
  };

  const handleUpdateAlarm = (
    use_alarm: boolean,
    newDelta: number,
    newUnit: number
  ) => {
    if (use_alarm) {
      setUseAlarm(use_alarm);
      setDelta(newDelta);
      setUnit(newUnit);
    } else {
      setUseAlarm(use_alarm);
      setDelta(0);
      setUnit(0);
    }
  };

  const handleUpdateRepeat = (
    use_repeat: boolean,
    newPeriod: number,
    newBreak: string
  ) => {
    if (use_repeat) {
      setUseRepeat(use_repeat);
      setRepeatPeriod(newPeriod);
      setRepeatBreak(newBreak);
    } else {
      setUseRepeat(use_repeat);
      setRepeatPeriod(0);
      setRepeatBreak("");
    }
  };

  const handleUpdateColor = (color: string) => {
    setColor(color);
    toggleColorModal();
  };

  const handleDateTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || new Date();
    if (mode === "start") {
      setSelectedStartDateTime(currentDate);

      if (currentDate > selectedEndDateTime) {
        setSelectedEndDateTime(
          new Date(currentDate.getTime() + 60 * 60 * 1000)
        );
      }
    } else {
      setSelectedEndDateTime(currentDate);
    }
  };

  const getDateTimePickerMode = () => {
    if (Platform.OS === "ios" && !isAllDay) {
      return "datetime";
    }

    return "date";
  };

  const getAlarmText = () => {
    const unitOptions = ["분 전", "시간 전", "일 전", "주 전"];
    return `${delta} ${unitOptions[unit]}`;
  };

  const handleSubmit = async () => {
    const response = await createSchedule(
      selectedCalendar?.type,
      title,
      description,
      {
        start: selectedStartDateTime,
        end: selectedEndDateTime,
        isAllDay,
      },
      {
        use: useAlarm,
        delta,
        unit,
      },
      color,
      {
        use: useRepeat,
        period: repeatPeriod,
        break: repeatBreak,
      },
      selectedCalendar?.uuid
    );

    if (response) {
      router.back();
    } else {
      alert("일정 등록 오류", "일정을 등록하는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const currentDate = new Date(date);
    setSelectedStartDateTime(currentDate);
    setSelectedEndDateTime(new Date(currentDate.getTime() + 60 * 60 * 1000));
  }, []);

  if (!selectedCalendar) {
    return <LoadingComponent />;
  }

  return (
    <>
      <View style={styles.container}>
        <Scroll style={styles.wrapper}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="일정 제목을 입력하세요."
            />
          </View>
          <DateTimeHeader
            selectedEndDateTime={selectedEndDateTime}
            selectedStartDateTime={selectedStartDateTime}
            mode={mode}
            handleEndMode={handleEndMode}
            handleStartMode={handleStartMode}
            isAllDay={isAllDay}
          />
          <View style={styles.pickerWrapper}>
            <DateTimePicker
              mode={getDateTimePickerMode()}
              value={
                mode === "start" ? selectedStartDateTime : selectedEndDateTime
              }
              onChange={handleDateTimeChange}
              display="spinner"
              locale="ko-KR"
              textColor="#000"
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.chip,
                isAllDay && { backgroundColor: theme.primary },
              ]}
              onPress={toggleAllDay}
              testID="all-day"
            >
              <Text
                style={[
                  styles.chipText,
                  isAllDay && { color: theme.background },
                ]}
              >
                종일
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputs}>
            <View style={styles.row}>
              <AppIcon
                icon="clipboard"
                size={24}
                color={theme.mediumEmphasis}
              />
              <View style={styles.wrapper}>
                <TextInput
                  placeholder="설명을 입력하세요."
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>
            <ScheduleInput
              icon="calendar-number-2"
              text={selectedCalendar.title}
              disabled
            />
            <ScheduleInput icon="clock" text="알림" onPress={toggleAlarmModal}>
              {useAlarm ? (
                <Text>{getAlarmText()}</Text>
              ) : (
                <Text>사용 안함</Text>
              )}
            </ScheduleInput>
            <ScheduleInput
              icon="palette"
              text="색상"
              onPress={toggleColorModal}
            >
              <View style={[styles.color, { backgroundColor: color }]} />
            </ScheduleInput>
            <ScheduleInput
              icon="repeat"
              text="반복"
              onPress={toggleRepeatModal}
            >
              {useRepeat ? (
                <Text>{`${periodOptions[repeatPeriod]} (${repeatBreak})`}</Text>
              ) : (
                <Text>반복 안함</Text>
              )}
            </ScheduleInput>
          </View>
        </Scroll>
        <View style={styles.buttonContainer}>
          <TextButton text="등록하기" onPress={handleSubmit} />
        </View>
      </View>
      <ColorModal
        colorModalOpen={colorModalOpen}
        setColorModalOpen={setColorModalOpen}
        selectedColor={color}
        handleUpdateColor={handleUpdateColor}
      />
      {alarmModalOpen && (
        <AlarmModal
          initialData={{ useAlarm, delta, unit }}
          setAlarmModalOpen={setAlarmModalOpen}
          handleUpdateAlarm={handleUpdateAlarm}
        />
      )}
      {repeatModalOpen && (
        <RepeatModal
          initialData={{ useRepeat, repeatPeriod, repeatBreak }}
          toggleRepeatModal={toggleRepeatModal}
          handleUpdateRepeat={handleUpdateRepeat}
        />
      )}
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 36,
      gap: 16,
      backgroundColor: theme.background,
    },
    wrapper: {
      flex: 1,
    },
    inputWrapper: {
      paddingHorizontal: 16,
    },
    pickerWrapper: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chip: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
      marginHorizontal: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 0.5,
      borderColor: theme.primary,
    },
    chipText: {
      fontSize: 16,
      color: theme.primary,
    },
    inputs: {
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    buttonContainer: {
      paddingHorizontal: 16,
    },
    alarm: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    color: {
      width: 24,
      height: 24,
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
    },
  });
