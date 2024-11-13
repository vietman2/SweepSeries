import { StyleSheet, View } from "react-native";

import { VerticalDivider } from "@components/Dividers";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { LessonDetailType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  lesson: LessonDetailType;
}

export function LessonHeader({ lesson }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
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
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
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
  });
