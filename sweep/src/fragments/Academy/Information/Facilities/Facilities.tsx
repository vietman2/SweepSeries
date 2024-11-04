import { StyleSheet, Text, View } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

import { useTheme } from "@contexts/theme";
import { FacilityType } from "@models/products";
import { ThemeColorType } from "@themes/colors";

interface Props {
  facilities: FacilityType[];
  type: "구비장비" | "편의시설";
}

export function Facilities({ facilities, type }: Readonly<Props>) {
  const facilitiesToDisplay = facilities.filter(
    (facility) => facility.type === type
  );

  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {facilitiesToDisplay.map((facility) => (
        <View key={facility.id} style={styles.facilityIcon}>
          <SvgCssUri
            uri={facility.icon_url}
            width={24}
            height={24}
            color={theme.highEmphasis}
          />
          <Text style={styles.facilityText}>{facility.kor_name}</Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: ThemeColorType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      marginVertical: 4,
      gap: 2,
    },
    facilityIcon: {
      width: 55,
      height: 55,
      alignItems: "center",
      justifyContent: "center",
    },
    facilityText: {
      marginTop: 8,
      color: theme.lowEmphasis,
    },
  });
