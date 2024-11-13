import { StyleSheet, TouchableOpacity, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";

interface Props {
  icon: string;
  text: string;
  onPress: () => void;
}

export function ScheduleInput({ icon, text, onPress }: Readonly<Props>) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <AppIcon icon={icon} size={24} color={theme.mediumEmphasis} />
      <View style={styles.row}>
        <Text>{text}</Text>
        <AppIcon icon="chevron-right" size={16} color={theme.lowEmphasis} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
});
