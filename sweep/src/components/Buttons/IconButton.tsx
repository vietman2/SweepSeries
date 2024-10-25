import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

interface Props {
  icon: string;
  text: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
}

export function SvgIconButton({
  icon,
  text,
  onPress,
  color = "black",
  backgroundColor = "transparent",
}: Readonly<Props>) {
  const url = `https://kr.object.ncloudstorage.com/sweepdev/icons/${icon}.svg`;
  return (
    <TouchableOpacity
      style={[styles.svghorizontal, { backgroundColor }]}
      onPress={onPress}
    >
      <SvgCssUri uri={url} width={"18"} height={"18"} color={color} />
      <Text style={[styles.svgtexthorizontal, { color }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  svghorizontal: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7.5,
    borderRadius: 5,
    gap: 7.5,
  },
  svgtexthorizontal: {
    fontSize: 20,
  },
});
