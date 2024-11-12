import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
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
  const [diaryContent, setDiaryContent] = useState<string>("");

  const { date } = useLocalSearchParams<{ date: string }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleModeToggle = () => {
    setDiaryEditMode(!diaryEditMode);
  };

  const handleSchedulePress = () => {
    router.replace("/calendar/addschedule");
  };

  useEffect(() => {
    setSchedules(sampleScheduleResponse[date]);
    setTodos(sampleTodos);
    setDateObj(new Date(date));

    if (parseInt(date.split("-")[2]) % 2 === 0) {
      setDiary(sampleDiary);
      setDiaryContent(sampleDiary.content);
    }
  }, [date]);

  const isNoSchedule = () => {
    if (!schedules) return true;
    if (schedules.length === 0) return true;

    return false;
  };

  return (
    <Scroll style={styles.container} extraScrollHeight={16}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>
          {`${dateObj?.toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
          })}. ${dateObj?.toLocaleDateString("ko-KR", { weekday: "short" })}`}
        </Text>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>일정</Text>
            <TouchableOpacity onPress={handleSchedulePress} testID="schedule">
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
          {diaryEditMode ? (
            <TextInput
              value={diaryContent}
              onChangeText={setDiaryContent}
              placeholder="내용을 입력해주세요."
              style={styles.textinput}
              numberOfLines={10}
              multiline
            />
          ) : (
            <>
              {diary ? (
                <View style={styles.diary}>
                  <Text style={styles.diaryText}>{diary.content}</Text>
                </View>
              ) : (
                <Text style={styles.emptyText}>다이어리를 추가해주세요.</Text>
              )}
            </>
          )}
        </View>
      </View>
      <StatusBar style="inverted" />
    </Scroll>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 32,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    wrapper: {
      gap: 16,
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
    textinput: {
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
    },
  });
