import { StyleSheet, TextInput as Input, View } from "react-native";

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
}: Props) {
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

const styles = StyleSheet.create({
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
    borderColor: "#D9D9D9", // TODO: theme color
    borderRadius: 5,
  },
  textinputarea: {
    flex: 1,
    marginHorizontal: 10,
  },
});
