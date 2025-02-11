import { StyleSheet, View } from "react-native";

import { VerticalDivider } from "@components/Dividers";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { LessonType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  lesson: LessonType;
}

export function LessonSimple({ lesson }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.horizontal}>
        <Text style={styles.date}>{lesson.date}</Text>
        <Text style={styles.time}>{lesson.time}</Text>
      </View>
      <View style={styles.horizontal}>
        <View
          style={[
            styles.chip,
            lesson.done && { backgroundColor: lesson.color },
          ]}
        >
          <Text
            style={[
              styles.chipText,
              lesson.done && { color: theme.background },
            ]}
          >
            {lesson.done ? "완료" : "예정"}
          </Text>
        </View>
        <VerticalDivider color={lesson.color} width={2} />
        <View style={styles.content}>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.detail}>{lesson.description}</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      gap: 12,
    },
    date: {
      fontSize: 20,
      color: theme.highEmphasis,
    },
    time: {
      marginLeft: 4,
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
      borderWidth: 1,
      borderColor: theme.primary,
      backgroundColor: theme.background,
    },
    chipText: {
      fontWeight: "bold",
      color: theme.primary,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    content: {
      gap: 4,
    },
    detail: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    notes: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 20,
      color: theme.lowEmphasis,
    },
  });
