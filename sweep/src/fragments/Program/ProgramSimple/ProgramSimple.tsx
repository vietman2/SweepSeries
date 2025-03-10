import { StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { ProgramSimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  program: ProgramSimpleType;
  selected?: boolean;
  type?: "price" | "check";
  color?: string;
}

export function ProgramSimple({
  program,
  selected = false,
  type = "price",
  color = "#000000",
}: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: selected ? theme.primary : theme.background },
      ]}
    >
      <View style={styles.info}>
        <Text style={selected ? styles.normal : styles.bold}>
          {program.name}
        </Text>
        <View style={styles.footer}>
          {!selected && (
            <View style={styles.rating}>
              <AppIcon icon="star" size={14} color="#F2B517" />
              <Text style={styles.ratingText}>{program.rating}</Text>
            </View>
          )}
          <View style={styles.chips}>
            <Chip
              text={program.target.name}
              color={selected ? theme.background : theme.lowEmphasis}
            />
            {program.positions.map((position) => (
              <Chip
                key={position.id}
                text={position.name}
                color={selected ? theme.background : theme.lowEmphasis}
              />
            ))}
          </View>
        </View>
      </View>
      {selected ? null : (
        <>
          {type === "price" ? (
            <Text style={styles.bold}>
              {program.lowest_price.toLocaleString()}~
            </Text>
          ) : (
            <AppIcon icon="check-circle" size={24} color={color} />
          )}
        </>
      )}
    </View>
  );
}

interface ChipProp {
  text: string;
  color: string;
}

function Chip({ text, color }: Readonly<ChipProp>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.chip, { borderColor: color }]}>
      <Text style={[styles.chipText, { color }]}>{text}</Text>
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
    normal: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.background,
    },
    bold: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.highEmphasis,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
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
      gap: 4,
    },
    chip: {
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
    },
    chipText: {
      fontSize: 12,
    },
  });
