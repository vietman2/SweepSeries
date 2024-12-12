import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CoachRequest, CoachSimple } from "@fragments/Coach";
import { CoachSimpleType } from "@models/products";
import { getEmployedCoaches } from "@services/products";
import { ThemeColorType } from "@themes/colors";

export function EmployeeManagement() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [coaches, setCoaches] = useState<CoachSimpleType[]>([]);
  const [requests, setRequests] = useState<CoachSimpleType[]>([]);

  const [refreshCount, setRefreshCount] = useState(0);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getEmployedCoaches(id);

      if (response) {
        setCoaches(response.accepted);
        setRequests(response.pending);
      } else {
        setCoaches([]);
        setRequests([]);
      }
    };

    fetchData();
  }, [refreshCount]);

  return (
    <Scroll style={styles.container}>
      <View style={styles.wrapper}>
        {requests.length > 0 && (
          <View style={styles.content}>
            <Text style={styles.title}>코치등록 요청</Text>
            <Scroll horizontal>
              {requests.map((request) => (
                <CoachRequest
                  key={request.uuid}
                  coach={request}
                  onRefresh={handleRefresh}
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
    </Scroll>
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
