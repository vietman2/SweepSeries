import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { Divider } from "@components/Dividers";
import { Empty } from "@components/Fallbacks";
import { ScrollView } from "@components/ScrollView";
import { useTheme } from "@contexts/theme";
import { AcademySimple } from "@fragments/Academy";
import { AcademySimpleType } from "@models/products";
import { getLikedAcademies } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function LikedAcademies() {
  const [academies, setAcademies] = useState<AcademySimpleType[]>([]);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const navigateToAcademyDetail = (academy: AcademySimpleType) => {
    router.push({
      pathname: "/home/academy/[id]",
      params: { id: academy.uuid },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response = await getLikedAcademies();

      if (response) {
        setAcademies(response);
      }

      setLoading(false);
    };

    fetchData();
  }, [refreshCount]);

  if (academies.length === 0) {
    return (
      <Empty
        message={
          "좋아요 한 아카데미가 없어요.\n좋아요는 아카데미에게 큰 힘이 됩니다."
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView onRefresh={handleRefresh} refreshing={loading}>
        <View style={styles.wrapper}>
          {academies.map((academy) => (
            <View key={academy.uuid} style={styles.academy}>
              <TouchableOpacity
                onPress={() => navigateToAcademyDetail(academy)}
                testID={`academy-${academy.uuid}`}
              >
                <AcademySimple academy={academy} />
              </TouchableOpacity>
              <Divider />
            </View>
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
    academy: {
      gap: 24,
    },
  });
