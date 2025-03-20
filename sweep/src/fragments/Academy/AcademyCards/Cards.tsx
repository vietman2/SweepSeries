import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Divider, VerticalDivider } from "@components/Dividers";
import { CalloutSmall, Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AcademySimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

export function EmptyCard() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>내 아카데미</Text>
        <CalloutSmall text={" 내 아카데미가 없어요 "} />
      </View>
      <View style={styles.horizontal}>
        <View style={styles.board}>
          <Text style={styles.subtitle}>마지막 레슨일</Text>
          <Text style={styles.text}>없음</Text>
        </View>
        <VerticalDivider width={1} />
        <View style={styles.board}>
          <Text style={styles.subtitle}>남은 횟수</Text>
          <Text style={styles.text}>0</Text>
        </View>
      </View>
    </View>
  );
}

interface Props {
  academy: AcademySimpleType;
  onPress?: () => void;
}

export function NormalCard({ academy, onPress }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>내 아카데미</Text>
        <CalloutSmall text={` ${academy.name} `} />
      </View>
      <View style={styles.horizontal}>
        <View style={styles.board}>
          <Text style={styles.subtitle}>마지막 레슨일</Text>
          <Text style={styles.text}>{academy.last_session}</Text>
        </View>
        <VerticalDivider width={1} />
        <View style={styles.board}>
          <Text style={styles.subtitle}>남은 횟수</Text>
          <Text style={styles.text}>{academy.remaining_sessions}</Text>
        </View>
      </View>
      {onPress && (
        <>
          <Divider />
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={onPress}
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

export function ProCard({ academy, onPress }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>내 아카데미</Text>
        <CalloutSmall text={` ${academy.name} `} />
      </View>
      <View style={styles.horizontal}>
        <View style={styles.board}>
          <Text style={styles.subtitle}>총 수강생</Text>
          <Text style={styles.text}>{academy.num_students}</Text>
        </View>
        <VerticalDivider width={1} />
        <View style={styles.board}>
          <Text style={styles.subtitle}>예약 승인 요청</Text>
          <Text
            style={[
              styles.text,
              {
                color: academy.num_requests > 0 ? "red" : theme.highEmphasis,
              },
            ]}
          >
            {academy.num_requests}
          </Text>
        </View>
      </View>
      {onPress && (
        <>
          <Divider />
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={onPress}
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

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    card: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      gap: 16,
      borderRadius: 8,
      borderColor: theme.border,
      borderWidth: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
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
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      flex: 1,
    },
    buttonText: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      color: theme.primary,
    },
  });
