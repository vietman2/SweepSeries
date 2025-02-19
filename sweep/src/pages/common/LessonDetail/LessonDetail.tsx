import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { ErrorPage } from "@components/Fallbacks";
import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { useTheme } from "@contexts/theme";
import { LessonSimple } from "@fragments/Lesson";
import { LessonDetailType } from "@models/calendar";
import { alert } from "@services/alert";
import {
  getSessionDetails,
  updateSessionFeedback,
  updateSessionNotes,
} from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

export function LessonDetail() {
  const [lesson, setLesson] = useState<LessonDetailType>();

  const [notes, setNotes] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const { id, mode } = useLocalSearchParams<{ id: string; mode: string }>();

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const notesActive = mode === "normal";
  const feedbackActive = mode === "pro";

  const handleSubmit = async () => {
    if (mode === "normal") {
      const response = await updateSessionNotes(id, notes);

      if (!response) {
        alert("저장 실패", "저장에 실패했습니다. 다시 시도해주세요.");
        return;
      }
    } else {
      const response = await updateSessionFeedback(id, feedback);

      if (!response) {
        alert("저장 실패", "저장에 실패했습니다. 다시 시도해주세요.");
        return;
      }
    }

    alert("저장 완료", "저장이 완료되었습니다.");
    setIsButtonActive(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSessionDetails(id);

      if (response) {
        setLesson(response);
        setNotes(response.notes);
        setFeedback(response.feedback);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    setIsButtonActive(notes !== lesson?.notes || feedback !== lesson?.feedback);
  }, [notes, feedback]);

  if (lesson === undefined) {
    return <ErrorPage />;
  }

  return (
    <View style={styles.container}>
      {lesson.done ? (
        <Scroll>
          <View style={styles.innerContainer}>
            <LessonSimple lesson={lesson} />
            <Divider color={theme.border} />
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>코치님 피드백</Text>
              <TextInput
                style={[
                  styles.input,
                  feedbackActive && { backgroundColor: theme.background },
                ]}
                multiline
                numberOfLines={4}
                value={feedback}
                onChangeText={setFeedback}
                editable={feedbackActive}
                testID="feedback-input"
              />
            </View>
            <Divider color={theme.border} />
            <View style={styles.wrapper}>
              <Text style={styles.subtitle}>홍길동 님의 레슨 노트</Text>
              <TextInput
                style={[
                  styles.input,
                  notesActive && { backgroundColor: theme.background },
                ]}
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
                editable={notesActive}
                testID="notes-input"
              />
            </View>
            <TextButton
              text="저장"
              onPress={handleSubmit}
              active={isButtonActive}
            />
          </View>
        </Scroll>
      ) : (
        <View style={styles.innerContainer}>
          <LessonSimple lesson={lesson} />
          <Divider color={theme.border} />
          <View style={styles.alert}>
            <AppIcon icon="warning-circle" size={48} color={theme.primary} />
            <Text style={styles.alertText}>아직 진행되지 않은 레슨입니다.</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <View style={styles.button}>
              <TextButton text="예약 변경" onPress={() => {}} />
            </View>
            <View style={styles.button}>
              <TextButton
                text="예약 취소"
                onPress={() => {}}
                backgroundColor={theme.border}
              />
            </View>
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
      paddingHorizontal: 24,
      paddingVertical: 16,
      gap: 32,
      backgroundColor: theme.background,
    },
    innerContainer: {
      flex: 1,
      gap: 24,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    wrapper: {
      gap: 8,
    },
    input: {
      padding: 12,
      minHeight: 180,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.backgroundGray,
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
