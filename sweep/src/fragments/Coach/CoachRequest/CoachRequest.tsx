import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CoachSimpleType } from "@models/products";
import { alert } from "@services/alert";
import { acceptCoach, rejectCoach } from "@services/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  coach: CoachSimpleType;
  onRefresh: () => void;
}

export function CoachRequest({ coach, onRefresh }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleAccept = async () => {
    const response = await acceptCoach(coach.uuid);

    if (response) {
      onRefresh();
    } else {
      alert("코치 승인 실패", "오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const acceptPress = () => {
    alert(
      "코치 승인",
      `${coach.name} 코치를 승인하시겠습니까?`,
      handleAccept,
      "승인",
      true
    );
  };

  const handleReject = async () => {
    const response = await rejectCoach(coach.uuid);

    if (response) {
      onRefresh();
    } else {
      alert("코치 거절 실패", "오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const rejectPress = () => {
    alert(
      "코치 거절",
      `${coach.name} 코치를 거절하시겠습니까?`,
      handleReject,
      "거절",
      true
    );
  };

  return (
    <View style={styles.container}>
      <Image src={coach.profile_image} style={styles.profileImage} />
      <Text style={styles.name}>{`${coach.name}\n${coach.career}`}</Text>
      <View style={styles.professions}>
        {coach.professions.map((profession) => (
          <View key={profession.id} style={styles.profession}>
            <Text style={styles.professionText}>{profession.kor_name}</Text>
          </View>
        ))}
      </View>
      <View style={styles.divider} />
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { borderColor: theme.border }]}
          onPress={rejectPress}
          testID="reject"
        >
          <Text style={[styles.buttonText, { color: theme.lowEmphasis }]}>
            거절
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.primary, borderColor: theme.primary },
          ]}
          onPress={acceptPress}
          testID="accept"
        >
          <Text style={[styles.buttonText, { color: theme.background }]}>
            승인
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      minWidth: 180,
      maxWidth: "50%",
      marginRight: 16,
      padding: 16,
      paddingBottom: 8,
      gap: 8,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 8,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    name: {
      fontSize: 16,
      lineHeight: 20,
      textAlign: "center",
    },
    professions: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    profession: {
      paddingVertical: 4,
      paddingHorizontal: 4,
      borderRadius: 4,
      borderColor: theme.border,
      borderWidth: 1,
    },
    professionText: {
      fontSize: 12,
      color: theme.lowEmphasis,
    },
    buttons: {
      flexDirection: "row",
      gap: 8,
    },
    button: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 4,
      borderWidth: 1,
    },
    buttonText: {
      fontSize: 16,
    },
    divider: {
      height: 1,
      width: "100%",
      backgroundColor: theme.border,
    },
  });
