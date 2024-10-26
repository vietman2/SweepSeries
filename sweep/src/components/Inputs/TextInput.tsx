import { StyleSheet, TextInput as Input, View } from "react-native";

import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  type?: "default" | "email-address" | "number-pad";
  multiline?: boolean;
}

export function TextInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  type = "default",
  multiline = false,
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.lowEmphasis}
          style={styles.textinputarea}
          secureTextEntry={secureTextEntry}
          keyboardType={type}
          multiline={multiline}
        />
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      marginVertical: 5,
    },
    input: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 5,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 5,
    },
    textinputarea: {
      flex: 1,
      marginHorizontal: 10,
    },
  });
