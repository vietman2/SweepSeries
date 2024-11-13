import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { Divider, VerticalDivider } from "@components/Dividers";
import { Progressbar } from "@components/Progressbars";
import { CalloutSmall, Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  type?: 1 | 2;
}

export function NormalCard({ type = 1 }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleMyAcademyPress = () => {
    router.push("/home/academy/my");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {type === 1 ? (
          <>
            <Text style={styles.title}>내 아카데미</Text>
            <CalloutSmall text="캐치비 베이스볼 아카데미" />
          </>
        ) : (
          <Text style={[styles.title, { color: theme.primary }]}>
            캐치비 베이스볼 아카데미
          </Text>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.horizontal}>
          <View style={styles.board}>
            <Text style={styles.subtitle}>마지막 레슨일</Text>
            <Text style={styles.text}>2024.10.20.</Text>
          </View>
          <VerticalDivider width={1} />
          <View style={styles.board}>
            <Text style={styles.subtitle}>남은 횟수</Text>
            <Text style={styles.text}>15</Text>
          </View>
        </View>
        <View style={styles.progress}>
          <Text style={styles.subtitle}>아카데미 누적 출석률</Text>
          <Progressbar done={4} total={5} />
        </View>
      </View>
      {type === 1 && (
        <>
          <Divider />
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleMyAcademyPress}
              testID="myacademy"
            >
              <Text style={styles.buttonText}>내 스케줄 확인하러 가기</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

interface PropProps {
  num_students: number;
  num_requests: number;
}

export function ProCard({ num_students, num_requests }: Readonly<PropProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>내 아카데미</Text>
        <CalloutSmall text="캐치비 베이스볼 아카데미" />
      </View>
      <View style={styles.content}>
        <View style={styles.horizontal}>
          <View style={styles.board}>
            <Text style={styles.subtitle}>총 수강생</Text>
            <Text style={styles.text}>{num_students}</Text>
          </View>
          <VerticalDivider width={1} />
          <View style={styles.board}>
            <Text style={styles.subtitle}>예약 승인 요청</Text>
            <Text
              style={[
                styles.text,
                { color: num_requests > 0 ? "red" : theme.highEmphasis },
              ]}
            >
              {num_requests}
            </Text>
          </View>
        </View>
      </View>
      <Divider />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {}}
          testID="myacademy"
        >
          <Text style={styles.buttonText}>내 스케줄 확인하러 가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      borderRadius: 8,
      borderColor: theme.border,
      borderWidth: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      gap: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    content: {
      paddingBottom: 16,
      gap: 16,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
    },
    board: {
      flex: 1,
      alignItems: "center",
      gap: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.lowEmphasis,
    },
    text: {
      fontSize: 16,
    },
    progress: {
      gap: 8,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      flex: 1,
      paddingVertical: 16,
    },
    buttonText: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      color: theme.primary,
    },
  });
