import { StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { TodoType } from "@models/calendar";
import { ThemeColorType } from "@themes/colors";

interface Props {
  todo: TodoType;
}

export function TodoSimple({ todo }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: todo.isDone ? "#3AB6FF" : "white" },
        ]}
      >
        <AppIcon icon="check" size={14} color="white" />
      </View>
      <Text style={styles.text}>{todo.text}</Text>
    </View>
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
      borderColor: "#3AB6FF",
      borderRadius: 20,
    },
    text: {
      fontSize: 14,
      color: theme.highEmphasis,
    },
  });
