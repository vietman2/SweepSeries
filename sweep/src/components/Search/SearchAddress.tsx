import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  address1: string | undefined;
  address2: string;
  onChangeText: (text: string) => void;
  onButtonPress: () => void;
}

export function SearchAddress({
  address1,
  address2,
  onChangeText,
  onButtonPress,
}: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.horizontal}>
        <View style={styles.textinput}>
          <TextInput
            value={address1 || ""}
            placeholder="주소 검색"
            style={styles.textinputarea}
            readOnly
          />
        </View>
        <View style={styles.button}>
          <TouchableOpacity onPress={onButtonPress}>
            <Text style={styles.buttonText}>주소 검색</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.textinput}>
        <TextInput
          value={address2}
          onChangeText={onChangeText}
          placeholder="상세주소를 입력해주세요"
          style={styles.textinputarea}
        />
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      marginBottom: 4,
    },
    textinput: {
      flex: 1,
      justifyContent: "center",
      marginVertical: 4,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 4,
    },
    textinputarea: {
      flex: 1,
      margin: 8,
    },
    horizontal: {
      flexDirection: "row",
      alignItems: "center",
    },
    button: {
      marginLeft: 4,
      padding: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
    },
    buttonText: {
      color: theme.background,
    }
  });
