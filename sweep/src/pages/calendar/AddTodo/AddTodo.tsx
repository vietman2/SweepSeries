import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { TextButton } from "@components/Buttons";
import { LoadingComponent } from "@components/Fallbacks";
import { TextInput } from "@components/Inputs";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useCalendar } from "@contexts/calendar";
import { useTheme } from "@contexts/theme";
import { ColorModal } from "@fragments/Calendar";
import { ScheduleInput } from "@fragments/Schedule";
import { alert } from "@services/alert";
import { createTodo } from "@services/calendar";
import { ThemeColorType } from "@themes/colors";
import { formatDate } from "@utils/formatters";

export function AddTodo() {
  const [todo, setTodo] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [color, setColor] = useState<string>("#FF6B6B");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { date } = useLocalSearchParams<{ date: string }>();
  const { selectedCalendar } = useCalendar();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const goBack = () => {
    router.back();
  };

  const openColorModal = () => {
    setIsModalOpen(true);
  };

  const closeColorModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateColor = (color: string) => {
    setColor(color);
    closeColorModal();
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || new Date(date);
    setSelectedDate(currentDate);
  };

  const handleSubmit = async () => {
    const response = await createTodo(
      selectedCalendar?.id,
      todo,
      selectedDate,
      color
    );

    if (response) {
      goBack();
    } else {
      alert("등록 실패", "일정을 등록하는데 실패했습니다.");
    }
  };

  useEffect(() => {
    setSelectedDate(new Date(date));
  }, [date]);

  if (!selectedDate || !selectedCalendar) {
    return <LoadingComponent />;
  }

  return (
    <>
      <View style={styles.container}>
        <Scroll style={styles.contents}>
          <View>
            <TextInput
              value={todo}
              onChangeText={setTodo}
              placeholder="할 일을 입력하세요."
            />
          </View>
          <View style={styles.datePicker}>
            <Text style={styles.date}>날짜: {formatDate(selectedDate)}</Text>
            <View style={styles.wrapper}>
              <DateTimePicker
                mode="date"
                value={selectedDate}
                onChange={handleDateChange}
                display="spinner"
                locale="ko-KR"
                textColor="#000"
              />
            </View>
          </View>
          <View>
            <ScheduleInput
              icon="calendar-number-2"
              text={selectedCalendar.name}
              disabled
            />
            <ScheduleInput icon="palette" text="색상" onPress={openColorModal}>
              <View style={[styles.color, { backgroundColor: color }]} />
            </ScheduleInput>
          </View>
        </Scroll>
        <TextButton text="등록하기" onPress={handleSubmit} />
      </View>
      <ColorModal
        colorModalOpen={isModalOpen}
        setColorModalOpen={setIsModalOpen}
        selectedColor={color}
        handleUpdateColor={handleUpdateColor}
      />
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 36,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    contents: {
      flex: 1,
    },
    datePicker: {
      gap: 8,
    },
    date: {
      paddingHorizontal: 8,
      paddingVertical: 12,
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    wrapper: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    color: {
      width: 24,
      height: 24,
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
    },
    time: {
      fontSize: 14,
      color: theme.mediumEmphasis,
    },
  });
