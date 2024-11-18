import { Image, StyleSheet, Text, View } from "react-native";
import { SvgCssUri } from "react-native-svg/css";

import { useTheme } from "@contexts/theme";

interface Props {
  size?: number;
  color?: string;
  blur?: boolean;
}

export function MainLogo({ size = 160, color, blur = false }: Readonly<Props>) {
  const { theme } = useTheme();
  color = color ?? theme.logo;

  return (
    <View style={styles.container}>
      <SvgCssUri
        uri="https://kr.object.ncloudstorage.com/sweepdev/icons/mainlogo_currentcolor.svg"
        width={size}
        height={size}
        color={color}
        opacity={blur ? 0.3 : 1}
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

interface CustomProps {
  image: string;
  text: string;
  color: string;
}

export function CustomLogo({ image, text, color }: Readonly<CustomProps>) {
  return (
    <View style={styles.customContainer}>
      <Image src={image} style={styles.image} />
      <Text style={[styles.customText, { color }]}>{text}</Text>
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
  customContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
  customText: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
