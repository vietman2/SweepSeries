import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  text: string;
  onPress: () => void;
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  active?: boolean;
}

export function TextButton({
  text,
  onPress,
  fontSize = 16,
  backgroundColor = "#14863E", // TODO: theme color
  color = "#FFFFFF",
  active = true,
}: Props) {
  backgroundColor = active ? backgroundColor : "#9D9D9D";

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={onPress}
      disabled={!active}
    >
      <Text
        style={[
          styles.text,
          {
            color,
            fontSize,
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  text: {
    fontWeight: "500",
  },
});
