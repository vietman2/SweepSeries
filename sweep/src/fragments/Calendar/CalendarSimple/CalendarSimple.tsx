import { Image, StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CalendarType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  calendar: CalendarType;
}

export function CalendarSimple({ calendar }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {calendar.logo ? (
          <Image source={{ uri: calendar.logo }} style={styles.fill} />
        ) : (
          <View style={[styles.fill, { backgroundColor: calendar.color }]}>
            <Text style={styles.character}>{calendar.title[0]}</Text>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{calendar.title}</Text>
          {calendar.num_members ? (
            <View style={styles.footer}>
              <AppIcon icon="people" size={16} color={theme.mediumEmphasis} />
              <Text style={styles.text}>{calendar.num_members} 명</Text>
            </View>
          ) : (
            <View style={styles.footer}>
              <Text style={styles.text}>개인 캘린더</Text>
            </View>
          )}
        </View>
      </View>
      {calendar.role === "owner" && (
        <AppIcon icon="crown" size={24} color={theme.primary} />
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    row: {
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
      fontWeight: "bold",
      color: "#000",
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
