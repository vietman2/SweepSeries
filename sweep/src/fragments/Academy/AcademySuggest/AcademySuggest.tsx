import { Image, StyleSheet, View } from "react-native";

import { AppIcon } from "@components/Icons";
import { Text } from "@components/Texts";
import { useTheme } from "@contexts/theme";
import { AcademySimpleType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  academy: AcademySimpleType;
}

export function AcademySuggest({ academy }: Readonly<Props>) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Image style={styles.image} src={academy.cover_image} />
      <Text style={styles.name}>{academy.name}</Text>
      <Text>{academy.location}</Text>
      <View style={styles.rating}>
        <AppIcon icon="star" size={16} color="#F2B517" />
        <Text>
          {academy.rating.toFixed(1)}
          <Text style={styles.grayText}> ({academy.num_reviews})</Text>
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 8,
      gap: 4,
    },
    image: {
      width: 185,
      height: 105,
      borderRadius: 8,
    },
    name: {
      fontSize: 16,
      fontWeight: "bold",
    },
    rating: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    grayText: {
      color: theme.lowEmphasis,
    },
  });
