import { StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CalendarType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  calendar?: CalendarType;
}

export function CalendarSimple({ calendar }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!calendar) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyFill}>
          <AppIcon icon="plus" size={24} color={theme.lowEmphasis} />
        </View>
        <View style={styles.content}>
          <Text style={styles.buttonText}>새로운 캘린더 만들기</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.fill, { backgroundColor: calendar.color }]}>
        <Text style={styles.character}>{calendar.title[0]}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{calendar.title}</Text>
        <View style={styles.footer}>
          <AppIcon icon="people" size={16} color={theme.mediumEmphasis} />
          <Text style={styles.text}>{calendar.members.length}명</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    fill: {
      alignItems: "center",
      justifyContent: "center",
      width: 48,
      height: 48,
      borderRadius: 4,
    },
    character: {
      fontSize: 20,
      color: theme.mediumEmphasis,
    },
    content: {
      gap: 8,
    },
    title: {
      fontSize: 18,
      color: theme.highEmphasis,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    text: {
      fontSize: 14,
      color: theme.mediumEmphasis,
    },
    emptyFill: {
      alignItems: "center",
      justifyContent: "center",
      width: 48,
      height: 48,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: theme.lowEmphasis,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.lowEmphasis,
    },
  });
