import { StyleSheet, TouchableOpacity, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";

interface Props {
  icon: string;
  text: string;
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function ScheduleInput({
  icon,
  text,
  onPress,
  disabled = false,
  children,
}: Readonly<Props>) {
  const { theme } = useTheme();

  if (disabled) {
    return (
      <View style={styles.container}>
        <AppIcon icon={icon} size={24} color={theme.mediumEmphasis} />
        <Text style={[styles.disabled, { color: theme.mediumEmphasis }]}>
          {text}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <AppIcon icon={icon} size={24} color={theme.mediumEmphasis} />
      <View style={styles.row}>
        <Text>{text}</Text>
        <View style={styles.horizontal}>
          {children}
          <AppIcon icon="chevron-right" size={12} color={theme.lowEmphasis} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  disabled: {
    paddingHorizontal: 4,
  },
  horizontal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
