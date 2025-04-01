import { useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { Scroll } from "@components/ScrollView";
import { useReview } from "@contexts/review";
import { useTheme } from "@contexts/theme";
import { LessonToReview } from "@fragments/Lesson";
import { LessonType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

const width = Dimensions.get("window").width;

interface Props {
  sessions: LessonType[];
}

export function SessionsToReview({ sessions }: Readonly<Props>) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { setSession } = useReview();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Calculate the current page index.
    const offsetX = event.nativeEvent.contentOffset.x;
    // Each session has a width of (width - 48) as per your styles.
    const index = Math.round(offsetX / (width - 48));
    setActiveIndex(index);
  };

  const handleReview = (session: LessonType) => {
    setSession(session);
    router.push("/mypage/reviews/new");
  };

  return (
    <View style={styles.container}>
      <Scroll
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {sessions.map((session) => (
          <View key={session.id} style={styles.session}>
            <LessonToReview lesson={session} />
            <TouchableOpacity
              onPress={() => handleReview(session)}
              style={styles.button}
              testID="review-button"
            >
              <Text style={styles.buttonText}>리뷰 남기기</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Scroll>
      <View style={styles.dots}>
        {sessions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && { backgroundColor: theme.primary },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 24,
      marginBottom: 16,
    },
    session: {
      width: width - 48,
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 6,
      borderWidth: 0.5,
      borderColor: theme.primary,
      borderRadius: 4,
    },
    buttonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    dots: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 10,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.lowEmphasis,
      marginHorizontal: 4,
    },
    date: {
      fontSize: 16,
      color: theme.highEmphasis,
    },
  });
