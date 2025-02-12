import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { Empty } from "@components/Fallbacks";
import { ScrollView } from "@components/ScrollView";
import { useTheme } from "@contexts/theme";
import { CoachSimple } from "@fragments/Coach";
import { CoachSimpleType } from "@models/products";
import { getLikedCoaches } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function LikedCoaches() {
  const [coaches, setCoaches] = useState<CoachSimpleType[]>([]);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const navigateToCoachDetail = (coach: CoachSimpleType) => {
    router.push({
      pathname: "/home/academy/coach/[id]",
      params: { id: coach.uuid },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response = await getLikedCoaches();

      if (response) {
        setCoaches(response);
      }

      setLoading(false);
    };

    fetchData();
  }, [refreshCount]);

  if (coaches.length === 0) {
    return (
      <Empty
        message={"좋아요 한 코치가 없어요.\n좋아요는 코치에게 큰 힘이 됩니다."}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView onRefresh={handleRefresh} refreshing={loading}>
        <View style={styles.wrapper}>
          {coaches.map((coach) => (
            <TouchableOpacity
              key={coach.uuid}
              onPress={() => navigateToCoachDetail(coach)}
              testID={`coach-${coach.uuid}`}
            >
              <CoachSimple coach={coach} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    wrapper: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 16,
      gap: 24,
    },
    coach: {
      gap: 24,
    },
  });
