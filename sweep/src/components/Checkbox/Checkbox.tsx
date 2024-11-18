import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Text } from "@components/Texts";
import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";

interface Props {
  text: string;
  checked: boolean;
  onChange: () => void;
  rightPress?: () => void;
  grayText?: boolean;
}

export function Checkbox({
  text,
  checked,
  onChange,
  rightPress,
  grayText = false,
}: Readonly<Props>) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onChange} style={styles.mainArea}>
        <AppIcon
          icon="check-circle"
          color={checked ? theme.primary : theme.lowEmphasis}
          size={24}
        />
        <Text
          style={[styles.text, grayText && { color: theme.mediumEmphasis }]}
        >
          {text}
        </Text>
      </TouchableOpacity>
      {rightPress && (
        <TouchableOpacity onPress={rightPress}>
          <AppIcon icon="chevron-right" color={theme.lowEmphasis} size={16} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 16,
  },
});
