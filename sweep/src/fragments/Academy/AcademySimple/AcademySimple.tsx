import { Image, StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { CalloutLarge, Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AcademySimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  academy: AcademySimpleType;
  quote?: boolean;
}

export function AcademySimple({ academy, quote = false }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.horizontal}>
        <Image style={styles.image} src={academy.logo} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={2}>
              {academy.name}
            </Text>
            <AppIcon icon={"heart-outline"} size={20} color={theme.primary} />
          </View>
          <View style={styles.rating}>
            <AppIcon icon="star" size={16} color="#F2B517" />
            <Text style={styles.ratingText}>
              {academy.rating.toFixed(1)}
              <Text style={styles.grayText}> ({academy.num_reviews})</Text>
            </Text>
          </View>
          <Text style={styles.location}>{academy.location}</Text>
        </View>
      </View>
      {quote && (
        <CalloutLarge text={academy.top_review} />
      )}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      gap: 16,
    },
    horizontal: {
      flexDirection: "row",
      gap: 16,
    },
    image: {
      width: 120,
      height: 90,
      borderRadius: 8,
      resizeMode: "cover",
    },
    content: {
      flex: 1,
      gap: 4,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    name: {
      flex: 1,
      paddingRight: 8,
      fontSize: 20,
      fontWeight: "bold",
    },
    rating: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    ratingText: {
      fontSize: 16,
    },
    location: {
      fontSize: 14,
      color: theme.lowEmphasis,
    },
    grayText: {
      color: theme.lowEmphasis,
    },
  });
