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
  backgroundColor = "#14863E",
  color = "#FFFFFF",
  active = true,
}: Readonly<Props>) {
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

interface LinkProps {
  text: string;
  onPress: () => void;
}

export function Link({ text, onPress }: Readonly<LinkProps>) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.link}>
      <Text style={styles.linkText}>{text}</Text>
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
  link: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  linkText: {
    fontSize: 12,
  },
});
