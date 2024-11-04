import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";

interface Props {
  introduction: string;
}

export function Introduction({ introduction }: Readonly<Props>) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const { theme } = useTheme();

  return (
    <View>
      <Text
        numberOfLines={expanded ? 0 : 5}
        ellipsizeMode="tail"
        style={styles.text}
      >
        {introduction}
      </Text>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.wrapper}
        testID="expand-button"
      >
        <AppIcon
          icon={expanded ? "chevron-up" : "chevron-down"}
          size={14}
          color={theme.highEmphasis}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
  },
});
