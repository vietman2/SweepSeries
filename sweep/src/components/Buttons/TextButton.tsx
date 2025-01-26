import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useTheme } from "@contexts/theme";

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
  const { theme } = useTheme();

  backgroundColor = active ? backgroundColor : theme.border;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor: color,
        },
      ]}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  text: {
    fontWeight: "bold",
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
