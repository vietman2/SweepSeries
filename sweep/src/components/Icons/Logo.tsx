import { StyleSheet, View } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

import { useTheme } from "@contexts/theme";

interface Props {
  size?: number;
}

export function MainLogo({ size = 160 }: Readonly<Props>) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <SvgCssUri
        uri="https://kr.object.ncloudstorage.com/sweepdev/icons/mainlogo_currentcolor.svg"
        width={size}
        height={size}
        color={theme.logo}
      />
    </View>
  );
}

export function HorizontalLogo({ size = 30 }: Readonly<Props>) {
  const width = size * 4.5;

  return (
    <View>
      <SvgCssUri
        uri="https://kr.object.ncloudstorage.com/sweepdev/icons/mainlogo_horizontal.svg"
        width={width}
        height={size}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    gap: 64,
  },
});
