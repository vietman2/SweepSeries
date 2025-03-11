import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Divider } from "@components/Dividers";
import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { CoachSelect } from "@fragments/Coach";
import { TeamType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  team: TeamType;
  type?: 1 | 2;
  onPress?: () => void;
}

export function CoachTeam({ team, type = 1, onPress }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (type === 1) {
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.coaches}>
            {team.coaches.map((coach) => (
              <CoachSelect key={coach.uuid} coach={coach} />
            ))}
          </View>
          {onPress && (
            <TouchableOpacity onPress={onPress} testID="remove">
              <AppIcon icon="close" size={18} color="red" />
            </TouchableOpacity>
          )}
        </View>
        <Divider />
      </View>
    );
  }

  return (
    <View style={styles.container2}>
      <View style={styles.wrapper}>
        <View style={styles.coaches}>
          {team.coaches.map((coach) => (
            <CoachSelect key={coach.uuid} coach={coach} />
          ))}
        </View>
      </View>
      {onPress && (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity onPress={onPress} style={styles.button} testID="button">
            <Text style={styles.buttonText}>예약하기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      gap: 8,
    },
    wrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    coaches: {
      flex: 1,
      flexDirection: "row",
    },
    container2: {
      gap: 8,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
    },
    buttonWrapper: {
      alignItems: "flex-end",
      paddingHorizontal: 8,
      paddingVertical: 8 ,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
      backgroundColor: theme.primary,
    },
    buttonText: {
      color: theme.background,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
