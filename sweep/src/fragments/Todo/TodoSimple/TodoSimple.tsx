import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { TodoType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  todo: TodoType;
}

export function TodoSimple({ todo }: Readonly<Props>) {
  const [isDone, setIsDone] = useState(todo.isDone);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleToggle = () => {
    setIsDone((prev) => !prev);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleToggle}
      testID="toggle"
    >
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: isDone ? theme.primary : "white" },
        ]}
      >
        <AppIcon icon="check" size={14} color="white" />
      </View>
      <Text style={styles.text}>{todo.text}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    iconWrapper: {
      padding: 2,
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 20,
    },
    text: {
      fontSize: 14,
      color: theme.highEmphasis,
    },
  });
