import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { CalendarHeader } from "@components/Calendars";
import { Divider } from "@components/Dividers";
import { LoadingComponent } from "@components/Fallbacks";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AcademyCard } from "@fragments/Academy";
import { LessonHeader } from "@fragments/Lesson";
import { LessonDetailType } from "@models/calendar";
import { sampleLessons } from "@testdata/calendar";
import { ThemeColorType } from "@themes/colors";

export function MyAcademy() {
  const [schedules, setSchedules] = useState<LessonDetailType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleLessonPress = (lesson: LessonDetailType) => {
    router.push({
      pathname: "/calendar/lesson/[id]",
      params: { id: lesson.id },
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
    setSchedules(sampleLessons);
    setLoading(false);
  }, []);

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
              <LessonHeader lesson={schedule} />
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
