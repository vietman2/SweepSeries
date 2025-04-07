import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { LessonSimple } from "@fragments/Lesson";
import { StudentLessonsType } from "@models/products";
import { getAcademyStudentDetail } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function CustomerDetail() {
  const [student, setStudent] = useState<StudentLessonsType>();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode, uuid } = useFront();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const navigateToLessonDetail = (id: string) => {
    const lessonId = id.slice(1);
    router.push({
      pathname: "/front/lesson/[id]",
      params: { id: lessonId },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (mode === "academy") {
        const response = await getAcademyStudentDetail(uuid, id);

        if (response) {
          setStudent(response);
        }
      }
    };

    fetchData();
  }, [mode, uuid, id]);

  if (!student) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>레슨 일정 및 피드백 목록</Text>
      <View style={styles.list}>
        {student.lessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            onPress={() => navigateToLessonDetail(lesson.id)}
            style={styles.lesson}
            testID={`lesson-${lesson.id}`}
          >
            <LessonSimple lesson={lesson} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 20,
      color: theme.highEmphasis,
    },
    list: {
      marginVertical: 16,
      gap: 8,
    },
    lesson: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
