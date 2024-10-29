import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CoachSimple } from "@fragments/Coach";
import { CoachSimpleType } from "@models/products";
import { sampleCoaches } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function RecentCoaches() {
  const [coaches, setCoaches] = useState<CoachSimpleType[]>([]);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setCoaches(sampleCoaches);
  }, []);

  return (
    <>
      {coaches.length === 0 ? (
        <View style={styles.empty}>
          <AppIcon icon="warning-circle" size={48} color={theme.primary} />
          <Text style={styles.warningText}>
            {"최근 본 코치가 없어요.\n자신에게 맞는 코치를 찾아보세요."}
          </Text>
        </View>
      ) : (
        <Scroll style={styles.container}>
          <View style={styles.wrapper}>
            {coaches.map((coach) => (
              <CoachSimple key={coach.uuid} coach={coach} />
            ))}
          </View>
        </Scroll>
      )}
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      marginTop: 4,
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
    empty: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      gap: 8,
    },
    warningText: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.lowEmphasis,
      lineHeight: 32,
    },
  });
