import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Divider } from "@components/Dividers";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { TodoSimple } from "@fragments/Todo";
import { ScheduleSimpleType, TodoType } from "@models/calendar";
import { sampleScheduleResponse, sampleTodos } from "@testdata/calendar";
import { ThemeColorType } from "@themes/colors";

export function DailySchedule() {
  const [schedules, setSchedules] = useState<ScheduleSimpleType[]>([]);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [dateObj, setDateObj] = useState<Date>();

  const { date } = useLocalSearchParams<{ date: string }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setSchedules(sampleScheduleResponse[date]);
    setTodos(sampleTodos);
    setDateObj(new Date(date));
  }, [date]);

  if (!schedules) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {`${dateObj?.toLocaleDateString("ko-KR", {
          day: "numeric",
        })}. ${dateObj?.toLocaleDateString("ko-KR", { weekday: "short" })}`}
      </Text>
      <View style={styles.content}>
        <Text style={styles.subtitle}>할 일</Text>
        {todos.map((todo) => (
          <TodoSimple key={todo.id} todo={todo} />
        ))}
        <Divider />
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>메모</Text>
        <Divider />
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>일정</Text>
        <Divider />
      </View>
      {schedules.length > 0 && (
        <Text>{schedules.map((schedule) => schedule.text).join(", ")}</Text>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 32,
      paddingHorizontal: 16,
      gap: 16,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.mediumEmphasis,
    },
    content: {
      gap: 8,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
  });
