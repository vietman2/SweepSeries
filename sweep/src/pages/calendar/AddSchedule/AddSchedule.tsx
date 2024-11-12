import { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { DateTimeHeader, ScheduleInput } from "@fragments/Schedule";
import { ThemeColorType } from "@themes/colors";

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

  const [mode, setMode] = useState<"start" | "end">("start");
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

  const handleDateTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || new Date();
    if (mode === "start") {
      setSelectedStartDateTime(currentDate);
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

  useEffect(() => {
    setSelectedEndDateTime(
      new Date(selectedStartDateTime.getTime() + 60 * 60 * 1000)
    );
  }, []);

  return (
    <Scroll style={styles.container}>
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
          value={mode === "start" ? selectedStartDateTime : selectedEndDateTime}
          onChange={handleDateTimeChange}
          display="spinner"
          textColor="#000"
        />
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.chip, isAllDay && { backgroundColor: theme.primary }]}
          onPress={toggleAllDay}
          testID="all-day"
        >
          <Text
            style={[styles.chipText, isAllDay && { color: theme.background }]}
          >
            종일
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputs}>
        <View style={styles.row}>
          <AppIcon icon="clipboard" size={24} color={theme.mediumEmphasis} />
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
          text="Calendar 1"
          onPress={() => {}}
        />
        <ScheduleInput icon="clock" text="알림" onPress={() => {}} />
        <ScheduleInput icon="palette" text="색상" onPress={() => {}} />
        <ScheduleInput icon="repeat" text="반복" onPress={() => {}} />
      </View>
    </Scroll>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
    wrapper: {
      flex: 1,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });
