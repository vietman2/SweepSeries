import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";

interface Props {
  icon: string;
  text: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
  align?: "flex-start" | "center";
  small?: boolean;
}

export function SvgIconButton({
  icon,
  text,
  onPress,
  color = "black",
  backgroundColor = "transparent",
  align = "flex-start",
  small = false,
}: Readonly<Props>) {
  const url = `https://kr.object.ncloudstorage.com/sweepdev/icons/${icon}.svg`;
  return (
    <TouchableOpacity
      style={[styles.svghorizontal, { backgroundColor, justifyContent: align }]}
      onPress={onPress}
    >
      <SvgCssUri uri={url} width={"18"} height={"18"} color={color} />
      <Text style={{ color, fontSize: small ? 16 : 20 }}>{text}</Text>
    </TouchableOpacity>
  );
}

interface BackProps {
  onPress: () => void;
  color?: string;
}

export function BackButton({ onPress, color }: Readonly<BackProps>) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <AppIcon
        icon="chevron-left"
        size={20}
        color={color || theme.highEmphasis}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  svghorizontal: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
    gap: 8,
  },
});
