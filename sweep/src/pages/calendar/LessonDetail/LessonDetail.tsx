import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Divider } from "@components/Dividers";
import { ErrorPage } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { LessonHeader } from "@fragments/Lesson";
import { LessonDetailType } from "@models/calendar";
import { sampleLessons } from "@testdata/calendar";
import { ThemeColorType } from "@themes/colors";

export function LessonDetail() {
  const [lesson, setLesson] = useState<LessonDetailType>();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    if (parseInt(id) % 2 === 0) {
      setLesson(sampleLessons[1]);
    } else {
      setLesson(sampleLessons[0]);
    }
  }, [id]);

  if (lesson === undefined) {
    return <ErrorPage />;
  }

  return (
    <View style={styles.container}>
      <LessonHeader lesson={lesson} />
      {lesson.status === "완료" ? (
        <>
          <View style={styles.content}>
            <Text style={styles.subtitle}>{lesson.player} 님의 레슨 노트</Text>
            <View style={styles.textArea}>
              <Text style={styles.feedbackText}>{lesson.note}</Text>
            </View>
          </View>
          <Divider />
          <View style={styles.content}>
            <Text style={styles.subtitle}>코치님 피드백</Text>
            <View style={styles.textArea}>
              <Text style={styles.feedbackText}>{lesson.feedback}</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <Divider />
          <View style={styles.upcoming}>
            <AppIcon icon="warning-circle" size={48} color={theme.primary} />
            <Text style={styles.upcomingText}>
              아직 진행되지 않은 일정입니다.
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 16,
      gap: 16,
      backgroundColor: theme.background,
    },
    content: {
      gap: 8,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    textArea: {
      backgroundColor: theme.backgroundGray,
      borderRadius: 16,
    },
    feedbackText: {
      padding: 16,
      fontSize: 16,
      lineHeight: 24,
      color: theme.highEmphasis,
    },
    upcoming: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    },
    upcomingText: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.lowEmphasis,
    },
  });
