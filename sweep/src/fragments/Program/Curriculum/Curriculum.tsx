import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@contexts/theme";
import { CurriculumType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface CurriculumChipProps {
  curriculum: CurriculumType | null;
  selected?: boolean;
}

export function CurriculumChip({
  curriculum,
  selected,
}: Readonly<CurriculumChipProps>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!curriculum) {
    return null;
  }

  return (
    <View style={[styles.container, selected && { borderColor: theme.primary }]}>
      <Text style={[styles.text, selected && { color: theme.primary }]}>
        {curriculum.num_lessons}회권
      </Text>
      <Text
        style={[styles.text, styles.bold, selected && { color: theme.primary }]}
      >
        {curriculum.price.toLocaleString()}
      </Text>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.lowEmphasis,
    },
    text: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    bold: {
      fontWeight: "bold",
    },
  });
