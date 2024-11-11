import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ScheduleSimple } from "@fragments/Schedule";
import { TodoSimple } from "@fragments/Todo";
import { DiaryType, ScheduleSimpleType, TodoType } from "@models/calendar";
import {
  sampleDiary,
  sampleScheduleResponse,
  sampleTodos,
} from "@testdata/calendar";
import { ThemeColorType } from "@themes/colors";

export function DailySchedule() {
  const [schedules, setSchedules] = useState<ScheduleSimpleType[]>([]);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [diary, setDiary] = useState<DiaryType>();
  const [dateObj, setDateObj] = useState<Date>();

  const [diaryEditMode, setDiaryEditMode] = useState<boolean>(false);

  const { date } = useLocalSearchParams<{ date: string }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleModeToggle = () => {
    setDiaryEditMode(!diaryEditMode);
  };

  useEffect(() => {
    setSchedules(sampleScheduleResponse[date]);
    setTodos(sampleTodos);
    setDateObj(new Date(date));

    if (parseInt(date.split("-")[2]) % 2 === 0) {
      setDiary(sampleDiary);
    }
  }, [date]);

  const isNoSchedule = () => {
    if (!schedules) return true;
    if (schedules.length === 0) return true;

    return false;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {`${dateObj?.toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
        })}. ${dateObj?.toLocaleDateString("ko-KR", { weekday: "short" })}`}
      </Text>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>일정</Text>
          <TouchableOpacity>
            <AppIcon icon="plus-circle" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
        {isNoSchedule() ? (
          <>
            <Text style={styles.emptyText}>일정이 없습니다.</Text>
            <Divider />
          </>
        ) : (
          schedules.map((schedule) => (
            <View key={schedule.id}>
              <ScheduleSimple schedule={schedule} />
              <Divider />
            </View>
          ))
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>할 일</Text>
          <TouchableOpacity>
            <AppIcon icon="plus-circle" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
        {todos.map((todo) => (
          <TodoSimple key={todo.id} todo={todo} />
        ))}
        <Divider />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>다이어리</Text>
          <TouchableOpacity onPress={handleModeToggle} testID="toggle-mode">
            <AppIcon icon="plus-circle" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
        {diary ? (
          <View style={styles.diary}>
            <Text style={styles.diaryText}>{diary.content}</Text>
          </View>
        ) : (
          <Text style={styles.emptyText}>다이어리를 추가해주세요.</Text>
        )}
      </View>
      <StatusBar style="inverted" />
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    emptyText: {
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
      color: theme.lowEmphasis,
    },
    diary: {
      marginTop: 8,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    diaryText: {
      fontSize: 14,
      lineHeight: 20,
    },
  });
