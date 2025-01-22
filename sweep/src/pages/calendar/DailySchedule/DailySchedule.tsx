import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useCalendar } from "@contexts/calendar";
import { useTheme } from "@contexts/theme";
import { ScheduleSimple } from "@fragments/Schedule";
import { TodoSimple } from "@fragments/Todo";
import { ScheduleType, TodoType } from "@models/calendar";
import { alert } from "@services/alert";
import {
  createDiary,
  getCalendarData,
  toggleTodoStatus,
} from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

export function DailySchedule() {
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [diary, setDiary] = useState<string>("");
  const [dateObj, setDateObj] = useState<Date>();

  const [diaryEditMode, setDiaryEditMode] = useState<boolean>(false);
  const [diaryContent, setDiaryContent] = useState<string>("");

  const { date } = useLocalSearchParams<{ date: string }>();
  const { selectedCalendar } = useCalendar();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleModeToggle = () => {
    setDiaryEditMode(!diaryEditMode);
  };

  const handleBack = () => {
    router.back();
  };

  const handleScheduleAddPress = () => {
    router.push({
      pathname: "/calendar/addschedule/[date]",
      params: { date },
    });
  };

  const handleTodoAddPress = () => {
    router.push({
      pathname: "/calendar/addtodo/[date]",
      params: { date },
    });
  };

  const handleTodoPress = async (id: number) => {
    const response = await toggleTodoStatus(id);

    if (response) {
      return true;
    } else {
      alert("오류 발생", "오류가 발생했습니다.");
      return false;
    }
  };

  const handleWriteDiary = async () => {
    const response = await createDiary(diaryContent, date);

    if (response) {
      setDiary(diaryContent);
      setDiaryEditMode(false);
    } else {
      alert("오류 발생", "오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    setDateObj(new Date(date));

    const fetchData = async () => {
      const response = await getCalendarData(selectedCalendar?.id, date, "day");

      if (response) {
        setSchedules(response.events);
        setTodos(response.todos);
        setDiary(response.diary);
        setDiaryContent(response.diary);
      } else {
        alert("오류 발생", "데이터를 불러오는데 실패했습니다.", handleBack);
      }
    };

    fetchData();
  }, [date]);

  const isNoSchedule = () => {
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
            <TouchableOpacity
              onPress={handleScheduleAddPress}
              testID="addschedule"
            >
              <AppIcon icon="plus-circle" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          {isNoSchedule() && (
            <Text style={styles.emptyText}>일정이 없습니다.</Text>
          )}
          {schedules.map((schedule) => (
            <View key={schedule.id}>
              <ScheduleSimple schedule={schedule} />
            </View>
          ))}
          <Divider />
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>할 일</Text>
            <TouchableOpacity onPress={handleTodoAddPress} testID="addtodo">
              <AppIcon icon="plus-circle" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          {todos.length === 0 && (
            <Text style={styles.emptyText}>할 일이 없습니다.</Text>
          )}
          {todos.map((todo) => (
            <TodoSimple
              key={todo.id}
              todo={todo}
              onPress={() => handleTodoPress(todo.id)}
            />
          ))}
          <Divider />
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>다이어리</Text>
            <TouchableOpacity onPress={handleModeToggle} testID="toggle-mode">
              <AppIcon
                icon={diary ? "pencil" : "plus-circle"}
                size={20}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>
          {diaryEditMode ? (
            <View style={styles.diaryEdit}>
              <TextInput
                value={diaryContent}
                onChangeText={setDiaryContent}
                placeholder="내용을 입력해주세요."
                style={styles.textinput}
                numberOfLines={10}
                multiline
              />
              <View style={styles.buttons}>
                <TouchableOpacity
                  onPress={handleModeToggle}
                  style={[
                    styles.button,
                    { backgroundColor: theme.lowEmphasis },
                  ]}
                >
                  <Text style={styles.buttonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleWriteDiary}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>저장</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {diary ? (
                <View style={styles.diary}>
                  <Text style={styles.diaryText}>{diary}</Text>
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
    diaryEdit: {
      marginVertical: 8,
      gap: 8,
    },
    textinput: {
      minHeight: 160,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
    },
    buttons: {
      flexDirection: "row",
      gap: 8,
    },
    button: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.background,
    },
  });
