import { StyleSheet, Text, View } from "react-native";

import { TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { LessonSimple } from "@fragments/Lesson";
import { LessonDetailType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  lesson: LessonDetailType;
  mode: string;
  openSheet: () => void;
}

export function ScheduledLesson({ lesson, mode, openSheet }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <LessonSimple lesson={lesson} />
      <Divider color={theme.border} />
      <View style={styles.alert}>
        <AppIcon icon="warning-circle" size={48} color={theme.primary} />
        <Text style={styles.alertText}>아직 진행되지 않은 레슨입니다.</Text>
      </View>
      {mode === "normal" && (
        <View style={styles.buttonWrapper}>
          <View style={styles.button}>
            <TextButton text="예약 변경" onPress={openSheet} />
          </View>
          <View style={styles.button}>
            <TextButton
              text="예약 취소"
              onPress={() => {}}
              backgroundColor={theme.border}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 24,
    },
    alert: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 24,
    },
    alertText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.lowEmphasis,
    },
    buttonWrapper: {
      flexDirection: "row",
      gap: 8,
    },
    button: {
      flex: 1,
    },
  });
