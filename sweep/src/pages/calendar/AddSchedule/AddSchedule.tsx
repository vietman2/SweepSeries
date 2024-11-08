import { useState } from "react";
import { StyleSheet, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { TextInput } from "@components/Inputs";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

export function AddSchedule() {
  const [title, setTitle] = useState<string>("");
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleDateTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || selectedDateTime;
    setSelectedDateTime(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="일정 제목을 입력하세요."
        />
      </View>
      <View style={styles.pickerWrapper}>
        <DateTimePicker
          mode="datetime"
          value={selectedDateTime}
          onChange={handleDateTimeChange}
          display="spinner"
        />
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 16,
      backgroundColor: theme.background,
    },
    inputWrapper: {
      paddingHorizontal: 16,
    },
    pickerWrapper: {
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 16,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
