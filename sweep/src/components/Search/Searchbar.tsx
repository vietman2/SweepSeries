import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";
import { AppIcon } from "@components/Icons";

interface Props {
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
}

export function Searchbar({ placeholder, value, onChange, onSubmit }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.horizontal}>
      <View style={styles.input}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          enterKeyHint="search"
          onSubmitEditing={onSubmit}
        />
      </View>
      <TouchableOpacity onPress={onSubmit}>
        <AppIcon icon="search" size={16} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    horizontal: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: theme.lowEmphasis,
    },
    input: {
      flex: 1,
    },
  });
