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

export function RecentAcademies() {
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
            "최근 본 아카데미가 없어요.\n자신에게 맞는 아카데미를 찾아보세요."
          }
        />
      ) : (
        <Scroll style={styles.container}>
          <View style={styles.wrapper}>
            {academies.map((academy) => (
              <View key={academy.uuid} style={styles.academy}>
                <AcademySimple academy={academy} />
                <Divider bold />
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
      marginTop: 4,
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
