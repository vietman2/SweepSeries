import { StyleSheet, TextInput as Input, View } from "react-native";

import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
}

export function TextInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
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
          style={styles.textinputarea}
          secureTextEntry={secureTextEntry}
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
