import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CoachSimple } from "@fragments/Coach";
import { CoachSimpleType } from "@models/products";
import { getCoaches } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function CoachList() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [coaches, setCoaches] = useState<CoachSimpleType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCoachPress = (coach: CoachSimpleType) => {
    router.push({
      pathname: "/home/academy/coach/[id]",
      params: { id: coach.uuid },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCoaches(id);

      if (response) {
        setCoaches(response);
      } else {
        setCoaches([]);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {coaches.length === 0 ? (
        <Text>등록된 코치가 아직 없습니다.</Text>
      ) : (
        <>
          {coaches.map((coach) => (
            <TouchableOpacity
              key={coach.uuid}
              onPress={() => handleCoachPress(coach)}
              testID={`coach-${coach.uuid}`}
            >
              <CoachSimple coach={coach} />
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      gap: 24,
      backgroundColor: theme.background,
    },
  });
