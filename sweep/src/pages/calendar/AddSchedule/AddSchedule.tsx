import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { AppIcon } from "@components/Icons";
import { TextInput } from "@components/Inputs";
import { useTheme } from "@contexts/theme";
import { DatetimeHeader } from "@fragments/Datetime";
import { ThemeColorType } from "@themes/colors";

export function AddSchedule() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
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
      <DatetimeHeader />
      <View style={styles.pickerWrapper}>
        <DateTimePicker
          mode={Platform.OS === "ios" ? "datetime" : "date"}
          value={selectedDateTime}
          onChange={handleDateTimeChange}
          display="spinner"
          textColor="#000"
        />
      </View>
      <View style={styles.inputs}>
        <View style={styles.row}>
          <AppIcon icon="check" size={24} color={theme.primary} />
          <View style={styles.wrapper}>
            <TextInput
              placeholder="설명을 입력하세요."
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>
        <View style={styles.row}>
          <AppIcon icon="check" size={24} color={theme.primary} />
          <View style={styles.wrapper}>
            <TextInput
              placeholder="설명을 입력하세요."
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>
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
      marginTop: 16,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    inputs: {
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    wrapper: {
      flex: 1,
    },
  });
