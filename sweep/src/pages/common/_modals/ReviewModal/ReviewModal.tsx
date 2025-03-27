import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { ErrorPage } from "@components/Fallbacks";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useReview } from "@contexts/review";
import { useTheme } from "@contexts/theme";
import { LessonSimple } from "@fragments/Lesson";
import { ReviewInputs } from "@fragments/Review";
import { ReviewInputType } from "@models/products";
import { alert } from "@services/alert";
import { createReview } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function ReviewModal() {
  const [lessonReview, setLessonReview] = useState<ReviewInputType>({
    rating: 0,
    comment: "",
    images: [],
    tagIds: [],
  });
  const [coachReview, setCoachReview] = useState<ReviewInputType>({
    rating: 0,
    comment: "",
    images: [],
    tagIds: [],
    secure: false,
  });
  const [academyReview, setAcademyReview] = useState<ReviewInputType>({
    rating: 0,
    comment: "",
    images: [],
    tagIds: [],
    secure: false,
  });

  const { sessionToReview, tagOptions } = useReview();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!sessionToReview || !tagOptions) {
    return <ErrorPage />;
  }

  const handleSubmit = async () => {
    const response = await createReview(
      sessionToReview.id,
      lessonReview,
      coachReview,
      academyReview
    );

    if (response.status === 201) {
      router.back();
    } else {
      alert("오류 발생", response.data.error);
    }
  };

  return (
    <View style={styles.container}>
      <Scroll>
        <View style={styles.content}>
          <Text style={styles.title}>오늘 레슨은 어떠셨나요?</Text>
          <LessonSimple lesson={sessionToReview} />
          <ReviewInputs
            type={1}
            values={lessonReview}
            setValues={setLessonReview}
            tagOptions={tagOptions.lesson}
          />
          <ReviewInputs
            type={2}
            values={coachReview}
            setValues={setCoachReview}
            tagOptions={tagOptions.coach}
            canSetSecure
          />
          <ReviewInputs
            type={3}
            values={academyReview}
            setValues={setAcademyReview}
            tagOptions={tagOptions.academy}
            canSetSecure
          />
        </View>
      </Scroll>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        testID="submit"
      >
        <Text style={styles.buttonText}>등록</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      marginBottom: 48,
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 16,
    },
    title: {
      marginVertical: 16,
      textAlign: "center",
      fontSize: 20,
      fontWeight: "700",
      color: theme.highEmphasis,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      marginHorizontal: 16,
      marginBottom: 48,
      backgroundColor: theme.primary,
      borderRadius: 4,
    },
    buttonText: {
      color: theme.background,
      fontSize: 16,
      fontWeight: "600",
    },
  });
