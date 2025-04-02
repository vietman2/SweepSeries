import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { TextButton } from "@components/Buttons";
import { Divider } from "@components/Dividers";
import { Scroll } from "@components/ScrollView";
import { useTheme } from "@contexts/theme";
import { LessonSimple } from "@fragments/Lesson";
import { LessonDetailType } from "@models/calendar";
import { alert } from "@services/alert";
import { updateSessionFeedback, updateSessionNotes } from "@services/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  id: string;
  lesson: LessonDetailType;
  mode: string;
}

export function FeedbackAndNotes({ id, lesson, mode }: Readonly<Props>) {
  const [notes, setNotes] = useState<string>(lesson.notes);
  const [feedback, setFeedback] = useState<string>(lesson.feedback);
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const notesActive = mode === "normal";
  const feedbackActive = mode === "pro";

  const { theme } = useTheme();
  const styles = createStyles(theme);

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
    setIsButtonActive(notes !== lesson?.notes || feedback !== lesson?.feedback);
  }, [notes, feedback]);

  return (
    <Scroll>
      <View style={styles.container}>
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
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 24,
    },
    wrapper: {
      gap: 8,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    input: {
      padding: 12,
      minHeight: 180,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.backgroundGray,
    },
  });
