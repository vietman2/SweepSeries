import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { CoachRequestType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  coach: CoachRequestType;
}

export function CoachRequest({ coach }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

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
      flexDirection: "row",
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
