import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

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
  const styles = createStyles(theme);

  backgroundColor = active ? backgroundColor : theme.border;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor, borderColor: color }]}
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
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity onPress={onPress} style={styles.link}>
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
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
