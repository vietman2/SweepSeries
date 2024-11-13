import { useState } from "react";
import { StyleSheet, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { TextButton } from "@components/Buttons";
import { TextInput } from "@components/Inputs";
import { useTheme } from "@contexts/theme";
import { ScheduleInput } from "@fragments/Schedule";
import { ThemeColorType } from "@themes/colors";
import { Scroll } from "@components/ScrollView";

interface Props {
  initialDate?: Date;
}

export function AddTodo({ initialDate = new Date() }: Readonly<Props>) {
  const [todo, setTodo] = useState<string>("");
  const [date, setDate] = useState<Date>(initialDate);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Scroll style={styles.contents}>
        <View>
          <TextInput
            value={todo}
            onChangeText={setTodo}
            placeholder="할 일을 입력하세요."
          />
        </View>
        <View style={styles.wrapper}>
          <DateTimePicker
            mode="date"
            value={date}
            onChange={handleDateChange}
            display="spinner"
            locale="ko-KR"
            textColor="#000"
          />
        </View>
        <View>
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
      <TextButton text="등록하기" onPress={() => {}} />
    </View>
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
    wrapper: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
