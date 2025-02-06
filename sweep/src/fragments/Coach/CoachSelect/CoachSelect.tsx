import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { useTheme } from "@contexts/theme";
import { CoachSimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

const { width } = Dimensions.get("window");

interface Props {
  coach: CoachSimpleType;
  selected?: boolean;
}

export function CoachSelect({ coach, selected = false }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {selected ? (
        <View>
          <View style={styles.iconOverlay}>
            <AppIcon icon="check" size={36} color={theme.primary} />
          </View>
          <Image
            source={{ uri: coach.profile_image }}
            style={[styles.image, styles.blur]}
          />
        </View>
      ) : (
        <Image source={{ uri: coach.profile_image }} style={styles.image} />
      )}
      <Text style={[styles.nameText, selected && styles.green]}>
        {coach.name}
      </Text>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 12,
      gap: 8,
    },
    image: {
      width: width / 5,
      height: width / 5,
      borderRadius: width / 10,
    },
    blur: {
      opacity: 0.3,
    },
    iconOverlay: {
      alignItems: "center",
      justifyContent: "center",
      width: width / 5,
      height: width / 5,
      borderRadius: width / 10,
      position: "absolute",
      backgroundColor: "#000000",
    },
    nameText: {
      fontSize: 16,
      color: theme.highEmphasis,
    },
    green: {
      fontWeight: "bold",
      color: theme.primary,
    },
  });
