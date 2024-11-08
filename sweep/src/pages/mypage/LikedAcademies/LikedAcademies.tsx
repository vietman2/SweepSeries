import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Divider } from "@components/Dividers";
import { Empty } from "@components/Fallbacks";
import { Scroll } from "@components/ScrollView";
import { useTheme } from "@contexts/theme";
import { AcademySimple } from "@fragments/Academy";
import { AcademySimpleType } from "@models/products";
import { sampleAcademies } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function LikedAcademies() {
  const [academies, setAcademies] = useState<AcademySimpleType[]>([]);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setAcademies(sampleAcademies);
  }, []);

  return (
    <>
      {academies.length === 0 ? (
        <Empty
          message={
            "좋아요 한 아카데미가 없어요.\n좋아요는 아카데미에게 큰 힘이 됩니다."
          }
        />
      ) : (
        <Scroll style={styles.container}>
          <View style={styles.wrapper}>
            {academies.map((academy) => (
              <View key={academy.uuid} style={styles.academy}>
                <AcademySimple academy={academy} />
                <Divider />
              </View>
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
      marginTop: 1,
      backgroundColor: theme.background,
    },
    wrapper: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 16,
      gap: 24,
    },
    academy: {
      gap: 24,
    },
  });
