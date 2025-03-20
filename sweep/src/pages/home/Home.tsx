import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { ScrollView } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useAuth } from "@contexts/auth";
import { useTheme } from "@contexts/theme";
import {
  AcademyCards,
  AcademySearch,
  Recommendations,
} from "@fragments/Academy";
import { ThemeColorType } from "@themes/colors";

export function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { mode } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);

    // setLoading to true for 2 seconds
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <ScrollView refreshing={loading} onRefresh={handleRefresh}>
      <View style={styles.container}>
        <AcademyCards />
        {mode === "pro" ? (
          <View style={styles.horizontal}>
            <Card
              title="예약 추가"
              subtitle="빠르고 손쉽게!"
              icon="calendar-pointer"
            />
            <Card title="프로필" subtitle="아카데미 소개" icon="user-pin" />
            <Card title="대시보드" subtitle="다양한 통계" icon="dashboard" />
          </View>
        ) : (
          <Recommendations refreshCount={refreshCount} />
        )}
        <AcademySearch refreshCount={refreshCount} />
      </View>
    </ScrollView>
  );
}

interface Props {
  title: string;
  subtitle: string;
  icon: string;
}

function Card({ title, subtitle, icon }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      <View style={styles.cardIcon}>
        <AppIcon icon={icon} color={theme.primary} size={50} />
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      paddingBottom: 64,
      gap: 36,
      backgroundColor: theme.background,
    },
    horizontal: {
      flexDirection: "row",
      gap: 8,
    },
    card: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      gap: 8,
      backgroundColor: theme.background,
      borderRadius: 8,
      shadowColor: theme.highEmphasis,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.mediumEmphasis,
    },
    cardIcon: {
      alignSelf: "flex-end",
      marginTop: 4,
    },
  });
