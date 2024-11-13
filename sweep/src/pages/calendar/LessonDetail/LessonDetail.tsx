import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Divider, VerticalDivider } from "@components/Dividers";
import { ErrorPage } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { LessonDetailType } from "@models/calendar";
import {
  sampleLessonDetail,
  sampleUpcomingLessonDetail,
} from "@testdata/calendar";
import { ThemeColorType } from "@themes/colors";

export function LessonDetail() {
  const [lesson, setLesson] = useState<LessonDetailType>();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    if (parseInt(id) % 2 === 0) {
      setLesson(sampleLessonDetail);
    } else {
      setLesson(sampleUpcomingLessonDetail);
    }
  }, []);

  if (lesson === undefined) {
    return <ErrorPage />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.datetime}>
          <Text style={styles.dateText}>{lesson.date}</Text>
          <Text style={styles.timeText}>{lesson.time}</Text>
        </View>
        <View style={styles.horizontal}>
          <View
            style={[
              styles.chip,
              {
                backgroundColor:
                  lesson.status === "완료" ? lesson.color : theme.background,
                borderColor: lesson.color,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color:
                    lesson.status === "완료" ? theme.background : lesson.color,
                },
              ]}
            >
              {lesson.status}
            </Text>
          </View>
          <VerticalDivider color={lesson.color} width={2} />
          <View style={styles.content}>
            <Text style={styles.title}>{lesson.program}</Text>
            <Text style={styles.detail}>
              코치: {lesson.coach} 수강생: {lesson.player}
            </Text>
          </View>
        </View>
      </View>
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
    header: {
      gap: 12,
    },
    datetime: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 8,
    },
    dateText: {
      fontSize: 20,
      color: theme.mediumEmphasis,
    },
    timeText: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    chip: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 4,
      borderWidth: 0.5,
    },
    chipText: {
      fontWeight: "bold",
      color: theme.background,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    content: {
      gap: 8,
    },
    detail: {
      fontSize: 14,
      color: theme.lowEmphasis,
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
