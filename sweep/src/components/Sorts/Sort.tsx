import { StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { ThemeColorType } from "@themes/colors";

interface Props {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

export function Sort({ options, selectedOption, onSelect }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <View style={styles.container}>
        <AppIcon icon="sort" size={18} color={theme.background} />
        <Text style={styles.text}>{selectedOption}</Text>
      </View>
    </>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 4,
      backgroundColor: theme.primary,
      borderRadius: 4,
      shadowColor: theme.lowEmphasis,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.24,
      shadowRadius: 4,
      elevation: 4,
    },
    text: {
      fontSize: 16,
      color: theme.background,
    },
  });
