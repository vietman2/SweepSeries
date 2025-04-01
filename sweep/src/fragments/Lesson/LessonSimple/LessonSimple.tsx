import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Divider, VerticalDivider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { LessonRequestType, LessonType } from "@models/calendar";
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

export function LessonToReview({ lesson }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{lesson.full_date}</Text>
      <Text style={styles.academyName}>{lesson.academy_name}</Text>
      <View style={styles.horizontal}>
        <View style={[styles.chip, { backgroundColor: theme.primary }]}>
          <Text style={[styles.chipText, { color: theme.background }]}>
            완료
          </Text>
        </View>
        <VerticalDivider color={lesson.color} width={2} />
        <View style={styles.content}>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.detail}>{lesson.curriculum}</Text>
        </View>
      </View>
    </View>
  );
}

interface RequestProps {
  lessonRequest: LessonRequestType;
  checked: boolean;
  onCheck: () => void;
}

export function LessonRequestSimple({
  lessonRequest,
  checked,
  onCheck,
}: Readonly<RequestProps>) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.requestWrapper}>
        <View style={[styles.container, { flex: 1 }]}>
          <View style={styles.horizontal}>
            <Text style={styles.date}>{lessonRequest.date}</Text>
            <Text style={styles.time}>{lessonRequest.time}</Text>
          </View>
          <View style={styles.horizontal}>
            <View
              style={[styles.chip, { backgroundColor: lessonRequest.color }]}
            >
              <Text style={styles.whiteText}>예약</Text>
            </View>
            <VerticalDivider color={lessonRequest.color} width={2} />
            <View style={styles.content}>
              <Text style={styles.title}>{lessonRequest.title}</Text>
              <Text style={styles.detail}>{lessonRequest.description}</Text>
            </View>
          </View>
        </View>
        <View>
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={toggleExpand}
              style={styles.expandButton}
              testID="expand-button"
            >
              <AppIcon
                icon={expanded ? "chevron-up" : "chevron-down"}
                size={18}
                color={theme.lowEmphasis}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onCheck} style={styles.checkBox}>
              <AppIcon
                icon="check-circle"
                size={32}
                color={checked ? theme.primary : theme.lowEmphasis}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {expanded && (
        <View style={styles.details}>
          <Text style={styles.detailText}>{lessonRequest.details}</Text>
        </View>
      )}
      <Divider />
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    date: {
      fontSize: 18,
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
    wrapper: {
      gap: 12,
    },
    requestWrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    whiteText: {
      fontWeight: "bold",
      color: theme.background,
    },
    details: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.lowEmphasis,
    },
    detailText: {
      fontSize: 14,
      lineHeight: 24,
      color: theme.mediumEmphasis,
    },
    buttons: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
    },
    expandButton: {
      justifyContent: "flex-start",
    },
    checkBox: {
      justifyContent: "center",
    },
    academyName: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.primary,
    },
  });
