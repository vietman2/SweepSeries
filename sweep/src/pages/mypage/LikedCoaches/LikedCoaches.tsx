import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Empty } from "@components/Fallbacks";
import { Scroll } from "@components/ScrollView";
import { useTheme } from "@contexts/theme";
import { CoachSimple } from "@fragments/Coach";
import { CoachSimpleType } from "@models/products";
import { sampleCoaches } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function LikedCoaches() {
  const [coaches, setCoaches] = useState<CoachSimpleType[]>([]);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setCoaches(sampleCoaches);
  }, []);

  return (
    <>
      {coaches.length === 0 ? (
        <Empty
          message={
            "좋아요 한 코치가 없어요.\n좋아요는 코치에게 큰 힘이 됩니다."
          }
        />
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
  });
