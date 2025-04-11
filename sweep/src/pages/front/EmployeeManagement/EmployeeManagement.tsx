import { StyleSheet, View } from "react-native";

import { Scroll, ScrollView } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useAcademyFront } from "@contexts/front";
import { useTheme } from "@contexts/theme";
import { CoachRequest, CoachSimple } from "@fragments/Coach";
import { ThemeColorType } from "@themes/colors";

export function EmployeeManagement() {
  const { coaches, requests, loading, refresh } = useAcademyFront();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <ScrollView
      refreshing={loading}
      onRefresh={refresh}
      style={styles.container}
    >
      <View style={styles.wrapper}>
        {requests.length > 0 && (
          <View style={styles.content}>
            <Text style={styles.title}>코치등록 요청</Text>
            <Scroll horizontal>
              {requests.map((request) => (
                <CoachRequest
                  key={request.uuid}
                  coach={request}
                  onRefresh={refresh}
                />
              ))}
            </Scroll>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title}>코치 관리</Text>
          {coaches.length > 0 ? (
            <>
              {coaches.map((coach) => (
                <CoachSimple key={coach.uuid} coach={coach} />
              ))}
            </>
          ) : (
            <Text>등록된 코치가 없습니다.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    wrapper: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 16,
    },
    content: {
      gap: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
  });
