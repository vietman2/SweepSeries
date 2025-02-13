import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { CalendarHeader } from "@components/Calendars";
import { Divider } from "@components/Dividers";
import { LoadingComponent } from "@components/Fallbacks";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import { AcademyCard } from "@fragments/Academy";
import { LessonSimple } from "@fragments/Lesson";
import { LessonDetailType } from "@models/calendar";
import { getSessions } from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

export function MyAcademy() {
  const [schedules, setSchedules] = useState<LessonDetailType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const { mode } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

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
  }, [selectedMonth]);

  if (loading) return <LoadingComponent />;

  return (
    <Scroll style={styles.container}>
      <AcademyCard mode="normal" type={2} />
      <View style={styles.content}>
        <Text style={styles.subtitle}>레슨 일정 및 피드백 목록</Text>
        <CalendarHeader
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
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
      </View>
    </Scroll>
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
  });
