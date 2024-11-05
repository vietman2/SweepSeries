import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { CalendarHeader } from "@components/Calendars";
import { LoadingComponent } from "@components/Fallbacks";
import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AcademyCard } from "@fragments/Academy";
import { ThemeColorType } from "@themes/colors";

export function MyAcademy() {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const getCurrentMonth = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      return `${year}-${month < 10 ? `0${month}` : month}`;
    };

    setSelectedMonth(getCurrentMonth());
    setLoading(false);
  }, []);

  if (loading) return <LoadingComponent />;

  return (
    <Scroll style={styles.container}>
      <AcademyCard mode="normal" type={2} />
      <View style={styles.content}>
        <Text style={styles.subtitle}>레슨 일정 및 피드백 목록</Text>
        <CalendarHeader
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </View>
    </Scroll>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 24,
      paddingHorizontal: 16,
      backgroundColor: theme.background,
    },
    content: {
      marginTop: 16,
    },
    subtitle: {
      fontSize: 20,
      marginBottom: 8,
      marginLeft: 4,
    },
  });
