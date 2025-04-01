import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { CalendarHeader } from "@components/Calendars";
import { Divider } from "@components/Dividers";
import { ScrollView } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useHome } from "@contexts/home";
import { useTheme } from "@contexts/theme";
import { NormalCard, ProCard } from "@fragments/Academy";
import { LessonSimple } from "@fragments/Lesson";
import { LessonDetailType } from "@models/calendar";
import { getSessions } from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

export function MyAcademy() {
  const [schedules, setSchedules] = useState<LessonDetailType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const { mode } = useAuth();
  const { academy } = useHome();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshCount((prev) => prev + 1);
  };

  const handleLessonPress = (lesson: LessonDetailType) => {
    const lessonId = lesson.id.slice(1);
    router.push({
      pathname: "/home/lesson/[id]",
      params: { id: lessonId, mode },
    });
  };

  useEffect(() => {
    const getCurrentMonth = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      return `${year}-${month < 10 ? `0${month}` : month}`;
    };

    setSelectedMonth(getCurrentMonth());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSessions(selectedMonth);

      if (response) {
        setSchedules(response);
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedMonth, refreshCount]);

  if (!academy || mode === "guest") return null;

  return (
    <ScrollView refreshing={loading} onRefresh={handleRefresh}>
      <View style={styles.container}>
        {mode === "pro" ? (
          <ProCard academy={academy} type={2} />
        ) : (
          <NormalCard academy={academy} type={2} />
        )}
        <View style={styles.content}>
          <Text style={styles.subtitle}>레슨 일정 및 피드백 목록</Text>
          <CalendarHeader
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
          {schedules.length === 0 ? (
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText}>일정이 없습니다.</Text>
            </View>
          ) : (
            <>
              {schedules.map((schedule) => (
                <View key={schedule.id} style={styles.lesson}>
                  <TouchableOpacity
                    onPress={() => handleLessonPress(schedule)}
                    testID={`lesson-${schedule.id}`}
                  >
                    <LessonSimple lesson={schedule} />
                  </TouchableOpacity>
                  <Divider />
                </View>
              ))}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 24,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    content: {
      marginTop: 16,
    },
    subtitle: {
      fontSize: 20,
      marginBottom: 8,
      marginLeft: 4,
    },
    lesson: {
      paddingVertical: 4,
      gap: 8,
    },
    emptyWrapper: {
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 64,
    },
    emptyText: {
      fontSize: 18,
      color: theme.mediumEmphasis,
    },
  });
