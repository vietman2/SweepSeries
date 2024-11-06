import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Scroll } from "@components/ScrollView";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CoachRequest, CoachSimple } from "@fragments/Coach";
import { CoachRequestType, CoachSimpleType } from "@models/products";
import { sampleCoaches, sampleCoachRequests } from "@testdata/products";
import { ThemeColorType } from "@themes/colors";

export function EmployeeManagement() {
  const [coaches, setCoaches] = useState<CoachSimpleType[]>([]);
  const [requests, setRequests] = useState<CoachRequestType[]>([]);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    setCoaches(sampleCoaches);
    setRequests(sampleCoachRequests);
  }, []);

  return (
    <Scroll style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <Text style={styles.title}>코치등록 요청</Text>
          <Scroll horizontal>
            {requests.map((request) => (
              <CoachRequest key={request.uuid} coach={request} />
            ))}
          </Scroll>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>코치 관리</Text>
          {coaches.map((coach) => (
            <CoachSimple key={coach.uuid} coach={coach} />
          ))}
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
