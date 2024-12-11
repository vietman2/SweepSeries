import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  onSubmit?: () => void;
}

export function Searchbar({ placeholder, value, onChange, onSubmit }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.horizontal}>
      <View style={styles.input}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.lowEmphasis}
          value={value}
          onChangeText={onChange}
          enterKeyHint="search"
          onSubmitEditing={onSubmit}
        />
      </View>
      {onSubmit && (
        <TouchableOpacity onPress={onSubmit}>
          <AppIcon icon="search" size={16} color={theme.primary} />
        </TouchableOpacity>
      )}
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
      borderColor: theme.border,
    },
    input: {
      flex: 1,
    },
  });
