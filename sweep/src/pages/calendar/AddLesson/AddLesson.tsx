import { StyleSheet, Text, View } from "react-native";

import { ErrorPage } from "@components/Fallbacks";
import { Scroll } from "@components/ScrollView";
import { AddLessonProvider } from "@contexts/addlesson";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import {
  CurriculumSelector,
  OtherFields,
  ProgramSelector,
  StudentSelector,
} from "@fragments/Lesson";
import { ThemeColorType } from "@themes/colors";

export function AddLesson() {
  const { mode } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (mode !== "pro") {
    return <ErrorPage />;
  }

  return (
    <AddLessonProvider>
      <Scroll style={styles.container}>
        <Text style={styles.subtitle}>프로그램 선택</Text>
        <View style={styles.content}>
          <ProgramSelector />
          <StudentSelector />
          <CurriculumSelector />
          <OtherFields />
        </View>
      </Scroll>
    </AddLessonProvider>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    content: {
      marginTop: 16,
      gap: 16,
    },
  });
