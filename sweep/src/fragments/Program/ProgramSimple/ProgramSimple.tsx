import { StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ProgramSimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  program: ProgramSimpleType;
}

export function ProgramSimple({ program }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.bold}>{program.name}</Text>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <AppIcon icon="star" size={14} color="#F2B517" />
            <Text style={styles.ratingText}>4.89</Text>
          </View>
          <View style={styles.chips}>
            <Chip text={program.target.name} />
            {program.positions.map((position) => (
              <Chip key={position.id} text={position.name} />
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.bold}>100,000~</Text>
    </View>
  );
}

interface ChipProp {
  text: string;
}

function Chip({ text }: Readonly<ChipProp>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 8,
      borderWidth: 1,
      borderLeftWidth: 5,
      borderRadius: 4,
      borderColor: theme.primary,
    },
    info: {
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "center",
      gap: 8,
    },
    bold: {
      fontSize: 16,
      fontWeight: "bold",
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    rating: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    ratingText: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    chips: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    chip: {
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chipText: {
      fontSize: 12,
      color: theme.lowEmphasis,
    },
  });
